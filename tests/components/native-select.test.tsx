import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/app/components/ui/native-select";

describe("NativeSelect", () => {
  it("renders a select and options", () => {
    render(
      <NativeSelect aria-label="Type">
        <NativeSelectOption value="income">Income</NativeSelectOption>
        <NativeSelectOption value="expense">Expense</NativeSelectOption>
      </NativeSelect>
    );

    const select = screen.getByLabelText("Type");
    expect(select.tagName.toLowerCase()).toBe("select");
    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("Expense")).toBeInTheDocument();
  });

  it("allows changing value", async () => {
    const user = userEvent.setup();

    render(
      <NativeSelect aria-label="Type" defaultValue="income">
        <NativeSelectOption value="income">Income</NativeSelectOption>
        <NativeSelectOption value="expense">Expense</NativeSelectOption>
      </NativeSelect>
    );

    const select = screen.getByLabelText("Type") as HTMLSelectElement;
    expect(select.value).toBe("income");

    await user.selectOptions(select, "expense");
    expect(select.value).toBe("expense");
  });
});
