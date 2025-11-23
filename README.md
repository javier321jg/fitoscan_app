# 🌱 FitoScan Pro - AI Plant Disease Detection

**Una aplicación completa de detección de enfermedades en plantas usando YOLOv8 + Google Gemini AI**

![FitoScan](https://img.shields.io/badge/Status-Production%20Ready-success)
![Python](https://img.shields.io/badge/Python-3.9%2B-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-00ff00)

---

## 🚀 Características

- ✅ **Detección en tiempo real** con YOLOv8
- ✅ **Bounding boxes reales** dibujados sobre la imagen
- ✅ **Chatbot IA** con Google Gemini para consultas agronómicas
- ✅ **Captura con webcam** o carga de archivos
- ✅ **UI Cyberpunk/Militar** con dark mode y verde neón
- ✅ **100% funcional** - listo para ejecutar

---

## 📁 Estructura del Proyecto

```
fitoscan_app/
├── backend/                 # FastAPI Backend
│   ├── main.py             # API principal
│   ├── requirements.txt    # Dependencias Python
│   ├── .env.example        # Ejemplo de configuración
│   └── .env               # Tu configuración (crear)
│
├── models/                 # Modelos YOLOv8
│   └── best.pt            # TU MODELO (colocar aquí)
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── CameraView.jsx
│   │   │   ├── ResultModal.jsx
│   │   │   ├── ChatBot.jsx
│   │   │   └── ...
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚡ Instalación Rápida

### 1️⃣ **Requisitos Previos**

- Python 3.9 o superior
- Node.js 16 o superior
- npm o yarn
- Modelo YOLOv8 entrenado (formato `.pt`)

### 2️⃣ **Clonar o Descargar el Proyecto**

```bash
cd fitoscan_app
```

### 3️⃣ **Configurar Backend (Python)**

```bash
# Navegar al directorio backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Linux/Mac:
source venv/bin/activate
# En Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
nano .env  # o usa tu editor favorito
```

**Edita `.env` y añade tu API key de Gemini:**

```env
GEMINI_API_KEY=tu_gemini_api_key_aqui
```

> 🔑 Obtén tu API key en: https://makersuite.google.com/app/apikey

### 4️⃣ **Colocar tu Modelo YOLOv8**

```bash
# Desde la raíz del proyecto
cp /ruta/a/tu/modelo.pt models/best.pt
```

**⚠️ IMPORTANTE:** El modelo DEBE llamarse `best.pt` y estar en la carpeta `models/`

### 5️⃣ **Configurar Frontend (React)**

```bash
# Desde la raíz del proyecto
cd frontend

# Instalar dependencias
npm install
# o con yarn:
yarn install
```

---

## 🎯 Ejecución

### Ejecutar Backend

```bash
cd backend
source venv/bin/activate  # Activar entorno virtual
python main.py
```

El backend estará disponible en: **http://localhost:8000**

### Ejecutar Frontend

```bash
# En otra terminal
cd frontend
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

---

## 🧪 Verificar que Todo Funciona

### 1. **Verificar Backend**

Abre en tu navegador: http://localhost:8000

Deberías ver:

```json
{
  "app": "FitoScan API",
  "version": "1.0.0",
  "status": "online",
  "model_loaded": true,
  "gemini_configured": true
}
```

### 2. **Probar Detección**

```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@test_image.jpg"
```

### 3. **Probar Chat**

```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Qué es Fusarium?"}'
```

---

## 🔧 Configuración Personalizada

### Personalizar Clases del Modelo

Edita en `backend/main.py`:

```python
CLASS_NAMES = {
    0: "TU_CLASE_1",
    1: "TU_CLASE_2",
    2: "TU_CLASE_3",
    # ... añade tus clases
}
```

### Añadir Información de Enfermedades

Edita en `backend/main.py`:

```python
DISEASE_INFO = {
    "TU_ENFERMEDAD": {
        "scientific": "NOMBRE_CIENTIFICO",
        "plant": "PLANTA_AFECTADA",
        "severity": "CRÍTICA/ALTA/MEDIA/BAJA",
        "description": "Descripción detallada...",
        "treatments": ["TRATAMIENTO_1", "TRATAMIENTO_2"]
    }
}
```

---

## 🐛 Solución de Problemas

### ❌ Error: "Modelo no encontrado"

**Solución:**
- Verifica que `models/best.pt` existe
- Asegúrate de que el archivo no esté corrupto

### ❌ Error: "GEMINI_API_KEY no encontrada"

**Solución:**
- Crea el archivo `.env` en `backend/`
- Añade tu API key: `GEMINI_API_KEY=tu_key_aqui`

### ❌ Error: "No se pudo acceder a la cámara"

**Solución:**
- Permite el acceso a la cámara en tu navegador
- O usa la opción de cargar imagen desde archivo

### ❌ Error de CORS

**Solución:**
- Verifica que el backend esté corriendo en puerto 8000
- Verifica que el frontend esté en puerto 5173

### ❌ Dependencias de PyTorch

Si tienes problemas instalando PyTorch:

```bash
# CPU only (más ligero)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Con GPU (CUDA 11.8)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

---

## 📊 API Endpoints

### `POST /predict`

Detectar enfermedades en una imagen.

**Request:**
- `file`: imagen (multipart/form-data)

**Response:**
```json
{
  "success": true,
  "detections": [
    {
      "class_id": 0,
      "class_name": "ROYA_AMARILLA",
      "confidence": 0.98,
      "bbox": [120, 80, 350, 280],
      "center": [235, 180]
    }
  ],
  "image_size": [640, 480],
  "disease_info": {
    "disease": "ROYA_AMARILLA",
    "scientific": "PUCCINIA STRIIFORMIS",
    "severity": "CRÍTICA",
    "confidence": 0.98,
    ...
  }
}
```

### `POST /chat`

Chatear con la IA agronómica.

**Request:**
```json
{
  "message": "¿Cómo prevenir Fusarium?",
  "disease": "FUSARIUM_WILT",
  "context": "El usuario acaba de detectar Fusarium"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Para prevenir Fusarium, es importante...",
  "error": null
}
```

---

## 🎨 Personalización del Frontend

### Cambiar Colores

Edita `frontend/tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#10B981',  // Verde actual
      // Añade tus colores
    }
  }
}
```

### Modificar UI

Los componentes están en `frontend/src/components/`:
- `CameraView.jsx` - Vista de cámara y captura
- `ResultModal.jsx` - Resultados con bounding boxes
- `ChatBot.jsx` - Interfaz de chat
- `MapScreen.jsx` - Mapa de radar
- `StatsScreen.jsx` - Estadísticas

---

## 📦 Producción

### Backend

```bash
cd backend
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

### Frontend

```bash
cd frontend
npm run build
# Los archivos estarán en frontend/dist/
```

---

## 🤝 Contribuir

¿Encontraste un bug? ¿Tienes una mejora?

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - siéntete libre de usar este proyecto como quieras.

---

## 🙏 Créditos

- **YOLOv8**: [Ultralytics](https://github.com/ultralytics/ultralytics)
- **Gemini AI**: [Google AI](https://ai.google.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📞 Soporte

¿Necesitas ayuda? Abre un issue en el repositorio.

---

## ✨ Demo

![Demo](https://via.placeholder.com/800x400/000000/10B981?text=FitoScan+Pro+Demo)

---

**¡Listo para detectar enfermedades en plantas con IA! 🌿🔬**
