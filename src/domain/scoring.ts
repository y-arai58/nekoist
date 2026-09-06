import { questions } from "./questions";
import { resultTypeById } from "./results";
import { attributeIds, type Answers, type AttributeId, type AttributeScores, type DiagnosisResult } from "./types";

const WEIGHTS = { primary: 2, secondary: 1 } as const;
const EPSILON = 1e-9;

function emptyAttributes(): AttributeScores {
  return Object.fromEntries(attributeIds.map((id) => [id, 0])) as AttributeScores;
}

function assertCompleteAnswers(answers: Answers) {
  for (const question of questions) {
    const answer = answers[question.id];
    if (!Number.isInteger(answer) || answer < 1 || answer > 5) {
      throw new Error(`Q${question.id} の回答がありません。`);
    }
  }
}

export function calculateAttributeScores(answers: Answers): AttributeScores {
  assertCompleteAnswers(answers);
  const earned = emptyAttributes();
  const possible = emptyAttributes();

  for (const question of questions) {
    const answer = answers[question.id];
    const leftRatio = (5 - answer) / 4;
    const rightRatio = (answer - 1) / 4;

    for (const attribute of attributeIds) {
      const leftWeight =
        (question.left.primary === attribute ? WEIGHTS.primary : 0) +
        (question.left.secondary === attribute ? WEIGHTS.secondary : 0);
      const rightWeight =
        (question.right.primary === attribute ? WEIGHTS.primary : 0) +
        (question.right.secondary === attribute ? WEIGHTS.secondary : 0);
      earned[attribute] += leftWeight * leftRatio + rightWeight * rightRatio;
      possible[attribute] += Math.max(leftWeight, rightWeight);
    }
  }

  return Object.fromEntries(
    attributeIds.map((id) => [id, possible[id] === 0 ? 0 : (earned[id] / possible[id]) * 100]),
  ) as AttributeScores;
}

type Direction = "left" | "right";
type DirectedQuestion = readonly [number, Direction];

function directedScore(answers: Answers, directedQuestions: readonly DirectedQuestion[]) {
  return directedQuestions.reduce((total, [id, direction]) => {
    const answer = answers[id];
    return total + (direction === "right" ? answer - 1 : 5 - answer) * 25;
  }, 0) / directedQuestions.length;
}

function strongCount(answers: Answers, directedQuestions: readonly DirectedQuestion[]) {
  return directedQuestions.filter(([id, direction]) =>
    direction === "right" ? answers[id] >= 4 : answers[id] <= 2,
  ).length;
}

const patterns = {
  loyal: [[6, "right"], [7, "right"]],
  servant: [[1, "right"], [2, "right"], [21, "right"], [22, "right"], [34, "right"]],
  mother: [[5, "right"], [9, "right"], [10, "right"], [33, "right"]],
  priest: [[16, "right"], [19, "right"], [27, "right"], [28, "right"], [29, "right"]],
  child: [[24, "right"], [25, "right"], [26, "right"], [35, "left"], [36, "right"]],
  doctor: [[8, "right"], [15, "right"], [17, "right"], [18, "right"], [31, "left"], [33, "left"]],
  sage: [[3, "left"], [4, "left"], [10, "left"], [15, "left"], [17, "left"]],
} as const satisfies Record<string, readonly DirectedQuestion[]>;

type Candidate = {
  id: string;
  fit: number;
  minimumCore: number;
  prominence: number;
  symbolic: number;
};

