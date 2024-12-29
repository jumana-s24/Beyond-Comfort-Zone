import { render, screen } from "@testing-library/react";
import HowItWorks from "./HowItWorks";

describe("HowItWorks Component", () => {
  it("renders the section title", () => {
    render(<HowItWorks />);
    const sectionTitle = screen.getByText("How It Works");
    expect(sectionTitle).toBeInTheDocument();
  });

  it("renders all steps with correct titles and descriptions", () => {
    render(<HowItWorks />);

    const stepTitles = ["Sign Up", "Pick a Challenge", "Track Your Progress"];
    stepTitles.forEach((title) => {
      const stepTitle = screen.getByText(title);
      expect(stepTitle).toBeInTheDocument();
    });

    const stepDescriptions = [
      "Create an account to get started.",
      "Choose challenges that inspire your growth.",
      "Earn streaks and see your achievements.",
    ];
    stepDescriptions.forEach((description) => {
      const stepDescription = screen.getByText(description);
      expect(stepDescription).toBeInTheDocument();
    });
  });
});
