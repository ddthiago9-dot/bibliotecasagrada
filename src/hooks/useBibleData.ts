import { useMemo } from "react";

interface Verse {
  verse: number;
  text: string;
}

interface ChapterData {
  book: string;
  chapter: number;
  verses: Verse[];
}

interface BookMeta {
  name: string;
  slug: string;
  testament: "old" | "new";
  chapters: number;
  order: number;
}

export interface BookInfo extends BookMeta {
  availableChapters: number[];
}

import genesisM from "@/data/bible/kjv/genesis/meta.json";
import genesis1 from "@/data/bible/kjv/genesis/1.json";
import psalmsM from "@/data/bible/kjv/psalms/meta.json";
import psalms23 from "@/data/bible/kjv/psalms/23.json";
import psalms91 from "@/data/bible/kjv/psalms/91.json";
import johnM from "@/data/bible/kjv/john/meta.json";
import john1 from "@/data/bible/kjv/john/1.json";
import john3 from "@/data/bible/kjv/john/3.json";
import matthewM from "@/data/bible/kjv/matthew/meta.json";
import matthew5 from "@/data/bible/kjv/matthew/5.json";
import proverbsM from "@/data/bible/kjv/proverbs/meta.json";
import proverbs1 from "@/data/bible/kjv/proverbs/1.json";
import romansM from "@/data/bible/kjv/romans/meta.json";
import romans8 from "@/data/bible/kjv/romans/8.json";
import revelationM from "@/data/bible/kjv/revelation/meta.json";
import revelation21 from "@/data/bible/kjv/revelation/21.json";

const rawBooks: Record<string, { meta: BookMeta; chapters: Record<number, ChapterData> }> = {
  genesis: { meta: genesisM as BookMeta, chapters: { 1: genesis1 as ChapterData } },
  psalms: { meta: psalmsM as BookMeta, chapters: { 23: psalms23 as ChapterData, 91: psalms91 as ChapterData } },
  john: { meta: johnM as BookMeta, chapters: { 1: john1 as ChapterData, 3: john3 as ChapterData } },
  matthew: { meta: matthewM as BookMeta, chapters: { 5: matthew5 as ChapterData } },
  proverbs: { meta: proverbsM as BookMeta, chapters: { 1: proverbs1 as ChapterData } },
  romans: { meta: romansM as BookMeta, chapters: { 8: romans8 as ChapterData } },
  revelation: { meta: revelationM as BookMeta, chapters: { 21: revelation21 as ChapterData } },
};

export function useBibleData() {
  const getChapter = (book: string, chapter: number): ChapterData | undefined =>
    rawBooks[book]?.chapters[chapter];

  const getBookMeta = (book: string): BookMeta | undefined => rawBooks[book]?.meta;

  const getAvailableBooks = (): BookInfo[] =>
    Object.entries(rawBooks)
      .map(([slug, data]) => ({
        ...data.meta,
        slug,
        availableChapters: Object.keys(data.chapters).map(Number).sort((a, b) => a - b),
      }))
      .sort((a, b) => a.order - b.order);

  return { getChapter, getBookMeta, getAvailableBooks };
}
