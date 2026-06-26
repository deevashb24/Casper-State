import "react";
import { Activity, ShieldCheck, Wifi } from "lucide-react";

export function BottomBar() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 bg-neutral-950/80 backdrop-blur-md border-t border-white/5 flex items-center justify-between px-6 z-20 pointer-events-auto">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Encrypted Local Storage</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
                <Activity size={14} className="text-indigo-500" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Node Status: Healthy</span>
            </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
            <Wifi size={14} className="text-emerald-500" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500">Testnet Connected</span>
        </div>
    </div>
  );
}
