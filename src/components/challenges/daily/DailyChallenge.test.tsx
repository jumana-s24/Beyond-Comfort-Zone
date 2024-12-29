import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DailyChallenge from "./DailyChallenge";
import {
  getOrAssignDailyChallengeService,
  updateDailyChallengeStatusService,
} from "../../../services/dailyChallengeService";
import {
  completeChallengeService,
  joinChallengeService,
} from "../../../services/globalChallengeService";
import { updateUserStatsService } from "../../../services/statsService";
import { useAuth } from "../../../contexts/AuthContext";
import { DailyChallengeCardProps } from "./DailyChallengeCard";

jest.mock("../../../firebase/firebase", () => ({
  auth: {
    currentUser: { uid: "testUserId" },
  },
}));

jest.mock("../../../services/dailyChallengeService", () => ({
  getOrAssignDailyChallengeService: jest.fn(),
  updateDailyChallengeStatusService: jest.fn(),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../../services/globalChallengeService", () => ({
  completeChallengeService: jest.fn(),
  joinChallengeService: jest.fn(),
}));

jest.mock("../../../services/statsService", () => ({
  updateUserStatsService: jest.fn(),
}));

jest.mock(
  "./DailyChallengeCard",
  () =>
    ({
      title,
      description,
      category,
      difficulty,
      imageUrl,
      status,
      onComplete,
      onJoin,
    }: DailyChallengeCardProps) =>
      (
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
          <p>{category}</p>
          <p>{difficulty}</p>
          <img src={imageUrl} alt="daily challenge" />
          <p>{status}</p>
          <button onClick={onComplete}>Complete</button>
          <button onClick={onJoin}>Join</button>
        </div>
      )
);

const mockAuth = {
  user: { uid: "defaultUserId" },
  isVerified: true,
};

const mockChallenge = {
  title: "Test Challenge",
  description: "Test Challenge Description",
  category: "Fitness",
  difficulty: "easy",
  imageUrl: "https://via.placeholder.com/150",
  status: "not-started",
};

const setupUseAuthMock = (override = {}) => {
  (useAuth as jest.Mock).mockReturnValue({
    ...mockAuth,
    ...override,
  });
};

const setupServiceMocks = () => {
  (getOrAssignDailyChallengeService as jest.Mock).mockResolvedValue(
    mockChallenge
  );
  (updateDailyChallengeStatusService as jest.Mock).mockResolvedValue(undefined);
  (joinChallengeService as jest.Mock).mockResolvedValue(undefined);
  (completeChallengeService as jest.Mock).mockResolvedValue(undefined);
  (updateUserStatsService as jest.Mock).mockResolvedValue(undefined);
};

describe("DailyChallenge Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupUseAuthMock();
    setupServiceMocks();
  });

  it("renders daily challenge correctly", async () => {
    render(
      <MemoryRouter>
        <DailyChallenge />
      </MemoryRouter>
    );

    await screen.findByText("Test Challenge");

    expect(screen.getByText("Test Challenge")).toBeInTheDocument();
    expect(screen.getByText("Test Challenge Description")).toBeInTheDocument();
    expect(screen.getByText("Fitness")).toBeInTheDocument();
    expect(screen.getByText("easy")).toBeInTheDocument();
    expect(screen.getByAltText("daily challenge")).toHaveAttribute(
      "src",
      "https://via.placeholder.com/150"
    );
  });

  it("handles joining a challenge", async () => {
    setupUseAuthMock({ user: { uid: "123" }, isVerified: true });

    render(
      <MemoryRouter>
        <DailyChallenge />
      </MemoryRouter>
    );

    await screen.findByText("Test Challenge");

    const joinButton = screen.getByText("Join");
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(updateDailyChallengeStatusService).toHaveBeenCalledWith(
        "testUserId",
        expect.any(String),
        "in-progress"
      );
    });

    await waitFor(() => {
      expect(joinChallengeService).toHaveBeenCalledWith(
        "testUserId",
        expect.any(String),
        "daily",
        mockChallenge
      );
    });
  });

  it("handles completing a challenge", async () => {
    setupUseAuthMock({ user: { uid: "123" }, isVerified: true });

    (getOrAssignDailyChallengeService as jest.Mock).mockResolvedValue({
      ...mockChallenge,
      status: "in-progress",
    });

    render(
      <MemoryRouter>
        <DailyChallenge />
      </MemoryRouter>
    );

    await screen.findByText("Test Challenge");

    const completeButton = screen.getByText("Complete");
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(updateDailyChallengeStatusService).toHaveBeenCalledWith(
        "testUserId",
        expect.any(String),
        "completed"
      );
    });

    await waitFor(() => {
      expect(completeChallengeService).toHaveBeenCalledWith(
        "testUserId",
        expect.any(String)
      );
    });

    await waitFor(() => {
      expect(updateUserStatsService).toHaveBeenCalledWith("testUserId");
    });
  });
});
