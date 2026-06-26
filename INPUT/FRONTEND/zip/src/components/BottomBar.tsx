import { ChevronRight, Settings2, ZoomIn, LayoutGrid, Maximize } from "lucide-react";

export function BottomBar() {
  return (
    <div className="absolute bottom-0 left-64 right-0 h-16 flex items-center justify-between px-10 z-20 pointer-events-none border-t border-white/5 bg-[#070708]/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-slate-500 pointer-events-auto cursor-pointer hover:text-white transition-colors">
        <ChevronRight size={16} />
        <span className="text-[10px] font-bold uppercase tracking-widest font-mono">_ CONSOLE</span>
      </div>

      <div className="flex items-center gap-6 text-slate-500 pointer-events-auto mr-[380px]"> {/* Avoid right panel */}
        <Settings2 size={16} className="cursor-pointer hover:text-white" />
        <ZoomIn size={16} className="cursor-pointer hover:text-white" />
        <LayoutGrid size={16} className="cursor-pointer hover:text-white" />
        <Maximize size={16} className="cursor-pointer hover:text-white" />
      </div>
    </div>
  );
}
