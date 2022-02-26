import * as React from "react";
import { vi } from "vitest";
import { render, act, fireEvent, screen } from "@testing-library/react";
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

afterEach(async () => {
  global.Date = RealDate;
});

it("should not trigger onChange Date when opening w/ Date", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleChange = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={FULL_DATE_FORMAT}
        timeFormat={false}
        onChange={handleChange}
        value={new Date(2019, 0, 16, 12, 1, 12, 34)}
      />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("01/16/2019");

  // Act
  // Open picker
  userEvent.click(element);

  expect(handleChange).toHaveBeenCalledTimes(0);
});

it("should not trigger onChange Date when clicking same date", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleChange = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={FULL_DATE_FORMAT}
        timeFormat={false}
        onChange={handleChange}
        value={new Date(2019, 0, 16, 12, 1, 12, 34)}
      />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("01/16/2019");

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

  expect(handleChange).toHaveBeenCalledTimes(0);
});

it("should trigger onChange Date when picking a first date", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleChange = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={FULL_DATE_FORMAT}
        timeFormat={false}
        onChange={handleChange}
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

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith(new Date(2019, 0, 16, 0, 0, 0, 0));
});

it("should trigger onChange Date when picking a new date", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleChange = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={FULL_DATE_FORMAT}
        timeFormat={false}
        onChange={handleChange}
        value={new Date(2019, 0, 16, 12, 1, 12, 34)}
      />
    </>
  );

  const element = await screen.findByLabelText("Some Field");
  expect(element).toHaveValue("01/16/2019");

  // Act
  // Open picker
  userEvent.click(element);

  // Assert
  expect(await screen.findByTestId("day-picker")).toBeVisible();

  const someDay = await screen.findByText("17");
  expect(someDay).toBeVisible();

  // Pick date
  userEvent.click(someDay);

  expect(element).toHaveValue("01/17/2019");

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith(
    new Date(2019, 0, 17, 12, 1, 12, 34)
  );
});

it("should trigger onChange input string when picking a date", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleChange = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={FULL_DATE_FORMAT}
        timeFormat={false}
        onChange={handleChange}
        dateTypeMode="input-format"
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

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith("01/16/2019");
});

it("should trigger onChange input string when picking a date/time", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleChange = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={FULL_DATE_FORMAT}
        timeFormat={FULL_TIME_FORMAT}
        onChange={handleChange}
        dateTypeMode="input-format"
      />
    </>
  );

  expect(await screen.findByLabelText("Some Field")).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  // Open picker
  userEvent.click(await screen.findByLabelText("Some Field"));

  // Assert
  expect(await screen.findByTestId("day-picker")).toBeVisible();
  expect(await screen.findByText("16")).toBeVisible();

  // Pick date
  userEvent.click(await screen.findByText("16"));

  expect(await screen.findByLabelText("Some Field")).toHaveValue(
    "01/16/2019 12:00 AM"
  );

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith("01/16/2019 12:00 AM");
});

it("should trigger onChange input string when increasing time by one step", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleChange = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={false}
        timeFormat={FULL_TIME_FORMAT}
        onChange={handleChange}
        dateTypeMode="input-format"
      />
    </>
  );

  expect(await screen.findByLabelText("Some Field")).toHaveValue("");
  expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

  // Act
  // Open picker
  userEvent.click(await screen.findByLabelText("Some Field"));

  // Assert
  expect(await screen.findByTestId("time-picker")).toBeVisible();

  // Click to change the time
  const upArrows = await screen.findAllByText("▲");
  expect(upArrows?.length).toBe(3);
  const downArrows = await screen.findAllByText("▼");
  expect(downArrows?.length).toBe(3);

  // Increase hours from 12 to 1
  userEvent.click(upArrows[0]);

  expect(await screen.findByLabelText("Some Field")).toHaveValue("1:00 AM");
  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith("1:00 AM");
});

it("should trigger onChange input string when increasing time by 3 hour increment", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleChange = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={false}
        timeFormat={FULL_TIME_FORMAT}
        onChange={handleChange}
        dateTypeMode="input-format"
        timeConstraints={{
          hours: {
            step: 3,
          },
        }}
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
  expect(await screen.findByTestId("time-picker")).toBeVisible();

  // Click to change the time
  const upArrows = await screen.findAllByText("▲");
  expect(upArrows?.length).toBe(3);

  const downArrows = await screen.findAllByText("▼");
  expect(downArrows?.length).toBe(3);

  // Increase hours from 12 to 3
  userEvent.click(upArrows[0]);

  expect(element).toHaveValue("3:00 AM");

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith("3:00 AM");

  // Decrease hours from 3 to 12
  userEvent.click(downArrows[0]);

  expect(element).toHaveValue("12:00 AM");

  expect(handleChange).toHaveBeenCalledTimes(2);
  expect(handleChange).toHaveBeenCalledWith("12:00 AM");
});

