import { motion } from "framer-motion";
import { BookOpen, Library, Sparkles } from "lucide-react";
import { useBibleData } from "@/hooks/useBibleData";
import type { Tab } from "@/App";

interface Props {
  onOpenBook: (book: string, chapter: number) => void;
  onNavigate: (tab: Tab) => void;
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const quickReads = [
  { book: "genesis", chapter: 1, label: "Gênesis 1", desc: "A Criação" },
  { book: "psalms", chapter: 23, label: "Salmo 23", desc: "O Bom Pastor" },
  { book: "john", chapter: 3, label: "João 3", desc: "Nicodemos" },
  { book: "matthew", chapter: 5, label: "Mateus 5", desc: "Bem-aventuranças" },
  { book: "romans", chapter: 8, label: "Romanos 8", desc: "Vida no Espírito" },
  { book: "proverbs", chapter: 1, label: "Provérbios 1", desc: "Sabedoria" },
];

export default function HomeView({ onOpenBook, onNavigate }: Props) {
  const { getAvailableBooks } = useBibleData();
  const books = getAvailableBooks();

  return (
    <motion.div className="px-5 pt-12 pb-6" variants={stagger} initial="initial" animate="animate">
      <motion.div variants={fadeUp} className="mb-10">
        <h1 className="text-3xl font-bold mb-1 tracking-tight">
          Biblioteca <span className="text-primary">Sagrada</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Escrituras e obras clássicas em domínio público
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Leitura Rápida
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {quickReads.map((item) => (
            <motion.button
              key={item.label}
              variants={fadeUp}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenBook(item.book, item.chapter)}
              className="bg-card border border-border rounded-lg p-4 text-left hover:border-primary/40 transition-colors"
            >
              <span className="text-sm font-semibold text-foreground">{item.label}</span>
              <span className="block text-xs text-muted-foreground mt-1">{item.desc}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate("bible")}
          className="bg-card border border-border rounded-lg p-5 text-left hover:border-primary/40 transition-colors"
        >
          <BookOpen className="w-6 h-6 text-primary mb-2" />
          <span className="text-sm font-semibold block">Bíblia KJV</span>
          <span className="text-xs text-muted-foreground">{books.length} livros disponíveis</span>
        </button>
        <button
          onClick={() => onNavigate("library")}
          className="bg-card border border-border rounded-lg p-5 text-left hover:border-primary/40 transition-colors"
        >
          <Library className="w-6 h-6 text-accent mb-2" />
          <span className="text-sm font-semibold block">Biblioteca Clássica</span>
          <span className="text-xs text-muted-foreground">Obras em domínio público</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
