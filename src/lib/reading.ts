import Anthropic from "@anthropic-ai/sdk";

export type ReadingInput = {
  year: number;
  month: number;
  day: number;
  now?: Date;
};

export type Reading = {
  date: string;
  weekday: string;
  moonPhase: string;
  theme: string;
  message: string;
  luckyColor: string;
  luckyItem: string;
  mode: "ai" | "fallback";
};

const THEMES: ReadonlyArray<{
  name: string;
  bodies: ReadonlyArray<string>;
}> = [
  {
    name: "自己理解",
    bodies: [
      "今日のあなたには、自分の内側を静かに見つめる時間が向いていると言われています。鏡の前で深呼吸を一度するだけで、隠れていた小さな声が浮かび上がるかもしれません。",
      "「こうあるべき」という鎧を少しだけ脱いでみる日。等身大のあなたを認める一言を、自分に贈ってみてください。",
      "あなたらしさは、人と比べたところにはありません。今日見つけた小さな違和感を、ノートにそっと書き留めておくと後で道標になります。",
      "言葉にならない気持ちにも、ちゃんと意味があると言われています。「ただそう感じている」を今日は許してあげてください。",
    ],
  },
  {
    name: "直感の星",
    bodies: [
      "理屈より先にやってきた「なんとなく」は、今日のあなたへの大切な合図かもしれません。最初に浮かんだ選択肢を一度信じてみてください。",
      "情報を入れすぎず、空白の時間を作るのが吉。窓の外を3分眺めるだけで、必要な答えが降りてくると言われています。",
      "誰かの言葉より、自分の胸のざわつきを優先する日。違和感を感じたら、無理に納得しなくて大丈夫です。",
      "夢や偶然の数字、ふとした単語に注目してみてください。日常に紛れたサインが今日は多めに届くと言われています。",
    ],
  },
  {
    name: "ご縁の流れ",
    bodies: [
      "今日は、誰かのひと言があなたの背中をそっと押すかもしれません。お礼を伝えるなら、丁寧に短く——それだけで十分に届きます。",
      "久しぶりに思い出した人がいたら、それは星の采配かもしれません。連絡を取るなら今日の夕方以降が穏やかと言われています。",
      "新しい出会いより、すでにあるご縁を耕す日。隣にいる人の話を、いつもより一段ゆっくり聴いてみてください。",
      "距離を置きたい関係には、今日「無理しない」を選んでも大丈夫。手放すことも、ご縁の整え方のひとつです。",
    ],
  },
  {
    name: "仕事と創造",
    bodies: [
      "完璧を目指すより、まず形にすることが今日の流れに合うと言われています。下書きの段階を恐れず外に出してみてください。",
      "あなたの中の「やってみたい」を、今日は1%だけ前に進めるのが吉。タイトルだけ書く、URLを1つ開く、それで十分です。",
      "作りかけのまま止まっているものに、今日もう一度光を当ててみてください。あの時の自分は、未来のあなたへの伏線でした。",
      "知らない人の作品に触れる日にしてみてください。自分の作品の方向性が、思いがけない角度から照らされます。",
    ],
  },
  {
    name: "手放しと浄化",
    bodies: [
      "古い手帳、読まないメール、開いていない通知——今日は小さな「手放し」が運気の通り道を整えてくれると言われています。",
      "誰かに言われた古い言葉が、まだ胸に残っているなら。「もう私はそこにいない」と心の中でつぶやいてみてください。",
      "頑張りすぎた自分への「ありがとう」を、今日忘れずに。労いは、次の一歩を軽くしてくれます。",
      "部屋の一角だけ整えるのが吉。デスクの隅、財布の中、玄関の足元——その小さな整いがあなた自身を整えます。",
    ],
  },
  {
    name: "学びの星",
    bodies: [
      "知りたい気持ちが強くなる日。読みかけの本や保存しただけの記事に、今日もう一度向き合ってみてください。",
      "「わからない」と素直に口に出すと、思いがけない助けが届くと言われています。完璧でなくていい日です。",
      "あなたが当たり前にできることは、誰かにとっての光です。学んできた道を、今日は少しだけ振り返ってみてください。",
      "新しい言葉を1つ覚える、新しいルートで帰る——その小さな変化が今日の星と響き合っています。",
    ],
  },
  {
    name: "喜びと遊び",
    bodies: [
      "効率や正解から少し離れて、今日は「楽しい」を選ぶ日。子どもの頃に好きだったものを、思い出してみてください。",
      "笑い声のある場所に身を置くと吉。ひとりなら、声を出して笑える映像を10分だけ眺めるのもおすすめです。",
      "ご褒美の小さなお菓子、いつもより少し贅沢な飲み物——今日のあなたには、それくらいの甘さがちょうどいいと言われています。",
      "予定を1つだけ「気の向くまま」に空けてみてください。その余白に、今日の星からのお便りが届きます。",
    ],
  },
  {
    name: "安定の星",
    bodies: [
      "急がず、焦らず、丁寧に。今日のあなたには「いつも通り」を続ける強さが宿っていると言われています。",
      "足元を整える日。靴を磨く、机を拭く、お米をきれいに研ぐ——その手触りがあなたを地に着けてくれます。",
      "決断を急がなくて大丈夫。今日は「保留する」も立派な選択だと言われています。",
      "信頼している人の言葉を、もう一度思い出してみてください。揺れた心の支柱は、すでにあなたの中にあります。",
    ],
  },
  {
    name: "静けさ",
    bodies: [
      "頑張ってきたあなたへ。今日は「何もしない時間」を10分だけ意図的に作ってみてください。",
      "通知を切る、SNSから1日だけ距離を置く——心の音が聞こえる静寂が、今日のあなたを満たしてくれます。",
      "湯船に長めに浸かるのが吉。水は、今日のあなたの感情を優しく流してくれると言われています。",
      "眠りを大切にする日。早めに照明を落として、明日の自分への贈り物にしてみてください。",
    ],
  },
  {
    name: "挑戦の星",
    bodies: [
      "ずっと先延ばしにしていた1つに、今日30秒だけ向き合ってみてください。動き出した瞬間に、星が背中を押すと言われています。",
      "怖さは、心が「大切なもの」を知っているサイン。震える手のまま、半歩だけ進んでみても大丈夫です。",
      "誰かに「やりたい」と口に出すのが吉。声に出した瞬間、その言葉があなたの守り神になります。",
      "完璧な準備より、不完全な開始を。今日のあなたには「とりあえずやってみる」が似合っています。",
    ],
  },
  {
    name: "感情の流れ",
    bodies: [
      "涙が出そうなら、止めなくて大丈夫。今日は、心の内側を洗う日だと言われています。",
      "怒りや悲しみも、あなたを守ってくれていた感情。今日はそれらに「ありがとう」とそっと声をかけてみてください。",
      "感情に名前をつけてみる日。「寂しい」「もどかしい」「嬉しい」——名前がつくと、その感情は少し落ち着くと言われています。",
      "音楽を1曲、最後まで聴いてみてください。歌詞の中に、今日のあなたへのメッセージが隠れているかもしれません。",
    ],
  },
  {
    name: "分かち合い",
    bodies: [
      "もらってばかりだと感じていたあなたへ。今日は誰かに小さなことを贈る日にしてみてください。優しさは循環していきます。",
      "「ありがとう」を、いつもより1回多く言ってみてください。その言葉が、あなた自身にも返ってくると言われています。",
      "あなたの当たり前の知恵を、誰かが必要としています。SNSの短い一言でも、今日は届く範囲が広いそうです。",
      "おすそ分けの日。お菓子1つ、写真1枚、感想1行——軽やかな贈り物が、今日の星に合っています。",
    ],
  },
];

