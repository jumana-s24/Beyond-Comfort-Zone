import { Challenge } from "../types";

export const mockChallengeData: Challenge[] = [
  {
    id: "1",
    title: "Challenge 1",
    description: "Description 1",
    category: "Category 1",
    difficulty: "easy",
    imageUrl: "http://example.com/image1.jpg",
    status: "not-started",
    onComplete: jest.fn(),
    onJoin: jest.fn(),
    createdAt: new Date(),
    assignedAt: new Date(),
    type: "",
  },
  {
    id: "2",
    title: "Challenge 2",
    description: "Description 2",
    category: "Category 2",
    difficulty: "medium",
    imageUrl: "http://example.com/image2.jpg",
    status: "not-started",
    onComplete: jest.fn(),
    onJoin: jest.fn(),
    createdAt: new Date(),
    assignedAt: new Date(),
    type: "",
  },
];
