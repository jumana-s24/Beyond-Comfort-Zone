import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Header from "./Header";
import { auth } from "../../firebase/firebase";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../firebase/firebase", () => ({
  auth: {
    signOut: jest.fn(),
  },
}));

describe("Header Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate,
    }));
  });

  it("renders navigation links when user is not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      signedInUserData: null,
      isVerified: false,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText("Beyond Comfort Zone")).toBeInTheDocument();
    expect(screen.getByText("Motivational Wall")).toBeInTheDocument();
    expect(screen.getByText("Growth Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Challenges")).toBeInTheDocument();
    expect(screen.getByText("Sign In / Sign Up")).toBeInTheDocument();
  });

  it("renders navigation links and user profile when user is authenticated and verified", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "123" },
      signedInUserData: { profilePicture: "profilePic.jpg" },
      isVerified: true,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText("Beyond Comfort Zone")).toBeInTheDocument();
    expect(screen.getByText("Motivational Wall")).toBeInTheDocument();
    expect(screen.getByText("Growth Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Challenges")).toBeInTheDocument();

    const profileImage = screen.getByAltText("User");
    expect(profileImage).toHaveAttribute("src", "profilePic.jpg");
  });

  it("toggles user dropdown menu when profile image is clicked", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "123" },
      signedInUserData: { profilePicture: "profilePic.jpg" },
      isVerified: true,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const profileImage = screen.getByAltText("User");
    fireEvent.click(profileImage);

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("signs out user when 'Sign out' is clicked", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "123" },
      signedInUserData: { profilePicture: "profilePic.jpg" },
      isVerified: true,
    });

    (auth.signOut as jest.Mock).mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const profileImage = screen.getByAltText("User");
    fireEvent.click(profileImage);
    const signOutButton = screen.getByText("Sign out");
    fireEvent.click(signOutButton);
    await screen.findByAltText("User");

    expect(auth.signOut).toHaveBeenCalledTimes(1);
  });

  it("toggles mobile dropdown menu when menu button is clicked", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      signedInUserData: null,
      isVerified: false,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const menuButton = screen.getByLabelText("Toggle Menu");
    fireEvent.click(menuButton);

    const dropdown = screen.getByRole("menu", { hidden: true });

    const signInLink = within(dropdown).getByText("Sign In / Sign Up");
    expect(signInLink).toBeInTheDocument();
  });
});
