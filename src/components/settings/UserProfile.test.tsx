import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useUserProfile } from "../../hooks/useUserProfile";
import UserProfile from "./UserProfile";

jest.mock("../../hooks/useUserProfile", () => ({
  useUserProfile: jest.fn(),
}));

jest.mock("../../firebase/firebase", () => ({
  auth: { currentUser: { uid: "testUserId" } },
}));

describe("UserProfile Component", () => {
  const mockUpdateUserProfile = jest.fn();
  const mockUploadProfilePicture = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: {
        name: "John Doe",
        email: "johndoe@example.com",
        bio: "This is a bio",
        profilePicture: "mockProfilePicture.jpg",
      },
      loading: false,
      updateUserProfile: mockUpdateUserProfile,
      uploadProfilePicture: mockUploadProfilePicture,
    });
  });

  it("renders the user profile form with initial values", () => {
    render(<UserProfile />);

    expect(screen.getByText("Update Your Profile")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("johndoe@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("This is a bio")).toBeInTheDocument();
    expect(screen.getByAltText("Profile")).toHaveAttribute(
      "src",
      "mockProfilePicture.jpg"
    );
  });

  it("submits the form and displays a success message", async () => {
    mockUpdateUserProfile.mockResolvedValueOnce(undefined);
    mockUploadProfilePicture.mockResolvedValueOnce(undefined);

    render(<UserProfile />);

    const nameInput = screen.getByLabelText(/name/i);
    const bioInput = screen.getByLabelText(/bio/i);
    const submitButton = screen.getByRole("button", {
      name: /update profile/i,
    });

    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
    fireEvent.change(bioInput, { target: { value: "Updated bio" } });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockUpdateUserProfile).toHaveBeenCalledWith({
        name: "Jane Doe",
        bio: "Updated bio",
      })
    );
    expect(
      screen.getByText("Profile updated successfully!")
    ).toBeInTheDocument();
  });

  it("displays an error message when the form submission fails", async () => {
    mockUpdateUserProfile.mockRejectedValueOnce(new Error("Update failed"));

    render(<UserProfile />);

    const submitButton = screen.getByRole("button", {
      name: /update profile/i,
    });

    fireEvent.click(submitButton);
    await screen.findByText("Error updating profile. Please try again.");
  });
});
