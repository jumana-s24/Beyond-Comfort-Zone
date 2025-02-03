import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HeroSection from "./HeroSection";

describe("HeroSection Component", () => {
  it("renders the hero section with title, description, button, and image", () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>
    );

    const title = screen.getByRole("heading", {
      name: /step outside your comfort zone/i,
    });
    expect(title).toBeInTheDocument();

    const description = screen.getByText(
      /turn small actions into life-changing habits\. embrace daily challenges that push your limits, track your streaks, and see how far you can grow\./i
    );
    expect(description).toBeInTheDocument();

    const button = screen.getByRole("link", {
      name: /start your first challenge/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/challenges/global-challenges");

    const image = screen.getByAltText("daily challenge");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/assets/heroSectionImage.png");
  });
});
