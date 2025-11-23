# ⚡ Quick Start - FitoScan Pro

## 🚀 Inicio Rápido en 3 Pasos

### 1️⃣ Coloca tu modelo YOLOv8

```bash
cp /ruta/a/tu/modelo.pt models/best.pt
```

### 2️⃣ Configura Gemini API (Opcional pero recomendado)

```bash
# Edita backend/.env y añade tu API key
nano backend/.env
```

Añade:
```
GEMINI_API_KEY=tu_api_key_aqui
```

> 🔑 Obtén tu key GRATIS en: https://makersuite.google.com/app/apikey

### 3️⃣ Ejecuta la aplicación

```bash
./start_all.sh
```

O manualmente en 2 terminales:

**Terminal 1 (Backend):**
```bash
./start_backend.sh
```

**Terminal 2 (Frontend):**
```bash
./start_frontend.sh
```

---

## 🌐 Acceso

Abre tu navegador en: **http://localhost:5173**

---

## 🎯 Uso

1. Click en **"ESCANEAR"**
2. Permite acceso a la cámara (o sube una imagen)
3. Click en el botón central para capturar
4. ¡Mira los resultados con bounding boxes en tiempo real!
5. Chatea con la IA en la sección **"AGRI-MIND"**

---

## 🐛 Problemas?

### ❌ "Modelo no encontrado"
- Verifica que `models/best.pt` existe
- El archivo DEBE llamarse exactamente `best.pt`

### ❌ "Error instalando dependencias"

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### ❌ Chat no funciona
- Añade tu `GEMINI_API_KEY` en `backend/.env`
- Reinicia el backend

---

## 📝 Personalizar Clases

Edita `backend/main.py` línea ~45:

```python
CLASS_NAMES = {
    0: "TU_CLASE_1",
    1: "TU_CLASE_2",
    # ...
}
```

Edita también `DISEASE_INFO` (línea ~52) para añadir información de cada enfermedad.

---

## ✅ Verificar Instalación

```bash
# Backend
curl http://localhost:8000

# Debería devolver:
# {"app":"FitoScan API","status":"online","model_loaded":true}
```

---

**¡Listo! 🎉**

Para más detalles, consulta el [README.md](README.md) completo.
