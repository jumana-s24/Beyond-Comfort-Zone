import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { deleteUserAccountService } from "../../services/userService";
import { AccountDeleteModal } from "./AccountDeleteModal";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../services/userService", () => ({
  deleteUserAccountService: jest.fn(),
}));

describe("AccountDeleteModal Component", () => {
  const mockOnClose = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("renders the modal with correctly", () => {
    render(<AccountDeleteModal onClose={mockOnClose} />);

    expect(
      screen.getByText("Are you sure you want to delete your account?")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "To delete your account, please enter your password. This action cannot be undone."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Delete/i })).toBeInTheDocument();
  });

  it("calls onClose function when Cancel is clicked", () => {
    render(<AccountDeleteModal onClose={mockOnClose} />);

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("displays error message when delete fails", async () => {
    (deleteUserAccountService as jest.Mock).mockRejectedValue(
      new Error("Delete failed")
    );

    render(<AccountDeleteModal onClose={mockOnClose} />);

    const passwordInput = screen.getByLabelText(/password/i);
    const deleteButton = screen.getByRole("button", { name: /Delete/i });

    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to delete the account. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("calls deleteUserAccountService and navigates to homepage on successfully deleted account", async () => {
    (deleteUserAccountService as jest.Mock).mockResolvedValue(undefined);

    render(<AccountDeleteModal onClose={mockOnClose} />);

    const passwordInput = screen.getByLabelText(/password/i);
    const deleteButton = screen.getByRole("button", { name: /Delete/i });

    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteUserAccountService).toHaveBeenCalledWith("testpassword");
    });
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