function awakeningCandidates(attributes: AttributeScores, answers: Answers): Candidate[] {
  const A = attributes.affectionIntensity;
  const B = attributes.affectionRange;
  const C = attributes.companionship;
  const D = attributes.protectiveness;
  const E = attributes.freedomRespect;
  const F = attributes.observation;
  const G = attributes.curiosity;
  const H = attributes.touchDesire;
  const I = attributes.worship;
  const J = attributes.evangelism;
  const K = attributes.catPriority;
  const L = attributes.protectedFeeling;
  const average = attributeIds.reduce((sum, id) => sum + attributes[id], 0) / attributeIds.length;
  const candidates: Candidate[] = [];

  const add = (id: string, fit: number, core: number[], symbolic: number, condition: boolean) => {
    if (!condition) return;
    const coreAverage = core.reduce((sum, score) => sum + score, 0) / core.length;
    candidates.push({ id, fit, minimumCore: Math.min(...core), prominence: coreAverage - average, symbolic });
  };

  const loyal = directedScore(answers, patterns.loyal);
  const loyalFit = 0.35 * A + 0.35 * (100 - B) + 0.3 * loyal;
  add("my-cat-supremacist", loyalFit, [A, 100 - B], loyal,
    A >= 75 && B <= 45 && loyal >= 75 && loyalFit >= 78 && strongCount(answers, patterns.loyal) === 2);

  const servant = directedScore(answers, patterns.servant);
  const servantFit = 0.5 * K + 0.2 * A + 0.3 * servant;
  add("servant", servantFit, [K, A], servant,
    K >= 80 && A >= 65 && servant >= 75 && servantFit >= 80 && strongCount(answers, patterns.servant) >= 3);

  const mother = directedScore(answers, patterns.mother);
  const care = Math.max(D, E);
  const motherFit = 0.45 * B + 0.25 * D + 0.2 * care + 0.1 * A;
  add("mother-earth", motherFit, [B, care], mother,
    B >= 80 && care >= 72 && mother >= 70 && motherFit >= 80 && (D >= 65 || E >= 80));

  const priest = directedScore(answers, patterns.priest);
  const priestFit = 0.5 * I + 0.4 * J + 0.1 * A;
  add("priest", priestFit, [I, J], priest,
    I >= 80 && J >= 78 && priest >= 75 && priestFit >= 82 && strongCount(answers, patterns.priest) >= 3);

  const child = directedScore(answers, patterns.child);
  const childFit = 0.55 * L + 0.3 * C + 0.15 * A;
  add("cat-child", childFit, [L, C], child,
    L >= 80 && C >= 68 && child >= 75 && childFit >= 80 && strongCount(answers, patterns.child) >= 3);

  const doctor = directedScore(answers, patterns.doctor);
  const doctorFit = 0.6 * G + 0.3 * F + 0.1 * D;
  add("doctor", doctorFit, [G, F], doctor,
    G >= 82 && F >= 70 && doctor >= 75 && doctorFit >= 80 && G - D >= 5);

  const sage = directedScore(answers, patterns.sage);
  const sageFit = 0.55 * E + 0.3 * F + 0.15 * C;
  add("sage", sageFit, [E, F], sage,
    E >= 82 && F >= 70 && sage >= 75 && sageFit >= 80 && E - H >= 10);

  return candidates;
}

function pickAwakening(candidates: Candidate[]): Candidate {
  const sorted = [...candidates].sort((a, b) => b.fit - a.fit);
  if (sorted.length === 1 || sorted[0].fit - sorted[1].fit >= 3) return sorted[0];
  const close = sorted.filter((candidate) => sorted[0].fit - candidate.fit < 3);
  close.sort((a, b) => {
    const coreDifference = b.minimumCore - a.minimumCore;
    if (Math.abs(coreDifference) >= 2) return coreDifference;
    const prominenceDifference = b.prominence - a.prominence;
    if (Math.abs(prominenceDifference) > EPSILON) return prominenceDifference;
    return b.symbolic - a.symbolic;
  });
  return close[0];
}

type NormalCandidate = { id: string; fit: number; primary: AttributeId; signature: number };

