import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Chatbot } from "../Chatbot";
import * as gemini from "@/lib/gemini";

describe("Chatbot", () => {
  it("renders the chatbot interface", () => {
    render(<Chatbot />);
    expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("sends a message and displays the bot's response", async () => {
    const mockSendMessage = vi.spyOn(gemini, "sendMessageToAI").mockResolvedValue("Hello, how can I help you?");
    render(<Chatbot />);
    const input = screen.getByPlaceholderText("Type your message...");
    const button = screen.getByRole("button");

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(button);

    expect(screen.getByText("Hello")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Hello, how can I help you?")).toBeInTheDocument();
    });

    mockSendMessage.mockRestore();
  });
});
