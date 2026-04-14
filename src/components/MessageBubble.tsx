import ReactMarkdown from "react-markdown";
import { motion } from "motion/react";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "user" | "model";
  text: string;
}

export function MessageBubble({ role, text }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[85%] gap-3",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
            isUser ? "bg-muted text-foreground" : "bg-primary text-background"
          )}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        <div
          className={cn(
            "p-4 rounded-xl text-[15px] leading-relaxed shadow-sm",
            isUser
              ? "bg-primary text-background font-bold rounded-tr-none"
              : "bg-surface border border-border border-l-4 border-l-primary text-foreground rounded-tl-none"
          )}
        >
          <div className="prose-chat dark:prose-invert">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
