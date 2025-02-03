import { render, screen, fireEvent } from "@testing-library/react";
import QuoteModal from "./QuoteModal";

jest.mock("../common/Modal", () => ({
  __esModule: true,
  default: ({
    children,
    title,
    onClose,
  }: {
    children: React.ReactNode;
    title: string;
    onClose: () => void;
  }) => (
    <div data-testid="modal">
      <h1>{title}</h1>
      <button onClick={onClose} data-testid="close-button">
        Close
      </button>
      {children}
    </div>
  ),
}));

describe("QuoteModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with default values", () => {
    render(<QuoteModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    expect(screen.getByText(/Add Motivational Quote/i)).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Type your motivational quote.../i)
    ).toBeInTheDocument();

    expect(screen.getByDisplayValue("#c2d4f0")).toBeInTheDocument(); // Background color
    expect(screen.getByDisplayValue("#ffffff")).toBeInTheDocument(); // Font color
  });

  it("handles input changes", () => {
    render(<QuoteModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const textarea = screen.getByPlaceholderText(
      /Type your motivational quote.../i
    );
    const bgColorPicker = screen.getByDisplayValue("#c2d4f0");
    const fontColorPicker = screen.getByDisplayValue("#ffffff");

    fireEvent.change(textarea, { target: { value: "New Quote" } });
    expect(textarea).toHaveValue("New Quote");

    fireEvent.change(bgColorPicker, { target: { value: "#123456" } });
    expect(bgColorPicker).toHaveValue("#123456");

    fireEvent.change(fontColorPicker, { target: { value: "#654321" } });
    expect(fontColorPicker).toHaveValue("#654321");
  });

  it("calls onSubmit with correct values", () => {
    render(<QuoteModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const textarea = screen.getByPlaceholderText(
      /Type your motivational quote.../i
    );
    const bgColorPicker = screen.getByDisplayValue("#c2d4f0");
    const fontColorPicker = screen.getByDisplayValue("#ffffff");
    const addButton = screen.getByText(/Add Quote/i);

    fireEvent.change(textarea, { target: { value: "New Quote" } });
    fireEvent.change(bgColorPicker, { target: { value: "#123456" } });
    fireEvent.change(fontColorPicker, { target: { value: "#654321" } });

    fireEvent.click(addButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      "New Quote",
      "#123456",
      "#654321"
    );
  });

  it("does not call onSubmit if text is empty", () => {
    render(<QuoteModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const addButton = screen.getByText(/Add Quote/i);

    fireEvent.click(addButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onClose when cancel button is clicked", () => {
    render(<QuoteModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const cancelButton = screen.getByText(/Cancel/i);

    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when close button in modal is clicked", () => {
    render(<QuoteModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const closeButton = screen.getByTestId("close-button");

    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
