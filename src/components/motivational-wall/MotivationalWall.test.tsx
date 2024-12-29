import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MotivationalWall from "./MotivationalWall";
import {
  addQuoteService,
  deleteQuoteService,
  fetchUserQuotesService,
  fetchGlobalQuotesService,
  updateQuoteService,
} from "../../services/quoteService";
import { MouseEventHandler } from "react";

jest.mock("../../services/quoteService", () => ({
  fetchUserQuotesService: jest.fn(),
  fetchGlobalQuotesService: jest.fn(),
  addQuoteService: jest.fn(),
  deleteQuoteService: jest.fn(),
  updateQuoteService: jest.fn(),
}));

jest.mock("../../firebase/firebase", () => ({
  auth: {
    currentUser: { uid: "testUserId" },
  },
}));

jest.mock(
  "./QuoteModal",
  () =>
    (props: {
      onSubmit: (arg0: string, arg1: string, arg2: string) => void;
      onClose: MouseEventHandler<HTMLButtonElement> | undefined;
    }) =>
      (
        <div data-testid="quote-modal">
          <button
            onClick={() => props.onSubmit("New Quote", "#ffffff", "#000000")}
          >
            Submit
          </button>
          <button onClick={props.onClose}>Close</button>
        </div>
      )
);

describe("MotivationalWall Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (fetchUserQuotesService as jest.Mock).mockResolvedValue([
      { id: "1", text: "User Quote", bgColor: "#ffffff", fontColor: "#000000" },
    ]);
    (fetchGlobalQuotesService as jest.Mock).mockResolvedValue([
      {
        id: "2",
        text: "Global Quote",
        bgColor: "#ff0000",
        fontColor: "#ffffff",
      },
    ]);
  });

  it("renders motivational wall with fetched quotes", async () => {
    render(<MotivationalWall />);

    await waitFor(() => {
      expect(screen.getByText(/Motivational Wall/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("User Quote")).toBeInTheDocument();
    });
  });

  it("opens and closes the add quote modal", async () => {
    render(<MotivationalWall />);

    const addButton = await screen.findByText("+ Add Motivational Quote");
    fireEvent.click(addButton);

    expect(screen.getByTestId("quote-modal")).toBeInTheDocument();

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(screen.queryByTestId("quote-modal")).not.toBeInTheDocument();
  });

  it("adds a new quote", async () => {
    (addQuoteService as jest.Mock).mockResolvedValue(undefined);

    render(<MotivationalWall />);

    const addButton = await screen.findByText("+ Add Motivational Quote");
    fireEvent.click(addButton);

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addQuoteService).toHaveBeenCalledWith(
        "New Quote",
        "#ffffff",
        "#000000",
        "testUserId"
      );
    });

    await waitFor(() => {
      expect(screen.getByText("New Quote")).toBeInTheDocument();
    });
  });

  it("edits an existing user quote", async () => {
    (updateQuoteService as jest.Mock).mockResolvedValue(undefined);

    render(<MotivationalWall />);

    const userQuote = await screen.findByText("User Quote");
    fireEvent.click(userQuote);

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateQuoteService).toHaveBeenCalledWith("testUserId", "1", {
        text: "New Quote",
        bgColor: "#ffffff",
        fontColor: "#000000",
      });
    });
  });

  it("hides a global quote", async () => {
    render(<MotivationalWall />);

    const deleteButton = await screen.findAllByRole("button");
    fireEvent.click(deleteButton[1]);

    await waitFor(() => {
      expect(screen.queryByText("Global Quote")).not.toBeInTheDocument();
    });
  });

  it("deletes a user quote", async () => {
    (deleteQuoteService as jest.Mock).mockResolvedValue(undefined);

    render(<MotivationalWall />);

    const deleteButton = await screen.findAllByRole("button");
    fireEvent.click(deleteButton[1]);

    await waitFor(() => {
      expect(deleteQuoteService).toHaveBeenCalledWith("testUserId", "1");
    });
  });
});
