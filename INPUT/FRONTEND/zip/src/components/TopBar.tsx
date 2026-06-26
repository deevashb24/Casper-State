import { Play, LogOut, ChevronDown } from "lucide-react";

export function TopBar() {
  return (
    <header className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-10 z-20 pointer-events-none border-b border-white/5 bg-[#070708]/80 backdrop-blur-sm">
      {/* Left section pointer-events-auto so we can interact */}
      <div className="flex items-center gap-8 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-indigo-500 rounded-sm rotate-45"></div>
          <span className="text-xl font-light tracking-tight text-white">Casper<span className="text-slate-500">State</span></span>
        </div>
        
        <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 px-4 py-1.5 rounded-full cursor-pointer hover:bg-white/5 transition-colors">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Workspace 1</span>
          <ChevronDown size={14} className="text-slate-500" />
        </div>
      </div>

      {/* Right section pointer-events-auto */}
      <div className="flex items-center gap-6 pointer-events-auto">
        <div className="flex gap-6 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            <span className="cursor-pointer hover:text-white transition-colors">Journal</span>
            <span className="cursor-pointer hover:text-white transition-colors">Integrations</span>
            <span className="cursor-pointer hover:text-white transition-colors">Settings</span>
        </div>

        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-colors">
                <Play size={14} />
                Run once
            </button>
            <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-colors">
                <LogOut size={14} className="rotate-180" />
                Go Live
            </button>
        </div>
      </div>
    </header>
  );
}
