import * as React from "react";
import { vi } from "vitest";
import { render, act, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import isSameDay from "date-fns/isSameDay";
import isSameMonth from "date-fns/isSameMonth";
import isSameYear from "date-fns/isSameYear";

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

describe("DateTime", () => {
  it("should render an input", async () => {
    render(<DateTime />);

    const input = await screen.findByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("should render an input with className", async () => {
    render(<DateTime className="form-control" />);

    const input = await screen.findByRole("textbox");
    expect(input).toHaveClass("form-control");
  });

  it("should render an input with id", async () => {
    render(<DateTime id="some-id" />);

    const input = await screen.findByRole("textbox");
    expect(input).toHaveAttribute("id", "some-id");
  });

  it("should render with a invalid string value", async () => {
    render(<DateTime value="test" />);

    const input = await screen.findByRole("textbox");
    expect(input).toHaveValue("test");
  });

  it("should render with a date string value", async () => {
    render(<DateTime value="06/16/2015 12:00 AM" />);

    const input = await screen.findByRole("textbox");
    expect(input).toHaveValue("06/16/2015 12:00 AM");
  });

  describe("shouldHideInput", () => {
    it("should not render any input", async () => {
      render(<DateTime shouldHideInput />);

      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("should render a picker with className", async () => {
      render(<DateTime className="some-class" shouldHideInput />);

      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

      const picker = await screen.findByTestId("picker-wrapper");
      expect(picker).toHaveClass("some-class");
    });

    it("should render a picker with id", async () => {
      render(<DateTime id="some-id" shouldHideInput />);

      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

      const picker = await screen.findByTestId("picker-wrapper");
      expect(picker).toHaveAttribute("id", "some-id");
    });
  });

  describe("invalid pickers", () => {
    it("should not open if there's no date/time formats", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat={false} timeFormat={false} />
        </>
      );

      // Act
      const element = await screen.findByLabelText("Some Field");
      userEvent.click(element);

      // Assert
      expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();
      expect(screen.queryByTestId("day-picker")).not.toBeInTheDocument();
      expect(screen.queryByTestId("month-picker")).not.toBeInTheDocument();
      expect(screen.queryByTestId("year-picker")).not.toBeInTheDocument();
      expect(screen.queryByTestId("time-picker")).not.toBeInTheDocument();
    });

    it("should show nothing with shouldHideInput if there's no date/time formats", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            shouldHideInput
            dateFormat={false}
            timeFormat={false}
          />
        </>
      );

      // Assert
      expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();
      expect(screen.queryByTestId("day-picker")).not.toBeInTheDocument();
      expect(screen.queryByTestId("month-picker")).not.toBeInTheDocument();
      expect(screen.queryByTestId("year-picker")).not.toBeInTheDocument();
      expect(screen.queryByTestId("time-picker")).not.toBeInTheDocument();
    });
  });

  describe("day picker", () => {
    it("should show day picker when shouldHideInput", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FULL_DATE_FORMAT}
            shouldHideInput
          />
        </>
      );

      // Assert
      expect(await screen.findByTestId("picker-wrapper")).toBeVisible();
      expect(await screen.findByTestId("day-picker")).toBeVisible();
    });

    it("should open day picker when clicking", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat={FULL_DATE_FORMAT} />
        </>
      );

      // Act
      const element = await screen.findByLabelText("Some Field");
      userEvent.click(element);

      // Assert
      const picker = await screen.findByTestId("day-picker");
      expect(picker).toBeVisible();
    });

    it("should open day picker on focus", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat={FULL_DATE_FORMAT} />
        </>
      );

      // Act
      const element = await screen.findByLabelText("Some Field");
      userEvent.click(element);
      expect(element).toHaveFocus();

      // Assert
      const picker = await screen.findByTestId("day-picker");
      expect(picker).toBeVisible();
    });

    describe("should open various months based on current date", () => {
      it("should open january day picker when clicking", async () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        // Arrange
        render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = await screen.findByLabelText("Some Field");
        userEvent.click(element);

        // Assert
        expect(await screen.findByTestId("day-picker")).toBeVisible();

        const rows = await screen.findAllByRole("row");
        const [headerRow, dowRow] = rows;

        expect(headerRow).toHaveTextContent("January");
        expect(dowRow).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open february day picker when clicking", async () => {
        mockDate(new Date(2019, 1, 1, 12, 1, 12, 34));

        // Arrange
        render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = await screen.findByLabelText("Some Field");
        userEvent.click(element);

        // Assert
        expect(await screen.findByTestId("day-picker")).toBeVisible();

        const rows = await screen.findAllByRole("row");
        const [headerRow, dowRow] = rows;

        expect(headerRow).toHaveTextContent("February");
        expect(dowRow).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open march day picker when clicking", async () => {
        mockDate(new Date(2019, 2, 1, 12, 1, 12, 34));

        // Arrange
        render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = await screen.findByLabelText("Some Field");
        userEvent.click(element);

        // Assert
        expect(await screen.findByTestId("day-picker")).toBeVisible();

        const rows = await screen.findAllByRole("row");
        const [headerRow, dowRow] = rows;

        expect(headerRow).toHaveTextContent("March");
        expect(dowRow).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open april day picker when clicking", async () => {
        mockDate(new Date(2019, 3, 1, 12, 1, 12, 34));

        // Arrange
        render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = await screen.findByLabelText("Some Field");
        userEvent.click(element);

        // Assert
        expect(await screen.findByTestId("day-picker")).toBeVisible();

        const rows = await screen.findAllByRole("row");
        const [headerRow, dowRow] = rows;

        expect(headerRow).toHaveTextContent("April");
        expect(dowRow).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open may day picker when clicking", async () => {
        mockDate(new Date(2019, 4, 1, 12, 1, 12, 34));

        // Arrange
        render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = await screen.findByLabelText("Some Field");
        userEvent.click(element);

        // Assert
        expect(await screen.findByTestId("day-picker")).toBeVisible();

        const rows = await screen.findAllByRole("row");
        const [headerRow, dowRow] = rows;

        expect(headerRow).toHaveTextContent("May");
        expect(dowRow).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open june day picker when clicking", async () => {
        mockDate(new Date(2019, 5, 1, 12, 1, 12, 34));

        // Arrange
        render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = await screen.findByLabelText("Some Field");
        userEvent.click(element);

        // Assert
        expect(await screen.findByTestId("day-picker")).toBeVisible();

        const rows = await screen.findAllByRole("row");
        const [headerRow, dowRow] = rows;

        expect(headerRow).toHaveTextContent("June");
        expect(dowRow).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open july day picker when clicking", async () => {
        mockDate(new Date(2019, 6, 1, 12, 1, 12, 34));

        // Arrange
        render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = await screen.findByLabelText("Some Field");
        userEvent.click(element);

        // Assert
        expect(await screen.findByTestId("day-picker")).toBeVisible();

        const rows = await screen.findAllByRole("row");
        const [headerRow, dowRow] = rows;

        expect(headerRow).toHaveTextContent("July");
        expect(dowRow).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open august day picker when clicking", async () => {
        mockDate(new Date(2019, 7, 1, 12, 1, 12, 34));

        // Arrange
        render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = await screen.findByLabelText("Some Field");
        userEvent.click(element);

        // Assert
        expect(await screen.findByTestId("day-picker")).toBeVisible();

        const rows = await screen.findAllByRole("row");
        const [headerRow, dowRow] = rows;

        expect(headerRow).toHaveTextContent("August");
        expect(dowRow).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open september day picker when clicking", async () => {
        mockDate(new Date(2019, 8, 1, 12, 1, 12, 34));

        // Arrange
        render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = await screen.findByLabelText("Some Field");
        userEvent.click(element);

        // Assert
        expect(await screen.findByTestId("day-picker")).toBeVisible();

        const rows = await screen.findAllByRole("row");
        const [headerRow, dowRow] = rows;

        expect(headerRow).toHaveTextContent("September");
        expect(dowRow).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open october day picker when clicking", async () => {
        mockDate(new Date(2019, 9, 1, 12, 1, 12, 34));

        // Arrange
        render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = await screen.findByLabelText("Some Field");
        userEvent.click(element);

        // Assert
        expect(await screen.findByTestId("day-picker")).toBeVisible();

        const rows = await screen.findAllByRole("row");
        const [headerRow, dowRow] = rows;

        expect(headerRow).toHaveTextContent("October");
        expect(dowRow).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open november day picker when clicking", async () => {
        mockDate(new Date(2019, 10, 1, 12, 1, 12, 34));

        // Arrange
        render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = await screen.findByLabelText("Some Field");
        userEvent.click(element);

        // Assert
        expect(await screen.findByTestId("day-picker")).toBeVisible();

        const rows = await screen.findAllByRole("row");
        const [headerRow, dowRow] = rows;

        expect(headerRow).toHaveTextContent("November");
        expect(dowRow).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open december day picker when clicking", async () => {
        mockDate(new Date(2019, 11, 1, 12, 1, 12, 34));

        // Arrange
        render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = await screen.findByLabelText("Some Field");
        userEvent.click(element);

        // Assert
        expect(await screen.findByTestId("day-picker")).toBeVisible();

        const rows = await screen.findAllByRole("row");
        const [headerRow, dowRow] = rows;

        expect(headerRow).toHaveTextContent("December");
        expect(dowRow).toHaveTextContent("SuMoTuWeThFrSa");
      });
    });

    it("should choose day from picker", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FULL_DATE_FORMAT}
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

      // Assert
      expect(await screen.findByTestId("day-picker")).toBeVisible();

      const someDay = await screen.findByText("16");
      expect(someDay).toBeVisible();

      // Pick date
      userEvent.click(someDay);

      expect(element).toHaveValue("01/16/2019");
    });

    it("should do nothing when picking day from picker without onChange function", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <RawDateTime
            id="some-id"
            dateFormat={FULL_DATE_FORMAT}
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

      // Assert
      expect(await screen.findByTestId("day-picker")).toBeVisible();

      const someDay = await screen.findByText("16");
      expect(someDay).toBeVisible();

      // Pick date
      userEvent.click(someDay);

      expect(element).toHaveValue("");
    });

    it("should block/unblock day picking based on isValidDate", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      const handleChange = vi.fn();
      function isValidDate(date: Date) {
        if (isSameDay(date, new Date(2019, 0, 16))) {
          return false;
        }

        return true;
      }

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FULL_DATE_FORMAT}
            timeFormat={false}
            onChange={handleChange}
            isValidDate={isValidDate}
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

      // Click a date (disabled)
      userEvent.click(await screen.findByText("16"));

      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click another date (not disabled)
      userEvent.click(await screen.findByText("17"));

      expect(element).toHaveValue("01/17/2019");
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("should navigate to previous months from picker", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FULL_DATE_FORMAT}
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

      // Assert
      expect(await screen.findByTestId("day-picker")).toBeVisible();

      // Go to previous month (twice)
      const prevButton = await screen.findByText("‹");
      expect(prevButton).toBeVisible();
      userEvent.click(prevButton);
      userEvent.click(prevButton);

      // Pick date
      userEvent.click(await screen.findByText("16"));

      expect(element).toHaveValue("11/16/2018");
    });

    it("should navigate to next months from picker", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FULL_DATE_FORMAT}
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

      // Assert
      expect(await screen.findByTestId("day-picker")).toBeVisible();

      // Go to next month (twice)
      const nextButton = await screen.findByText("›");
      expect(nextButton).toBeVisible();
      userEvent.click(nextButton);
      userEvent.click(nextButton);

      // Pick date
      userEvent.click(await screen.findByText("16"));

      expect(element).toHaveValue("03/16/2019");
    });

    it("should mark date value as active with date string", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FULL_DATE_FORMAT}
            timeFormat={false}
            value="06/16/2015"
          />
        </>
      );

      expect(await screen.findByLabelText("Some Field")).toHaveValue(
        "06/16/2015"
      );

      // Act
      // Open picker
      userEvent.click(await screen.findByLabelText("Some Field"));

      // Assert
      expect(await screen.findByTestId("day-picker")).toBeVisible();

      expect(await screen.findByText("16")).toBeVisible();
      expect(await screen.findByText("16")).toHaveClass("rdtActive");
    });

    it("should mark date value as active with date and time string", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FULL_DATE_FORMAT}
            timeFormat={FULL_TIME_FORMAT}
            value="06/16/2015 11:13 PM"
          />
        </>
      );

      const element = await screen.findByLabelText("Some Field");
      expect(element).toHaveValue("06/16/2015 11:13 PM");

      // Act
      // Open picker
      userEvent.click(element);

      // Assert
      expect(await screen.findByTestId("day-picker")).toBeVisible();

      const someDay = await screen.findByText("16");
      expect(someDay).toBeVisible();
      expect(someDay).toHaveClass("rdtActive");
    });

    it("should mark date value as active with Date dateTypeMode", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FULL_DATE_FORMAT}
            timeFormat={FULL_TIME_FORMAT}
            dateTypeMode="Date"
            value={new Date(2015, 5, 16, 23, 13)}
          />
        </>
      );

      const element = await screen.findByLabelText("Some Field");
      expect(element).toHaveValue("06/16/2015 11:13 PM");

      // Act
      // Open picker
      userEvent.click(element);

      // Assert
      expect(await screen.findByTestId("day-picker")).toBeVisible();

      const someDay = await screen.findByText("16");
      expect(someDay).toBeVisible();
      expect(someDay).toHaveClass("rdtActive");
    });

    it("should mark date value as active with input-format dateTypeMode", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FULL_DATE_FORMAT}
            timeFormat={FULL_TIME_FORMAT}
            dateTypeMode="input-format"
            value="06/16/2015 11:13 PM"
          />
        </>
      );

      const element = await screen.findByLabelText("Some Field");
      expect(element).toHaveValue("06/16/2015 11:13 PM");

      // Act
      // Open picker
      userEvent.click(element);

      // Assert
      expect(await screen.findByTestId("day-picker")).toBeVisible();

      const someDay = await screen.findByText("16");
      expect(someDay).toBeVisible();
      expect(someDay).toHaveClass("rdtActive");
    });

    it("should mark date value as active with utc-ms-timestamp dateTypeMode", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FULL_DATE_FORMAT}
            timeFormat={FULL_TIME_FORMAT}
            dateTypeMode="utc-ms-timestamp"
            value={new Date(2015, 5, 16, 23, 13).getTime()}
          />
        </>
      );

      const element = await screen.findByLabelText("Some Field");
      expect(element).toHaveValue("06/16/2015 11:13 PM");

      // Act
      // Open picker
      userEvent.click(element);

      // Assert
      expect(await screen.findByTestId("day-picker")).toBeVisible();

      const someDay = await screen.findByText("16");
      expect(someDay).toBeVisible();
      expect(someDay).toHaveClass("rdtActive");
    });
  });

  describe("month picker", () => {
    it("should show month picker when shouldHideInput", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={`${FORMATS.MONTH}/${FORMATS.YEAR}`}
            shouldHideInput
          />
        </>
      );

      // Assert
      expect(await screen.findByTestId("picker-wrapper")).toBeVisible();
      expect(await screen.findByTestId("month-picker")).toBeVisible();
    });

    it("should open month picker when clicking", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={`${FORMATS.MONTH}/${FORMATS.YEAR}`}
          />
        </>
      );

      // Act
      const element = await screen.findByLabelText("Some Field");
      userEvent.click(element);

      // Assert
      const picker = await screen.findByTestId("month-picker");
      expect(picker).toBeVisible();

      const rows = await screen.findAllByRole("row");
      const [headerRow, row1, row2, row3] = rows;
      expect(headerRow).toHaveTextContent("2019");
      expect(row1).toHaveTextContent("JanFebMarApr");
      expect(row2).toHaveTextContent("MayJunJulAug");
      expect(row3).toHaveTextContent("SepOctNovDec");
    });

    it("should open month picker on focus", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={`${FORMATS.MONTH}/${FORMATS.YEAR}`}
          />
        </>
      );

      // Act
      const element = await screen.findByLabelText("Some Field");
      userEvent.click(element);
      expect(element).toHaveFocus();

      // Assert
      const picker = await screen.findByTestId("month-picker");
      expect(picker).toBeVisible();

      const rows = await screen.findAllByRole("row");
      const [headerRow, row1, row2, row3] = rows;
      expect(headerRow).toHaveTextContent("2019");
      expect(row1).toHaveTextContent("JanFebMarApr");
      expect(row2).toHaveTextContent("MayJunJulAug");
      expect(row3).toHaveTextContent("SepOctNovDec");
    });

    it("should choose month from picker", async () => {
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
      userEvent.click(element);

      // Assert
      const someMonth = await screen.findByText(/jun/i);
      userEvent.click(someMonth);

      expect(element).toHaveValue("06/2019");
    });

    it("should block/unblock month picking based on isValidDate", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      const handleChange = vi.fn();

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={`${FORMATS.MONTH}/${FORMATS.YEAR}`}
            timeFormat={false}
            onChange={handleChange}
            isValidDate={(date: Date) =>
              isSameMonth(date, new Date(2019, 2, 16))
            }
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
      expect(await screen.findByTestId("month-picker")).toBeVisible();

      // Click a month (disabled)
      userEvent.click(await screen.findByText(/jan/i));
      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click a month (disabled)
      userEvent.click(await screen.findByText(/feb/i));
      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click a month (disabled)
      userEvent.click(await screen.findByText(/nov/i));
      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click a month (disabled)
      userEvent.click(await screen.findByText(/feb/i));
      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click another date (not disabled)
      userEvent.click(await screen.findByText(/mar/i));

      expect(element).toHaveValue("03/2019");
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("should navigate to previous year's months from picker", async () => {
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
      userEvent.click(element);

      // Go to previous year (twice)
      const prevButton = await screen.findByText("‹");
      expect(prevButton).toBeVisible();
      userEvent.click(prevButton);
      userEvent.click(prevButton);

      const someMonth = await screen.findByText(/jun/i);
      userEvent.click(someMonth);

      // Assert
      expect(element).toHaveValue("06/2017");
    });

    it("should navigate to next year's months from picker", async () => {
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
      userEvent.click(element);

      // Go to previous year (twice)
      const nextButton = await screen.findByText("›");
      expect(nextButton).toBeVisible();
      userEvent.click(nextButton);
      userEvent.click(nextButton);

      const someMonth = await screen.findByText(/jun/i);
      userEvent.click(someMonth);

      // Assert
      expect(element).toHaveValue("06/2021");
    });

    it("should mark month value as active with just date", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={`${FORMATS.MONTH}/${FORMATS.YEAR}`}
            timeFormat={false}
            value="06/2015"
          />
        </>
      );

      const element = await screen.findByLabelText("Some Field");
      expect(element).toHaveValue("06/2015");

      // Act
      // Open picker
      userEvent.click(element);

      // Assert
      const someMonth = await screen.findByText(/jun/i);
      expect(someMonth).toBeVisible();
      expect(someMonth).toHaveClass("rdtActive");
    });

    it("should mark month value as active with date and time", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={`${FORMATS.MONTH}/${FORMATS.YEAR}`}
            timeFormat={FULL_TIME_FORMAT}
            value="06/2015 12:00 AM"
          />
        </>
      );

      const element = await screen.findByLabelText("Some Field");
      expect(element).toHaveValue("06/2015 12:00 AM");

      // Act
      // Open picker
      userEvent.click(element);

      // Assert
      const someMonth = await screen.findByText(/jun/i);
      expect(someMonth).toBeVisible();
      expect(someMonth).toHaveClass("rdtActive");
    });
  });

  describe("year picker", () => {
    it("should show year picker when shouldHideInput", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat={FORMATS.YEAR} shouldHideInput />
        </>
      );

      // Assert
      expect(await screen.findByTestId("picker-wrapper")).toBeVisible();
      expect(await screen.findByTestId("year-picker")).toBeVisible();
    });

    it("should open year picker when clicking", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat={FORMATS.YEAR} />
        </>
      );

      const element = await screen.findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

      // Act
      userEvent.click(element);

      // Assert
      const picker = await screen.findByText(/2010-2019/i);
      expect(picker).toBeVisible();

      const rows = await screen.findAllByRole("row");
      const [headerRow, row1, row2, row3] = rows;
      expect(headerRow).toHaveTextContent("2010-2019");
      expect(row1).toHaveTextContent("2009201020112012");
      expect(row2).toHaveTextContent("2013201420152016");
      expect(row3).toHaveTextContent("2017201820192020");
    });

    it("should open year picker on focus", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat={FORMATS.YEAR} />
        </>
      );

      const element = await screen.findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

      // Act
      userEvent.click(element);
      expect(element).toHaveFocus();

      // Assert
      const picker = await screen.findByText(/2010-2019/i);
      expect(picker).toBeVisible();

      const rows = await screen.findAllByRole("row");
      const [headerRow, row1, row2, row3] = rows;
      expect(headerRow).toHaveTextContent("2010-2019");
      expect(row1).toHaveTextContent("2009201020112012");
      expect(row2).toHaveTextContent("2013201420152016");
      expect(row3).toHaveTextContent("2017201820192020");
    });

    it("should choose year from picker", async () => {
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
      userEvent.click(element);

      expect(await screen.findByTestId("year-picker")).toBeVisible();

      const someYear = await screen.findByText("2015");
      expect(someYear).toBeVisible();

      userEvent.click(someYear);

      // Assert
      expect(element).toHaveValue("2015");
    });

    it("should block/unblock year picking based on isValidDate", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      const handleChange = vi.fn();

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={`${FORMATS.YEAR}`}
            timeFormat={false}
            onChange={handleChange}
            isValidDate={(date: Date) =>
              isSameYear(date, new Date(2019, 2, 16))
            }
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
      expect(await screen.findByTestId("year-picker")).toBeVisible();

      // Click a month (disabled)
      userEvent.click(await screen.findByText("2010"));
      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click a month (disabled)
      userEvent.click(await screen.findByText("2011"));
      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click a month (disabled)
      userEvent.click(await screen.findByText("2014"));
      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click another date (not disabled)
      userEvent.click(await screen.findByText("2019"));

      expect(element).toHaveValue("2019");
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("should navigate to previous decades from picker", async () => {
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
      userEvent.click(element);
      expect(await screen.findByTestId("year-picker")).toBeVisible();

      // Go to previous decade (twice)
      const prevButton = await screen.findByText("‹");
      expect(prevButton).toBeVisible();
      userEvent.click(prevButton);
      userEvent.click(prevButton);

      const someYear = await screen.findByText("1990");
      userEvent.click(someYear);

      // Assert
      expect(element).toHaveValue("1990");
    });

    it("should navigate to next decades from picker", async () => {
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
      userEvent.click(element);
      expect(await screen.findByTestId("year-picker")).toBeVisible();

      // Go to next decade (twice)
      const nextButton = await screen.findByText("›");
      expect(nextButton).toBeVisible();
      userEvent.click(nextButton);
      userEvent.click(nextButton);

      const someYear = await screen.findByText("2035");
      userEvent.click(someYear);

      // Assert
      expect(element).toHaveValue("2035");
    });

    it("should mark year value as active with just date", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FORMATS.YEAR}
            timeFormat={false}
            value="2015"
          />
        </>
      );

      const element = await screen.findByLabelText("Some Field");
      expect(element).toHaveValue("2015");

      // Act
      // Open picker
      userEvent.click(element);

      // Assert
      const someYear = await screen.findByText("2015");
      expect(someYear).toBeVisible();
      expect(someYear).toHaveClass("rdtActive");
    });

    it("should mark year value as active with date and time", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FORMATS.YEAR}
            timeFormat={FULL_TIME_FORMAT}
            value="2015 12:00 AM"
          />
        </>
      );

      const element = await screen.findByLabelText("Some Field");
      expect(element).toHaveValue("2015 12:00 AM");

      // Act
      // Open picker
      userEvent.click(element);

      // Assert
      const someYear = await screen.findByText("2015");
      expect(someYear).toBeVisible();
      expect(someYear).toHaveClass("rdtActive");
    });
  });

  describe("time picker", () => {
    it("should show time picker when shouldHideInput", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={false}
            timeFormat={FULL_TIME_FORMAT}
            shouldHideInput
          />
        </>
      );

      // Assert
      expect(await screen.findByTestId("picker-wrapper")).toBeVisible();
      expect(await screen.findByTestId("time-picker")).toBeVisible();
    });

    it("should open time picker when clicking", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={false}
            timeFormat={FULL_TIME_FORMAT}
          />
        </>
      );

      // Act
      const element = await screen.findByLabelText("Some Field");
      userEvent.click(element);

      // Assert
      expect(await screen.findByTestId("picker-wrapper")).toBeVisible();
      expect(await screen.findByTestId("time-picker")).toBeVisible();
    });

    it("should open time picker on focus", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={false}
            timeFormat={FULL_TIME_FORMAT}
          />
        </>
      );

      // Act
      const element = await screen.findByLabelText("Some Field");
      userEvent.click(element);
      expect(element).toHaveFocus();

      // Assert
      expect(await screen.findByTestId("picker-wrapper")).toBeVisible();
      expect(await screen.findByTestId("time-picker")).toBeVisible();

      const picker = await screen.findByText(/am/i);
      expect(picker).toBeVisible();

      const row = await screen.findByRole("row");
      const textContent = row.textContent?.replace(/\W+/g, "");
      expect(textContent).toMatch(/1200AM/i);
    });

    it("should open time picker in military time when clicking", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={false}
            timeFormat={`${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}`}
          />
        </>
      );

      // Act
      const element = await screen.findByLabelText("Some Field");
      userEvent.click(element);

      const picker = await screen.findByTestId("time-picker");
      expect(picker).toBeVisible();

      const textContent = picker.textContent?.replace(/\W+/g, "");
      expect(textContent).toMatch(/000/i);
    });

    it("should use value when opening", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={false}
            timeFormat={FULL_TIME_FORMAT}
            value="2:13 PM"
          />
        </>
      );

      // Act
      const element = await screen.findByLabelText("Some Field");
      userEvent.click(element);
      expect(element).toHaveFocus();

      const picker = await screen.findByText(/pm/i);
      expect(picker).toBeVisible();

      const row = await screen.findByRole("row");
      const textContent = row.textContent?.replace(/\W+/g, "");
      expect(textContent).toMatch(/213pm/i);
    });

    it("should use late military time value when opening", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={false}
            timeFormat={`${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}`}
            value="21:13"
          />
        </>
      );

      // Act
      const element = await screen.findByLabelText("Some Field");
      userEvent.click(element);
      expect(element).toHaveFocus();

      const picker = await screen.findByTestId("time-picker");
      expect(picker).toBeVisible();

      const textContent = picker.textContent?.replace(/\W+/g, "");
      expect(textContent).toMatch(/2113/i);
    });

    it("should show Date value as time when opening", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={false}
            timeFormat={`${FORMATS.HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND}.${FORMATS.MILLISECOND} ${FORMATS.AM_PM}`}
            value={new Date()}
          />
        </>
      );

      // Act
      const element = await screen.findByLabelText("Some Field");
      userEvent.click(element);
      expect(element).toHaveFocus();

      const picker = await screen.findByText(/pm/i);
      expect(picker).toBeVisible();

      const row = await screen.findByRole("row");
      const textContent = row.textContent?.replace(/\W+/g, "");
      expect(textContent).toMatch(/120112034pm/i);
    });
  });

  describe("switchers", () => {
    it("should switch to 'month mode' from 'day mode' when month picker is supported", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FULL_DATE_FORMAT}
            timeFormat={false}
          />
        </>
      );

      const element = await screen.findByLabelText("Some Field");

      // Act
      userEvent.click(element);
      expect(element).toHaveFocus();

      const dayPicker = await screen.findByTestId("day-picker");
      expect(dayPicker).toBeVisible();

      const switcher = await screen.findByTestId("day-mode-switcher");
      expect(switcher).toBeVisible();

      userEvent.click(switcher);

      // Assert
      const monthPicker = await screen.findByTestId("month-picker");
      expect(monthPicker).toBeVisible();
    });

    it("should switch to 'time mode' when time picker is supported", async () => {
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

      // Act
      userEvent.click(element);
      expect(element).toHaveFocus();

      const dayPicker = await screen.findByTestId("day-picker");
      expect(dayPicker).toBeVisible();

      const switcher = await screen.findByTestId("day-to-time-mode-switcher");
      expect(switcher).toBeVisible();

      userEvent.click(switcher);

      // Assert
      const timePicker = await screen.findByTestId("time-picker");
      expect(timePicker).toBeVisible();
    });

    it("should not switch to 'time mode' when time picker is not supported", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FULL_DATE_FORMAT}
            timeFormat={false}
          />
        </>
      );

      const element = await screen.findByLabelText("Some Field");

      // Act
      userEvent.click(element);
      expect(element).toHaveFocus();

      const dayPicker = await screen.findByTestId("day-picker");
      expect(dayPicker).toBeVisible();

      // Assert
      const switcher = screen.queryByTestId("day-to-time-mode-switcher");
      expect(switcher).not.toBeInTheDocument();
    });

    it("should stay on year picker when already on year picker", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={FULL_DATE_FORMAT}
            timeFormat={false}
          />
        </>
      );

      const element = await screen.findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(screen.queryByTestId("picker-wrapper")).not.toBeInTheDocument();

      // Act
      userEvent.click(element);
      expect(await screen.findByTestId("day-picker")).toBeVisible();

      userEvent.click(await screen.findByTestId("day-mode-switcher"));

      expect(await screen.findByTestId("month-picker")).toBeVisible();

      userEvent.click(await screen.findByTestId("month-mode-switcher"));

      expect(await screen.findByTestId("year-picker")).toBeVisible();

      userEvent.click(await screen.findByTestId("year-mode-switcher"));

      // Assert
      expect(await screen.findByTestId("year-picker")).toBeVisible();
    });
  });
});
