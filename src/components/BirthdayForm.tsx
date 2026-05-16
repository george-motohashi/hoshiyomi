"use client";

import { useMemo, useState } from "react";

type Props = {
  onSubmit: (input: { year: number; month: number; day: number }) => void;
  loading: boolean;
};

export default function BirthdayForm({ onSubmit, loading }: Props) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const years = useMemo(
    () => Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i),
    [currentYear],
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    if (!y || !m || !d) {
      setError("生年月日をすべて選んでください。");
      return;
    }
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
      setError("その日付は存在しません。もう一度ご確認ください。");
      return;
    }
    onSubmit({ year: y, month: m, day: d });
  }

  const selectClass =
    "w-full appearance-none rounded-lg border border-gold/30 bg-night-soft/60 px-3 py-3 text-moon focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs tracking-widest text-moon-dim">年</span>
          <select
            className={selectClass}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            aria-label="生年（西暦）"
          >
            <option value="">—</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs tracking-widest text-moon-dim">月</span>
          <select
            className={selectClass}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            aria-label="生まれ月"
          >
            <option value="">—</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs tracking-widest text-moon-dim">日</span>
          <select
            className={selectClass}
            value={day}
            onChange={(e) => setDay(e.target.value)}
            aria-label="生まれた日"
          >
            <option value="">—</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="text-sm text-gold-soft" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-lg border border-gold bg-gradient-to-r from-violet-mystic via-night-soft to-violet-mystic px-6 py-4 text-base font-medium tracking-widest text-moon transition hover:from-violet-light hover:to-violet-light disabled:opacity-60 disabled:hover:from-violet-mystic disabled:hover:to-violet-mystic"
      >
        <span className="relative z-10">
          {loading ? "星に問いかけています…" : "今日の星詠みを受け取る"}
        </span>
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </button>

      <p className="text-center text-[11px] leading-relaxed text-moon-dim/80">
        ※ 結果はあくまで自己理解のヒントです。健康や医療判断には用いないでください。
      </p>
    </form>
  );
}
