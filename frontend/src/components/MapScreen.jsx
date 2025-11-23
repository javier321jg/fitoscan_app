import React from 'react';
import { Radio, ArrowLeft } from 'lucide-react';

const MapScreen = ({ setActiveTab }) => {
  return (
    <div className="h-full w-full bg-gray-950 relative overflow-hidden animate-fadeIn">
      {/* Mapa Dark Mode Simulado */}
      <div
        className="absolute inset-0 bg-[#0a0f14] opacity-80 z-0"
        style={{
          backgroundImage: 'radial-gradient(#1f2937 1px, transparent 1px), radial-gradient(#1f2937 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px'
        }}
      />

      {/* Líneas de Radar */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-emerald-900/30 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-emerald-900/50 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] border border-emerald-500/20 rounded-full"></div>

        {/* Barrido de Radar */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-transparent to-emerald-500/10 rounded-full animate-spin-slow origin-center" style={{ maskImage: 'linear-gradient(transparent 50%, black 50%)' }}></div>
      </div>

      {/* Marcadores de Infección */}
      <div className="absolute top-[40%] left-[30%] group cursor-pointer z-10">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute opacity-75"></div>
        <div className="w-4 h-4 bg-red-600 rounded-full relative border-2 border-black shadow-[0_0_10px_#EF4444] flex items-center justify-center text-[8px] text-white font-bold">!</div>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 border border-red-500 text-red-400 text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          ALERTA: FUSARIUM
        </div>
      </div>

      <div className="absolute top-[60%] right-[25%] group cursor-pointer z-10">
        <div className="w-3 h-3 bg-emerald-500 rounded-full relative border-2 border-black shadow-[0_0_10px_#10B981]"></div>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 border border-emerald-500 text-emerald-400 text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          ZONA SANA
        </div>
      </div>

      {/* UI Superpuesta */}
      <div className="absolute top-12 left-6 z-20">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setActiveTab('home')}
            className="p-2 bg-black/60 backdrop-blur border border-gray-800 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-emerald-500 font-mono text-xl font-bold flex items-center gap-2">
              <Radio className="w-5 h-5 animate-pulse"/> BIO-RADAR
            </h2>
            <p className="text-gray-500 text-[10px] font-mono tracking-widest">VISTA SATELITAL TÁCTICA</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-28 left-6 bg-black/80 backdrop-blur-md border border-emerald-900/50 p-4 rounded-xl w-48 z-20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-[10px] font-bold font-mono">ZONA SEGURA</span>
          <span className="text-emerald-500 font-mono font-bold">85%</span>
        </div>
        <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full w-[85%]"></div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400 text-[10px] font-bold font-mono">2 FOCOS ACTIVOS</span>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
