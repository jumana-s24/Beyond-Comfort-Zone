import { render, screen, fireEvent } from "@testing-library/react";
import DailyChallengeCard from "./DailyChallengeCard";

describe("DailyChallengeCard Component", () => {
  const defaultProps = {
    title: "Sample Challenge",
    description: "This is a sample daily challenge description.",
    category: "Fitness",
    difficulty: "easy" as "easy" | "medium" | "hard",
    imageUrl: "https://via.placeholder.com/150",
    status: "not-started" as "not-started" | "in-progress" | "completed",
    onComplete: jest.fn(),
    onJoin: jest.fn(),
  };

  it("renders the card with all provided details", () => {
    render(<DailyChallengeCard {...defaultProps} />);

    expect(screen.getByText("Sample Challenge")).toBeInTheDocument();
    expect(
      screen.getByText("This is a sample daily challenge description.")
    ).toBeInTheDocument();

    expect(screen.getByText("Fitness")).toBeInTheDocument();
    expect(screen.getByText("easy")).toBeInTheDocument();

    const image = screen.getByAltText("daily challenge");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", defaultProps.imageUrl);

    expect(screen.getByText("Join Challenge")).toBeInTheDocument();
  });

  it("calls onJoin function when 'Join Challenge' button is clicked", () => {
    render(<DailyChallengeCard {...defaultProps} />);

    const joinButton = screen.getByText("Join Challenge");
    fireEvent.click(joinButton);

    expect(defaultProps.onJoin).toHaveBeenCalled();
  });

  it("renders 'Mark as Complete' button when status is 'in-progress'", () => {
    render(<DailyChallengeCard {...defaultProps} status="in-progress" />);

    const completeButton = screen.getByText("Mark as Complete");
    expect(completeButton).toBeInTheDocument();
  });

  it("calls onComplete function when 'Mark as Complete' is clicked", () => {
    render(<DailyChallengeCard {...defaultProps} status="in-progress" />);

    const completeButton = screen.getByText("Mark as Complete");
    fireEvent.click(completeButton);

    expect(defaultProps.onComplete).toHaveBeenCalled();
  });

  it("renders 'Completed' button when status is 'completed'", () => {
    render(<DailyChallengeCard {...defaultProps} status="completed" />);

    const completedButton = screen.getByText("Completed");
    expect(completedButton).toBeInTheDocument();
    expect(completedButton).toBeDisabled();
  });

  it("does not call any functions when 'Completed' button is clicked", () => {
    render(<DailyChallengeCard {...defaultProps} status="completed" />);

    const completedButton = screen.getByText("Completed");
    fireEvent.click(completedButton);

    expect(defaultProps.onJoin).not.toHaveBeenCalled();
    expect(defaultProps.onComplete).not.toHaveBeenCalled();
  });
});
