import { render, screen } from "@testing-library/react";
import WhyChallenges from "./WhyChallenges";

describe("WhyChallenges Component", () => {
  it("renders the section title", () => {
    render(<WhyChallenges />);
    expect(screen.getByText("Why Challenges?")).toBeInTheDocument();
  });

  it("renders the first paragraph", () => {
    render(<WhyChallenges />);
    expect(
      screen.getByText(
        /Taking on challenges helps you build confidence, develop habits, and achieve goals that matter to you./i
      )
    ).toBeInTheDocument();
  });
});
