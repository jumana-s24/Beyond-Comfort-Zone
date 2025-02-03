import { render, screen } from "@testing-library/react";
import TotalChallenges from "./TotalChallenges";

jest.mock("react-countup", () => ({
  __esModule: true,
  default: ({ end }: { end: number }) => <span>{end}</span>,
}));

describe("TotalChallenges Component", () => {
  it("renders the component with correct title", () => {
    render(<TotalChallenges totalChallenges={0} />);
    expect(screen.getByText("Total Challenges Completed")).toBeInTheDocument();
  });

  it("displays the correct totalChallenges count", () => {
    const totalChallenges = 42;
    render(<TotalChallenges totalChallenges={totalChallenges} />);
    expect(screen.getByText(totalChallenges.toString())).toBeInTheDocument();
  });
});
