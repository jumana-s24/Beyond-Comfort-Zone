import React from "react";
import { render, screen } from "@testing-library/react";
import ChallengeBreakdown from "./ChallengeBreakdown";

jest.mock("recharts", () => ({
  __esModule: true,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie">{children}</div>
  ),
  Cell: ({ fill }: { fill: string }) => (
    <div data-testid="cell" style={{ fill }}></div>
  ),
  Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
}));

describe("ChallengeBreakdown Component", () => {
  const mockData: {
    name: string;
    value: number;
  }[] = [
    { name: "Physical", value: 10 },
    { name: "Mental", value: 20 },
    { name: "Lifestyle", value: 30 },
    { name: "Social", value: 40 },
  ];

  it("renders the component with correct title", () => {
    render(<ChallengeBreakdown data={mockData} />);
    expect(screen.getByText("Challenge Breakdown")).toBeInTheDocument();
  });

  it("renders the PieChart component", () => {
    render(<ChallengeBreakdown data={mockData} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renders the Pie component with correct data", () => {
    render(<ChallengeBreakdown data={mockData} />);
    expect(screen.getByTestId("pie")).toBeInTheDocument();
    expect(screen.getAllByTestId("cell")).toHaveLength(mockData.length);
  });

  it("renders cells with correct colors", () => {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    render(<ChallengeBreakdown data={mockData} />);

    const cells = screen.getAllByTestId("cell");
    cells.forEach((cell, index) => {
      expect(cell).toHaveStyle(`fill: ${COLORS[index % COLORS.length]}`);
    });
  });

  it("renders the Tooltip component", () => {
    render(<ChallengeBreakdown data={mockData} />);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });
});
