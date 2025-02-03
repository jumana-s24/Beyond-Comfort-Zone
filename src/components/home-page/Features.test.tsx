import { render, screen } from "@testing-library/react";
import Features from "./Features";

describe("Features Component", () => {
  it("renders the Features section with the correct title", () => {
    render(<Features />);
    const title = screen.getByText("Features");
    expect(title).toBeInTheDocument();
  });

  it("renders all feature cards", () => {
    render(<Features />);

    expect(screen.getByText("Daily Challenges")).toBeInTheDocument();
    expect(screen.getByText("Global Challenges")).toBeInTheDocument();
    expect(screen.getByText("Progress Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Motivational Wall")).toBeInTheDocument();
    expect(screen.getByText("Custom Challenges")).toBeInTheDocument();

    expect(
      screen.getByText("Random challenges to keep you inspired.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Participate alongside a global community.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Track your streaks, stats, and achievements.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Share and view inspiring quotes and stories.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Create personalized challenges for your goals.")
    ).toBeInTheDocument();
  });
});
