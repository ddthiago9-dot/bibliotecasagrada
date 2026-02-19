import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Loader2, BookOpen, Search } from "lucide-react";

interface GutenbergBook {
  id: number;
  title: string;
  authors: { name: string }[];
  formats: Record<string, string>;
  subjects: string[];
  download_count: number;
}

const CATEGORIES = [
  { label: "Religião", query: "topic=religion&languages=en" },
  { label: "Filosofia", query: "topic=philosophy&languages=en" },
  { label: "História", query: "topic=history&languages=en" },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function ClassicLibrary() {
  const [books, setBooks] = useState<GutenbergBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    fetchBooks();
  }, [activeCategory]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const cat = CATEGORIES[activeCategory];
      const url = search
        ? `https://gutendex.com/books/?search=${encodeURIComponent(search)}&languages=en`
        : `https://gutendex.com/books/?${cat.query}`;
      const res = await fetch(url);
      const data = await res.json();
      setBooks(data.results || []);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks();
  };

  const getReadUrl = (book: GutenbergBook) =>
    book.formats["text/html; charset=utf-8"] ||
    book.formats["text/html"] ||
    `https://www.gutenberg.org/ebooks/${book.id}`;

  return (
    <div className="px-5 pt-12 pb-6">
      <h2 className="text-2xl font-bold mb-2">
        Biblioteca <span className="text-accent">Clássica</span>
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Obras em domínio público via Project Gutenberg
      </p>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar obras..."
              className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </form>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => {
              setActiveCategory(i);
              setSearch("");
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === i && !search
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">Nenhuma obra encontrada.</p>
      ) : (
        <motion.div
          className="space-y-3"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.04 } } }}
        >
          {books.map((book) => (
            <motion.a
              key={book.id}
              variants={fadeUp}
              href={getReadUrl(book)}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">{book.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {book.authors.map((a) => a.name).join(", ") || "Autor desconhecido"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {book.download_count.toLocaleString()} downloads
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </motion.a>
          ))}
        </motion.div>
      )}
    </div>
  );
}
