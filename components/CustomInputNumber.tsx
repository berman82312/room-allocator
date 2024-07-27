"use client";

import {
  ChangeEventHandler,
  FocusEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

interface CustomInputNumberProps {
  min: number;
  max: number;
  step: number;
  name: string;
  value: number;
  disabled: boolean;
  onChange: ChangeEventHandler;
  onBlur: FocusEventHandler;
}

export const CustomInputNumber = (props: CustomInputNumberProps) => {
  const { min, max, step, name, disabled } = props;

  const [value, setValue] = useState<number | string>(props.value);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.target.value);
    props.onChange(event);
  };

  const addStep = () => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.step = "1";
    inputRef.current?.stepUp(step);

    timerRef.current = setTimeout(
      () => {
        addStep();
      },
      timerRef.current ? 78 : 500
    );
  };

  const minusStep = () => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.step = "1";
    inputRef.current?.stepDown(step);

    timerRef.current = setTimeout(
      () => {
        minusStep();
      },
      timerRef.current ? 78 : 500
    );
  };

  const clearTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = undefined;

    if (!inputRef.current) {
      return;
    }
    inputRef.current.step = step.toString();

    inputRef.current?.dispatchEvent(new Event("change", { bubbles: true }));
    inputRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
  };

  return (
    <div className="flex itmes-center" onBlur={props.onBlur}>
      <button
        data-testid="custom-number-minus-button"
        onMouseDown={minusStep}
        onTouchStart={minusStep}
        onMouseUp={clearTimer}
        onTouchEnd={clearTimer}
        className="h-12 w-12 border border-sky-500 disabled:border-sky-200 disabled:cursor-not-allowed [&>span]:disabled:text-sky-200 rounded"
        disabled={disabled || Number(value) <= min}
      >
        <span className="text-sky-500">-</span>
      </button>
      <input
        data-testid="custom-number-input"
        ref={inputRef}
        min={min}
        max={max}
        step={step}
        inputMode="numeric"
        className="appearance-none h-12 w-12 border border-neutral-400 disabled:border-neutral-200 disabled:cursor-not-allowed rounded ml-2 text-center"
        disabled={disabled}
        type="number"
        value={value}
        name={name}
        onChange={handleOnChange}
      />
      <button
        data-testid="custom-number-add-button"
        onMouseDown={addStep}
        onTouchStart={addStep}
        onMouseUp={clearTimer}
        onTouchEnd={clearTimer}
        className="h-12 w-12 border border-sky-500 rounded ml-2 disabled:border-sky-200 disabled:cursor-not-allowed [&>span]:disabled:text-sky-200"
        disabled={disabled || Number(value) >= max}
      >
        <span className="text-sky-500">+</span>
      </button>
    </div>
  );
};
