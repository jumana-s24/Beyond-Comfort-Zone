import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import CustomChallengeList from "./CustomChallengeList";
import {
  getCustomChallengesService,
  updateCustomChallengeService,
} from "../../../services/customChallengesService";
import {
  joinChallengeService,
  completeChallengeService,
} from "../../../services/globalChallengeService";
import { updateUserStatsService } from "../../../services/statsService";

jest.mock("../../../firebase/firebase", () => ({
  auth: { currentUser: { uid: "testUserId" } },
}));

jest.mock("../../../services/customChallengesService", () => ({
  getCustomChallengesService: jest.fn(),
  deleteCustomChallengeService: jest.fn(),
  updateCustomChallengeService: jest.fn(),
}));

jest.mock("../../../services/globalChallengeService", () => ({
  joinChallengeService: jest.fn(),
  completeChallengeService: jest.fn(),
}));

jest.mock("../../../services/statsService", () => ({
  updateUserStatsService: jest.fn(),
}));

jest.mock("../../common/Spinner", () => ({
  Spinner: () => <div>Loading...</div>,
}));

jest.mock("./CustomChallengeModal", () => ({
  __esModule: true,
  default: ({
    onClose,
    handleOnSubmit,
  }: {
    onClose: () => void;
    handleOnSubmit: (data: { title: string }) => void;
  }) => (
    <div>
      <button onClick={onClose}>Close Modal</button>
      <button onClick={() => handleOnSubmit({ title: "New Challenge" })}>
        Submit Modal
      </button>
    </div>
  ),
}));

jest.mock("../global/ChallengeCard", () => ({
  __esModule: true,
  default: ({
    title,
    handleDelete,
    onComplete,
    onJoin,
  }: {
    title: string;
    handleDelete: () => void;
    onComplete: () => void;
    onJoin: () => void;
  }) => (
    <div>
      <h2>{title}</h2>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={onComplete}>Complete</button>
      <button onClick={onJoin}>Join</button>
    </div>
  ),
}));

jest.useFakeTimers();

describe("CustomChallengeList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the loading spinner initially", async () => {
    (getCustomChallengesService as jest.Mock).mockResolvedValue([]);
    render(<CustomChallengeList />);
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("renders the empty state when no challenges are found", async () => {
    (getCustomChallengesService as jest.Mock).mockResolvedValue([]);
    render(<CustomChallengeList />);
    await waitFor(() => {
      expect(
        screen.getByText("No custom challenges found.")
      ).toBeInTheDocument();
    });
  });

  it("filters challenges based on the search query with debounce", async () => {
    const mockChallenges = [
      { id: "1", title: "First Challenge", description: "Test description 1" },
      { id: "2", title: "Second Challenge", description: "Test description 2" },
    ];
    (getCustomChallengesService as jest.Mock).mockResolvedValue(mockChallenges);

    render(<CustomChallengeList />);

    await waitFor(() => {
      expect(screen.getByText("First Challenge")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Second Challenge")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search challenges...");
    fireEvent.change(searchInput, { target: { value: "second" } });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByText("Second Challenge")).toBeInTheDocument();
    });

    fireEvent.change(searchInput, { target: { value: "" } });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByText("First Challenge")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Second Challenge")).toBeInTheDocument();
    });
  });

  it("renders challenges when available", async () => {
    (getCustomChallengesService as jest.Mock).mockResolvedValue([
      { id: "1", title: "Test Challenge", status: "not_started" },
    ]);

    render(<CustomChallengeList />);
    await waitFor(() => {
      expect(screen.getByText("Test Challenge")).toBeInTheDocument();
    });
  });

  it("opens the modal to add a new challenge", async () => {
    (getCustomChallengesService as jest.Mock).mockResolvedValue([]);

    render(<CustomChallengeList />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("+ Add Custom Challenge"));

    await waitFor(() => {
      expect(screen.getByText("Close Modal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Submit Modal"));

    await waitFor(() => {
      expect(screen.getByText("New Challenge")).toBeInTheDocument();
    });
  });

  it("handles completing a challenge", async () => {
    (getCustomChallengesService as jest.Mock).mockResolvedValue([
      { id: "1", title: "Test Challenge", status: "not_started" },
    ]);
    (updateCustomChallengeService as jest.Mock).mockResolvedValue(undefined);
    (completeChallengeService as jest.Mock).mockResolvedValue(undefined);
    (updateUserStatsService as jest.Mock).mockResolvedValue(undefined);

    render(<CustomChallengeList />);
    await waitFor(() => {
      expect(screen.getByText("Test Challenge")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Complete"));
    await waitFor(() => {
      expect(completeChallengeService).toHaveBeenCalledWith("testUserId", "1");
    });
    await waitFor(() => {
      expect(updateUserStatsService).toHaveBeenCalled();
    });
  });

  it("handles joining a challenge", async () => {
    (getCustomChallengesService as jest.Mock).mockResolvedValue([
      { id: "1", title: "Test Challenge", status: "not_started" },
    ]);
    (updateCustomChallengeService as jest.Mock).mockResolvedValue(undefined);
    (joinChallengeService as jest.Mock).mockResolvedValue(undefined);

    render(<CustomChallengeList />);
    await waitFor(() => {
      expect(screen.getByText("Test Challenge")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Join"));
    await waitFor(() => {
      expect(joinChallengeService).toHaveBeenCalledWith(
        "testUserId",
        "1",
        "custom",
        expect.any(Object)
      );
    });
  });
});
