import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import { useBibleData } from "@/hooks/useBibleData";

interface Props {
  book: string;
  chapter: number;
  fontSize: number;
  onBack: () => void;
  onChapterChange: (ch: number) => void;
}

export default function BibleReader({ book, chapter, fontSize, onBack, onChapterChange }: Props) {
  const { getChapter, getBookMeta, getAvailableBooks } = useBibleData();
  const data = getChapter(book, chapter);
  const meta = getBookMeta(book);
  const allBooks = getAvailableBooks();
  const currentBook = allBooks.find((b) => b.slug === book);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setProgress(Math.min(100, Math.max(0, pct * 100)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [data]);

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
    setProgress(0);
  }, [book, chapter]);

  const copyVerse = (verse: number, text: string) => {
    navigator.clipboard.writeText(`${meta?.name || book} ${chapter}:${verse} - ${text} (KJV)`);
    setCopied(verse);
    setTimeout(() => setCopied(null), 2000);
  };

  const hasPrev = currentBook && currentBook.availableChapters.indexOf(chapter) > 0;
  const hasNext =
    currentBook &&
    currentBook.availableChapters.indexOf(chapter) < currentBook.availableChapters.length - 1;

  const goPrev = () => {
    if (!currentBook || !hasPrev) return;
    const idx = currentBook.availableChapters.indexOf(chapter);
    onChapterChange(currentBook.availableChapters[idx - 1]);
  };

  const goNext = () => {
    if (!currentBook || !hasNext) return;
    const idx = currentBook.availableChapters.indexOf(chapter);
    onChapterChange(currentBook.availableChapters[idx + 1]);
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Progress bar */}
      <div className="h-0.5 bg-border">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Header */}
      <header className="glass sticky top-0 z-10 border-b border-border px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-semibold">
          {meta?.name || book} {chapter}
        </h1>
        <div className="w-7" />
      </header>

      {/* Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-8 max-w-2xl mx-auto w-full">
        {data ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {data.verses.map((v) => (
              <p
                key={v.verse}
                className="mb-3 leading-relaxed group cursor-pointer hover:bg-card/50 rounded px-2 py-1 -mx-2 transition-colors"
                style={{ fontSize: `${fontSize}px` }}
                onClick={() => copyVerse(v.verse, v.text)}
              >
                <sup className="text-primary font-bold mr-1.5 text-xs">{v.verse}</sup>
                <span>{v.text}</span>
                <span className="inline-flex ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copied === v.verse ? (
                    <Check className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </span>
              </p>
            ))}
          </motion.div>
        ) : (
          <p className="text-muted-foreground text-center py-20">Capítulo não disponível.</p>
        )}
      </div>

      {/* Navigation */}
      <div className="glass border-t border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className="flex items-center gap-1 text-sm disabled:opacity-30 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
        <span className="text-xs text-muted-foreground">
          Cap. {chapter}
        </span>
        <button
          onClick={goNext}
          disabled={!hasNext}
          className="flex items-center gap-1 text-sm disabled:opacity-30 hover:text-primary transition-colors"
        >
          Próximo <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
