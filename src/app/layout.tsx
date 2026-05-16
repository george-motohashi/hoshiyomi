import type { Metadata } from "next";
import { Inter, Shippori_Mincho } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const shippori = Shippori_Mincho({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-shippori",
  display: "swap",
});

export const metadata: Metadata = {
  title: "hoshiyomi — 今日の星が、あなたに詠む。",
  description:
    "生年月日を入れるだけで、今日のあなたへの「星詠み」をお届けします。自分の星と対話する、毎日のお守り体験。",
  openGraph: {
    title: "hoshiyomi — 今日の星詠み",
    description:
      "生年月日を入れるだけで、今日のあなたへの星詠みをお届けします。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${shippori.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
