import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SortingVisualizer } from "../SortingVisualizer";

describe("SortingVisualizer", () => {
  it("renders the component", () => {
    render(<SortingVisualizer />);
    expect(screen.getByText("Sorting Algorithms")).toBeInTheDocument();
  });
});
