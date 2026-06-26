import { Search, Wallet, Pen, Settings, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

export function Canvas({ onAskAI }: { onAskAI: (text: string) => void }) {
  const [prompt, setPrompt] = useState("");
  const [imgSize, setImgSize] = useState("2K");

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && prompt.trim()) {
          // If they explicitly want an image, maybe prepend a secret tag or just rely on AI understanding, 
          // but let's append the size preference
          const finalPrompt = prompt.toLowerCase().includes("image") || prompt.toLowerCase().includes("draw") 
            ? `${prompt} (use size ${imgSize})` 
            : prompt;
          onAskAI(finalPrompt);
          setPrompt("");
      }
  }

  return (
    <div className="flex-1 h-full relative bg-canvas-grid flex items-center justify-center overflow-hidden">
        {/* Glow Effects in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-brand-purple/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Ask AI Input */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] z-10">
        <div className="flex items-center gap-3 bg-neutral-950/80 backdrop-blur-md border border-white/5 px-6 py-4 rounded-full shadow-lg pointer-events-auto">
          <Search size={20} className="text-slate-500" />
          <input
            type="text"
            placeholder="Ask AI to build or change this agent... (e.g., 'generate image of a neon cube')"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
             <ImageIcon size={16} className="text-slate-500" />
             <select 
                value={imgSize}
                onChange={(e) => setImgSize(e.target.value)}
                className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer"
             >
                 <option value="1K" className="bg-neutral-900">1K</option>
                 <option value="2K" className="bg-neutral-900">2K</option>
                 <option value="4K" className="bg-neutral-900">4K</option>
             </select>
          </div>
        </div>
      </div>

      {/* Mock Nodes */}
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
        
        {/* Node 1: Wallet (Top Center) */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
            <div className="bg-neutral-950 border border-white/5 rounded-3xl w-[280px] p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <Wallet size={18} className="text-indigo-400" />
                        <span className="text-sm font-semibold uppercase tracking-widest text-slate-100">Wallet</span>
                    </div>
                    <span className="text-slate-500 hover:text-slate-300 cursor-pointer">⋮</span>
                </div>
                <div className="bg-neutral-900 rounded-lg px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-4 flex justify-between items-center border border-white/5 relative z-10">
                    <span>wallet 1: 02023e...ecb9</span>
                    <span className="text-slate-500">v</span>
                </div>
                <div className="flex justify-between items-center relative z-10">
                    <span className="font-light tracking-tight text-white text-2xl">4,723.5 CSPR</span>
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-emerald-400 text-[12px]">✓</span>
                    </div>
                </div>

                {/* Bottom Port */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-400 rounded-full border-2 border-neutral-950 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
            </div>
        </div>

        {/* Node 2: Spend Limit (Bottom Left) */}
        <div className="absolute top-[60%] left-[30%] flex flex-col items-center pointer-events-auto">
            <div className="bg-neutral-950 border border-white/5 rounded-3xl w-[240px] p-6 shadow-2xl relative">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <Pen size={18} className="text-purple-400" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-100">Spend limit</span>
                    </div>
                    <span className="text-slate-500 hover:text-slate-300 cursor-pointer">⋮</span>
                </div>
                <div className="text-sm text-slate-400">
                    Cap 10 CSPR / this run
                </div>
                {/* Top Port */}
                <div className="absolute -top-1.5 left-[30%] w-3 h-3 bg-purple-400 rounded-full border-2 border-neutral-950 shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
                {/* Right Port */}
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full border-2 border-neutral-950 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            </div>
        </div>

        {/* Node 3: AI Agent (Bottom Right) */}
        <div className="absolute top-[60%] left-[60%] flex flex-col items-center pointer-events-auto">
            <div className="bg-neutral-950 border border-white/5 rounded-3xl w-[240px] p-6 shadow-2xl relative">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <Settings size={18} className="text-indigo-400" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-100">AI Agent</span>
                    </div>
                    <span className="text-slate-500 hover:text-slate-300 cursor-pointer">⋮</span>
                </div>
                <div className="text-sm text-slate-400">
                    Check wallet balance...
                </div>
                 {/* Top Port */}
                 <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-400 rounded-full border-2 border-neutral-950 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
                 {/* Left Port */}
                 <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full border-2 border-neutral-950 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                 {/* Right Port */}
                 <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-indigo-400 rounded-full border-2 border-neutral-950 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
            </div>
        </div>

        {/* Curved Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
            {/* Wallet to Spend Limit */}
            <path 
                d="M 50% 33% C 50% 45%, 35% 50%, 35% 60%" 
                fill="none" 
                stroke="url(#gradient-blue-red)" 
                strokeWidth="3" 
                className="opacity-60"
            />
            {/* Wallet to AI Agent */}
            <path 
                d="M 50% 33% C 50% 45%, 65% 50%, 65% 60%" 
                fill="none" 
                stroke="url(#gradient-blue-yellow)" 
                strokeWidth="3" 
                className="opacity-60"
            />
             {/* Spend Limit to AI Agent */}
             <path 
                d="M 40% 63% C 45% 63%, 50% 63%, 55% 63%" 
                fill="none" 
                stroke="url(#gradient-orange-yellow)" 
                strokeWidth="3" 
                className="opacity-60"
            />

            <defs>
                <linearGradient id="gradient-blue-red" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#C084FC" />
                </linearGradient>
                <linearGradient id="gradient-blue-yellow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
                <linearGradient id="gradient-orange-yellow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
            </defs>
        </svg>

      </div>
    </div>
  );
}
