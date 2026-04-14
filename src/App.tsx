import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, Trash2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Message, sendMessage } from "./services/geminiService";
import { MessageBubble } from "./components/MessageBubble";
import { QuickActions } from "./components/QuickActions";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", parts: [{ text }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage(messages, text);
      const modelMessage: Message = { role: "model", parts: [{ text: response }] };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { 
        role: "model", 
        parts: [{ text: "Eish bafethu, I'm having some network issues. Check your connection and try again." }] 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-background font-sans text-foreground overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-surface border-b border-border sticky top-0 z-10 h-16 shrink-0">
        <div className="flex items-center gap-2">
          <div className="logo font-black text-xl tracking-tighter flex items-center gap-1">
            KASIMIND<span className="text-primary">AI</span>
          </div>
          <div className="status flex items-center gap-2 ml-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
            Hustle Mode Active
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={clearChat} className="text-muted-foreground hover:text-destructive">
          <Trash2 size={20} />
        </Button>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden bg-border gap-[1px]">
        {/* Left Sidebar */}
        <aside className="w-72 bg-surface p-6 flex flex-col gap-8 hidden lg:flex">
          <section>
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4">Your Wallet Today</h2>
            <div className="bg-background border border-border p-4 rounded-lg">
              <div className="text-xs font-bold text-orange mb-1">Target Goal</div>
              <div className="text-2xl font-black">R1,200</div>
              <div className="text-[10px] font-bold text-primary mt-1">+R340 today</div>
            </div>
          </section>
          
          <section>
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4">Quick Tools</h2>
            <div className="flex flex-col gap-2">
              {["Create 1-Page CV", "Price my product", "Marketing text"].map((tool) => (
                <button
                  key={tool}
                  onClick={() => handleSend(tool)}
                  className="bg-background border border-border p-3 rounded-lg text-xs font-bold text-left hover:border-primary transition-colors"
                >
                  {tool}
                </button>
              ))}
            </div>
          </section>
        </aside>

        {/* Main Chat Content */}
        <main className="flex-1 bg-background flex flex-col overflow-hidden relative">
          <ScrollArea className="flex-1 px-6 py-8">
            <AnimatePresence initial={false}>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full py-12 text-center"
                >
                  <div className="w-20 h-20 bg-surface border border-border rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="text-primary" size={40} />
                  </div>
                  <h2 className="text-2xl font-black mb-2">Heita! I'm KasiMind.</h2>
                  <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                    I'm here to help you hustle, find jobs, and grow your business. What's the move?
                  </p>
                  <Separator className="mb-8 w-1/2 mx-auto bg-border" />
                  <QuickActions onAction={handleSend} />
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, i) => (
                    <MessageBubble key={i} role={msg.role} text={msg.parts[0].text} />
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3 mb-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <BotPulse />
                      </div>
                      <div className="bg-surface border border-border p-4 rounded-xl rounded-tl-none shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={scrollRef} />
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 bg-surface border-t border-border shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-3 max-w-3xl mx-auto w-full"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What's the move next?..."
                className="flex-1 bg-background border-border focus-visible:ring-primary rounded-lg h-12"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-12 px-8 font-black uppercase text-xs tracking-widest transition-all"
              >
                GO
              </Button>
            </form>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-72 bg-surface p-6 flex flex-col gap-6 hidden xl:flex">
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Local Opportunities</h2>
          <div className="flex flex-col gap-4">
            {[
              { tag: "LEARNERSHIP", title: "Retail Assistant", meta: "Apply by Friday • Mall of Africa" },
              { tag: "GIG", title: "Data Entry (Online)", meta: "R150 / hour • Mobile friendly" },
              { tag: "TRAINING", title: "Basic Coding", meta: "Free • Starts Monday" },
              { tag: "GRANT", title: "Youth Micro-Business", meta: "Up to R5,000 available" }
            ].map((op, i) => (
              <div key={i} className="pb-4 border-b border-border last:border-0">
                <div className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded inline-block mb-2 tracking-widest uppercase">
                  {op.tag}
                </div>
                <div className="text-sm font-bold mb-1">{op.title}</div>
                <div className="text-[10px] text-muted-foreground">{op.meta}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function BotPulse() {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="w-4 h-4 bg-white rounded-full"
    />
  );
}
