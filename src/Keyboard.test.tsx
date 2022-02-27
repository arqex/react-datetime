import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

import MutationObserver from "@sheerun/mutationobserver-shim";
window.MutationObserver = MutationObserver;

import { DateTime as RawDateTime, FORMATS } from "./index";

const FULL_DATE_FORMAT = `${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`;
const FULL_TIME_FORMAT = `${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`;

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

function type(element: Element, value: string) {
  userEvent.type(element, value);
}

afterEach(async () => {
  global.Date = RealDate;
});

it("should let you type to mark a full date active", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime id="some-id" dateFormat={FULL_DATE_FORMAT} timeFormat={false} />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  // Open picker
  userEvent.click(element);
  expect(element).toHaveFocus();

  // Should start visible with nothing active
  {
    const picker = await screen.findByTestId("day-picker");
    expect(picker).toBeVisible();

    const targetDate = await screen.findByText("16");
    expect(targetDate).toBeVisible();
    expect(targetDate).not.toHaveClass("rdtActive");
  }

  type(element, "06/16/2015");

  expect(element).toMatchInlineSnapshot(`
    <input
      id="some-id"
      type="text"
      value="06/16/2015"
    />
  `);

  // Assert the typed value is now active
  {
    const picker = await screen.findByTestId("day-picker");
    expect(picker).toBeVisible();

    const targetDate = await screen.findByText("16");
    expect(targetDate).toBeVisible();
    expect(targetDate).toHaveClass("rdtActive");
  }
});

it("should let you type to mark a month/year active", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={`${FORMATS.MONTH}/${FORMATS.YEAR}`}
        timeFormat={false}
      />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  // Open picker
  userEvent.click(element);
  expect(element).toHaveFocus();

  // Should start visible with nothing active
  expect(await screen.findByTestId("month-picker")).toBeVisible();
  expect(await screen.findByText(/jun/i)).toBeVisible();
  expect(await screen.findByText(/jun/i)).not.toHaveClass("rdtActive");

  type(element, "06/2015");

  expect(element).toMatchInlineSnapshot(`
    <input
      id="some-id"
      type="text"
      value="06/2015"
    />
  `);

  // Assert the typed value is now active
  expect(await screen.findByTestId("month-picker")).toBeVisible();
  expect(await screen.findByText(/jun/i)).toBeVisible();
  expect(await screen.findByText(/jun/i)).toHaveClass("rdtActive");
});

it("should let you type to mark a year active", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime id="some-id" dateFormat={FORMATS.YEAR} timeFormat={false} />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  // Open picker
  userEvent.click(element);
  expect(element).toHaveFocus();

  // Should start visible with nothing active
  expect(await screen.findByTestId("year-picker")).toBeVisible();
  expect(await screen.findByText(/2015/i)).toBeVisible();
  expect(await screen.findByText(/2015/i)).not.toHaveClass("rdtActive");

  type(element, "2015");

  expect(element).toMatchInlineSnapshot(`
    <input
      id="some-id"
      type="text"
      value="2015"
    />
  `);

  // Assert the typed value is now active
  expect(await screen.findByTestId("year-picker")).toBeVisible();
  expect(await screen.findByText(/2015/i)).toBeVisible();
  expect(await screen.findByText(/2015/i)).toHaveClass("rdtActive");
});

it("should let you type to mark a time active", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime id="some-id" dateFormat={false} timeFormat={FULL_TIME_FORMAT} />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  // Open picker
  userEvent.click(element);
  expect(element).toHaveFocus();

  // Should start visible with nothing active
  const picker = await screen.findByTestId("time-picker");
  expect(picker).toBeVisible();
  {
    const textContent = picker.textContent?.replace(/\W+/g, "");
    expect(textContent).toMatch(/1200AM/i);
  }

  userEvent.paste(element, "4:13 PM");

  // Assert the typed value is now active
  expect(await screen.findByTestId("time-picker")).toBeVisible();
  {
    const textContent = picker.textContent?.replace(/\W+/g, "");
    expect(textContent).toMatch(/413PM/i);
  }
});

