import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CustomChallengeModal from "./CustomChallengeModal";
import {
  uploadImageToStorage,
  addCustomChallengeService,
} from "../../../services/customChallengesService";

jest.mock("../../../services/customChallengesService", () => ({
  uploadImageToStorage: jest.fn(),
  addCustomChallengeService: jest.fn(),
}));

jest.mock("../../../firebase/firebase", () => ({
  auth: {
    currentUser: { uid: "testUserId" },
  },
}));

jest.mock("../../common/Modal", () => ({
  __esModule: true,
  default: ({
    children,
    title,
    onClose,
  }: {
    children: React.ReactNode;
    title: string;
    onClose: () => void;
  }) => (
    <div data-testid="modal">
      <h1>{title}</h1>
      <button onClick={onClose} data-testid="close-button">
        Close
      </button>
      {children}
    </div>
  ),
}));

describe("CustomChallengeModal Component", () => {
  const mockOnClose = jest.fn();
  const mockHandleOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the modal with default values", () => {
    render(
      <CustomChallengeModal
        onClose={mockOnClose}
        handleOnSubmit={mockHandleOnSubmit}
        isCustomChallenge={true}
      />
    );

    expect(screen.getByText("Add Custom Challenge")).toBeInTheDocument();
    expect(screen.getByAltText("challenge preview")).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(
      <CustomChallengeModal
        onClose={mockOnClose}
        handleOnSubmit={mockHandleOnSubmit}
        isCustomChallenge={true}
      />
    );

    fireEvent.click(screen.getByText("Save Challenge"));

    await waitFor(() => {
      expect(screen.getByText("The title is required.")).toBeInTheDocument();
      expect(
        screen.getByText("The description is required.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("The difficulty is required.")
      ).toBeInTheDocument();
      expect(screen.getByText("The category is required.")).toBeInTheDocument();
    });
  });

  it("fills the form with initial data", () => {
    const initialData = {
      title: "Initial Title",
      description: "Initial Description",
      category: "physical",
      difficulty: "medium" as "medium",
      imageUrl: "initial-image-url",
    };

    render(
      <CustomChallengeModal
        onClose={mockOnClose}
        handleOnSubmit={mockHandleOnSubmit}
        isCustomChallenge={true}
        initialData={initialData}
      />
    );

    expect(screen.getByDisplayValue("Initial Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Initial Description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Medium")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Physical")).toBeInTheDocument();
    expect(screen.getByAltText("challenge preview")).toHaveAttribute(
      "src",
      "initial-image-url"
    );
  });

  it("submits valid data and closes the modal", async () => {
    (uploadImageToStorage as jest.Mock).mockResolvedValue("uploaded-image-url");
    (addCustomChallengeService as jest.Mock).mockResolvedValue({
      id: "newChallengeId",
    });

    render(
      <CustomChallengeModal
        onClose={mockOnClose}
        handleOnSubmit={mockHandleOnSubmit}
        isCustomChallenge={false}
      />
    );

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Test Challenge" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText(/Difficulty/i), {
      target: { value: "easy" },
    });
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: "mental" },
    });

    fireEvent.click(screen.getByText("Save Challenge"));

    await waitFor(() => {
      expect(addCustomChallengeService).toHaveBeenCalledWith(
        "testUserId",
        expect.any(Object)
      );
      expect(mockHandleOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Test Challenge" })
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
