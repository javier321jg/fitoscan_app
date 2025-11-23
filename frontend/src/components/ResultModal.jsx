import React, { useRef, useEffect, useState } from 'react';
import { X, Microscope, Droplets, AlertCircle } from 'lucide-react';

const ResultModal = ({ result, capturedImage, detections, onClose, setActiveTab }) => {
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!capturedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Ajustar el tamaño del canvas a la imagen
      canvas.width = img.width;
      canvas.height = img.height;

      // Dibujar la imagen
      ctx.drawImage(img, 0, 0);

      // Dibujar las bounding boxes
      detections.forEach((detection) => {
        const [x1, y1, x2, y2] = detection.bbox;
        const width = x2 - x1;
        const height = y2 - y1;

        // Color según la confianza
        const confidence = detection.confidence;
        let color;
        if (confidence > 0.9) color = '#10B981'; // Verde (alta confianza)
        else if (confidence > 0.7) color = '#FACC15'; // Amarillo (media)
        else color = '#EF4444'; // Rojo (baja)

        // Dibujar rectángulo
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.strokeRect(x1, y1, width, height);

        // Dibujar máscara semi-transparente
        ctx.fillStyle = color + '20';
        ctx.fillRect(x1, y1, width, height);

        // Dibujar etiqueta
        const label = `${detection.class_name} ${(confidence * 100).toFixed(1)}%`;
        ctx.font = 'bold 16px monospace';
        const textWidth = ctx.measureText(label).width;

        // Fondo de la etiqueta
        ctx.fillStyle = color;
        ctx.fillRect(x1, y1 - 30, textWidth + 16, 30);

        // Texto de la etiqueta
        ctx.fillStyle = '#000000';
        ctx.fillText(label, x1 + 8, y1 - 8);

        // Dibujar centro (crosshair)
        const [cx, cy] = detection.center;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy);
        ctx.lineTo(cx + 10, cy);
        ctx.moveTo(cx, cy - 10);
        ctx.lineTo(cx, cy + 10);
        ctx.stroke();
      });

      setImageLoaded(true);
    };

    img.src = capturedImage;
  }, [capturedImage, detections]);

  if (!result) return null;

  return (
    <div className="absolute inset-0 z-[60] bg-gray-950 flex flex-col animate-slideUp font-sans text-white overflow-hidden">
      {/* Header con imagen y bounding boxes */}
      <div className="h-[45%] relative flex-shrink-0">
        <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain"
            style={{ imageRendering: 'crisp-edges' }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-emerald-500"></div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-black/60 backdrop-blur rounded-lg text-white border border-white/10 hover:bg-red-500 hover:border-red-500 transition-colors z-10"
        >
          <X />
        </button>

        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="bg-red-600 text-white px-3 py-1 text-[10px] font-bold font-mono tracking-widest rounded shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse">
              POSITIVO
            </span>
            <span className="bg-emerald-900/80 border border-emerald-500/30 text-emerald-400 px-3 py-1 text-[10px] font-mono tracking-widest rounded">
              CONF: {(result.confidence * 100).toFixed(1)}%
            </span>
            <span className="bg-gray-900/80 border border-gray-700 text-gray-300 px-3 py-1 text-[10px] font-mono tracking-widest rounded">
              {detections.length} DETECCIÓN{detections.length !== 1 ? 'ES' : ''}
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            {result.disease}
          </h1>
          <p className="text-emerald-500 text-xs font-mono uppercase tracking-wider">
            {result.scientific}
          </p>
        </div>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 px-6 pt-6 bg-gray-950 overflow-y-auto pb-8">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <span className="block text-[9px] text-gray-500 uppercase font-mono mb-1">Severidad</span>
            <span className={`font-bold text-lg ${
              result.severity === 'CRÍTICA' ? 'text-red-500' :
              result.severity === 'ALTA' ? 'text-orange-500' :
              result.severity === 'MEDIA' ? 'text-yellow-500' :
              'text-emerald-500'
            }`}>
              {result.severity}
            </span>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <span className="block text-[9px] text-gray-500 uppercase font-mono mb-1">Planta</span>
            <span className="text-white font-bold text-xs">{result.plant}</span>
          </div>
        </div>

        {/* Lista de detecciones */}
        <div className="mb-8">
          <h3 className="text-emerald-500 text-xs font-bold font-mono uppercase mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4"/> DETECCIONES ({detections.length})
          </h3>
          <div className="space-y-2">
            {detections.map((det, idx) => (
              <div key={idx} className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex justify-between items-center">
                <div>
                  <span className="text-white font-bold text-sm">{det.class_name}</span>
                  <span className="block text-[9px] text-gray-500 font-mono mt-1">
                    Coord: ({det.bbox[0].toFixed(0)}, {det.bbox[1].toFixed(0)}) - ({det.bbox[2].toFixed(0)}, {det.bbox[3].toFixed(0)})
                  </span>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                  det.confidence > 0.9 ? 'bg-emerald-900/30 text-emerald-400' :
                  det.confidence > 0.7 ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {(det.confidence * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-emerald-500 text-xs font-bold font-mono uppercase mb-3 flex items-center gap-2">
            <Microscope className="w-4 h-4"/> ANÁLISIS IA
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-emerald-900 pl-4">
            {result.description}
          </p>
        </div>

        <div>
          <h3 className="text-emerald-500 text-xs font-bold font-mono uppercase mb-4 flex items-center gap-2">
            <Droplets className="w-4 h-4"/> PROTOCOLO DE ACCIÓN
          </h3>
          <div className="space-y-3">
            {result.treatments.map((treatment, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition-colors group">
                <span className="text-emerald-600 font-mono font-bold text-sm bg-emerald-900/20 w-8 h-8 rounded flex items-center justify-center group-hover:text-emerald-400 group-hover:bg-emerald-900/40">
                  0{i+1}
                </span>
                <span className="text-gray-300 text-xs font-bold uppercase tracking-wide group-hover:text-white">
                  {treatment}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
            setActiveTab('stats');
          }}
          className="w-full mt-10 mb-8 bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-5 rounded-xl text-sm tracking-[0.2em] uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
        >
          Archivar Reporte
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
