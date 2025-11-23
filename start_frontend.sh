#!/bin/bash

echo "🚀 Iniciando FitoScan Frontend..."

cd frontend

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependencias de Node.js..."
    npm install
fi

echo "✅ Frontend iniciando en http://localhost:5173"
echo "📝 Presiona Ctrl+C para detener"
echo ""

npm run dev