function normalCandidates(attributes: AttributeScores, answers: Answers): NormalCandidate[] {
  const A = attributes.affectionIntensity;
  const B = attributes.affectionRange;
  const C = attributes.companionship;
  const D = attributes.protectiveness;
  const E = attributes.freedomRespect;
  const F = attributes.observation;
  const G = attributes.curiosity;
  const H = attributes.touchDesire;
  const I = attributes.worship;
  const K = attributes.catPriority;
  const loyal = directedScore(answers, patterns.loyal);
  const candidate = (id: string, fit: number, primary: AttributeId, signature: readonly DirectedQuestion[]): NormalCandidate =>
    ({ id, fit, primary, signature: directedScore(answers, signature) });

  return [
    candidate("devoted-guardian", 0.35 * A + 0.3 * (100 - B) + 0.25 * loyal + 0.1 * C, "affectionIntensity", patterns.loyal),
    candidate("best-friend", 0.6 * C + 0.2 * A + 0.1 * attributes.protectedFeeling + 0.1 * H + (C - H >= 10 ? 5 : 0), "companionship", [[3, "right"], [23, "right"], [24, "left"]]),
    candidate("protector", 0.6 * D + 0.15 * G + 0.15 * A + 0.1 * K + (D - G >= 10 ? 5 : 0), "protectiveness", [[9, "right"], [10, "right"], [18, "right"], [33, "right"]]),
    candidate("mother-of-all-cats", 0.5 * B + 0.3 * D + 0.1 * A + 0.1 * E, "affectionRange", patterns.mother),
    candidate("neighbor", 0.6 * E + 0.2 * C + 0.2 * F + (E - F >= 10 ? 5 : 0), "freedomRespect", patterns.sage),
    candidate("observer", 0.65 * F + 0.15 * B + 0.15 * E + 0.05 * I + (F - E >= 10 ? 5 : 0), "observation", [[3, "left"], [8, "left"], [11, "left"], [14, "left"], [17, "left"]]),
    candidate("researcher", 0.65 * G + 0.2 * F + 0.1 * D + 0.05 * C + (G - D >= 10 ? 5 : 0), "curiosity", patterns.doctor),
    candidate("cat-inhaler", 0.7 * H + 0.15 * A + 0.1 * C + 0.05 * K + (H - C >= 10 ? 5 : 0), "touchDesire", [[4, "right"], [12, "right"], [13, "right"]]),
    candidate("believer", 0.65 * I + 0.15 * A + 0.1 * K + 0.1 * F + (I - F >= 10 ? 5 : 0), "worship", [[11, "right"], [14, "right"], [30, "right"], [31, "right"], [32, "right"]]),
  ];
}

function responseFingerprint(answers: Answers, typeId: string) {
  const salt = [...typeId].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return questions.reduce((sum, question) => sum + answers[question.id] * ((question.id * salt) % 17), 0);
}

function pickNormal(candidates: NormalCandidate[], attributes: AttributeScores, answers: Answers): NormalCandidate {
  const sorted = [...candidates].sort((a, b) => b.fit - a.fit);
  if (sorted[0].fit - sorted[1].fit >= 3) return sorted[0];
  const close = sorted.filter((candidate) => sorted[0].fit - candidate.fit < 3);
  close.sort((a, b) => {
    const primaryDifference = attributes[b.primary] - attributes[a.primary];
    if (Math.abs(primaryDifference) > EPSILON) return primaryDifference;
    const signatureDifference = b.signature - a.signature;
    if (Math.abs(signatureDifference) > EPSILON) return signatureDifference;
    const rawDifference = b.fit - a.fit;
    if (Math.abs(rawDifference) > EPSILON) return rawDifference;
    return responseFingerprint(answers, b.id) - responseFingerprint(answers, a.id);
  });
  return close[0];
}

export function diagnose(answers: Answers): DiagnosisResult {
  const attributes = calculateAttributeScores(answers);
  const awakenings = awakeningCandidates(attributes, answers);
  const winner = awakenings.length > 0
    ? pickAwakening(awakenings)
    : pickNormal(normalCandidates(attributes, answers), attributes, answers);

  return {
    type: resultTypeById[winner.id],
    attributes,
    fitScore: winner.fit,
    awakeningCandidates: awakenings.map((candidate) => candidate.id),
  };
}
