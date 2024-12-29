import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

jest.mock("./components/home-page/Home", () => () => <div>Home Component</div>);
jest.mock("./components/auth/AuthForm", () => () => (
  <div>AuthForm Component</div>
));
jest.mock("./components/auth/VerifyEmailPage", () => () => (
  <div>VerifyEmailPage Component</div>
));
jest.mock("./components/settings/Settings", () => () => (
  <div>Settings Component</div>
));
jest.mock("./components/challenges/Challenges", () => () => (
  <div>Challenges Component</div>
));
jest.mock("./components/dashboard/Dashboard", () => () => (
  <div>Dashboard Component</div>
));
jest.mock("./components/motivational-wall/MotivationalWall", () => () => (
  <div>MotivationalWall Component</div>
));
jest.mock("./components/layout/Header", () => () => (
  <div>Header Component</div>
));
jest.mock("./components/layout/Footer", () => () => (
  <div>Footer Component</div>
));
jest.mock("./contexts/AuthProvider", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
jest.mock("./components/routing/PrivateRoute", () => ({
  PrivateRoute: ({ component }: { component: React.ComponentType }) => {
    const Component = component;
    return <Component />;
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("App Component", () => {
  it("renders Home component for root path", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Home Component")).toBeInTheDocument();
  });

  it("renders AuthForm component for /auth path", () => {
    render(
      <MemoryRouter initialEntries={["/auth"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("AuthForm Component")).toBeInTheDocument();
  });

  it("renders VerifyEmailPage component for /verify-email path", () => {
    render(
      <MemoryRouter initialEntries={["/verify-email"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("VerifyEmailPage Component")).toBeInTheDocument();
  });

  it("renders PrivateRoute with Settings component for /settings path", () => {
    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Settings Component")).toBeInTheDocument();
  });

  it("renders PrivateRoute with Dashboard component for /dashboard path", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Dashboard Component")).toBeInTheDocument();
  });

  it("renders Challenges component for /challenges path", () => {
    render(
      <MemoryRouter initialEntries={["/challenges"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Challenges Component")).toBeInTheDocument();
  });

  it("renders MotivationalWall component for /motivational-wall path", () => {
    render(
      <MemoryRouter initialEntries={["/motivational-wall"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("MotivationalWall Component")).toBeInTheDocument();
  });

  it("renders Header and Footer components on all routes", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Header Component")).toBeInTheDocument();
    expect(screen.getByText("Footer Component")).toBeInTheDocument();
  });
});
