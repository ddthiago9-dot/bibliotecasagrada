import { motion } from "framer-motion";
import { Sun, Moon, BookOpen, Type, Minus, Plus } from "lucide-react";
import type { Theme } from "@/App";

interface Props {
  theme: Theme;
  fontSize: number;
  onThemeChange: (t: Theme) => void;
  onFontSizeChange: (s: number) => void;
}

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "dark", label: "Escuro", icon: <Moon className="w-4 h-4" /> },
  { value: "light", label: "Claro", icon: <Sun className="w-4 h-4" /> },
  { value: "sepia", label: "Sépia", icon: <BookOpen className="w-4 h-4" /> },
];

export default function SettingsView({ theme, fontSize, onThemeChange, onFontSizeChange }: Props) {
  return (
    <motion.div
      className="px-5 pt-12 pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold mb-8">Configurações</h2>

      <section className="mb-8">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Tema
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => onThemeChange(t.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                theme === t.value
                  ? "bg-primary/10 border-primary"
                  : "bg-card border-border hover:border-primary/40"
              }`}
            >
              {t.icon}
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          <Type className="w-3.5 h-3.5 inline mr-1" />
          Tamanho da Fonte
        </h3>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
          <button
            onClick={() => onFontSizeChange(Math.max(14, fontSize - 2))}
            className="p-2 rounded-md bg-secondary hover:bg-primary/20 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="text-center">
            <span className="text-2xl font-bold text-primary">{fontSize}</span>
            <span className="text-xs text-muted-foreground block">px</span>
          </div>
          <button
            onClick={() => onFontSizeChange(Math.min(32, fontSize + 2))}
            className="p-2 rounded-md bg-secondary hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-3 text-muted-foreground" style={{ fontSize: `${fontSize}px` }}>
          Exemplo de texto com o tamanho atual.
        </p>
      </section>

      <section>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground">Biblioteca Sagrada v1.0</p>
          <p className="text-xs text-muted-foreground mt-1">
            Textos bíblicos: King James Version (domínio público)
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Obras clássicas: Project Gutenberg
          </p>
        </div>
      </section>
    </motion.div>
  );
}
