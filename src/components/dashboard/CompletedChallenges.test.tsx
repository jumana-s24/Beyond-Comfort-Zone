import { render, screen } from "@testing-library/react";
import CompletedChallenges from "./CompletedChallenges";
import { Challenge } from "../../types";
import { mockChallengeData } from "../../mock-data";

jest.mock("../challenges/global/ChallengeCard", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe("CompletedChallenges Component", () => {
  const mockData = mockChallengeData.map((challenge) => ({
    ...challenge,
    status: "completed" as Challenge["status"],
  }));

  it("renders the component with correct title", () => {
    render(<CompletedChallenges data={mockData} />);
    expect(screen.getByText("Completed Challenges")).toBeInTheDocument();
  });

  it("renders a message when no completed challenges are found", () => {
    render(<CompletedChallenges data={[]} />);
    expect(
      screen.getByText("No completed challenges found.")
    ).toBeInTheDocument();
  });

  it("renders a list of completed challenges", () => {
    render(<CompletedChallenges data={mockData} />);
    mockData.forEach((challenge) => {
      expect(screen.getByText(challenge.title)).toBeInTheDocument();
    });
  });
});
