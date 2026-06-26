import { Play, LogOut, ChevronDown, Check } from "lucide-react";
import React, { useState } from "react";

export function TopBar({
  workspaces,
  activeId,
  onSwitchWorkspace,
  onJournal,
  onSettings,
  onRunOnce,
  onGoLive,
  isLive,
}: any) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeWorkspace = workspaces.find((w: any) => w.id === activeId) || workspaces[0];

  return (
    <header className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-10 z-20 pointer-events-none border-b border-white/5 bg-[#070708]/80 backdrop-blur-sm">
      <div className="flex items-center gap-8 pointer-events-auto">
        <div className="flex items-center gap-3">
          <img src="/cornerstone-logo.webp" alt="Cornerstone Logo" className="h-10 w-auto object-contain" />
          <span className="text-xl font-light tracking-tight text-white">Casper<span className="text-slate-500">State</span></span>
        </div>
        
        <div className="relative">
          <div 
            className="flex items-center gap-2 bg-neutral-900 border border-white/10 px-4 py-1.5 rounded-full cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{activeWorkspace?.name}</span>
            <ChevronDown size={14} className="text-slate-500" />
          </div>
          {menuOpen && (
            <div className="absolute top-full mt-2 w-48 bg-neutral-900 border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
              {workspaces.map((w: any) => (
                <div 
                  key={w.id} 
                  className="px-4 py-2 text-sm text-slate-300 hover:bg-white/5 cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    onSwitchWorkspace(w.id);
                    setMenuOpen(false);
                  }}
                >
                  {w.name}
                  {w.id === activeId && <Check size={14} className="text-indigo-400" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 pointer-events-auto">
        <div className="flex gap-6 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            <span className="cursor-pointer hover:text-white transition-colors" onClick={onJournal}>Journal</span>
            <span className="cursor-pointer hover:text-white transition-colors" onClick={onSettings}>Settings</span>
        </div>

        <div className="flex items-center gap-3">
            <button 
                className="flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-colors"
                onClick={onRunOnce}
            >
                <Play size={14} />
                Run once
            </button>
            <button 
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-colors ${
                  isLive ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-indigo-500 hover:bg-indigo-600 text-white border border-transparent'
                }`}
                onClick={onGoLive}
            >
                {isLive ? <LogOut size={14} /> : <LogOut size={14} className="rotate-180" />}
                {isLive ? 'Stop Live' : 'Go Live'}
            </button>
        </div>
      </div>
    </header>
  );
}
