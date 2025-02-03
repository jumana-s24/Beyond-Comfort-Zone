import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  signInUserService,
  signUpUserService,
} from "../../services/authService";
import AuthForm from "./AuthForm";
import { sendEmailVerification } from "firebase/auth";

const mockNavigate = jest.fn();

jest.mock("../../services/authService", () => ({
  signInUserService: jest.fn(),
  signUpUserService: jest.fn(),
}));

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../firebase/firebase", () => ({
  auth: {
    signOut: jest.fn(),
  },
}));

jest.mock("firebase/auth", () => ({
  ...jest.requireActual("firebase/auth"),
  sendEmailVerification: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("AuthForm Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      setIsVerified: jest.fn(),
    });
  });

  it("renders sign-in form by default", () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Sign In/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /Forgot Password/i })
    ).toBeInTheDocument();
  });

  it("toggles between sign-in and sign-up forms", () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    expect(
      screen.getByRole("heading", { name: /Sign Up/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign Up/i })
    ).toBeInTheDocument();

    // Check the name input field is now visible
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  });

  it("submits sign-in form successfully", async () => {
    (signInUserService as jest.Mock).mockResolvedValue({
      emailVerified: true,
    });

    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "TestPassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(signInUserService).toHaveBeenCalledWith(
        "test@example.com",
        "TestPassword"
      );
    });
  });

  it("displays error if the email is not verified", async () => {
    (signInUserService as jest.Mock).mockResolvedValue({
      emailVerified: false,
    });

    (sendEmailVerification as jest.Mock).mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "unverified@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "TestPassword1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          /Your email is not verified. Please check your inbox and verify your email./i
        )
      ).toBeInTheDocument();
    });

    expect(sendEmailVerification).toHaveBeenCalledTimes(1);
  });

  it("submits sign-up form successfully", async () => {
    (signUpUserService as jest.Mock).mockResolvedValue({});

    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "TestPassword1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(signUpUserService).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "TestPassword1!",
      });
    });
  });

  it("displays validation errors when fields are empty", async () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/emailIsRequired/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/passwordIsRequired/i)).toBeInTheDocument();
    });
  });
});
