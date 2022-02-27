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

it("should trigger onBlur with no value when tabbed out with no value", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleBlur = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={FULL_DATE_FORMAT}
        timeFormat={false}
        onBlur={handleBlur}
      />
      <label htmlFor="another-id">Another Field</label>
      <input id="another-id" type="text" />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  expect(document.body).toHaveFocus();

  // Tab in
  userEvent.tab();
  expect(element).toHaveFocus();

  // Tab out
  userEvent.tab();

  // Should have triggered "onBlur"
  expect(handleBlur).toHaveBeenCalledTimes(1);
  expect(element).not.toHaveFocus();
  expect(handleBlur).toHaveBeenCalledWith(undefined);
});

it("should trigger onBlur with value when tabbed out with value", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleBlur = vi.fn();

  // Arrange
  const testValue = new Date(2019, 0, 16, 12, 1, 12, 34);
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={FULL_DATE_FORMAT}
        timeFormat={false}
        value={testValue}
        onBlur={handleBlur}
      />
      <label htmlFor="another-id">Another Field</label>
      <input id="another-id" type="text" />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  expect(document.body).toHaveFocus();

  // Tab in
  userEvent.tab();
  expect(element).toHaveFocus();

  // Tab out
  userEvent.tab();

  // Should have triggered "onBlur"
  expect(handleBlur).toHaveBeenCalledTimes(1);
  expect(element).not.toHaveFocus();
  expect(handleBlur).toHaveBeenCalledWith(testValue);
});

it("should trigger onBlur when picking a first date", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleBlur = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={FULL_DATE_FORMAT}
        timeFormat={false}
        onBlur={handleBlur}
      />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  // Open picker
  userEvent.click(element);

  // Assert
  expect(await screen.findByTestId("day-picker")).toBeVisible();

  const someDay = await screen.findByText("16");
  expect(someDay).toBeVisible();

  // Pick date
  userEvent.click(someDay);

  expect(element).toHaveValue("01/16/2019");

  expect(handleBlur).toHaveBeenCalledTimes(1);
  expect(handleBlur).toHaveBeenCalledWith(new Date(2019, 0, 16, 0, 0, 0, 0));
});