it("should trigger onChange input string when increasing time by 15 min increment", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleChange = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={false}
        timeFormat={FULL_TIME_FORMAT}
        onChange={handleChange}
        dateTypeMode="input-format"
        timeConstraints={{
          minutes: {
            step: 15,
          },
        }}
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
  expect(await screen.findByTestId("time-picker")).toBeVisible();

  // Click to change the time
  const upArrows = await screen.findAllByText("▲");
  expect(upArrows?.length).toBe(3);

  const downArrows = await screen.findAllByText("▼");
  expect(downArrows?.length).toBe(3);

  // Increase minutes from 0 to 15
  userEvent.click(upArrows[1]);

  expect(element).toHaveValue("12:15 AM");

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith("12:15 AM");

  // Decrease minutes from 15 to 0
  userEvent.click(downArrows[1]);

  expect(element).toHaveValue("12:00 AM");

  expect(handleChange).toHaveBeenCalledTimes(2);
  expect(handleChange).toHaveBeenCalledWith("12:00 AM");
});

it("should trigger onChange input string when increasing time by 30 second increment", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleChange = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={false}
        timeFormat={`${FORMATS.HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND} ${FORMATS.AM_PM}`}
        onChange={handleChange}
        dateTypeMode="input-format"
        timeConstraints={{
          seconds: {
            step: 30,
          },
        }}
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
  expect(await screen.findByTestId("time-picker")).toBeVisible();

  // Click to change the time
  const upArrows = await screen.findAllByText("▲");
  expect(upArrows?.length).toBe(4);

  const downArrows = await screen.findAllByText("▼");
  expect(downArrows?.length).toBe(4);

  // Increase seconds from 0 to 30
  userEvent.click(upArrows[2]);

  expect(element).toHaveValue("12:00:30 AM");

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith("12:00:30 AM");

  // Decrease seconds from 30 to 0
  userEvent.click(downArrows[2]);

  expect(element).toHaveValue("12:00:00 AM");

  expect(handleChange).toHaveBeenCalledTimes(2);
  expect(handleChange).toHaveBeenCalledWith("12:00:00 AM");
});

it("should trigger onChange input string when increasing time by 10 milliseconds increment", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleChange = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={false}
        timeFormat={`${FORMATS.HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND}.${FORMATS.MILLISECOND} ${FORMATS.AM_PM}`}
        onChange={handleChange}
        dateTypeMode="input-format"
        timeConstraints={{
          milliseconds: {
            step: 10,
          },
        }}
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
  expect(await screen.findByTestId("time-picker")).toBeVisible();

  // Click to change the time
  const upArrows = await screen.findAllByText("▲");
  expect(upArrows?.length).toBe(5);

  const downArrows = await screen.findAllByText("▼");
  expect(downArrows?.length).toBe(5);

  // Increase milliseconds from 0 to 10
  userEvent.click(upArrows[3]);

  expect(element).toHaveValue("12:00:00.010 AM");

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith("12:00:00.010 AM");

  // Decrease milliseconds from 10 to 0
  userEvent.click(downArrows[3]);

  expect(element).toHaveValue("12:00:00.000 AM");

  expect(handleChange).toHaveBeenCalledTimes(2);
  expect(handleChange).toHaveBeenCalledWith("12:00:00.000 AM");
});

it('should trigger onChange input string once holding down the "up" seconds for a bit of time', async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleChange = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={false}
        timeFormat={`${FORMATS.HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND} ${FORMATS.AM_PM}`}
        onChange={handleChange}
        dateTypeMode="input-format"
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
  expect(await screen.findByTestId("time-picker")).toBeVisible();

  // Click to change the time
  const upArrows = await screen.findAllByText("▲");
  expect(upArrows?.length).toBe(4);

  const downArrows = await screen.findAllByText("▼");
  expect(downArrows?.length).toBe(4);

  // Use fake timers to run for x seconds
  vi.useFakeTimers();

  fireEvent.mouseDown(upArrows[2]);

  // Increase seconds
  act(() => {
    // Fast forward and exhaust only currently pending timers
    // (but not any new timers that get created during that process)
    vi.runOnlyPendingTimers();

    // Fast forward and exhaust only currently pending timers
    // (but not any new timers that get created during that process)
    vi.runOnlyPendingTimers();

    // Fast forward and exhaust only currently pending timers
    // (but not any new timers that get created during that process)
    vi.runOnlyPendingTimers();

    // Fast forward and exhaust only currently pending timers
    // (but not any new timers that get created during that process)
    vi.runOnlyPendingTimers();
  });

  fireEvent.mouseUp(upArrows[2]);

  // Re-enable real timers
  vi.useRealTimers();

  expect(element).toHaveValue("12:00:04 AM");

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith("12:00:04 AM");
});

it("should trigger onChange utc-ms-timestamp when picking a date", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  const handleChange = vi.fn();

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={FULL_DATE_FORMAT}
        timeFormat={false}
        onChange={handleChange}
        dateTypeMode="utc-ms-timestamp"
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

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith(
    new Date(2019, 0, 16, 0, 0, 0, 0).getTime()
  );
});
