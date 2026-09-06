"use client";

import { useMemo, useState } from "react";
import { questions } from "@/domain/questions";
import { attributeLabels } from "@/domain/results";
import { diagnose } from "@/domain/scoring";
import type { Answers, AnswerValue, DiagnosisResult } from "@/domain/types";

type Screen = "welcome" | "questions" | "result";

export function DiagnosisApp() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id];

  const topAttributes = useMemo(() => {
    if (!result) return [];
    return Object.entries(result.attributes)
      .sort(([, left], [, right]) => right - left)
      .slice(0, 3) as [keyof typeof result.attributes, number][];
  }, [result]);

  const start = () => {
    setScreen("questions");
    setCurrentIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectAnswer = (value: AnswerValue) => {
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: value }));
  };

  const next = () => {
    if (!currentAnswer) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const completedAnswers = answers as Answers;
    setResult(diagnose(completedAnswers));
    setScreen("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    if (currentIndex === 0) {
      setScreen("welcome");
      return;
    }
    setCurrentIndex((index) => index - 1);
  };

  const restart = () => {
    setAnswers({});
    setResult(null);
    setCurrentIndex(0);
    setScreen("welcome");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="app-shell">
      <div className="page-wrap">
        <div className="brand" aria-label="nekoist">
          <span className="brand-mark" aria-hidden="true">ね</span>
          nekoist
        </div>

        {screen === "welcome" && (
          <section className="card hero" aria-labelledby="welcome-title">
            <div className="hero-cat" aria-hidden="true">🐱</div>
            <p className="eyebrow">What kind of cat lover are you?</p>
            <h1 id="welcome-title">nekoist診断<span>あなたの猫愛、何タイプ？</span></h1>
            <p className="hero-copy">
              猫への「好き」は、ひとつじゃない。36の究極の二択から、
              あなたに宿る猫愛のかたちをこっそり判定します。
            </p>
            <div className="fact-row" aria-label="診断の概要">
              <span className="fact">全36問</span>
              <span className="fact">所要時間 約4分</span>
              <span className="fact">16タイプ</span>
            </div>
            <div><button className="primary-button" type="button" onClick={start}>診断をはじめる　→</button></div>
          </section>
        )}

        {screen === "questions" && (
          <section className="card question-card" aria-labelledby="question-title">
            <div className="progress-head">
              <span className="progress-label">猫愛を観測中…</span>
              <span className="progress-count">{currentIndex + 1} / {questions.length}</span>
            </div>
            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
            </div>
            <p className="question-number">QUESTION {String(currentQuestion.id).padStart(2, "0")}</p>
            <h1 className="question-title" id="question-title">{currentQuestion.prompt}</h1>
            <div className="answer-scale">
              <div className="answer-anchors">
                <span>{currentQuestion.left.label}</span>
                <span>{currentQuestion.right.label}</span>
              </div>
              <div className="answer-buttons" role="group" aria-label="1から5で回答">
                {([1, 2, 3, 4, 5] as AnswerValue[]).map((value) => (
                  <button
                    className="answer-button"
                    type="button"
                    key={value}
                    aria-label={`${value}を選ぶ`}
                    aria-pressed={currentAnswer === value}
                    onClick={() => selectAnswer(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className="scale-hint"><span>← 左に近い</span><span>右に近い →</span></div>
            </div>
            <div className="question-actions">
              <button className="secondary-button" type="button" onClick={back}>← もどる</button>
              <button className="primary-button" type="button" onClick={next} disabled={!currentAnswer}>
                {currentIndex === questions.length - 1 ? "結果を見る" : "次へ"}　→
              </button>
            </div>
          </section>
        )}

        {screen === "result" && result && (
          <section className="card result-card" aria-labelledby="result-title" aria-live="polite">
            <div className="result-emoji" aria-hidden="true">{result.type.emoji}</div>
            {result.type.kind === "awakening" && <span className="awakening-badge">覚醒タイプ</span>}
            <p className="eyebrow">あなたのnekoistタイプは</p>
            <h1 className="result-title" id="result-title">{result.type.name}</h1>
            <p className="result-lead">{result.type.lead}</p>
            <p className="result-description">{result.type.description}</p>
            <ul className="trait-list">
              {result.type.traits.map((trait) => <li key={trait}>{trait}</li>)}
            </ul>
            <div className="attribute-panel">
              <h2>あなたの猫愛をつくる上位3属性</h2>
              {topAttributes.map(([attribute, score]) => (
                <div className="attribute-row" key={attribute}>
                  <span>{attributeLabels[attribute]}</span>
                  <div className="attribute-bar" aria-hidden="true"><span style={{ width: `${score}%` }} /></div>
                  <span>{Math.round(score)}</span>
                </div>
              ))}
            </div>
            <div className="result-actions"><button className="secondary-button" type="button" onClick={restart}>もう一度診断する</button></div>
          </section>
        )}

        <p className="footer-note">猫の気持ちは猫のみぞ知る。結果は楽しくお受け取りください。</p>
      </div>
    </main>
  );
}
