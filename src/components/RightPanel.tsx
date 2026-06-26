import { useEffect, useRef, useState } from "react";
import { Bot, Sparkles, AlertCircle, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import AutoTextarea from "../AutoTextarea";

export function RightPanel({ messages, isTyping, onSendMessage }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="w-[380px] h-full bg-neutral-950/90 backdrop-blur-xl border-l border-white/5 flex flex-col shadow-2xl pointer-events-auto">
      <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
                <Bot size={16} className="text-indigo-400" />
            </div>
            <div>
                <h3 className="text-sm font-semibold text-slate-100">Casper AI Assistant</h3>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">GPT-4 Turbo / High Thinking</p>
            </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {(!messages || messages.length === 0) && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm text-center">
             <Bot size={32} className="mb-4 opacity-50" />
             <p>I can help you build and configure agents.</p>
             <p>Ask me anything!</p>
          </div>
        )}
        {messages?.map((msg: any) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                        {msg.role === 'user' ? 'You' : 'Casper AI'}
                    </span>
                    <span className="text-[9px] text-slate-600">
                        {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                
                <div className={`
                    max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                    ${msg.role === 'user' 
                        ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)] rounded-tr-none' 
                        : 'bg-neutral-900 border border-white/10 text-slate-300 rounded-tl-none'
                    }
                `}>
                    <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 text-sm">
                        <ReactMarkdown>
                            {msg.content}
                        </ReactMarkdown>
                    </div>

                    {msg.image && (
                        <div className="mt-3 rounded-lg overflow-hidden border border-white/10 shadow-lg relative group">
                            <img src={`data:image/png;base64,${msg.image}`} alt="Generated Content" className="w-full h-auto" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-xs font-semibold uppercase tracking-widest text-white border border-white/20 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md cursor-pointer hover:bg-black/70">
                                    Download Image
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ))}

        {isTyping && (
             <div className="flex flex-col items-start">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Casper AI</span>
                </div>
                <div className="bg-neutral-900 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                    <Sparkles size={14} className="text-indigo-400 animate-pulse" />
                    <span className="text-sm text-slate-400 italic">Thinking...</span>
                </div>
            </div>
        )}
      </div>

      <div className="p-4 bg-neutral-900/50 border-t border-white/5 shrink-0 flex flex-col gap-3">
         <div className="relative flex items-end">
            <AutoTextarea 
               value={inputValue}
               onChange={setInputValue}
               placeholder="Message AI Assistant..."
               className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-200 outline-none focus:border-indigo-500/50 resize-none transition-colors"
               minHeight={46}
            />
            <button 
               onClick={handleSend}
               disabled={!inputValue.trim() || isTyping}
               className="absolute right-2 bottom-2 p-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 transition-colors text-white"
            >
               <Send size={14} />
            </button>
         </div>
         <div className="flex items-center gap-3 bg-neutral-950 border border-white/5 rounded-xl p-3 shadow-inner">
             <AlertCircle size={14} className="text-amber-500 shrink-0" />
             <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                 Use the floating command bar in the center of the canvas to build new agents. 
                 This chat keeps a history of your AI generation events.
             </p>
         </div>
      </div>
    </div>
  );
}
