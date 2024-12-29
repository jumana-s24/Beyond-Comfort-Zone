import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import VerifyEmailPage from "./VerifyEmailPage";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("firebase/auth", () => ({
  sendEmailVerification: jest.fn(),
}));

jest.mock("../../firebase/firebase", () => ({
  auth: {
    currentUser: { email: "test@example.com" },
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("VerifyEmailPage Component", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(
      <MemoryRouter>
        <VerifyEmailPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Verify Your Email/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/A verification email has been sent to your inbox/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Resend Verification Email/i })
    ).toBeInTheDocument();
  });

  it("sends verification email on button click", async () => {
    (sendEmailVerification as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <VerifyEmailPage />
      </MemoryRouter>
    );

    const resendButton = screen.getByRole("button", {
      name: /Resend Verification Email/i,
    });
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Verification Email Sent/i })
      ).toBeInTheDocument();
    });

    expect(resendButton).toBeDisabled();
    expect(sendEmailVerification).toHaveBeenCalledWith(auth.currentUser);
  });

  it("displays error if too many requests are made", async () => {
    (sendEmailVerification as jest.Mock).mockRejectedValueOnce({
      code: "auth/too-many-requests",
    });

    render(
      <MemoryRouter>
        <VerifyEmailPage />
      </MemoryRouter>
    );

    const resendButton = screen.getByRole("button", {
      name: /Resend Verification Email/i,
    });
    fireEvent.click(resendButton);

    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Too many requests. Please wait and try again later."
      );
    });

    alertSpy.mockRestore();
  });
});
