import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

jest.mock("../challenges/daily/DailyChallenge", () => () => (
  <div>Mock Daily Challenge Component</div>
));
jest.mock("./HeroSection", () => () => <div>Mock Hero Section Component</div>);

describe("Home Component", () => {
  it("renders the HeroSection and DailyChallenge components", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Mock Hero Section Component")).toBeInTheDocument();

    expect(
      screen.getByText("Mock Daily Challenge Component")
    ).toBeInTheDocument();
  });
});
