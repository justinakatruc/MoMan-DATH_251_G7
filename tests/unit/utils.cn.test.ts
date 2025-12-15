import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges classnames and resolves tailwind conflicts", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", false && "hidden", undefined, "text-sm")).toBe(
      "text-sm"
    );
  });

  it("supports conditional classes", () => {
    const isActive = true;
    expect(cn("base", isActive && "active")).toBe("base active");
  });
});