const LUCKY_COLORS = [
  { name: "藍鼠（あいねず）", note: "落ち着きと品位" },
  { name: "白磁（はくじ）", note: "浄化とリセット" },
  { name: "金茶（きんちゃ）", note: "豊かさと安定" },
  { name: "薄紅（うすべに）", note: "やわらかい関係性" },
  { name: "深緑（ふかみどり）", note: "再生と循環" },
  { name: "瑠璃（るり）", note: "直感と冴え" },
  { name: "山吹（やまぶき）", note: "創造の灯" },
  { name: "若草（わかくさ）", note: "新しい芽吹き" },
  { name: "墨（すみ）", note: "凛とした集中" },
  { name: "月白（げっぱく）", note: "静けさと祈り" },
  { name: "桜鼠（さくらねず）", note: "繊細な共感" },
  { name: "群青（ぐんじょう）", note: "深い洞察" },
];

const LUCKY_ITEMS = [
  "小さなノートとペン",
  "白いお皿",
  "湯のみ一杯の白湯",
  "丸い形のもの",
  "塩ひとつまみ",
  "鏡（手鏡でも可）",
  "鈴の音が鳴るもの",
  "観葉植物の葉",
  "ろうそく",
  "貝殻や石",
  "古い手紙",
  "ハーブティー",
];

const ADVICES = [
  "夕方には少しだけ空を見上げてみてください。風の匂いや雲の動きに、今日の星のサインがそっと乗っているかもしれません。",
  "「今日のひとつだけ」を、ノートの隅にそっと書き留めてみてください。明日のあなたへの、小さな贈り物になります。",
  "湯気の立つ飲み物を一杯、心を込めて淹れる時間を持ってみてください。その数分が、今日のあなたを静かに整えてくれます。",
  "歩く速度を、いつもよりほんの半歩だけゆっくりにしてみてください。見えていなかった景色が、すっと浮かび上がってきます。",
  "誰かに「ありがとう」を、いつもより丁寧に伝えてみてください。その響きは巡り巡って、あなた自身にも戻ってきます。",
  "深く息を吸って、二倍の時間をかけて吐いてみてください。その呼吸が、今日のあなたの中心を静かに整えてくれます。",
  "手を温める、肩を回す、首をゆっくり傾ける——身体が緩むと、心の余白も自然と少しずつ広がっていくと言われています。",
  "気になっていた本のページを、たった一段落だけ開いてみてください。今日のあなたへの言葉が、そこに眠っているかもしれません。",
  "夜のひととき、灯りを少しだけ落として過ごしてみてください。光が柔らかくなるほど、あなたの思考も自然と和らいでいきます。",
  "目を閉じて、自分の名前を心の中でそっと呼んでみてください。いちばん近くで応えてくれるのは、いつもあなた自身です。",
  "窓を5分だけ開けて、空気を入れ替えてみてください。新しい風は、新しい思考の種をあなたの元へと運んできます。",
  "「今日の一番うれしかったこと」を、ひとつだけ思い出してみてください。それが、明日へつながる小さな灯になります。",
];

