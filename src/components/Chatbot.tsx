import { useEffect, useState, useRef } from "react";
import { MessageSquare, Send, X, Bot, User, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome to UBMA. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      // Pointing to our local backend on port 8005
      const response = await fetch("http://localhost:8005/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });

      if (!response.ok) throw new Error("Backend not responding");
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I'm having trouble connecting to my university brain right now. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-ink text-white shadow-2xl hover:scale-110 transition-transform pulse-ring"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="flex h-[500px] w-[380px] flex-col border-surface-3 bg-white/95 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-10 fade-in duration-300 rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between bg-ink p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gold/30 animate-pulse" />
                <Bot className="relative h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-sm font-bold">UBMA Assistant</p>
                <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    <p className="text-[10px] text-white/70">Online · GPT-4 Powered</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex max-w-[85%] items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-gold/10" : "bg-ink/5"}`}>
                        {m.role === "user" ? <User className="h-3.5 w-3.5 text-gold" /> : <Sparkles className="h-3.5 w-3.5 text-ink" />}
                    </div>
                    <div
                        className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        m.role === "user"
                            ? "bg-ink text-white rounded-tr-none"
                            : "bg-surface-2 text-ink rounded-tl-none border border-surface-3"
                        }`}
                    >
                        {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/5">
                        <Bot className="h-3.5 w-3.5 text-ink" />
                    </div>
                    <div className="rounded-2xl bg-surface-2 px-4 py-2 text-sm border border-surface-3 rounded-tl-none">
                        <span className="dot-anim flex gap-1">
                        <span className="h-1 w-1 rounded-full bg-ink-3" />
                        <span className="h-1 w-1 rounded-full bg-ink-3" />
                        <span className="h-1 w-1 rounded-full bg-ink-3" />
                        </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-surface-3 bg-surface-2/50">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything about UBMA..."
                className="flex-1 rounded-full border border-surface-3 bg-white px-4 py-2 text-sm outline-none transition-colors focus:border-ink shadow-sm"
              />
              <Button type="submit" size="icon" className="rounded-full bg-ink text-white hover:opacity-90">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-2 text-center text-[10px] text-ink-3">
                UBMA Digital Assistant · May provide inaccurate info.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
