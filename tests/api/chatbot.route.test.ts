/** @jest-environment node */

import { POST } from "@/app/api/chatbot/route";

// Mock transactionAPI used in chatbot route
jest.mock("@/lib/api", () => ({
  transactionAPI: {
    getAllTransactions: jest.fn().mockResolvedValue([
      { id: "tx1", amount: 100, type: "expense", name: "Coffee", date: "2025-12-01", categoryId: "cat1" },
      { id: "tx2", amount: 200, type: "income", name: "Salary", date: "2025-12-02", categoryId: "cat2" },
    ]),
  },
}));

describe("UC-09: AI-Assisted Report via Chatbot", () => {
  it("should return a summarized report for a natural language query", async () => {
    const req = new Request("http://localhost/api/chatbot", {
      method: "POST",
      body: JSON.stringify({
        message: "Show my expenses from last month",
        authToken: "valid-token",
      }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.reply).toMatch(/\d+/); // Should mention a number (amount)
    // Accept Vietnamese or English keywords for category/type
    expect(body.reply).toMatch(/Food|Drink|Coffee|Salary|expense|income|cà phê|chi|thu|lương|khoản chi|khoản thu/i); // Should mention category or type
  });

  it("should return an error if AI processing fails", async () => {
    // Simulate missing token
    const req = new Request("http://localhost/api/chatbot", {
      method: "POST",
      body: JSON.stringify({ message: "Show my expenses" }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(401);
    expect(body.error).toMatch(/token/i);
  });
});
