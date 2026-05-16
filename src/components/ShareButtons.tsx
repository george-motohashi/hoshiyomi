"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import { BRAND } from "@/lib/brand";

type SizeKey = "portrait" | "square";

type Props = {
  portraitRef: React.RefObject<HTMLDivElement>;
  squareRef: React.RefObject<HTMLDivElement>;
  shareText: string;
};

const HASHTAGS = "星詠み,hoshiyomi,今日の運勢";

const SIZE_LABEL: Record<SizeKey, string> = {
  portrait: "縦長 4:5（Instagram 向け）",
  square: "正方形 1:1（X / Threads 向け）",
};

export default function ShareButtons({ portraitRef, squareRef, shareText }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState<SizeKey | "share" | null>(null);

  async function captureAs(size: SizeKey): Promise<Blob | null> {
    const target = size === "portrait" ? portraitRef.current : squareRef.current;
    if (!target) return null;
    const dataUrl = await toPng(target, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#0B1026",
    });
    const res = await fetch(dataUrl);
    return await res.blob();
  }

  async function handleDownload(size: SizeKey) {
    try {
      setBusy(size);
      setStatus(null);
      const blob = await captureAs(size);
      if (!blob) throw new Error("カードがまだ準備できていません。");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hoshiyomi-${size}-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatus(`${SIZE_LABEL[size]} で画像を保存しました。`);
    } catch (err) {
      console.error(err);
      setStatus("画像の生成に失敗しました。もう一度お試しください。");
    } finally {
      setBusy(null);
    }
  }

  async function handleNativeShare() {
    try {
      setBusy("share");
      setStatus(null);
      const blob = await captureAs("portrait");
      if (!blob) throw new Error("カードがまだ準備できていません。");
      const file = new File([blob], "hoshiyomi.png", { type: "image/png" });
      const nav = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
      };
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await nav.share({
          files: [file],
          title: "今日の星詠み",
          text: shareText,
        });
        setStatus("シェア画面を開きました。");
      } else {
        setStatus("このブラウザはシェアに非対応です。画像を保存してご利用ください。");
      }
    } catch (err) {
      if ((err as DOMException).name !== "AbortError") {
        console.error(err);
        setStatus("シェアに失敗しました。");
      }
    } finally {
      setBusy(null);
    }
  }

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText,
  )}&url=${encodeURIComponent(BRAND.siteUrl)}&hashtags=${encodeURIComponent(HASHTAGS)}`;
  const threadsUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(
    `${shareText}\n${BRAND.siteUrl}`,
  )}`;

  const btn =
    "rounded-lg border px-4 py-3 text-sm tracking-wider transition disabled:opacity-50";

  return (
    <div className="space-y-3">
      <p className="text-center text-[11px] tracking-widest text-moon-dim">
        画像として保存
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleDownload("portrait")}
          disabled={busy !== null}
          className={`${btn} border-gold/50 bg-night-soft text-moon hover:bg-violet-mystic`}
        >
          {busy === "portrait" ? "生成中…" : "縦長 4:5"}
        </button>
        <button
          type="button"
          onClick={() => handleDownload("square")}
          disabled={busy !== null}
          className={`${btn} border-gold/50 bg-night-soft text-moon hover:bg-violet-mystic`}
        >
          {busy === "square" ? "生成中…" : "正方形 1:1"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handleNativeShare}
          disabled={busy !== null}
          className={`${btn} border-gold/30 bg-night-deep text-moon-dim hover:text-moon`}
        >
          {busy === "share" ? "…" : "シェア"}
        </button>
        <a
          href={xUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={`${btn} border-gold/30 bg-night-deep text-moon-dim hover:text-moon text-center`}
        >
          X で共有
        </a>
        <a
          href={threadsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={`${btn} border-gold/30 bg-night-deep text-moon-dim hover:text-moon text-center`}
        >
          Threads
        </a>
      </div>

      <p className="text-center text-[11px] leading-relaxed text-moon-dim/80">
        Instagram は直接シェアできないため、画像を保存してから投稿してください。
      </p>

      {status && (
        <p className="text-center text-xs text-moon-dim" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
