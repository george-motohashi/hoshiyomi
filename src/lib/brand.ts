export const BRAND = {
  name: "hoshiyomi",
  nameJa: "星詠み",
  tagline: "今日の星が、あなたに詠む。",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hoshiyomi.example.com",
  colors: {
    night: "#0B1026",
    nightDeep: "#070A1A",
    nightSoft: "#161B3D",
    violetMystic: "#3D2B6B",
    violetLight: "#6F5BB5",
    gold: "#D4AF37",
    goldSoft: "#E8C766",
    moon: "#F5F3FF",
    moonDim: "#CFC9E6",
  },
} as const;
