import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import JoinCommunity from "./JoinCommunity";

describe("JoinCommunity Component", () => {
  it("renders the section title", () => {
    render(
      <MemoryRouter>
        <JoinCommunity />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Start Your Journey to Growth Today")
    ).toBeInTheDocument();
  });

  it("renders the description paragraph", () => {
    render(
      <MemoryRouter>
        <JoinCommunity />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Every big change starts with a single step/i)
    ).toBeInTheDocument();
  });

  it("renders the call-to-action link with correctly", () => {
    render(
      <MemoryRouter>
        <JoinCommunity />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", {
      name: /start your first challenge/i,
    });
    expect(link).toBeInTheDocument();
  });

  it("ensures the link navigates to the correct page", () => {
    render(
      <MemoryRouter>
        <JoinCommunity />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", {
      name: /start your first challenge/i,
    });
    expect(link).toHaveAttribute("href", "/challenges/global-challenges");
  });
});
