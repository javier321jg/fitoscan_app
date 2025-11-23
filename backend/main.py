from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from ultralytics import YOLO
import cv2
import numpy as np
import base64
from pathlib import Path
import os
from dotenv import load_dotenv
import logging

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

# Inicializar FastAPI
app = FastAPI(title="FitoScan API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== CONFIGURACIÓN ====================

# Ruta al modelo YOLOv8
MODEL_PATH = Path(__file__).parent.parent / "models" / "best.pt"

# Variable global para el modelo
model = None

# Configurar Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-pro')
else:
    logger.warning("GEMINI_API_KEY no encontrada. El chat no funcionará.")
    gemini_model = None

# Mapeo de clases (personaliza según tu modelo)
CLASS_NAMES = {
    0: "ROYA_AMARILLA",
    1: "FUSARIUM_WILT",
    2: "POWDERY_MILDEW",
    3: "HEALTHY",
    4: "LEAF_SPOT",
}

DISEASE_INFO = {
    "ROYA_AMARILLA": {
        "scientific": "PUCCINIA STRIIFORMIS",
        "plant": "TRITICUM AESTIVUM",
        "severity": "CRÍTICA",
        "description": "Infección sistémica avanzada. Detección de urediniosporas en haz y envés. Índice de clorosis > 45%.",
        "treatments": ["AZOXISTROBINA 20%", "QUEMA CONTROLADA", "AISLAMIENTO ZONA B"]
    },
    "FUSARIUM_WILT": {
        "scientific": "FUSARIUM OXYSPORUM",
        "plant": "CUCUMIS SATIVUS",
        "severity": "ALTA",
        "description": "Marchitez vascular por hongo. Afecta sistema radicular y xilema. Clorosis progresiva.",
        "treatments": ["FUNGICIDA SISTÉMICO", "ROTACIÓN DE CULTIVOS", "DESINFECCIÓN DE SUELO"]
    },
    "POWDERY_MILDEW": {
        "scientific": "ERYSIPHE NECATOR",
        "plant": "VITIS VINIFERA",
        "severity": "MEDIA",
        "description": "Mildiu polvoriento. Micelio blanquecino en superficie foliar. Reduce fotosíntesis.",
        "treatments": ["AZUFRE EN POLVO", "BICARBONATO DE POTASIO", "PODA DE VENTILACIÓN"]
    },
    "HEALTHY": {
        "scientific": "N/A",
        "plant": "SPECIMEN SANO",
        "severity": "NINGUNA",
        "description": "Tejido vegetal sin signos de patógenos. Coloración normal, turgencia óptima.",
        "treatments": ["MANTENIMIENTO PREVENTIVO", "MONITOREO REGULAR"]
    },
    "LEAF_SPOT": {
        "scientific": "ALTERNARIA SPP",
        "plant": "SOLANUM LYCOPERSICUM",
        "severity": "MEDIA",
        "description": "Manchas foliares necróticas. Hongo oportunista. Común en alta humedad.",
        "treatments": ["FUNGICIDA DE CONTACTO", "ELIMINACIÓN DE HOJAS", "REDUCIR RIEGO FOLIAR"]
    }
}

# ==================== MODELOS PYDANTIC ====================

class Detection(BaseModel):
    class_id: int
    class_name: str
    confidence: float
    bbox: List[float]  # [x1, y1, x2, y2] en píxeles
    center: List[float]  # [cx, cy]

class PredictionResponse(BaseModel):
    success: bool
    detections: List[Detection]
    image_size: List[int]  # [width, height]
    disease_info: Optional[dict] = None
    message: str

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None
    disease: Optional[str] = None

class ChatResponse(BaseModel):
    success: bool
    response: str
    error: Optional[str] = None

# ==================== FUNCIONES AUXILIARES ====================

def load_model():
    """Cargar modelo YOLOv8"""
    global model
    try:
        if not MODEL_PATH.exists():
            logger.error(f"Modelo no encontrado en: {MODEL_PATH}")
            return False

        logger.info(f"Cargando modelo desde: {MODEL_PATH}")
        model = YOLO(str(MODEL_PATH))
        logger.info("✅ Modelo YOLOv8 cargado exitosamente")
        return True
    except Exception as e:
        logger.error(f"❌ Error cargando modelo: {e}")
        return False

def decode_image(file_bytes: bytes) -> np.ndarray:
    """Decodificar imagen desde bytes"""
    nparr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("No se pudo decodificar la imagen")
    return img

def process_results(results, img_shape) -> List[Detection]:
    """Procesar resultados de YOLOv8"""
    detections = []

    if len(results) == 0 or results[0].boxes is None:
        return detections

    boxes = results[0].boxes

    for box in boxes:
        # Obtener coordenadas (xyxy format)
        xyxy = box.xyxy[0].cpu().numpy().tolist()

        # Calcular centro
        cx = (xyxy[0] + xyxy[2]) / 2
        cy = (xyxy[1] + xyxy[3]) / 2

        # Obtener clase y confianza
        class_id = int(box.cls[0].cpu().numpy())
        confidence = float(box.conf[0].cpu().numpy())

        # Nombre de la clase
        class_name = CLASS_NAMES.get(class_id, f"CLASS_{class_id}")

        detection = Detection(
            class_id=class_id,
            class_name=class_name,
            confidence=confidence,
            bbox=xyxy,
            center=[cx, cy]
        )
        detections.append(detection)

    return detections

# ==================== ENDPOINTS ====================

@app.on_event("startup")
async def startup_event():
    """Cargar modelo al iniciar"""
    load_model()

@app.get("/")
async def root():
    """Endpoint raíz"""
    return {
        "app": "FitoScan API",
        "version": "1.0.0",
        "status": "online",
        "model_loaded": model is not None,
        "gemini_configured": gemini_model is not None
    }

@app.get("/health")
async def health_check():
    """Health check"""
    return {
        "status": "healthy",
        "model": "loaded" if model is not None else "not_loaded",
        "gemini": "configured" if gemini_model is not None else "not_configured"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """
    Endpoint de predicción con YOLOv8

    Args:
        file: Imagen enviada desde el frontend

    Returns:
        JSON con detecciones y bounding boxes
    """
    try:
        # Validar que el modelo esté cargado
        if model is None:
            raise HTTPException(status_code=503, detail="Modelo no cargado. Verifica que 'models/best.pt' exista.")

        # Leer y decodificar imagen
        contents = await file.read()
        img = decode_image(contents)

        logger.info(f"Imagen recibida: {img.shape}")

        # Realizar predicción
        results = model(img, conf=0.25, iou=0.45)

        # Procesar resultados
        detections = process_results(results, img.shape)

        # Obtener información de la enfermedad principal
        disease_info = None
        if detections:
            # Ordenar por confianza y tomar la más alta
            main_detection = max(detections, key=lambda x: x.confidence)
            disease_name = main_detection.class_name
            disease_info = DISEASE_INFO.get(disease_name, {})
            disease_info['confidence'] = main_detection.confidence
            disease_info['disease'] = disease_name

        return PredictionResponse(
            success=True,
            detections=detections,
            image_size=[img.shape[1], img.shape[0]],  # [width, height]
            disease_info=disease_info,
            message=f"Se detectaron {len(detections)} objeto(s)"
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error en predicción: {e}")
        raise HTTPException(status_code=500, detail=f"Error en predicción: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Endpoint de chatbot con Gemini

    Args:
        request: Mensaje del usuario + contexto opcional

    Returns:
        Respuesta generada por Gemini
    """
    try:
        if gemini_model is None:
            return ChatResponse(
                success=False,
                response="",
                error="Gemini API no configurada. Añade GEMINI_API_KEY en .env"
            )

        # Construir prompt contextualizado
        system_prompt = """Eres un experto agrónomo especializado en fitopatología.
Respondes de manera técnica pero comprensible sobre enfermedades de plantas,
tratamientos, prevención y manejo integrado de plagas.

Características de tus respuestas:
- Precisas y basadas en ciencia
- Incluyes nombres científicos cuando es relevante
- Ofreces soluciones prácticas
- Eres conciso pero completo
- Usas términos técnicos correctamente"""

        # Añadir contexto si existe
        context_text = ""
        if request.disease:
            disease_data = DISEASE_INFO.get(request.disease, {})
            context_text = f"\n\nCONTEXTO DE DETECCIÓN:\nEnfermedad: {request.disease}\nNombre científico: {disease_data.get('scientific', 'N/A')}\nDescripción: {disease_data.get('description', 'N/A')}"

        if request.context:
            context_text += f"\n\nContexto adicional: {request.context}"

        full_prompt = f"{system_prompt}{context_text}\n\nPREGUNTA DEL USUARIO:\n{request.message}"

        # Generar respuesta
        response = gemini_model.generate_content(full_prompt)

        return ChatResponse(
            success=True,
            response=response.text,
            error=None
        )

    except Exception as e:
        logger.error(f"Error en chat: {e}")
        return ChatResponse(
            success=False,
            response="",
            error=f"Error generando respuesta: {str(e)}"
        )

@app.post("/reload-model")
async def reload_model():
    """Recargar el modelo (útil para desarrollo)"""
    success = load_model()
    return {
        "success": success,
        "message": "Modelo recargado" if success else "Error recargando modelo"
    }

# ==================== EJECUTAR ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
