// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { questions } from "@/domain/questions";
import { resultTypes } from "@/domain/results";
import { DiagnosisApp } from "./diagnosis-app";

describe("DiagnosisApp", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());
  });

  it("moves from the welcome screen through all 36 questions to one result", async () => {
    const user = userEvent.setup();
    render(<DiagnosisApp />);

    await user.click(screen.getByRole("button", { name: /診断をはじめる/ }));

    for (const [index, question] of questions.entries()) {
      expect(screen.getByRole("heading", { name: question.prompt })).toBeTruthy();
      await user.click(screen.getByRole("button", { name: "3を選ぶ" }));
      await user.click(screen.getByRole("button", {
        name: index === questions.length - 1 ? /結果を見る/ : /次へ/,
      }));
    }

    expect(screen.getByText("あなたのnekoistタイプは")).toBeTruthy();
    const resultNames = resultTypes.map((result) => result.name);
    expect(resultNames).toContain(screen.getByRole("heading", { level: 1 }).textContent);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });
});
