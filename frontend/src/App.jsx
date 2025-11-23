import React, { useState, useEffect } from 'react';
import {
  Camera, Home, PieChart, Scan, Activity, Droplets, Wind, Sun, ArrowLeft,
  Share2, Zap, AlertTriangle, Leaf, X, ChevronRight, CheckCircle2,
  CloudLightning, Thermometer, User, Settings, Bell, Microscope, Grid, Layers, Cpu,
  Maximize2, Crosshair, Aperture, Fingerprint, Map, MessageSquare, Send, Radio
} from 'lucide-react';
import CameraView from './components/CameraView';
import ResultModal from './components/ResultModal';
import ChatBot from './components/ChatBot';
import MapScreen from './components/MapScreen';
import StatsScreen from './components/StatsScreen';
import AreaChart from './components/AreaChart';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [viewingResult, setViewingResult] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [detections, setDetections] = useState([]);

  const startScan = () => {
    setActiveTab('scan');
    setIsScanning(false);
    setShowResult(false);
    setScanProgress(0);
    setCapturedImage(null);
    setDetections([]);
  };

  const handleScanComplete = (imageData, detectionsData, diseaseInfo) => {
    setCapturedImage(imageData);
    setDetections(detectionsData);

    if (diseaseInfo) {
      setViewingResult({
        id: Date.now(),
        disease: diseaseInfo.disease,
        scientific: diseaseInfo.scientific,
        plant: diseaseInfo.plant,
        confidence: diseaseInfo.confidence,
        severity: diseaseInfo.severity,
        description: diseaseInfo.description,
        treatments: diseaseInfo.treatments
      });
      setShowResult(true);
    }
  };

  const HomeScreen = () => (
    <div className="h-full flex flex-col bg-black p-6 pt-12 animate-fadeIn pb-24 overflow-y-auto scrollbar-hide text-gray-200 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Fingerprint className="w-4 h-4 text-emerald-500 animate-pulse" />
            <h2 className="text-emerald-500 font-mono text-[10px] tracking-[0.2em] uppercase">BIO_VISION v5.0</h2>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">DASHBOARD</h1>
        </div>
        <div className="relative group">
          <div className="w-12 h-12 rounded-xl border border-emerald-500/50 p-1 group-hover:border-emerald-400 transition-colors">
            <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 shadow-[0_0_10px_#10B981] rounded-full border-2 border-black"></div>
        </div>
      </div>

      <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 border border-emerald-900/50 bg-gray-900/80 group cursor-pointer hover:border-emerald-500/50 transition-all">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>

        <div className="relative z-10 p-6 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-emerald-600/80 font-mono uppercase tracking-wider block mb-1">Estado del Cultivo</span>
              <span className="text-xl font-bold text-white flex items-center gap-2">
                ÓPTIMO <CheckCircle2 className="w-5 h-5 text-emerald-500"/>
              </span>
            </div>
            <Activity className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="flex gap-6 items-end">
            <div>
              <span className="block text-3xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">98.2%</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-wider">Salud Bio-Métrica</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button onClick={startScan} className="h-32 bg-emerald-600 hover:bg-emerald-500 text-black p-5 rounded-2xl flex flex-col justify-between transition-all group relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-black/20 w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Scan className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="block font-bold text-lg tracking-tight z-10">ESCANEAR</span>
            <span className="text-[9px] font-mono font-bold opacity-60">INICIAR DIAGNÓSTICO</span>
          </div>
        </button>

        <div className="flex flex-col gap-4">
          <button onClick={() => setActiveTab('map')} className="flex-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3 transition-all active:scale-95">
            <Map className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-bold text-white">BIO-RADAR</span>
          </button>
          <button onClick={() => setActiveTab('chat')} className="flex-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3 transition-all active:scale-95">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-bold text-white">AGRI-MIND</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-900/30 border border-emerald-900/30 p-6 rounded-2xl mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity className="w-24 h-24 text-emerald-500"/>
        </div>
        <h3 className="text-emerald-500 text-[10px] font-mono uppercase mb-2">Últimos Escaneos</h3>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-4xl font-bold text-white tracking-tighter">24</span>
          <span className="text-xs text-emerald-400 font-mono bg-emerald-900/20 px-2 py-1 rounded">HOY</span>
        </div>
        <AreaChart />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex justify-center items-center font-sans selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-[400px] h-[850px] bg-gray-950 relative shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden md:rounded-[3rem] border-[8px] border-gray-900 ring-1 ring-white/10">

        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'stats' && <StatsScreen setActiveTab={setActiveTab} />}
        {activeTab === 'map' && <MapScreen setActiveTab={setActiveTab} />}
        {activeTab === 'chat' && <ChatBot setActiveTab={setActiveTab} currentDisease={viewingResult?.disease} />}
        {activeTab === 'scan' && (
          <CameraView
            setActiveTab={setActiveTab}
            onScanComplete={handleScanComplete}
            isScanning={isScanning}
            setIsScanning={setIsScanning}
            scanProgress={scanProgress}
            setScanProgress={setScanProgress}
          />
        )}

        {showResult && viewingResult && (
          <ResultModal
            result={viewingResult}
            capturedImage={capturedImage}
            detections={detections}
            onClose={() => setShowResult(false)}
            setActiveTab={setActiveTab}
          />
        )}

        {!isScanning && !showResult && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[95%] h-20 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl flex justify-around items-center px-2 z-40 shadow-2xl">
            <button onClick={() => setActiveTab('home')} className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-emerald-400' : 'text-gray-600 hover:text-gray-400'}`}>
              <Home className="w-5 h-5" />
              <span className="text-[8px] font-bold">HOME</span>
            </button>
            <button onClick={() => setActiveTab('map')} className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${activeTab === 'map' ? 'text-emerald-400' : 'text-gray-600 hover:text-gray-400'}`}>
              <Map className="w-5 h-5" />
              <span className="text-[8px] font-bold">RADAR</span>
            </button>
            <button onClick={startScan} className="-mt-10 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 rounded-2xl flex items-center justify-center shadow-[0_5px_20px_rgba(16,185,129,0.3)] transition-all group border-4 border-gray-950">
              <Scan className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
            </button>
            <button onClick={() => setActiveTab('stats')} className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${activeTab === 'stats' ? 'text-emerald-400' : 'text-gray-600 hover:text-gray-400'}`}>
              <PieChart className="w-5 h-5" />
              <span className="text-[8px] font-bold">DATOS</span>
            </button>
            <button onClick={() => setActiveTab('chat')} className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-emerald-400' : 'text-gray-600 hover:text-gray-400'}`}>
              <MessageSquare className="w-5 h-5" />
              <span className="text-[8px] font-bold">IA</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
