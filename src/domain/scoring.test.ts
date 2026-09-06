import { describe, expect, it } from "vitest";
import { questions } from "./questions";
import { resultTypes } from "./results";
import { calculateAttributeScores, diagnose } from "./scoring";
import { attributeIds, type Answers, type AnswerValue, type AttributeId } from "./types";

const filledAnswers = (value: AnswerValue): Answers =>
  Object.fromEntries(questions.map((question) => [question.id, value])) as Answers;

const directedProfile = (
  weights: Partial<Record<AttributeId, number>>,
  forced: Record<number, AnswerValue>,
): Answers => Object.fromEntries(questions.map((question) => {
  const sideValue = (side: typeof question.left) =>
    2 * (weights[side.primary] ?? 0) + (weights[side.secondary] ?? 0);
  const left = sideValue(question.left);
  const right = sideValue(question.right);
  return [question.id, forced[question.id] ?? (right > left ? 5 : left > right ? 1 : 3)];
})) as Answers;

describe("question definition", () => {
  it("contains exactly 36 sequential questions", () => {
    expect(questions).toHaveLength(36);
    expect(questions.map((question) => question.id)).toEqual(
      Array.from({ length: 36 }, (_, index) => index + 1),
    );
  });

  it("only refers to the 12 known attributes", () => {
    const known = new Set(attributeIds);
    for (const question of questions) {
      expect(known.has(question.left.primary)).toBe(true);
      expect(known.has(question.left.secondary)).toBe(true);
      expect(known.has(question.right.primary)).toBe(true);
      expect(known.has(question.right.secondary)).toBe(true);
    }
  });
});

describe("attribute scoring", () => {
  it("normalizes all 12 attributes to the 0-100 range", () => {
    for (const answers of [filledAnswers(1), filledAnswers(3), filledAnswers(5)]) {
      const attributes = calculateAttributeScores(answers);
      expect(Object.keys(attributes)).toHaveLength(12);
      for (const score of Object.values(attributes)) {
        expect(Number.isFinite(score)).toBe(true);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      }
    }
  });

  it("moves left- and right-facing attributes in the expected direction", () => {
    const allLeft = calculateAttributeScores(filledAnswers(1));
    const allRight = calculateAttributeScores(filledAnswers(5));
    expect(allLeft.freedomRespect).toBeGreaterThan(allRight.freedomRespect);
    expect(allRight.catPriority).toBeGreaterThan(allLeft.catPriority);
  });

  it("rejects an incomplete answer set", () => {
    expect(() => calculateAttributeScores({ 1: 3 } as Answers)).toThrow("Q2");
  });
});

describe("diagnosis", () => {
  it("always returns exactly one of the 16 result types", () => {
    const knownIds = new Set(resultTypes.map((result) => result.id));
    let seed = 20260906;
    for (let sample = 0; sample < 1000; sample += 1) {
      const answers = Object.fromEntries(questions.map((question) => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return [question.id, ((seed % 5) + 1) as AnswerValue];
      })) as Answers;
      const result = diagnose(answers);
      expect(knownIds.has(result.type.id)).toBe(true);
      expect(result.fitScore).toBeGreaterThanOrEqual(0);
      expect(result.fitScore).toBeLessThanOrEqual(100);
    }
  });

  it("is deterministic for the same answers", () => {
    const answers = filledAnswers(3);
    expect(diagnose(answers)).toEqual(diagnose(answers));
  });

  it("can reach every awakening type with a matching answer profile", () => {
    const profiles: Record<string, Answers> = {
      "my-cat-supremacist": directedProfile(
        { affectionIntensity: 0.5, affectionRange: -0.4, companionship: 0.1 },
        { 6: 5, 7: 5 },
      ),
      servant: directedProfile(
        { catPriority: 0.55, affectionIntensity: 0.25, touchDesire: 0.1 },
        { 1: 5, 2: 5, 21: 5, 22: 5, 34: 5 },
      ),
      "mother-earth": directedProfile(
        { affectionRange: 0.5, protectiveness: 0.3, freedomRespect: 0.15, affectionIntensity: 0.05 },
        { 5: 5, 9: 5, 10: 5, 33: 5 },
      ),
      priest: directedProfile(
        { worship: 0.5, evangelism: 0.4, affectionIntensity: 0.1 },
        { 16: 5, 19: 5, 27: 5, 28: 5, 29: 5 },
      ),
      "cat-child": directedProfile(
        { protectedFeeling: 0.55, companionship: 0.3, affectionIntensity: 0.15 },
        { 24: 5, 25: 5, 26: 5, 35: 1, 36: 5 },
      ),
      doctor: directedProfile(
        { curiosity: 0.7, observation: 0.3, protectiveness: -0.15 },
        { 8: 5, 15: 5, 17: 5, 18: 5, 31: 1, 33: 1 },
      ),
      sage: directedProfile(
        { freedomRespect: 0.65, observation: 0.3, companionship: 0.15, touchDesire: -0.2 },
        { 3: 1, 4: 1, 10: 1, 15: 1, 17: 1 },
      ),
    };

    for (const [expectedType, answers] of Object.entries(profiles)) {
      expect(diagnose(answers).type.id).toBe(expectedType);
    }
  });
});
