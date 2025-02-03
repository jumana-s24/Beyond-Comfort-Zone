import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useFetchChallenges } from "../../../hooks/useFetchChallenges";
import {
  fetchChallengesByStatusService,
  joinChallengeService,
  completeChallengeService,
} from "../../../services/globalChallengeService";
import { updateUserStatsService } from "../../../services/statsService";
import GlobalChallengesList from "./GlobalChallengesList";

jest.mock("../../../hooks/useFetchChallenges");
jest.mock("../../../services/globalChallengeService");
jest.mock("../../../services/statsService");
jest.mock("../../../firebase/firebase", () => ({
  auth: { currentUser: { uid: "testUserId" } },
}));

jest.mock(
  "./ChallengeCard",
  () =>
    ({
      title,
      onJoin,
      onComplete,
      status,
    }: {
      title: string;
      onJoin: () => void;
      onComplete: () => void;
      status: string;
    }) =>
      (
        <div>
          <h3>{title}</h3>
          <button onClick={onJoin}>Join</button>
          <button onClick={onComplete}>Complete</button>
          <p>{status}</p>
        </div>
      )
);

describe("GlobalChallengesList Component", () => {
  const mockChallenges = [
    {
      id: "1",
      title: "Challenge 1",
      description: "Description 1",
      category: "Category 1",
      difficulty: "Easy",
      imageUrl: "image1.jpg",
    },
    {
      id: "2",
      title: "Challenge 2",
      description: "Description 2",
      category: "Category 2",
      difficulty: "Medium",
      imageUrl: "image2.jpg",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders challenges when fetched", async () => {
    (useFetchChallenges as jest.Mock).mockReturnValue({
      data: { pages: [{ challenges: mockChallenges }] },
      isLoading: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
    });

    render(<GlobalChallengesList />);

    await waitFor(() => {
      mockChallenges.forEach((challenge) => {
        expect(screen.getByText(challenge.title)).toBeInTheDocument();
      });
    });
  });

  it("handles joining a challenge", async () => {
    (fetchChallengesByStatusService as jest.Mock).mockResolvedValue([]);
    (joinChallengeService as jest.Mock).mockResolvedValue(undefined);
    (useFetchChallenges as jest.Mock).mockReturnValue({
      data: { pages: [{ challenges: mockChallenges }] },
      isLoading: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
    });

    render(<GlobalChallengesList />);

    fireEvent.click(screen.getAllByText("Join")[0]);

    await waitFor(() => {
      expect(joinChallengeService).toHaveBeenCalledWith(
        "testUserId",
        "1",
        "global",
        mockChallenges[0]
      );
    });
    await waitFor(() => {
      expect(fetchChallengesByStatusService).toHaveBeenCalledWith(
        "testUserId",
        "in-progress"
      );
    });
  });

  it("handles completing a challenge", async () => {
    (fetchChallengesByStatusService as jest.Mock).mockResolvedValue([]);
    (completeChallengeService as jest.Mock).mockResolvedValue(undefined);
    (updateUserStatsService as jest.Mock).mockResolvedValue(undefined);
    (useFetchChallenges as jest.Mock).mockReturnValue({
      data: { pages: [{ challenges: mockChallenges }] },
      isLoading: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
    });

    render(<GlobalChallengesList />);

    const completeButton = screen.getAllByText("Complete")[0];
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(completeChallengeService).toHaveBeenCalledWith("testUserId", "1");
    });
    await waitFor(() => {
      expect(updateUserStatsService).toHaveBeenCalledWith("testUserId");
    });

    await waitFor(() => {
      expect(fetchChallengesByStatusService).toHaveBeenCalledWith(
        "testUserId",
        "completed"
      );
    });
  });

  it("loads more challenges when 'Load More' is clicked", () => {
    const fetchNextPageMock = jest.fn();
    (useFetchChallenges as jest.Mock).mockReturnValue({
      data: { pages: [{ challenges: mockChallenges }] },
      isLoading: false,
      isFetchingNextPage: false,
      fetchNextPage: fetchNextPageMock,
      hasNextPage: true,
    });

    render(<GlobalChallengesList />);
    fireEvent.click(screen.getByText("Load More"));
    expect(fetchNextPageMock).toHaveBeenCalledTimes(1);
  });
});
