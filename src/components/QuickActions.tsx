import { motion } from "motion/react";
import { Briefcase, Lightbulb, Megaphone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    {
      id: "cv",
      label: "Create CV",
      icon: Briefcase,
      description: "Get a professional CV fast",
      color: "bg-blue-500",
    },
    {
      id: "hustle",
      label: "Hustle Ideas",
      icon: Lightbulb,
      description: "3 ways to make money today",
      color: "bg-yellow-500",
    },
    {
      id: "marketing",
      label: "Marketing",
      icon: Megaphone,
      description: "Grow your small business",
      color: "bg-green-500",
    },
    {
      id: "opportunities",
      label: "Opportunities",
      icon: Search,
      description: "Jobs & learnerships",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {actions.map((action) => (
        <motion.button
          key={action.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction(action.label)}
          className="flex flex-col items-start p-4 bg-surface border border-border rounded-lg shadow-sm hover:border-primary transition-all text-left"
        >
          <div className={`p-2 rounded-lg ${action.color} text-white mb-3`}>
            <action.icon size={18} />
          </div>
          <h3 className="font-bold text-sm text-foreground">{action.label}</h3>
          <p className="text-[10px] text-muted-foreground mt-1">{action.description}</p>
        </motion.button>
      ))}
    </div>
  );
}
