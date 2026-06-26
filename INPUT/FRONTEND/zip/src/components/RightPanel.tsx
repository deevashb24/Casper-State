import { X, Loader2, Minus, Minimize2 } from "lucide-react";
import { Message } from "../types";
import { useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';

export function RightPanel({ messages, isTyping }: { messages: Message[], isTyping: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="w-[380px] h-full flex flex-col p-6 z-20 pointer-events-none">
      <div className="flex-1 bg-neutral-950/90 backdrop-blur-xl border border-white/5 rounded-3xl flex flex-col overflow-hidden pointer-events-auto mt-20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Log</span>
            <div className="flex items-center gap-3 text-slate-500">
                <Minus size={16} className="cursor-pointer hover:text-white" />
                <Minimize2 size={14} className="cursor-pointer hover:text-white" />
                <X size={16} className="cursor-pointer hover:text-white" />
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs">
            
            {/* Initial mock logs to match image */}
            {messages.length === 0 && (
                <>
                    <div className="flex gap-4 text-slate-500">
                        <span className="opacity-50 shrink-0">10:28:15</span>
                        <span className="text-indigo-400">Manual run</span>
                    </div>
                    <div className="flex gap-4 text-slate-300">
                        <span className="opacity-50 shrink-0 text-slate-500">10:28:16</span>
                        <span>Wallet 'wallet 1' ready...</span>
                    </div>
                    <div className="flex gap-4 text-slate-300">
                        <span className="opacity-50 shrink-0 text-slate-500">10:28:17</span>
                        <span>Spend limit armed.<br/>the ask agent to cap 10 CSPR / this run...</span>
                    </div>
                </>
            )}

            {/* Actual Chat Messages */}
            {messages.map((msg) => (
                <div key={msg.id} className="flex gap-4">
                    <span className="opacity-50 shrink-0 text-slate-500">
                        {msg.timestamp.toLocaleTimeString([], { hour12: false })}
                    </span>
                    <div className={`flex flex-col ${msg.role === 'user' ? 'text-indigo-300' : 'text-slate-300'}`}>
                        {msg.role === 'assistant' && msg.id !== 'initial' && (
                            <span className="text-emerald-400 mb-1 font-sans font-bold text-[10px] uppercase tracking-widest">AI Agent:</span>
                        )}
                        {msg.image ? (
                             <img src={`data:image/jpeg;base64,${msg.image}`} alt="Generated" className="mt-2 rounded-md max-w-full" />
                        ) : (
                             <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                             </div>
                        )}
                    </div>
                </div>
            ))}

            {isTyping && (
                <div className="flex gap-4 text-slate-500">
                     <span className="opacity-50 shrink-0">{new Date().toLocaleTimeString([], { hour12: false })}</span>
                     <div className="flex items-center gap-2 text-emerald-400 font-sans font-bold text-[10px] uppercase tracking-widest">
                         <Loader2 size={12} className="animate-spin" />
                         <span>AI Agent thinking...</span>
                     </div>
                </div>
            )}
            
            <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
