import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer Component", () => {
  it("renders the footer content", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const titleLink = screen.getByRole("link", { name: "Beyond Comfort Zone" });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute("href", "/");

    const copyrightText = screen.getByText(
      /© 2024 Beyond Comfort Zone. All rights reserved./i
    );
    expect(copyrightText).toBeInTheDocument();
  });
});