const CLOSINGS = [
  "今日も、あなたの星があなたを静かに見守っています。",
  "焦らず、ゆっくり、あなたのペースで歩んでいきましょう。",
  "深呼吸ひとつ分の余白を、どうか忘れずに。",
  "あなたが選ぶ道に、星が静かに光を添えています。",
  "今日のあなたで、十分です。",
];

const MOON_PHASES = [
  "新月",
  "三日月",
  "上弦の月",
  "十三夜月",
  "満月",
  "十六夜",
  "下弦の月",
  "有明月",
];

function hashSeed(parts: ReadonlyArray<number>): number {
  let h = 2166136261;
  for (const p of parts) {
    h ^= p;
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function moonPhaseFor(date: Date): string {
  const synodic = 29.5305882;
  const refNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
  const days = (date.getTime() - refNewMoon) / 86400000;
  const phase = ((days % synodic) + synodic) % synodic;
  const idx = Math.floor((phase / synodic) * MOON_PHASES.length) % MOON_PHASES.length;
  return MOON_PHASES[idx];
}

function formatJaDate(date: Date): { date: string; weekday: string } {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = weekdays[date.getDay()];
  return { date: `${y}年${m}月${d}日`, weekday: `${w}曜日` };
}

export function fallbackReading(input: ReadingInput): Reading {
  const now = input.now ?? new Date();
  const seed = hashSeed([
    input.year,
    input.month,
    input.day,
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  ]);

  const theme = THEMES[seed % THEMES.length];
  const body = theme.bodies[(seed >>> 4) % theme.bodies.length];
  const advice = ADVICES[(seed >>> 8) % ADVICES.length];
  const closing = CLOSINGS[(seed >>> 12) % CLOSINGS.length];
  const luckyColor = LUCKY_COLORS[(seed >>> 16) % LUCKY_COLORS.length];
  const luckyItem = LUCKY_ITEMS[(seed >>> 20) % LUCKY_ITEMS.length];

  const message = `${body}\n${advice}\n${closing}`;
  const { date, weekday } = formatJaDate(now);

  return {
    date,
    weekday,
    moonPhase: moonPhaseFor(now),
    theme: theme.name,
    message,
    luckyColor: `${luckyColor.name}（${luckyColor.note}）`,
    luckyItem,
    mode: "fallback",
  };
}

const SYSTEM_PROMPT = `あなたは hoshiyomi（星詠み）という日本のスピリチュアル ブランドの占術師です。
ユーザーの生年月日と今日の日付から、優しく寄り添う「今日の星詠み」を生成してください。

## 厳守ルール
- 断定的予言は禁止。「〜と言われています」「〜という傾向があります」など余白のある表現を使うこと
- 医療・健康効果・治癒を謳う表現は禁止
- 不安を煽る表現は禁止
- 「占い」より「星詠み」「メッセージ」「お便り」の語を優先
- 文体: 凛として神秘的、知的、そっと寄り添うトーン

## 出力フォーマット（JSON のみ。前後に説明文を書かない）
{
  "theme": "短いテーマ名（例: 自己理解 / 直感の星 / ご縁の流れ）",
  "message": "鑑定本文。120〜220文字。句読点を効かせて余白のあるリズムに",
  "luckyColor": "色名（和名）と意味（例: 群青（深い洞察））",
  "luckyItem": "身近に手に入るもの（例: 白いお皿）"
}`;

async function aiReading(input: ReadingInput): Promise<Reading> {
  const now = input.now ?? new Date();
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const { date, weekday } = formatJaDate(now);
  const moonPhase = moonPhaseFor(now);

  const userMessage = `生年月日: ${input.year}年${input.month}月${input.day}日
今日の日付: ${date} ${weekday}
今日の月相: ${moonPhase}

このユーザーへの今日の星詠みを、ルールに従って JSON で生成してください。`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("AI response had no text block");
  }
  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI response had no JSON");
  const parsed = JSON.parse(jsonMatch[0]) as {
    theme: string;
    message: string;
    luckyColor: string;
    luckyItem: string;
  };

  return {
    date,
    weekday,
    moonPhase,
    theme: parsed.theme,
    message: parsed.message,
    luckyColor: parsed.luckyColor,
    luckyItem: parsed.luckyItem,
    mode: "ai",
  };
}

export async function generateReading(input: ReadingInput): Promise<Reading> {
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await aiReading(input);
    } catch (err) {
      console.warn("[hoshiyomi] AI reading failed, falling back:", err);
      return fallbackReading(input);
    }
  }
  return fallbackReading(input);
}
