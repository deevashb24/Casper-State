import { Zap, GitBranch, Bot, LineChart, Wallet, FileCode2, Globe2, ArrowRightLeft, LayoutTemplate } from "lucide-react";

export function Sidebar() {
  const categories = [
    { name: "TRIGGERS", icon: <Zap size={18} className="text-blue-400" />, count: 3 },
    { name: "LOGIC", icon: <GitBranch size={18} className="text-purple-400" />, count: 3 },
    { name: "AI AGENT", icon: <Bot size={18} className="text-purple-500" />, count: 0 },
    { name: "TRADING & DEFI", icon: <LineChart size={18} className="text-green-400" />, count: 3 },
    { name: "PAYMENTS", icon: <Wallet size={18} className="text-blue-500" />, count: 2 },
    { name: "SMART CONTRACTS", icon: <FileCode2 size={18} className="text-blue-300" />, count: 3 },
    { name: "REAL-WORLD ASSETS", icon: <Globe2 size={18} className="text-purple-500" />, count: 6 },
    { name: "OUTPUTS", icon: <ArrowRightLeft size={18} className="text-gray-400" />, count: 4 },
    { name: "TEMPLATES", icon: <LayoutTemplate size={18} className="text-pink-400" /> },
  ];

  return (
    <div className="w-64 h-full bg-neutral-950 flex flex-col border-r border-white/5 py-8 px-6 select-none z-10">
      
      <div className="flex-1 overflow-y-auto mt-16 flex flex-col gap-2">
        {categories.map((cat, i) => (
          <div 
            key={i} 
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 text-slate-500">
              {cat.icon}
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{cat.name}</span>
            </div>
            {cat.count !== undefined && (
              <span className="text-[10px] bg-neutral-900 border border-white/10 text-slate-500 px-2 py-0.5 rounded-full">
                {cat.count}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
