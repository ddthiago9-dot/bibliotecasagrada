import { motion } from "framer-motion";
import { Home, BookOpen, Library, Settings } from "lucide-react";
import type { Tab } from "@/App";

interface Props {
  current: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "Início", icon: <Home className="w-5 h-5" /> },
  { id: "bible", label: "Bíblia", icon: <BookOpen className="w-5 h-5" /> },
  { id: "library", label: "Biblioteca", icon: <Library className="w-5 h-5" /> },
  { id: "settings", label: "Ajustes", icon: <Settings className="w-5 h-5" /> },
];

export default function BottomNav({ current, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex flex-col items-center py-2.5 px-4 transition-colors"
          >
            {current === tab.id && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -top-px left-2 right-2 h-0.5 bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className={current === tab.id ? "text-primary" : "text-muted-foreground"}>
              {tab.icon}
            </span>
            <span
              className={`text-[10px] mt-1 font-medium ${
                current === tab.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
