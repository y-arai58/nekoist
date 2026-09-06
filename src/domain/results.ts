import type { AttributeId, ResultType } from "./types";

export const attributeLabels: Record<AttributeId, string> = {
  affectionIntensity: "愛情強度", affectionRange: "愛情範囲", companionship: "相棒感",
  protectiveness: "保護欲", freedomRespect: "自由尊重", observation: "観察欲",
  curiosity: "探究欲", touchDesire: "接触欲", worship: "崇拝度",
  evangelism: "布教欲", catPriority: "猫優先度", protectedFeeling: "被庇護感",
};

export const resultTypes: ResultType[] = [
  { id: "devoted-guardian", kind: "normal", name: "一途な猫守り", emoji: "🐈", lead: "あなたの猫愛は、深く、まっすぐ、一点集中。", description: "猫全般への好意とは少し違う、“この子だから”という絆を大切にする人。小さな変化も見逃さず、静かな忠誠心で相棒を守ります。", traits: ["一点集中の愛", "静かな忠誠心", "うちの子基準"] },
  { id: "best-friend", kind: "normal", name: "猫の親友", emoji: "😺", lead: "言葉がなくても、だいたい通じている。", description: "猫を守る対象や神聖な存在というより、毎日を並んで過ごす相棒として見ています。相談も遊びも、同じ目線で分け合うタイプです。", traits: ["対等な関係", "会話が多い", "一緒が自然"] },
  { id: "protector", kind: "normal", name: "猫の保護者", emoji: "🧺", lead: "かわいいの先に、ちゃんと守りたいがある。", description: "安全、体調、暮らしやすさに自然と目が向く頼れる保護者。調べることも整えることも、猫に穏やかでいてほしいからです。", traits: ["安全第一", "変化に敏感", "頼れる世話役"] },
  { id: "mother-of-all-cats", kind: "normal", name: "全猫の母", emoji: "🐾", lead: "うちの子も、よその子も、みんな幸せであれ。", description: "目の前の一匹だけでなく、世界中の猫の幸せに心が動く人。包容力の広さと、放っておけない優しさを持っています。", traits: ["愛情範囲が広い", "包容力", "全猫の幸福"] },
  { id: "neighbor", kind: "normal", name: "猫界の隣人", emoji: "🌿", lead: "好きだからこそ、猫の選択を尊重する。", description: "距離を詰めることだけが愛ではないと知っている人。猫の時間と意思を尊重し、必要なときに隣にいられる関係を好みます。", traits: ["自由を尊重", "ほどよい距離", "猫目線"] },
  { id: "observer", kind: "normal", name: "猫観察家", emoji: "👀", lead: "見ているだけで、一日はだいたい楽しい。", description: "寝顔、しっぽ、謎の動き。猫の一瞬一瞬を味わう名観察者です。答えを急がず、猫らしさそのものを楽しめます。", traits: ["観察が趣味", "瞬間を愛でる", "謎も楽しい"] },
  { id: "researcher", kind: "normal", name: "猫研究家", emoji: "🔎", lead: "かわいい。そして、なぜそうするのか知りたい。", description: "猫の行動や気持ちを理解するほど、愛が深まるタイプ。観察したことを調べ、知識を毎日の関係づくりに活かします。", traits: ["理由を探る", "知識派", "理解も愛"] },
  { id: "cat-inhaler", kind: "normal", name: "猫吸い職人", emoji: "🫧", lead: "猫は見るもの。そして条件が整えば吸うもの。", description: "ふわふわ、ぬくもり、香ばしさ。猫の魅力を五感で受け止める人です。もちろん、猫本人のご機嫌と許可が最優先。", traits: ["五感で愛でる", "接触に幸福", "吸引は礼儀正しく"] },
  { id: "believer", kind: "normal", name: "猫教信徒", emoji: "✨", lead: "猫がいる。それだけで世界は少し正しい。", description: "寝顔には宇宙を感じ、ヒゲには神聖さを見いだす人。猫の存在そのものへの敬意と感謝を、日々静かに捧げています。", traits: ["尊さを感知", "日々感謝", "猫は秩序"] },
  { id: "my-cat-supremacist", kind: "awakening", name: "うちの子原理主義", emoji: "👑", lead: "審査基準はひとつ。うちの子であること。", description: "愛情が特定の一匹へまばゆいほど集中した覚醒タイプ。世界一かわいい猫の選考に、うちの子がいないなら、その大会は無効です。", traits: ["絶対的うちの子", "愛の集中", "比較は無意味"] },
  { id: "servant", kind: "awakening", name: "猫の下僕", emoji: "🛎️", lead: "予定も睡眠も席も、猫さまの仰せのままに。", description: "自分の都合を猫へ譲ることに、もはや迷いがない覚醒タイプ。その献身は義務ではなく、よろこんで選んだ生き方です。", traits: ["猫最優先", "献身が自然", "席は献上済み"] },
  { id: "mother-earth", kind: "awakening", name: "猫界の母なる大地", emoji: "🌏", lead: "すべての猫よ、その猫らしく幸せであれ。", description: "守る愛も、自由を願う愛も、全猫へ広がった覚醒タイプ。会ったことのない猫の幸福にも、本気で安心できる大きな心の持ち主です。", traits: ["全猫規模の愛", "慈愛", "幸せを願う"] },
  { id: "priest", kind: "awakening", name: "猫教司祭", emoji: "📣", lead: "座って。猫の尊さについて話があります。", description: "尊いと思うだけでなく、誰かへ伝えずにはいられない覚醒タイプ。知識でも動画でも、猫の魅力へ至る道を鮮やかに案内します。", traits: ["布教の才能", "尊さを言語化", "証拠映像完備"] },
  { id: "cat-child", kind: "awakening", name: "猫の子ども", emoji: "🧸", lead: "守っているつもりで、じつは守られている。", description: "猫が自分を心配し、管理し、看病してくれていると感じる覚醒タイプ。猫との関係には、親友以上の深い安心感があります。", traits: ["猫に見守られる", "安心感", "生活管理されがち"] },
  { id: "doctor", kind: "awakening", name: "猫博士", emoji: "🎓", lead: "その行動、かわいいだけでは終われない。", description: "観察と探究が高い純度で結びついた覚醒タイプ。なぜ、どうしてを楽しみながら、猫への理解をどこまでも深めます。", traits: ["探究が止まらない", "観察眼", "猫知識の深海"] },
  { id: "sage", kind: "awakening", name: "猫界の仙人", emoji: "🍃", lead: "触れずとも、通じる。追わずとも、近い。", description: "猫を深く見つめながら、その自由へ手を出しすぎない覚醒タイプ。無関心ではなく、理解の先にある静かな非干渉です。", traits: ["静かな理解", "非干渉の愛", "気配で通じる"] },
];

export const resultTypeById = Object.fromEntries(resultTypes.map((result) => [result.id, result])) as Record<string, ResultType>;
