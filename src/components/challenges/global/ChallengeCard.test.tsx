import { render, screen, fireEvent } from "@testing-library/react";
import ChallengeCard, { ChallengeCardProps } from "./ChallengeCard";

const mockHandleDelete = jest.fn();
const mockHandleEdit = jest.fn();
const mockOnComplete = jest.fn();
const mockOnJoin = jest.fn();

const defaultProps: ChallengeCardProps = {
  challengeId: "1",
  title: "Test Challenge",
  description: "Test Description",
  imageUrl: "",
  difficulty: "easy",
  category: "Physical",
  isCustomChallenge: false,
  status: "not-started",
  handleDelete: mockHandleDelete,
  handleEdit: mockHandleEdit,
  onComplete: mockOnComplete,
  onJoin: mockOnJoin,
  isDashboard: false,
};

describe("ChallengeCard Component", () => {
  it("renders the challenge card with correct details", () => {
    render(<ChallengeCard {...defaultProps} />);

    expect(screen.getByText("Test Challenge")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Physical")).toBeInTheDocument();
    expect(screen.getByText("easy")).toBeInTheDocument();
  });

  it("displays the 'Join Challenge' button when status is 'not-started'", () => {
    render(<ChallengeCard {...defaultProps} status="not-started" />);

    const joinButton = screen.getByText("Join Challenge");
    expect(joinButton).toBeInTheDocument();
    fireEvent.click(joinButton);
    expect(mockOnJoin).toHaveBeenCalledTimes(1);
  });

  it("displays the 'Mark as Complete' button when status is 'in-progress'", () => {
    render(<ChallengeCard {...defaultProps} status="in-progress" />);

    const completeButton = screen.getByText("Mark as Complete");
    expect(completeButton).toBeInTheDocument();
    fireEvent.click(completeButton);
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it("displays the 'Completed' button when status is 'completed' and is not a dashboard", () => {
    render(
      <ChallengeCard {...defaultProps} status="completed" isDashboard={false} />
    );

    const completedButton = screen.getByText("Completed");
    expect(completedButton).toBeInTheDocument();
    expect(completedButton).toBeDisabled();
  });

  it("renders edit and delete buttons when isCustomChallenge is true", () => {
    render(<ChallengeCard {...defaultProps} isCustomChallenge={true} />);

    const editButton = screen.getByRole("button", { name: /edit challenge/i });
    const deleteButton = screen.getByRole("button", {
      name: /delete challenge/i,
    });

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(editButton);
    expect(mockHandleEdit).toHaveBeenCalledTimes(1);

    fireEvent.click(deleteButton);
    expect(mockHandleDelete).toHaveBeenCalledTimes(1);
  });

  it("renders the default image when imageUrl is not provided", () => {
    render(<ChallengeCard {...defaultProps} imageUrl="" />);
    const image = screen.getByAltText("profile");
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("defaultImage")
    );
  });

  it("renders the provided image when imageUrl is provided", () => {
    render(<ChallengeCard {...defaultProps} imageUrl="test-image.jpg" />);
    const image = screen.getByAltText("profile");
    expect(image).toHaveAttribute("src", "test-image.jpg");
  });

  it("does not render action buttons when status is not provided", () => {
    render(<ChallengeCard {...defaultProps} status={undefined} />);

    expect(screen.queryByText("Join Challenge")).not.toBeInTheDocument();
    expect(screen.queryByText("Mark as Complete")).not.toBeInTheDocument();
    expect(screen.queryByText("Completed")).not.toBeInTheDocument();
  });
});
