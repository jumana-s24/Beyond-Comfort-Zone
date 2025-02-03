import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AccountDeleteModal } from "./AccountDeleteModal";
import AccountManagement from "./AccountManagement";

jest.mock("./AccountDeleteModal", () => ({
  AccountDeleteModal: jest.fn(() => (
    <div data-testid="account-delete-modal">Account Delete Modal</div>
  )),
}));

describe("AccountManagement Component", () => {
  it("renders AccountManagement correctly", () => {
    render(<AccountManagement />);

    expect(screen.getByText(/Account Management/i)).toBeInTheDocument();

    expect(
      screen.getByText(
        /If you delete your account, all your personal data and account information will be permanently removed./i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Delete Account/i })
    ).toBeInTheDocument();
  });

  it("closes the AccountDeleteModal when the onClose callback is called", async () => {
    const { rerender } = render(<AccountManagement />);

    let onCloseCallback: (() => void) | undefined;
    jest.mocked(AccountDeleteModal).mockImplementation(({ onClose }) => {
      onCloseCallback = onClose;
      return <div data-testid="account-delete-modal">Account Delete Modal</div>;
    });

    fireEvent.click(screen.getByRole("button", { name: /Delete Account/i }));

    expect(screen.getByTestId("account-delete-modal")).toBeInTheDocument();

    expect(screen.getByTestId("account-delete-modal")).toBeInTheDocument();

    await waitFor(async () => {
      if (onCloseCallback) {
        onCloseCallback();
      }
    });

    rerender(<AccountManagement />);

    expect(
      screen.queryByTestId("account-delete-modal")
    ).not.toBeInTheDocument();
  });
});
