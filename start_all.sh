#!/bin/bash

echo "🌱 FitoScan Pro - Iniciando aplicación completa..."
echo ""

# Verificar modelo
if [ ! -f "models/best.pt" ]; then
    echo "❌ ERROR: Modelo no encontrado en models/best.pt"
    echo ""
    echo "   SOLUCIÓN:"
    echo "   1. Coloca tu modelo YOLOv8 en: models/best.pt"
    echo "   2. Vuelve a ejecutar este script"
    echo ""
    exit 1
fi

# Iniciar backend en background
echo "🔧 Iniciando Backend..."
gnome-terminal --tab --title="FitoScan Backend" -- bash -c './start_backend.sh; exec bash' 2>/dev/null || \
xterm -T "FitoScan Backend" -e './start_backend.sh' 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && ./start_backend.sh"' 2>/dev/null || \
(echo "⚠️  No se pudo abrir terminal automáticamente." && \
 echo "   Ejecuta manualmente: ./start_backend.sh" && \
 ./start_backend.sh &)

sleep 3

# Iniciar frontend en background
echo "🎨 Iniciando Frontend..."
gnome-terminal --tab --title="FitoScan Frontend" -- bash -c './start_frontend.sh; exec bash' 2>/dev/null || \
xterm -T "FitoScan Frontend" -e './start_frontend.sh' 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && ./start_frontend.sh"' 2>/dev/null || \
(echo "⚠️  No se pudo abrir terminal automáticamente." && \
 echo "   Ejecuta manualmente: ./start_frontend.sh")

echo ""
echo "✅ FitoScan Pro iniciado correctamente!"
echo ""
echo "📍 URLs:"
echo "   - Backend:  http://localhost:8000"
echo "   - Frontend: http://localhost:5173"
echo ""
echo "🔍 Abre tu navegador en: http://localhost:5173"
echo ""
