import * as React from "react";
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

it("should switch through to year mode, and pick a specific date through various pickers", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime id="some-id" dateFormat={FULL_DATE_FORMAT} timeFormat={false} />
    </>
  );

  const element = await screen.findByLabelText("Some Field");

  // Act
  userEvent.click(element);
  expect(element).toHaveFocus();

  {
    const picker = await screen.findByTestId("day-picker");
    expect(picker).toBeVisible();
  }

  // day -> month picker
  {
    const switcher = await screen.findByTestId("day-mode-switcher");
    expect(switcher).toBeVisible();

    userEvent.click(switcher);

    // Assert
    const picker = await screen.findByTestId("month-picker");
    expect(picker).toBeVisible();
  }

  // month -> year picker
  {
    const switcher = await screen.findByTestId("month-mode-switcher");
    expect(switcher).toBeVisible();

    userEvent.click(switcher);

    // Assert
    const picker = await screen.findByTestId("year-picker");
    expect(picker).toBeVisible();
  }

  {
    // click a year (switch to month picker)
    userEvent.click(await screen.findByText("2020"));

    const picker = await screen.findByTestId("month-picker");
    expect(picker).toBeVisible();
  }

  {
    // click a month (switch to day picker)
    userEvent.click(await screen.findByText("Feb"));

    const picker = await screen.findByTestId("day-picker");
    expect(picker).toBeVisible();
  }

  // click a day
  userEvent.click(await screen.findByText("11"));

  // Assert
  expect(await screen.findByLabelText("Some Field")).toHaveValue("02/11/2020");
});

it("should switch through to year mode, and pick a specific date/time through various pickers", async () => {
  mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

  // Arrange
  render(
    <>
      <label htmlFor="some-id">Some Field</label>
      <DateTime
        id="some-id"
        dateFormat={FULL_DATE_FORMAT}
        timeFormat={`${FORMATS.HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND}.${FORMATS.MILLISECOND} ${FORMATS.AM_PM}`}
      />
    </>
  );

  const element = await screen.findByLabelText("Some Field");

  // Act
  userEvent.click(element);
  expect(element).toHaveFocus();

  {
    const picker = await screen.findByTestId("day-picker");
    expect(picker).toBeVisible();
  }

  // day -> month picker
  {
    const switcher = await screen.findByTestId("day-mode-switcher");
    expect(switcher).toBeVisible();

    userEvent.click(switcher);

    // Assert
    const picker = await screen.findByTestId("month-picker");
    expect(picker).toBeVisible();
  }

  // month -> year picker
  {
    const switcher = await screen.findByTestId("month-mode-switcher");
    expect(switcher).toBeVisible();

    userEvent.click(switcher);

    // Assert
    const picker = await screen.findByTestId("year-picker");
    expect(picker).toBeVisible();
  }

  {
    // click a year (switch to month picker)
    userEvent.click(await screen.findByText("2020"));

    const picker = await screen.findByTestId("month-picker");
    expect(picker).toBeVisible();
  }

  {
    // click a month (switch to day picker)
    userEvent.click(await screen.findByText("Feb"));

    const picker = await screen.findByTestId("day-picker");
    expect(picker).toBeVisible();
  }

  // Switch to time mode
  {
    const switcher = await screen.findByTestId("day-to-time-mode-switcher");
    expect(switcher).toBeVisible();

    userEvent.click(switcher);
  }

  {
    // Assert
    const picker = await screen.findByTestId("time-picker");
    expect(picker).toBeVisible();

    expect(picker.textContent?.replace(/[^\w/]+/g, "")).toMatch(
      /02\/01\/2020120000000AM/i
    );

    // Click to change the time
    const upArrows = await screen.findAllByText("▲");
    expect(upArrows?.length).toBe(5);

    const downArrows = await screen.findAllByText("▼");
    expect(downArrows?.length).toBe(5);

    // Increase hours from 12 to 1
    userEvent.click(upArrows[0]);

    // Increase minutes from 00 to 05
    for (let i = 0; i < 5; i++) {
      userEvent.click(upArrows[1]);
    }

    // Increase seconds from 00 to 35
    for (let i = 0; i < 35; i++) {
      userEvent.click(upArrows[2]);
    }

    // Increase milliseconds from 000 to 321
    for (let i = 0; i < 321; i++) {
      userEvent.click(upArrows[3]);
    }

    // Change from AM to PM
    userEvent.click(upArrows[4]);

    expect(picker.textContent?.replace(/[^\w/]+/g, "")).toMatch(
      /02\/01\/202010535321PM/i
    );

    // Change from PM to AM
    userEvent.click(upArrows[4]);

    expect(picker.textContent?.replace(/[^\w/]+/g, "")).toMatch(
      /02\/01\/202010535321AM/i
    );

    // Change from AM to PM
    userEvent.click(upArrows[4]);

    expect(picker.textContent?.replace(/[^\w/]+/g, "")).toMatch(
      /02\/01\/202010535321PM/i
    );
  }

  // Switch back to day mode
  {
    const switcher = await screen.findByTestId("time-mode-switcher");
    expect(switcher).toBeVisible();

    userEvent.click(switcher);
  }

  // click a day
  userEvent.click(await screen.findByText("11"));

  // Assert
  expect(await screen.findByLabelText("Some Field")).toHaveValue(
    "02/11/2020 1:05:35.321 PM"
  );
});
