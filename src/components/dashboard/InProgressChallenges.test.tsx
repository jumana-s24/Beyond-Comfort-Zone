import { render, screen } from "@testing-library/react";
import InProgressChallenges from "./InProgressChallenges";
import userEvent from "@testing-library/user-event";
import { Challenge } from "../../types";
import { mockChallengeData } from "../../mock-data";

jest.mock("../challenges/global/ChallengeCard", () => ({
  __esModule: true,
  default: ({
    title,
    onComplete,
  }: {
    title: string;
    onComplete: () => void;
  }) => (
    <div>
      <h3>{title}</h3>
      <button onClick={onComplete}>Complete</button>
    </div>
  ),
}));

describe("InProgressChallenges Component", () => {
  const mockHandleCompleteChallenge = jest.fn();
  const mockData = mockChallengeData.map((challenge) => ({
    ...challenge,
    status: "in-progress" as Challenge["status"],
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with correct title", () => {
    render(
      <InProgressChallenges
        data={mockData}
        handleCompleteChallenge={mockHandleCompleteChallenge}
      />
    );

    expect(screen.getByText("In Progress Challenges")).toBeInTheDocument();
  });

  it("renders a message when no challenges are in progress", () => {
    render(
      <InProgressChallenges
        data={[]}
        handleCompleteChallenge={mockHandleCompleteChallenge}
      />
    );

    expect(
      screen.getByText("No in progress challenges found.")
    ).toBeInTheDocument();
  });

  it("renders a list of in progress challenges", () => {
    render(
      <InProgressChallenges
        data={mockData}
        handleCompleteChallenge={mockHandleCompleteChallenge}
      />
    );

    mockData.forEach((challenge) => {
      expect(screen.getByText(challenge.title)).toBeInTheDocument();
    });
  });

  it("calls handleCompleteChallenge when a challenge is completed", async () => {
    render(
      <InProgressChallenges
        data={mockData}
        handleCompleteChallenge={mockHandleCompleteChallenge}
      />
    );

    const completeButtons = screen.getAllByText("Complete");
    expect(completeButtons).toHaveLength(mockData.length);

    await userEvent.click(completeButtons[0]);
    expect(mockHandleCompleteChallenge).toHaveBeenCalledWith(mockData[0].id);
  });
});
