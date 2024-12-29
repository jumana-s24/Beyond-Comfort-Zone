import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Settings from "./Settings";

jest.mock("./UserProfile", () => ({
  __esModule: true,
  default: () => <div>User Profile Component</div>,
}));

jest.mock("./AccountManagement", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="account-management-page">
      Account Management Component
    </div>
  ),
}));

describe("Settings Component", () => {
  it("redirects to User Profile component when navigating to /settings", () => {
    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <Routes>
          <Route path="settings/*" element={<Settings />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("User Profile Component")).toBeInTheDocument();
  });

  it("renders the User Profile component when the route matches", () => {
    render(
      <MemoryRouter initialEntries={["/settings/user-profile"]}>
        <Routes>
          <Route path="/settings/*" element={<Settings />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("User Profile Component")).toBeInTheDocument();
  });

  it("renders the Account Management component when the route matches", () => {
    render(
      <MemoryRouter initialEntries={["/settings/account-management"]}>
        <Routes>
          <Route path="/settings/*" element={<Settings />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("account-management-page")).toBeInTheDocument();
  });
});
