import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CATEGORY_LABELS, CATEGORY_COLORS, MODULES, ModuleCategory } from "../modules";
import Icon from "../Icon";

export function Sidebar({ paletteWidth, onDragStart, onItemClick }: any) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.keys(CATEGORY_LABELS).reduce((acc, k) => ({ ...acc, [k]: true }), {})
  );

  return (
    <div 
      className="h-full bg-neutral-950 flex flex-col border-r border-white/5 py-8 px-6 select-none z-10 shrink-0 overflow-hidden transition-all"
      style={{ width: paletteWidth }}
    >
      <div className="flex-1 overflow-y-auto mt-16 flex flex-col gap-2">
        {(Object.keys(CATEGORY_LABELS) as ModuleCategory[]).map((cat) => {
          const items = MODULES.filter((m) => m.category === cat && !m.hidden);
          if (items.length === 0) return null;
          const isExp = expanded[cat];
          const color = CATEGORY_COLORS[cat].border;

          return (
            <div key={cat} className="flex flex-col gap-1">
              <div 
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => setExpanded({ ...expanded, [cat]: !isExp })}
              >
                <div className="flex items-center gap-3 text-slate-500">
                  {isExp ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500" style={{ color: color }}>
                    {CATEGORY_LABELS[cat]}
                  </span>
                </div>
                <span className="text-[10px] bg-neutral-900 border border-white/10 text-slate-500 px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              
              {isExp && (
                <div className="flex flex-col gap-1 pl-4 mb-2">
                  {items.map((m) => (
                    <div
                      key={m.type}
                      draggable
                      onDragStart={(e) => {
                        if (onDragStart) onDragStart(e, m.type);
                      }}
                      onClick={() => {
                        if (onItemClick) onItemClick(m.type);
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 cursor-grab active:cursor-grabbing transition-colors text-slate-300 hover:text-white"
                      style={{ borderLeft: `2px solid ${color}` }}
                    >
                      <Icon name={m.icon} size={14} className="text-slate-500" />
                      <span className="text-xs font-medium">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
