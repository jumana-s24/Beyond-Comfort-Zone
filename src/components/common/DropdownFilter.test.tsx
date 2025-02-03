import { render, screen, fireEvent } from "@testing-library/react";
import DropdownFilter from "./DropdownFilter";

describe("DropdownFilter Component", () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dropdown with all options", () => {
    render(
      <DropdownFilter
        selectedDifficulty={null}
        onFilterChange={mockOnFilterChange}
      />
    );

    const dropdown = screen.getByRole("combobox");
    expect(dropdown).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4);
    expect(options.map((o) => o.textContent)).toEqual([
      "All",
      "Easy",
      "Medium",
      "Hard",
    ]);
  });

  it("selects the correct option based on selectedDifficulty prop", () => {
    render(
      <DropdownFilter
        selectedDifficulty="Medium"
        onFilterChange={mockOnFilterChange}
      />
    );

    const dropdown = screen.getByRole("combobox") as HTMLSelectElement;
    expect(dropdown.value).toBe("Medium");
  });

  it("calls onFilterChange with the correct value when an option is selected", () => {
    render(
      <DropdownFilter
        selectedDifficulty={null}
        onFilterChange={mockOnFilterChange}
      />
    );

    const dropdown = screen.getByRole("combobox");
    fireEvent.change(dropdown, { target: { value: "Easy" } });

    expect(mockOnFilterChange).toHaveBeenCalledWith("Easy");
  });
});