it("should let you type to mark a date/time active", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={FULL_DATE_FORMAT}
        timeFormat={FULL_TIME_FORMAT}
      />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  // Open picker
  userEvent.click(element);
  expect(element).toHaveFocus();

  // Should start visible with nothing active
  expect(await screen.findByTestId("day-picker")).toBeVisible();
  expect(await screen.findByText("16")).toBeVisible();
  expect(await screen.findByText("16")).not.toHaveClass("rdtActive");

  type(element, "06/16/2015 12:00 AM");

  expect(element).toMatchInlineSnapshot(`
    <input
      id="some-id"
      type="text"
      value="06/16/2015 12:00 AM"
    />
  `);

  // Assert the typed value is now active
  expect(await screen.findByTestId("day-picker")).toBeVisible();
  expect(await screen.findByText("16")).toBeVisible();
  expect(await screen.findByText("16")).toHaveClass("rdtActive");
});

it("should show when tabbed in", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime id="some-id" dateFormat={FULL_DATE_FORMAT} timeFormat={false} />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  expect(document.body).toHaveFocus();

  // Open picker
  userEvent.tab();
  userEvent.click(element);
  expect(element).toHaveFocus();
  expect(element).toHaveFocus();

  // Should become visible
  expect(await screen.findByTestId("picker-wrapper")).toBeVisible();
  expect(await screen.findByTestId("day-picker")).toBeVisible();
});

it("should hide when open and hitting enter", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime id="some-id" dateFormat={FULL_DATE_FORMAT} timeFormat={false} />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  // Open picker
  userEvent.click(element);
  expect(element).toHaveFocus();

  // Should become visible
  expect(await screen.findByTestId("picker-wrapper")).toBeVisible();
  expect(await screen.findByTestId("day-picker")).toBeVisible();

  // Hit enter
  type(element, "{enter}");

  // Assert the picker is closed
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();
  expect(screen.queryByTestId("day-picker")).not.toBeInTheDocument();
});

it("should open when closed and hitting down arrow", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime id="some-id" dateFormat={FULL_DATE_FORMAT} timeFormat={false} />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Hit down arrow
  type(element, "{arrowdown}");

  // Assert the picker is open
  expect(await screen.findByTestId("picker-wrapper")).toBeVisible();
  expect(await screen.findByTestId("day-picker")).toBeVisible();
});

it("should hide when open and hitting escape", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime id="some-id" dateFormat={FULL_DATE_FORMAT} timeFormat={false} />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  // Open picker
  userEvent.click(element);
  expect(element).toHaveFocus();

  // Should become visible
  expect(await screen.findByTestId("picker-wrapper")).toBeVisible();
  expect(await screen.findByTestId("day-picker")).toBeVisible();

  // Hit escape
  type(element, "{esc}");

  // Assert the picker is closed
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();
  expect(screen.queryByTestId("day-picker")).not.toBeInTheDocument();
});

it("should hide when open and hitting tab", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime id="some-id" dateFormat={FULL_DATE_FORMAT} timeFormat={false} />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  // Open picker
  userEvent.click(element);
  expect(element).toHaveFocus();

  // Should become visible
  expect(await screen.findByTestId("picker-wrapper")).toBeVisible();
  expect(await screen.findByTestId("day-picker")).toBeVisible();

  // Hit tab
  fireEvent.keyDown(element, {
    key: "Tab",
    code: 9,
    keyCode: 9,
    charCode: 9,
  });
  fireEvent.keyUp(element, {
    key: "Tab",
    code: 9,
    keyCode: 9,
    charCode: 9,
  });

  // Assert the picker is closed
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();
  expect(screen.queryByTestId("day-picker")).not.toBeInTheDocument();
});
