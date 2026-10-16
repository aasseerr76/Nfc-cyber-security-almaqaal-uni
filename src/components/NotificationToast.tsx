import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, AlertTriangle, X, Radio } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { activeToast, dismissToast } = useApp();

  if (!activeToast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md pointer-events-auto">
      <div className="bg-slate-900/95 backdrop-blur-md border border-indigo-500/40 shadow-2xl shadow-indigo-950/60 rounded-2xl p-4 text-white flex items-start gap-3.5 transform transition-all animate-in fade-in slide-in-from-top-4 duration-300">
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${
          activeToast.type === 'success' 
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }`}>
          {activeToast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <h4 className="text-sm font-bold text-slate-100">{activeToast.title}</h4>
            <span className="text-[11px] text-slate-400 font-mono mr-auto">{activeToast.timestamp}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{activeToast.message}</p>
        </div>

        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
