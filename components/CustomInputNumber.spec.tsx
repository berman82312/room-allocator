import { describe, test, expect, afterEach, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomInputNumber } from "./CustomInputNumber";

describe("CustomInputNumber", () => {
  afterEach(() => {
    cleanup();
  });

  test("Feat: render correctly", async () => {
    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={"test"}
        value={1}
        disabled={false}
        onChange={() => {}}
        onBlur={() => {}}
      />
    );

    const input = await screen.findByTestId<HTMLInputElement>(
      "custom-number-input"
    );
    expect(input.value).toBe("1");
  });

  test("Feat: click add button", async () => {
    const user = userEvent.setup();
    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={"test"}
        value={1}
        disabled={false}
        onChange={() => {}}
        onBlur={() => {}}
      />
    );

    const addButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-add-button"
    );

    await user.click(addButton);

    const input = screen.getByTestId<HTMLInputElement>("custom-number-input");
    expect(input.value).toBe("2");
  });

  test("Feat: click minus button", async () => {
    const user = userEvent.setup();
    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={"test"}
        value={16}
        disabled={false}
        onChange={() => {}}
        onBlur={() => {}}
      />
    );

    const minusButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-minus-button"
    );

    await user.click(minusButton);

    const input = screen.getByTestId<HTMLInputElement>("custom-number-input");
    expect(input.value).toBe("15");
  });

  test("Feat: step", async () => {
    const user = userEvent.setup();
    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={2}
        name={"test"}
        value={13}
        disabled={false}
        onChange={() => {}}
        onBlur={() => {}}
      />
    );

    const addButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-add-button"
    );

    await user.click(addButton);

    const input = screen.getByTestId<HTMLInputElement>("custom-number-input");
    expect(input.value).toBe("15");

    await user.click(addButton);
    expect(input.value).toBe("16");

    const minusButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-minus-button"
    );

    await user.click(minusButton);
    expect(input.value).toBe("14");

    await user.click(minusButton); // 12
    await user.click(minusButton); // 10
    await user.click(minusButton); // 8
    await user.click(minusButton); // 6
    await user.click(minusButton); // 4
    await user.click(minusButton); // 2
    await user.click(minusButton);
    expect(input.value).toBe("1");
  });

  test("Feat: cannot add over max", async () => {
    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={"test"}
        value={16}
        disabled={false}
        onChange={() => {}}
        onBlur={() => {}}
      />
    );

    const addButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-add-button"
    );

    fireEvent.mouseDown(addButton);
    fireEvent.mouseUp(addButton);

    const input = screen.getByTestId<HTMLInputElement>("custom-number-input");
    expect(input.value).toBe("16");
  });

  test("Feat: cannot minus over min", async () => {
    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={"test"}
        value={1}
        disabled={false}
        onChange={() => {}}
        onBlur={() => {}}
      />
    );

    const minusButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-minus-button"
    );

    fireEvent.mouseDown(minusButton);
    fireEvent.mouseUp(minusButton);

    const input = screen.getByTestId<HTMLInputElement>("custom-number-input");
    expect(input.value).toBe("1");
  });

  test("Feat: fire onchange when click on button", async () => {
    const onChange = vi.fn();
    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={"test"}
        value={16}
        disabled={false}
        onChange={onChange}
        onBlur={() => {}}
      />
    );

    const minusButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-minus-button"
    );

    fireEvent.mouseDown(minusButton);
    fireEvent.mouseUp(minusButton);

    expect(onChange).toHaveBeenCalledOnce();
  });

  test("Feat: long press on minus button", async () => {
    const onChange = vi.fn();

    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={"test"}
        value={16}
        disabled={false}
        onChange={onChange}
        onBlur={() => {}}
      />
    );

    const minusButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-minus-button"
    );

    vi.useFakeTimers();

    fireEvent.mouseDown(minusButton);

    vi.advanceTimersByTime(600); // 500 + 78, two more steps

    fireEvent.mouseUp(minusButton);

    expect(onChange).toHaveBeenCalledOnce();

    vi.useRealTimers();

    const input = screen.getByTestId<HTMLInputElement>("custom-number-input");

    expect(input.value).toBe("13");
  });

  test("Feat: long press on add button", async () => {
    const onChange = vi.fn();

    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={"test"}
        value={1}
        disabled={false}
        onChange={onChange}
        onBlur={() => {}}
      />
    );

    const addButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-add-button"
    );

    vi.useFakeTimers();

    fireEvent.mouseDown(addButton);

    vi.advanceTimersByTime(600); // 500 + 78, two more steps

    fireEvent.mouseUp(addButton);

    expect(onChange).toHaveBeenCalledOnce();

    vi.useRealTimers();

    const input = screen.getByTestId<HTMLInputElement>("custom-number-input");

    expect(input.value).toBe("4");
  });

  test("Feat: long press on add to max", async () => {
    const onChange = vi.fn();

    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={"test"}
        value={14}
        disabled={false}
        onChange={onChange}
        onBlur={() => {}}
      />
    );

    const addButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-add-button"
    );

    vi.useFakeTimers();

    fireEvent.mouseDown(addButton);

    vi.advanceTimersByTime(600); // 500 + 78, two more steps

    fireEvent.mouseUp(addButton);

    expect(onChange).toHaveBeenCalledOnce();

    vi.useRealTimers();

    const input = screen.getByTestId<HTMLInputElement>("custom-number-input");

    expect(input.value).toBe("16");
  });

  test("Feat: long press on minus to min", async () => {
    const onChange = vi.fn();

    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={"test"}
        value={3}
        disabled={false}
        onChange={onChange}
        onBlur={() => {}}
      />
    );

    const minusButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-minus-button"
    );

    vi.useFakeTimers();

    fireEvent.mouseDown(minusButton);

    vi.advanceTimersByTime(600); // 500 + 78, two more steps

    fireEvent.mouseUp(minusButton);

    expect(onChange).toHaveBeenCalledOnce();

    vi.useRealTimers();

    const input = screen.getByTestId<HTMLInputElement>("custom-number-input");

    expect(input.value).toBe("1");
  });

  test("Feat: minus button is disabled on min", async () => {
    const onChange = vi.fn();

    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={"test"}
        value={1}
        disabled={false}
        onChange={onChange}
        onBlur={() => {}}
      />
    );

    const minusButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-minus-button"
    );
    const addButton = screen.getByTestId<HTMLButtonElement>(
      "custom-number-add-button"
    );

    expect(minusButton.disabled).toBeTruthy();
    expect(addButton.disabled).toBeFalsy();
  });

  test("Feat: add button is disabled on max", async () => {
    const onChange = vi.fn();

    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={"test"}
        value={16}
        disabled={false}
        onChange={onChange}
        onBlur={() => {}}
      />
    );

    const addButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-add-button"
    );
    const minusButton = screen.getByTestId<HTMLButtonElement>(
      "custom-number-minus-button"
    );

    expect(minusButton.disabled).toBeFalsy();
    expect(addButton.disabled).toBeTruthy();
  });

  test("Feat: onBlur is called when blur event occurred in the component", async () => {
    const onBlur = vi.fn();

    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={"test"}
        value={16}
        disabled={false}
        onChange={() => {}}
        onBlur={onBlur}
      />
    );

    const addButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-add-button"
    );
    const minusButton = screen.getByTestId<HTMLButtonElement>(
      "custom-number-minus-button"
    );
    const input = screen.getByTestId<HTMLInputElement>("custom-number-input");

    fireEvent.blur(addButton);
    fireEvent.blur(minusButton);
    fireEvent.blur(input);

    expect(onBlur).toHaveBeenCalledTimes(3);
  });

  test("Feat: disabled state cannot do add nor minus", async () => {
    render(
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={"test"}
        value={1}
        disabled={true}
        onChange={() => {}}
        onBlur={() => {}}
      />
    );

    const addButton = await screen.findByTestId<HTMLButtonElement>(
      "custom-number-add-button"
    );
    expect(addButton.disabled).toBeTruthy();

    fireEvent.mouseDown(addButton);
    fireEvent.mouseUp(addButton);

    const input = screen.getByTestId<HTMLInputElement>("custom-number-input");

    expect(input.value).toBe("1");
  });
});
