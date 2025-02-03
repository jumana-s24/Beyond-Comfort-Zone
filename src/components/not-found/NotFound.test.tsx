import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound Component", () => {
  it("renders component with correct texts", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The page you’re looking for doesn’t exist or has been moved."
      )
    ).toBeInTheDocument();
  });

  it("renders the Go Home button with correct link", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const goHomeLink = screen.getByText("Go Home");
    expect(goHomeLink).toBeInTheDocument();
    expect(goHomeLink).toHaveAttribute("href", "/");
  });
});
