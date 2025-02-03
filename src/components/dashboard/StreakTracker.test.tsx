import { render, screen } from "@testing-library/react";
import StreakTracker from "./StreakTracker";

describe("StreakTracker Component", () => {
  it("renders the component with correct title", () => {
    render(<StreakTracker currentStreak={0} longestStreak={0} />);

    expect(screen.getByText("Streak Tracker")).toBeInTheDocument();
  });

  it("renders dynamic current and longest streak values correctly", () => {
    const currentStreak = 3;
    const longestStreak = 7;
    render(
      <StreakTracker
        currentStreak={currentStreak}
        longestStreak={longestStreak}
      />
    );

    expect(screen.getByText(`${currentStreak} days`)).toBeInTheDocument();
    expect(screen.getByText(`${longestStreak} days`)).toBeInTheDocument();
  });
});
