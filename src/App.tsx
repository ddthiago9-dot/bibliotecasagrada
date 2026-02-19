import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HomeView from "@/components/HomeView";
import BibleShelf from "@/components/BibleShelf";
import BibleReader from "@/components/BibleReader";
import ClassicLibrary from "@/components/ClassicLibrary";
import SettingsView from "@/components/SettingsView";
import BottomNav from "@/components/BottomNav";

export type Tab = "home" | "bible" | "library" | "settings";
export type Theme = "dark" | "light" | "sepia";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("bs-theme") as Theme) || "dark"
  );
  const [fontSize, setFontSize] = useState(
    () => parseInt(localStorage.getItem("bs-fontSize") || "18")
  );
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.className = theme === "dark" ? "" : `theme-${theme}`;
    localStorage.setItem("bs-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("bs-fontSize", String(fontSize));
  }, [fontSize]);

  const openReader = (book: string, chapter: number) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
  };

  const closeReader = () => {
    setSelectedBook(null);
    setSelectedChapter(null);
  };

  if (selectedBook && selectedChapter !== null) {
    return (
      <BibleReader
        book={selectedBook}
        chapter={selectedChapter}
        fontSize={fontSize}
        onBack={closeReader}
        onChapterChange={(ch) => setSelectedChapter(ch)}
      />
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground pb-20">
      <AnimatePresence mode="wait">
        <motion.div key={tab} {...pageVariants}>
          {tab === "home" && <HomeView onOpenBook={openReader} onNavigate={setTab} />}
          {tab === "bible" && <BibleShelf onSelectChapter={openReader} />}
          {tab === "library" && <ClassicLibrary />}
          {tab === "settings" && (
            <SettingsView
              theme={theme}
              fontSize={fontSize}
              onThemeChange={setTheme}
              onFontSizeChange={setFontSize}
            />
          )}
        </motion.div>
      </AnimatePresence>
      <BottomNav current={tab} onChange={setTab} />
    </div>
  );
}
