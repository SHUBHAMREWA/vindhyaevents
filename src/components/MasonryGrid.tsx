"use client";

import { useSyncExternalStore, type ReactNode } from "react";

// Pinterest-style layout: every photo keeps its own shape (no cropping) and
// photos stack in columns of uneven height. Items are dealt left to right
// (1st item → 1st column, 2nd → 2nd column …) so the newest photos stay at the
// top of the page, which plain CSS columns would not do.

type Breakpoints = { base: number; sm?: number; md?: number; lg?: number; xl?: number };

const MIN_WIDTHS: [keyof Breakpoints, number][] = [
  ["xl", 1280],
  ["lg", 1024],
  ["md", 768],
  ["sm", 640],
];

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function useColumnCount(columns: Breakpoints) {
  return useSyncExternalStore(
    subscribe,
    () => {
      const width = window.innerWidth;
      for (const [key, min] of MIN_WIDTHS) {
        const count = columns[key];
        if (count && width >= min) return count;
      }
      return columns.base;
    },
    // The server can't know the screen width; the phone layout is used until
    // the page loads in the browser.
    () => columns.base
  );
}

export default function MasonryGrid<T>({
  items,
  columns = { base: 2, md: 3, lg: 4 },
  gapClassName = "gap-3 sm:gap-4",
  getKey,
  renderItem,
}: {
  items: T[];
  columns?: Breakpoints;
  /** Tailwind gap classes, used both between columns and between photos. */
  gapClassName?: string;
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
}) {
  const count = Math.max(1, Math.min(useColumnCount(columns), items.length || 1));
  const cols: { item: T; index: number }[][] = Array.from({ length: count }, () => []);
  items.forEach((item, index) => cols[index % count].push({ item, index }));

  return (
    <div className={`flex items-start ${gapClassName}`}>
      {cols.map((col, c) => (
        <div key={c} className={`flex min-w-0 flex-1 flex-col ${gapClassName}`}>
          {col.map(({ item, index }) => (
            <div key={getKey(item, index)}>{renderItem(item, index)}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
