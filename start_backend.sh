#!/bin/bash

echo "🚀 Iniciando FitoScan Backend..."

cd backend

# Verificar si existe el entorno virtual
if [ ! -d "venv" ]; then
    echo "⚠️  Entorno virtual no encontrado. Creando..."
    python3 -m venv venv
fi

# Activar entorno virtual
echo "📦 Activando entorno virtual..."
source venv/bin/activate

# Verificar si las dependencias están instaladas
if [ ! -f "venv/installed" ]; then
    echo "📥 Instalando dependencias..."
    pip install -r requirements.txt
    touch venv/installed
fi

# Verificar modelo
if [ ! -f "../models/best.pt" ]; then
    echo "❌ ERROR: Modelo no encontrado en models/best.pt"
    echo "   Por favor, coloca tu modelo YOLOv8 en models/best.pt"
    exit 1
fi

# Verificar .env
if [ ! -f ".env" ]; then
    echo "⚠️  Archivo .env no encontrado. Copiando desde .env.example"
    cp .env.example .env
    echo "   ⚠️  Por favor, edita backend/.env y añade tu GEMINI_API_KEY"
fi

echo "✅ Backend iniciando en http://localhost:8000"
echo "📝 Presiona Ctrl+C para detener"
echo ""

python main.py
