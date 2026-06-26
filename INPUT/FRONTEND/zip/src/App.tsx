import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Canvas } from './components/Canvas';
import { RightPanel } from './components/RightPanel';
import { BottomBar } from './components/BottomBar';
import { Message } from './types';

const SYSTEM_INSTRUCTION = `You are an AI Agent builder for the Casper blockchain (CasperState). 
Your role is to help users construct, debug, and understand their node-based visual workflows.
Keep answers concise, technical, and relevant to building blockchain agents (wallets, smart contracts, limits).
You can also generate images if asked. If the user asks to generate an image, output exactly: 
[GENERATE_IMAGE: prompt | size]
where size is 1K, 2K, or 4K.
Example: [GENERATE_IMAGE: A futuristic neon smart contract | 2K]`;

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
      {
          id: 'initial',
          role: 'assistant',
          content: 'AI Agent: using connected wallet...',
          timestamp: new Date()
      }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleAskAI = async (text: string) => {
      // 1. Add user message
      const userMsg: Message = {
          id: uuidv4(),
          role: 'user',
          content: text,
          timestamp: new Date()
      };
      
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setIsTyping(true);

      try {
          // Check if it's an explicit image command or let the model decide via the prompt
          // We will send to chat endpoint first
          const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  messages: newMessages,
                  modelTier: 'pro', // Using High Thinking / Pro for complex builder logic
                  useThinking: true,
                  systemInstruction: SYSTEM_INSTRUCTION
              })
          });

          if (!res.ok) throw new Error("API Error");
          const data = await res.json();
          const replyText = data.text;

          // Check for image generation trigger
          const imageMatch = replyText.match(/\[GENERATE_IMAGE:(.*?)\|(.*?)\]/);
          
          if (imageMatch) {
              const prompt = imageMatch[1].trim();
              const size = imageMatch[2].trim();
              
              // Add a text message acknowledging
              setMessages(prev => [...prev, {
                  id: uuidv4(),
                  role: 'assistant',
                  content: `Generating image: "${prompt}" at ${size}...`,
                  timestamp: new Date()
              }]);

              // Call image API
              const imgRes = await fetch('/api/image', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ prompt, size })
              });
              const imgData = await imgRes.json();
              
              if (imgData.imageBase64) {
                 setMessages(prev => [...prev, {
                    id: uuidv4(),
                    role: 'assistant',
                    content: `Here is your generated image:`,
                    timestamp: new Date(),
                    image: imgData.imageBase64
                 }]);
              } else {
                  throw new Error("Failed to load image");
              }

          } else {
              // Standard text reply
              setMessages(prev => [...prev, {
                  id: uuidv4(),
                  role: 'assistant',
                  content: replyText,
                  timestamp: new Date()
              }]);
          }

      } catch (error) {
          console.error(error);
          setMessages(prev => [...prev, {
              id: uuidv4(),
              role: 'assistant',
              content: `Error: Could not process request.`,
              timestamp: new Date()
          }]);
      } finally {
          setIsTyping(false);
      }
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-[#070708] text-slate-100 font-sans">
        <Sidebar />
        
        <div className="flex-1 relative flex">
            <TopBar />
            <Canvas onAskAI={handleAskAI} />
            <BottomBar />
        </div>

        <div className="absolute right-0 top-0 bottom-0 pointer-events-none z-30 flex justify-end">
             <RightPanel messages={messages} isTyping={isTyping} />
        </div>
    </div>
  );
}

