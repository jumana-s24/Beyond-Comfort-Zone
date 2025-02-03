import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { fetchChallengesByStatusService } from "../../services/globalChallengeService";
import { fetchUserByIdService } from "../../services/userService";

jest.mock("../../firebase/firebase", () => ({
  auth: { currentUser: { uid: "test-user-id" } },
  db: jest.fn(),
  storage: jest.fn(),
  functions: jest.fn(),
}));

jest.mock(
  "./StreakTracker",
  () =>
    ({
      currentStreak,
      longestStreak,
    }: {
      currentStreak: number;
      longestStreak: number;
    }) =>
      (
        <div data-testid="streak-tracker">
          Current: {currentStreak}, Longest: {longestStreak}
        </div>
      )
);

jest.mock(
  "./TotalChallenges",
  () =>
    ({ totalChallenges }: { totalChallenges: number }) =>
      <div data-testid="total-challenges">{totalChallenges} Challenges</div>
);

jest.mock(
  "./ChallengeBreakdown",
  () =>
    ({ data }: { data: { name: string; value: number }[] }) =>
      (
        <div data-testid="challenge-breakdown">
          Breakdown: {data.map((d) => `${d.name}: ${d.value}`).join(", ")}
        </div>
      )
);

jest.mock("./InProgressChallenges", () => ({
  __esModule: true,
  default: ({
    data,
    handleCompleteChallenge,
  }: {
    data: { id: string; title: string }[];
    handleCompleteChallenge: (id: string) => void;
  }) => (
    <div data-testid="in-progress-challenges">
      {data.length > 0
        ? data.map((challenge) => (
            <div key={challenge.id}>
              {challenge.title}
              <button
                onClick={() => handleCompleteChallenge(challenge.id)}
                data-testid={`complete-${challenge.id}`}
              >
                Complete
              </button>
            </div>
          ))
        : "No in-progress challenges"}
    </div>
  ),
}));

jest.mock(
  "./CompletedChallenges",
  () =>
    ({ data }: { data: { id: string; title: string }[] }) =>
      (
        <div data-testid="completed-challenges">
          {data.length > 0
            ? data.map((challenge) => (
                <div key={challenge.id}>{challenge.title}</div>
              ))
            : "No completed challenges"}
        </div>
      )
);

jest.mock("../../services/globalChallengeService", () => ({
  fetchChallengesByStatusService: jest.fn(),
  completeChallengeService: jest.fn(),
}));

jest.mock("../../services/userService", () => ({
  fetchUserByIdService: jest.fn(),
}));

jest.mock("../../services/statsService", () => ({
  updateUserStatsService: jest.fn(),
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders components with fetched data", async () => {
    const mockUserStats = { stats: { streak: 3, longestStreak: 7 } };
    const mockInProgressChallenges = [
      { id: "1", title: "In Progress 1" },
      { id: "2", title: "In Progress 2" },
    ];
    const mockCompletedChallenges = [
      { id: "3", title: "Completed 1", category: "Fitness" },
      { id: "4", title: "Completed 2", category: "Learning" },
    ];

    (fetchUserByIdService as jest.Mock).mockResolvedValue(mockUserStats);
    (fetchChallengesByStatusService as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve(mockInProgressChallenges))
      .mockImplementationOnce(() => Promise.resolve(mockCompletedChallenges));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Growth Dashboard")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(fetchChallengesByStatusService).toHaveBeenCalledTimes(2);
    });

    expect(screen.getByTestId("streak-tracker")).toHaveTextContent(
      "Current: 3, Longest: 7"
    );
    expect(screen.getByTestId("total-challenges")).toHaveTextContent(
      "2 Challenges"
    );
    expect(screen.getByTestId("challenge-breakdown")).toHaveTextContent(
      "Breakdown: Fitness: 1, Learning: 1"
    );
    expect(screen.getByTestId("in-progress-challenges")).toHaveTextContent(
      "In Progress 1"
    );
    expect(screen.getByTestId("completed-challenges")).toHaveTextContent(
      "Completed 1"
    );
  });
});
