# 📦 Guía de Instalación Detallada - FitoScan Pro

## ✅ Checklist Pre-Instalación

- [ ] Python 3.9+ instalado (`python --version`)
- [ ] Node.js 16+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Modelo YOLOv8 (`.pt`) disponible
- [ ] API Key de Gemini (opcional, para chatbot)

---

## 🔧 Instalación Paso a Paso

### 📍 Paso 1: Preparar el Modelo

```bash
# Desde la raíz del proyecto
cp /tu/ruta/modelo.pt models/best.pt

# Verificar
ls -lh models/best.pt
```

**⚠️ IMPORTANTE:**
- El archivo DEBE llamarse `best.pt`
- Debe estar en formato PyTorch (`.pt`)
- Debe ser un modelo YOLOv8 válido

---

### 📍 Paso 2: Configurar Backend

```bash
cd backend

# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
source venv/bin/activate  # Linux/Mac
# o en Windows:
# venv\Scripts\activate

# Actualizar pip
pip install --upgrade pip

# Instalar dependencias
pip install -r requirements.txt
```

**Si tienes errores con PyTorch:**

```bash
# Solo CPU (más rápido de instalar, recomendado para desarrollo)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Con GPU CUDA 11.8
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118

# Con GPU CUDA 12.1
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
```

---

### 📍 Paso 3: Configurar Gemini API

```bash
# Editar archivo .env
nano backend/.env
```

Añadir:
```env
GEMINI_API_KEY=AIzaSy...tu_key_aqui
```

**Obtener API Key:**
1. Ve a: https://makersuite.google.com/app/apikey
2. Crea una API key (es GRATIS)
3. Cópiala y pégala en `.env`

**🔍 Nota:** El chatbot funcionará solo si configuras esto.

---

### 📍 Paso 4: Instalar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Si tienes problemas, prueba:
npm install --legacy-peer-deps
```

**Alternativa con Yarn:**
```bash
yarn install
```

---

### 📍 Paso 5: Verificar Instalación

```bash
# Desde backend (en terminal 1)
cd backend
source venv/bin/activate
python main.py
```

Deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
✅ Modelo YOLOv8 cargado exitosamente
```

```bash
# Desde frontend (en terminal 2)
cd frontend
npm run dev
```

Deberías ver:
```
  VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🎯 Personalización

### 1. Cambiar Clases del Modelo

**Archivo:** `backend/main.py` (línea ~45)

```python
CLASS_NAMES = {
    0: "ROYA_AMARILLA",      # ← Cambia por tus clases
    1: "FUSARIUM_WILT",      # ←
    2: "POWDERY_MILDEW",     # ←
    3: "HEALTHY",            # ←
}
```

### 2. Añadir Información de Enfermedades

**Archivo:** `backend/main.py` (línea ~52)

```python
DISEASE_INFO = {
    "TU_ENFERMEDAD": {
        "scientific": "Nombre Científico",
        "plant": "Planta Afectada",
        "severity": "CRÍTICA",  # CRÍTICA | ALTA | MEDIA | BAJA
        "description": "Descripción técnica...",
        "treatments": [
            "TRATAMIENTO 1",
            "TRATAMIENTO 2",
            "TRATAMIENTO 3"
        ]
    }
}
```

### 3. Ajustar Confianza Mínima

**Archivo:** `backend/main.py` (línea ~246)

```python
results = model(img, conf=0.25, iou=0.45)
#                     ^^^^ Cambiar este valor
#                     0.25 = 25% confianza mínima
```

---

## 🌐 Configuración de Red

### Acceder desde otro dispositivo en la misma red

**Backend:**
```python
# backend/main.py (al final)
uvicorn.run(app, host="0.0.0.0", port=8000)
#                      ^^^^^^^^^ Permite acceso externo
```

**Frontend:**
```bash
# frontend/
npm run dev -- --host
```

Luego accede desde: `http://TU_IP_LOCAL:5173`

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "command not found: python"

**Solución:** Usa `python3` en lugar de `python`

---

### ❌ Error: "ModuleNotFoundError: No module named 'cv2'"

**Solución:**
```bash
pip install opencv-python-headless
```

---

### ❌ Error: "CUDA out of memory"

**Solución 1:** Instala versión CPU
```bash
pip uninstall torch torchvision
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

**Solución 2:** Reduce tamaño de imagen en `backend/main.py`:
```python
results = model(img, imgsz=320)  # En vez de 640
```

---

### ❌ Error: "Port 8000 already in use"

**Solución:**
```bash
# Linux/Mac
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

### ❌ Error: "Cannot access camera"

**Soluciones:**
1. Permite acceso en configuración del navegador
2. Usa HTTPS (o localhost)
3. Usa la opción de subir archivo en lugar de cámara

---

### ❌ Error: "Network Error" en Frontend

**Verificar:**
1. Backend corriendo en puerto 8000
2. URL correcta en `frontend/src/components/CameraView.jsx` y `ChatBot.jsx`:
```javascript
const API_URL = 'http://localhost:8000';
```

---

## 📊 Verificación de Funcionamiento

### Test 1: Backend Health Check
```bash
curl http://localhost:8000/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "model": "loaded",
  "gemini": "configured"
}
```

---

### Test 2: Predicción con cURL
```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@/ruta/a/imagen.jpg"
```

---

### Test 3: Chat con cURL
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Qué es la roya amarilla?",
    "disease": null
  }'
```

---

## 🚀 Comandos Rápidos

```bash
# Iniciar todo
./start_all.sh

# Solo backend
./start_backend.sh

# Solo frontend
./start_frontend.sh

# Detener todo
# Presiona Ctrl+C en cada terminal
```

---

## 📝 Notas Adicionales

- **Desarrollo:** Usa `npm run dev` (hot reload)
- **Producción:** Usa `npm run build` + servidor web estático
- **Backend producción:** Usa Gunicorn con workers
- **CORS:** Ya está configurado para `localhost:5173`

---

## ✅ Instalación Exitosa

Si ves esto, ¡todo está funcionando! ✨

1. ✅ Backend en http://localhost:8000
2. ✅ Frontend en http://localhost:5173
3. ✅ Modelo cargado
4. ✅ Gemini configurado (opcional)

**¡Ahora puedes empezar a detectar enfermedades!** 🌱🔬

---

## 📞 ¿Necesitas ayuda?

- 📖 Lee el [README.md](README.md) completo
- ⚡ Consulta el [QUICKSTART.md](QUICKSTART.md)
- 🐛 Abre un issue en GitHub

---

**Última actualización:** 2024-11-23
