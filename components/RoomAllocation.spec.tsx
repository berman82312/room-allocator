import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import RoomAllocation from "./RoomAllocation";
import userEvent from "@testing-library/user-event";

describe("RoomAllocation", () => {
  test("Feat: render correctly", async () => {
    render(
      <RoomAllocation
        guest={{ adult: 2, child: 4 }}
        rooms={[
          { roomPrice: 0, adultPrice: 1000, childPrice: 300, capacity: 5 },
          { roomPrice: 150, adultPrice: 500, childPrice: 20, capacity: 5 },
          { roomPrice: 1000, adultPrice: 100, childPrice: 10, capacity: 6 },
        ]}
        onChange={vi.fn()}
        onBlur={vi.fn()}
      />
    );

    const addButtons = await screen.findAllByTestId<HTMLButtonElement>(
      "custom-number-add-button"
    );
    const leftGuestAlert = screen.queryByTestId("left-guest-alert");
    const minusButtons = screen.getAllByTestId<HTMLButtonElement>(
      "custom-number-minus-button"
    );

    expect(addButtons.length).toBe(6);
    expect(minusButtons.length).toBe(6);

    expect(addButtons[0].disabled).toBeTruthy();
    expect(addButtons[1].disabled).toBeTruthy();
    expect(addButtons[2].disabled).toBeTruthy();
    expect(addButtons[3].disabled).toBeTruthy();
    expect(addButtons[4].disabled).toBeTruthy();
    expect(addButtons[5].disabled).toBeTruthy();

    expect(minusButtons[0].disabled).toBeTruthy();
    expect(minusButtons[1].disabled).toBeTruthy();
    expect(minusButtons[2].disabled).toBeTruthy();
    expect(minusButtons[3].disabled).toBeTruthy();
    expect(minusButtons[4].disabled).toBeFalsy();
    expect(minusButtons[5].disabled).toBeFalsy();

    expect(leftGuestAlert).toBeNull();
  });

  test("Feat: button work as expected", async () => {
    render(
      <RoomAllocation
        guest={{ adult: 2, child: 4 }}
        rooms={[
          { roomPrice: 0, adultPrice: 1000, childPrice: 300, capacity: 5 },
          { roomPrice: 150, adultPrice: 500, childPrice: 20, capacity: 5 },
          { roomPrice: 1000, adultPrice: 100, childPrice: 10, capacity: 6 },
        ]}
        onChange={() => {}}
        onBlur={() => {}}
      />
    );
    const user = userEvent.setup();

    const minusButtons = await screen.findAllByTestId<HTMLButtonElement>(
      "custom-number-minus-button"
    );

    await user.click(minusButtons[5]);

    const inputs = await screen.findAllByTestId<HTMLInputElement>(
      "custom-number-input"
    );

    expect(inputs[5].value).toBe("3");

    const alertDiv = screen.getByTestId("left-guest-alert");

    expect(alertDiv).toBeDefined();
    expect(alertDiv.textContent).toContain("1 位小孩");
    expect(alertDiv.textContent).not.toContain("1 位大人");

    await user.click(minusButtons[4]);
    expect(alertDiv.textContent).toContain("1 位小孩");
    expect(alertDiv.textContent).toContain("1 位大人");
  });
});
