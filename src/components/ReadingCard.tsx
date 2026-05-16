"use client";

import { forwardRef } from "react";
import type { Reading } from "@/lib/reading";
import { BRAND } from "@/lib/brand";

type Aspect = "portrait" | "square";

type Props = {
  reading: Reading;
  aspect?: Aspect;
};

const ASPECT_RATIO: Record<Aspect, string> = {
  portrait: "4 / 5",
  square: "1 / 1",
};

const ReadingCard = forwardRef<HTMLDivElement, Props>(function ReadingCard(
  { reading, aspect = "portrait" },
  ref,
) {
  const displayUrl = BRAND.siteUrl.replace(/^https?:\/\//, "");
  return (
    <div
      ref={ref}
      className="glass-card relative mx-auto w-full max-w-[480px] overflow-hidden rounded-2xl p-8"
      style={{ aspectRatio: ASPECT_RATIO[aspect] }}
    >
      <div className="starfield pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute right-6 top-6 h-14 w-14 rounded-full border border-gold/40 bg-gradient-to-br from-moon/20 via-transparent to-violet-mystic/40" />

      <div className="relative flex h-full flex-col">
        <header className="space-y-1">
          <p className="font-serif text-xs tracking-[0.5em] text-gold-soft">
            HOSHIYOMI
          </p>
          <p className="text-[11px] tracking-widest text-moon-dim">
            {reading.date} {reading.weekday} ・ {reading.moonPhase}
          </p>
        </header>

        <div className="my-4 gold-line h-px w-full" />

        <div className="mb-3">
          <p className="font-serif text-xl font-medium tracking-wider text-moon">
            今日の星詠み
          </p>
          <p className="mt-1 inline-block rounded-full border border-violet-light/40 px-3 py-0.5 text-[11px] tracking-widest text-violet-light">
            {reading.theme}
          </p>
        </div>

        <p className="flex-1 whitespace-pre-line text-[14px] leading-[1.95] tracking-wide text-moon">
          {reading.message}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
          <div className="rounded-lg border border-gold/20 bg-night-deep/40 p-3">
            <p className="mb-1 tracking-widest text-moon-dim">今日の色</p>
            <p className="text-moon">{reading.luckyColor}</p>
          </div>
          <div className="rounded-lg border border-gold/20 bg-night-deep/40 p-3">
            <p className="mb-1 tracking-widest text-moon-dim">そばに置きたい</p>
            <p className="text-moon">{reading.luckyItem}</p>
          </div>
        </div>

        <footer className="mt-5 flex items-center justify-between text-[10px] tracking-widest text-moon-dim/70">
          <span>— hoshiyomi</span>
          <span className="text-gold-soft/70">{displayUrl}</span>
        </footer>
      </div>
    </div>
  );
});

export default ReadingCard;
