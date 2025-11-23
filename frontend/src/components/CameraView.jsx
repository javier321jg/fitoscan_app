import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { X, Zap, Scan, Cpu, Crosshair, Upload } from 'lucide-react';

const API_URL = 'http://localhost:8000';

const NeuralOverlay = ({ isScanning, progress }) => {
  const [stage, setStage] = useState('calibrating');

  useEffect(() => {
    if (progress < 20) setStage('calibrating');
    else if (progress < 60) setStage('searching');
    else if (progress < 90) setStage('locking');
    else setStage('identified');
  }, [progress]);

  if (!isScanning) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-emerald-500/50 rounded-tl-xl transition-all duration-300"></div>
      <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-emerald-500/50 rounded-tr-xl transition-all duration-300"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-emerald-500/50 rounded-bl-xl transition-all duration-300"></div>
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-emerald-500/50 rounded-br-xl transition-all duration-300"></div>

      {(stage === 'calibrating' || stage === 'searching') && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      )}
      <div className="absolute left-0 w-full h-1 bg-emerald-400 shadow-[0_0_20px_#10B981] animate-scanSweepLine" style={{ animationDuration: '3s' }}></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        {stage === 'calibrating' && (
          <div className="text-emerald-500 font-mono text-xs bg-black/80 px-2 py-1 rounded animate-pulse">
            CALIBRANDO SENSORES...
          </div>
        )}
        {stage === 'searching' && (
          <div className="text-yellow-500 font-mono text-xs bg-black/80 px-2 py-1 rounded animate-pulse flex items-center gap-2">
            <Cpu className="w-4 h-4 animate-spin" />
            ANALIZANDO IMAGEN...
          </div>
        )}
        {stage === 'locking' && (
          <div className="text-orange-500 font-mono text-xs bg-black/80 px-2 py-1 rounded animate-pulse flex items-center gap-2">
            <Crosshair className="w-4 h-4 animate-pulse" />
            PROCESANDO DETECCIONES...
          </div>
        )}
        {stage === 'identified' && (
          <div className="text-emerald-500 font-mono text-xs bg-black/80 px-2 py-1 rounded flex items-center gap-2">
            <Crosshair className="w-4 h-4" />
            ANÁLISIS COMPLETO
          </div>
        )}
      </div>
    </div>
  );
};

const CameraView = ({ setActiveTab, onScanComplete, isScanning, setIsScanning, scanProgress, setScanProgress }) => {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [useWebcam, setUseWebcam] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    let interval;
    if (isScanning) {
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isScanning, setScanProgress]);

  const captureAndAnalyze = async () => {
    try {
      setError(null);
      setIsScanning(true);
      setScanProgress(0);

      let imageData;

      if (useWebcam && webcamRef.current) {
        imageData = webcamRef.current.getScreenshot();
        if (!imageData) {
          throw new Error('No se pudo capturar la imagen de la cámara');
        }
      } else if (previewImage) {
        imageData = previewImage;
      } else {
        throw new Error('No hay imagen para analizar');
      }

      // Convertir base64 a blob
      const base64Response = await fetch(imageData);
      const blob = await base64Response.blob();

      // Crear FormData
      const formData = new FormData();
      formData.append('file', blob, 'capture.jpg');

      // Enviar al backend
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Esperar a que la animación llegue al 100%
        const waitForAnimation = new Promise(resolve => {
          const checkProgress = setInterval(() => {
            if (scanProgress >= 100) {
              clearInterval(checkProgress);
              resolve();
            }
          }, 100);
        });

        await waitForAnimation;

        setTimeout(() => {
          onScanComplete(imageData, response.data.detections, response.data.disease_info);
          setIsScanning(false);
          setScanProgress(0);
        }, 500);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (err) {
      console.error('Error en análisis:', err);
      setError(err.response?.data?.detail || err.message || 'Error al analizar la imagen');
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setUseWebcam(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col font-mono">
      <div className="absolute inset-0 z-0">
        {useWebcam ? (
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: 'environment',
              width: 1280,
              height: 720,
            }}
            className="w-full h-full object-cover"
            onUserMediaError={(err) => {
              console.error('Error accediendo a la cámara:', err);
              setError('No se pudo acceder a la cámara. Por favor, permite el acceso o sube una imagen.');
              setUseWebcam(false);
            }}
          />
        ) : previewImage ? (
          <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Upload className="w-12 h-12 mx-auto mb-4" />
              <p className="text-sm">Sube una imagen para analizar</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-emerald-900/20 mix-blend-overlay"></div>
      </div>

      <NeuralOverlay isScanning={isScanning} progress={scanProgress} />

      <div className="relative z-30 flex-1 flex flex-col justify-between p-6 pt-12">
        <div className="flex justify-between items-start">
          <button
            onClick={() => setActiveTab('home')}
            className="p-3 bg-black/60 backdrop-blur border border-white/10 text-white rounded-xl hover:border-emerald-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="bg-black/80 backdrop-blur border border-emerald-500/50 px-4 py-2 rounded-lg flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Estado</span>
              <span className={`text-[10px] font-bold tracking-widest ${isScanning ? 'text-emerald-400 animate-pulse' : 'text-gray-500'}`}>
                {isScanning ? 'ANALIZANDO...' : 'STANDBY'}
              </span>
            </div>
            <div className="h-6 w-px bg-gray-700"></div>
            <div className="flex flex-col items-center min-w-[40px]">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Progreso</span>
              <span className="text-emerald-400 font-bold text-xs">{scanProgress.toFixed(0)}%</span>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-black/60 backdrop-blur border border-white/10 text-white rounded-xl hover:border-yellow-400 transition-colors"
          >
            <Upload className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {error && (
          <div className="bg-red-900/80 border border-red-500 text-white px-4 py-3 rounded-lg text-xs">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-4 pb-12">
          {useWebcam && (
            <button
              onClick={() => {
                setUseWebcam(false);
                setPreviewImage(null);
              }}
              className="text-emerald-400 text-xs underline hover:text-emerald-300"
            >
              O sube una imagen desde tu dispositivo
            </button>
          )}

          <button
            onClick={captureAndAnalyze}
            disabled={isScanning}
            className={`group w-24 h-24 flex items-center justify-center transition-all duration-300 relative ${isScanning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className={`absolute inset-0 border border-white/10 rounded-full transition-all duration-500 ${isScanning ? 'scale-125 border-emerald-500/30 border-dashed animate-spin-slow' : 'scale-100'}`}></div>
            <div className={`absolute inset-3 border border-white/30 rounded-full transition-all duration-500 ${isScanning ? 'scale-110 border-emerald-500/50' : 'scale-100 group-hover:border-emerald-400'}`}></div>
            <div className={`w-16 h-16 bg-white rounded-full transition-all duration-300 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(255,255,255,0.3)] ${isScanning ? 'scale-90 bg-emerald-500 shadow-[0_0_30px_#10B981]' : 'group-hover:scale-105 group-hover:bg-emerald-100'}`}>
              {isScanning ? <Cpu className="w-6 h-6 text-black animate-pulse" /> : <Scan className="w-6 h-6 text-black" />}
            </div>
          </button>

          <p className="text-emerald-500 text-xs font-mono text-center">
            {isScanning ? 'PROCESANDO...' : useWebcam ? 'TOCA PARA CAPTURAR Y ANALIZAR' : 'TOCA PARA ANALIZAR IMAGEN'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CameraView;
