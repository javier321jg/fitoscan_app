import React from 'react';
import { ArrowLeft, Activity } from 'lucide-react';
import AreaChart from './AreaChart';

const StatsScreen = ({ setActiveTab }) => {
  return (
    <div className="h-full flex flex-col bg-black pt-12 px-6 pb-24 overflow-y-auto animate-fadeIn text-gray-200">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('home')}
          className="p-3 border border-gray-800 rounded-xl hover:bg-gray-900 text-emerald-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5"/>
        </button>
        <div>
          <h2 className="text-xl font-bold font-mono text-white">ANALYTICS</h2>
          <p className="text-[10px] text-emerald-600 font-mono tracking-wider">MÓDULO DE REPORTE</p>
        </div>
      </div>

      <div className="bg-gray-900/30 border border-emerald-900/30 p-6 rounded-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity className="w-24 h-24 text-emerald-500"/>
        </div>
        <h3 className="text-emerald-500 text-[10px] font-mono uppercase mb-2">Infecciones Detectadas</h3>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-5xl font-bold text-white tracking-tighter">24</span>
          <span className="text-xs text-red-400 font-mono bg-red-900/20 px-2 py-1 rounded">▲ 12% ALERTA</span>
        </div>
        <AreaChart />
      </div>

      <h3 className="text-gray-500 text-[10px] font-mono font-bold uppercase mb-4 pl-1">DISTRIBUCIÓN PATÓGENOS</h3>
      <div className="space-y-4">
        {[
          { name: 'FUSARIUM', count: 45, color: 'bg-red-600' },
          { name: 'MILDIU', count: 30, color: 'bg-yellow-500' },
          { name: 'ROYA', count: 18, color: 'bg-orange-500' },
          { name: 'HEALTHY', count: 7, color: 'bg-emerald-600' }
        ].map((item, i) => (
          <div key={i} className="group">
            <div className="flex justify-between text-xs font-mono mb-2 text-gray-400">
              <span>{item.name}</span>
              <span className="text-white font-bold">{item.count}%</span>
            </div>
            <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <div
                style={{ width: `${item.count}%` }}
                className={`h-full ${item.color} shadow-[0_0_15px_currentColor] transition-all duration-500`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <span className="text-[9px] text-gray-500 uppercase font-mono block mb-2">Escaneos Hoy</span>
          <span className="text-3xl font-bold text-white">156</span>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <span className="text-[9px] text-gray-500 uppercase font-mono block mb-2">Precisión IA</span>
          <span className="text-3xl font-bold text-emerald-500">98.2%</span>
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;
