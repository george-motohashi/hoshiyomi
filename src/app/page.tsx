"use client";

import { useRef, useState } from "react";
import BirthdayForm from "@/components/BirthdayForm";
import ReadingCard from "@/components/ReadingCard";
import ShareButtons from "@/components/ShareButtons";
import type { Reading } from "@/lib/reading";

type ApiError = { error: string };

export default function HomePage() {
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);

  async function fetchReading(input: { year: number; month: number; day: number }) {
    setLoading(true);
    setError(null);
    setReading(null);
    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as Reading | ApiError;
      if (!res.ok) {
        setError((data as ApiError).error ?? "鑑定に失敗しました。");
        return;
      }
      setReading(data as Reading);
      requestAnimationFrame(() => {
        document
          .getElementById("reading-result")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch {
      setError("通信に失敗しました。少し時間を置いてもう一度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-starry-night">
      <div className="starfield pointer-events-none absolute inset-0 opacity-60" />

      <section className="relative mx-auto flex max-w-xl flex-col items-center px-5 pb-16 pt-14 sm:pt-20">
        <p className="font-serif text-xs tracking-[0.6em] text-gold-soft">
          HOSHIYOMI
        </p>
        <h1 className="mt-4 text-center font-serif text-3xl font-medium leading-snug tracking-wider text-moon sm:text-4xl">
          今日の星が、テスト
          <br className="sm:hidden" />
          あなたに詠む。
        </h1>
        <p className="mt-5 max-w-md text-center text-sm leading-loose tracking-wide text-moon-dim">
          生年月日を入れるだけ。
          <br />
          今日のあなたへの「星詠み」を、そっとお届けします。
        </p>

        <div className="my-8 gold-line h-px w-1/2" />

        <div className="w-full max-w-sm">
          <BirthdayForm onSubmit={fetchReading} loading={loading} />
        </div>

        {error && (
          <p className="mt-5 text-sm text-gold-soft" role="alert">
            {error}
          </p>
        )}
      </section>

      {reading && (
        <section
          id="reading-result"
          className="relative mx-auto max-w-xl px-5 pb-24"
        >
          <div className="mb-5 flex flex-col items-center">
            <p className="font-serif text-xs tracking-[0.4em] text-gold-soft">
              FROM THE STARS
            </p>
            <p className="mt-2 text-[11px] tracking-widest text-moon-dim">
              {reading.mode === "ai"
                ? "AI が星から詠みました"
                : "今日のあなたへ、星詠みより"}
            </p>
          </div>

          <ReadingCard ref={portraitRef} reading={reading} aspect="portrait" />

          <div
            aria-hidden
            style={{
              position: "absolute",
              left: -99999,
              top: 0,
              width: 480,
              pointerEvents: "none",
            }}
          >
            <ReadingCard ref={squareRef} reading={reading} aspect="square" />
          </div>

          <div className="mx-auto mt-8 max-w-[480px]">
            <ShareButtons
              portraitRef={portraitRef}
              squareRef={squareRef}
              shareText={`【今日の星詠み】${reading.theme}\n${reading.message.slice(0, 80)}…`}
            />
          </div>

          <p className="mx-auto mt-10 max-w-md text-center text-xs leading-loose tracking-wide text-moon-dim/70">
            毎朝の星詠みを LINE で受け取れるサービスを準備中です。
            <br />
            まずは、画像として保存してお守りに。
          </p>
        </section>
      )}

      <footer className="relative border-t border-violet-mystic/30 px-5 py-8 text-center text-[11px] tracking-widest text-moon-dim/60">
        © {new Date().getFullYear()} hoshiyomi
      </footer>
    </main>
  );
}
