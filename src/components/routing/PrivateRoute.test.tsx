import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { PrivateRoute } from "./PrivateRoute";

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Navigate: ({ to }: { to: string }) => <div>{`Redirecting to ${to}`}</div>,
}));

describe("PrivateRoute", () => {
  const MockComponent = () => <div>Private Content</div>;

  it("redirects to /verify-email when the user is logged in but not verified", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "testUserId" },
      loading: false,
      isVerified: false,
    });

    render(
      <MemoryRouter>
        <PrivateRoute component={MockComponent} />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Redirecting to /verify-email")
    ).toBeInTheDocument();
  });

  it("redirects to /auth when there is no user", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      isVerified: false,
    });

    render(
      <MemoryRouter>
        <PrivateRoute component={MockComponent} />
      </MemoryRouter>
    );

    expect(screen.getByText("Redirecting to /auth")).toBeInTheDocument();
  });

  it("renders the component when the user is logged in and verified", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "testUserId" },
      loading: false,
      isVerified: true,
    });

    render(
      <MemoryRouter>
        <PrivateRoute component={MockComponent} />
      </MemoryRouter>
    );

    expect(screen.getByText("Private Content")).toBeInTheDocument();
  });
});
