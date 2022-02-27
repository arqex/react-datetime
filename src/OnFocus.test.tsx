import * as React from "react";
import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

import MutationObserver from "@sheerun/mutationobserver-shim";
window.MutationObserver = MutationObserver;

import { DateTime as RawDateTime, FORMATS } from "./index";

const FULL_DATE_FORMAT = `${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`;

function DateTime(props) {
  const [value, setValue] = React.useState(props.value);

  function onChange(newVal) {
    if (typeof props.onChange === "function") {
      props.onChange(newVal);
    }

    setValue(newVal);
  }

  return <RawDateTime {...props} value={value} onChange={onChange} />;
}

const RealDate = Date;

function mockDate(isoDate: Date) {
  //@ts-ignore
  global.Date = class extends RealDate {
    //@ts-ignore
    constructor(...args) {
      if (args.length === 0) {
        return new RealDate(isoDate);
      }

      //@ts-ignore
      return new RealDate(...args);
    }
  };
}

afterEach(async () => {
  global.Date = RealDate;
});

it("should trigger onFocus when tabbed in", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleFocus = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={FULL_DATE_FORMAT}
        timeFormat={false}
        onFocus={handleFocus}
      />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  expect(document.body).toHaveFocus();

  // Open picker
  userEvent.tab();
  expect(element).toHaveFocus();

  // Should have triggered "onFocus"
  expect(handleFocus).toHaveBeenCalledTimes(1);
});

it("should trigger onFocus when clicked in", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleFocus = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={FULL_DATE_FORMAT}
        timeFormat={false}
        onFocus={handleFocus}
      />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  userEvent.click(element);

  // Should have triggered "onFocus"
  expect(handleFocus).toHaveBeenCalledTimes(1);
});
