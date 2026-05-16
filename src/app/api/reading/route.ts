import { NextResponse } from "next/server";
import { generateReading } from "@/lib/reading";

export const runtime = "nodejs";

type Body = {
  year?: unknown;
  month?: unknown;
  day?: unknown;
};

function isValidDate(y: number, m: number, d: number): boolean {
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return false;
  if (y < 1900 || y > new Date().getFullYear()) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json(
      { error: "リクエスト形式が正しくありません。" },
      { status: 400 },
    );
  }

  const year = Number(body.year);
  const month = Number(body.month);
  const day = Number(body.day);

  if (!isValidDate(year, month, day)) {
    return NextResponse.json(
      { error: "生年月日が正しくありません。1900年以降の実在する日付を入力してください。" },
      { status: 400 },
    );
  }

  const reading = await generateReading({ year, month, day });
  return NextResponse.json(reading);
}
