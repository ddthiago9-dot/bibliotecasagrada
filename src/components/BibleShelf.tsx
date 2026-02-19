import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight } from "lucide-react";
import { useBibleData } from "@/hooks/useBibleData";

interface Props {
  onSelectChapter: (book: string, chapter: number) => void;
}

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function BibleShelf({ onSelectChapter }: Props) {
  const { getAvailableBooks } = useBibleData();
  const books = getAvailableBooks();
  const [expandedBook, setExpandedBook] = useState<string | null>(null);

  const oldTestament = books.filter((b) => b.testament === "old");
  const newTestament = books.filter((b) => b.testament === "new");

  const renderSection = (title: string, list: typeof books) => (
    <div className="mb-8">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">
        {title}
      </h3>
      <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-2">
        {list.map((book) => (
          <motion.div key={book.slug} variants={fadeUp}>
            <button
              onClick={() => setExpandedBook(expandedBook === book.slug ? null : book.slug)}
              className="w-full bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <span className="text-sm font-semibold">{book.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {book.availableChapters.length} capítulo{book.availableChapters.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  expandedBook === book.slug ? "rotate-90" : ""
                }`}
              />
            </button>
            {expandedBook === book.slug && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="flex flex-wrap gap-2 px-4 py-3"
              >
                {book.availableChapters.map((ch) => (
                  <button
                    key={ch}
                    onClick={() => onSelectChapter(book.slug, ch)}
                    className="w-10 h-10 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {ch}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <div className="px-5 pt-12 pb-6">
      <h2 className="text-2xl font-bold mb-6">
        Bíblia <span className="text-primary">KJV</span>
      </h2>
      {oldTestament.length > 0 && renderSection("Antigo Testamento", oldTestament)}
      {newTestament.length > 0 && renderSection("Novo Testamento", newTestament)}
    </div>
  );
}
