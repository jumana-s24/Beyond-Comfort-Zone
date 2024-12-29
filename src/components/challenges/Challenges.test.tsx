import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Challenges from "./Challenges";

jest.mock("./global/GlobalChallengesList", () => () => (
  <div>Global Challenges Component</div>
));

jest.mock("./custom/CustomChallengeList", () => () => (
  <div>Custom Challenges Component</div>
));

jest.mock("../routing/PrivateRoute", () => ({
  PrivateRoute: ({
    component: Component,
  }: {
    component: React.ComponentType;
  }) => <Component />,
}));

describe("Challenges Component", () => {
  it("redirects to Global Challenges when navigating to /challenges", () => {
    render(
      <MemoryRouter initialEntries={["/challenges"]}>
        <Routes>
          <Route path="challenges/*" element={<Challenges />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Global Challenges Component")).toBeInTheDocument();
  });

  it("renders the Global Challenges component when the route matches", () => {
    render(
      <MemoryRouter initialEntries={["/challenges/global-challenges"]}>
        <Routes>
          <Route path="challenges/*" element={<Challenges />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Global Challenges Component")).toBeInTheDocument();
  });

  it("renders the Custom Challenges component when the route matches", () => {
    render(
      <MemoryRouter initialEntries={["/challenges/custom-challenges"]}>
        <Routes>
          <Route path="challenges/*" element={<Challenges />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Custom Challenges Component")).toBeInTheDocument();
  });
});
