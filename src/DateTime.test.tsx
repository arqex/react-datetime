import * as React from "react";
import { render, act, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import isSameDay from "date-fns/isSameDay";
import isSameMonth from "date-fns/isSameMonth";
import isSameYear from "date-fns/isSameYear";

const {
  findByText,
  findByTestId,
  queryByTestId,
  findAllByText,
  findByLabelText
} = screen;

import RawDateTime, { FORMATS } from "./index";

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

afterEach(() => {
  global.Date = RealDate;
});

describe("DateTime", () => {
  it("should render an input", async () => {
    const { container } = render(<DateTime />);

    expect(container.firstChild).toHaveValue("");
  });

  it("should render an input with className", async () => {
    const { container } = render(<DateTime className="form-control" />);

    expect(container.firstChild).toHaveClass("form-control");
  });

  it("should render an input with id", async () => {
    const { container } = render(<DateTime id="some-id" />);

    expect(container.firstChild).toHaveAttribute("id", "some-id");
  });

  it("should render with a invalid string value", async () => {
    const { container } = render(<DateTime value="test" />);

    expect(container.firstChild).toHaveValue("test");
  });

  it("should render with a date string value", async () => {
    const { container } = render(<DateTime value="06/16/2015 12:00 AM" />);

    expect(container.firstChild).toHaveValue("06/16/2015 12:00 AM");
  });

  describe("shouldHideInput", () => {
    it("should not render any input", async () => {
      const { container } = render(<DateTime shouldHideInput />);

      expect(container.querySelector("input")).toBeNull();
    });

    it("should render a picker with className", async () => {
      const { container } = render(
        <DateTime className="some-class" shouldHideInput />
      );

      expect(container.querySelector("input")).toBeNull();
      expect(container.firstChild).toHaveClass("some-class");
    });

    it("should render a picker with id", async () => {
      const { container } = render(<DateTime id="some-id" shouldHideInput />);

      expect(container.querySelector("input")).toBeNull();
      expect(container.firstChild).toHaveAttribute("id", "some-id");
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
      const element = await findByLabelText("Some Field");
      fireEvent.click(element);

      // Assert
      expect(queryByTestId("picker-wrapper")).toBeNull();
      expect(queryByTestId("day-picker")).toBeNull();
      expect(queryByTestId("month-picker")).toBeNull();
      expect(queryByTestId("year-picker")).toBeNull();
      expect(queryByTestId("time-picker")).toBeNull();
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
      expect(queryByTestId("picker-wrapper")).toBeNull();
      expect(queryByTestId("day-picker")).toBeNull();
      expect(queryByTestId("month-picker")).toBeNull();
      expect(queryByTestId("year-picker")).toBeNull();
      expect(queryByTestId("time-picker")).toBeNull();
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
      expect(await findByTestId("picker-wrapper")).toBeVisible();
      expect(await findByTestId("day-picker")).toBeVisible();
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
      const element = await findByLabelText("Some Field");
      fireEvent.click(element);

      // Assert
      const picker = await findByTestId("day-picker");
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
      const element = await findByLabelText("Some Field");
      fireEvent.focus(element);

      // Assert
      const picker = await findByTestId("day-picker");
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
        const element = await findByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(await findByTestId("day-picker")).toBeVisible();

        const monthName = await findByText(/january/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = await findByText("Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
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
        const element = await findByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(await findByTestId("day-picker")).toBeVisible();

        const monthName = await findByText(/february/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = await findByText("Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
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
        const element = await findByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(await findByTestId("day-picker")).toBeVisible();

        const monthName = await findByText(/march/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = await findByText("Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
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
        const element = await findByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(await findByTestId("day-picker")).toBeVisible();

        const monthName = await findByText(/april/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = await findByText("Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
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
        const element = await findByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(await findByTestId("day-picker")).toBeVisible();

        const monthName = await findByText(/may/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = await findByText("Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
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
        const element = await findByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(await findByTestId("day-picker")).toBeVisible();

        const monthName = await findByText(/june/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = await findByText("Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
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
        const element = await findByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(await findByTestId("day-picker")).toBeVisible();

        const monthName = await findByText(/july/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = await findByText("Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
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
        const element = await findByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(await findByTestId("day-picker")).toBeVisible();

        const monthName = await findByText(/august/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = await findByText("Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
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
        const element = await findByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(await findByTestId("day-picker")).toBeVisible();

        const monthName = await findByText(/september/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = await findByText("Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
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
        const element = await findByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(await findByTestId("day-picker")).toBeVisible();

        const monthName = await findByText(/october/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = await findByText("Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
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
        const element = await findByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(await findByTestId("day-picker")).toBeVisible();

        const monthName = await findByText(/november/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = await findByText("Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
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
        const element = await findByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(await findByTestId("day-picker")).toBeVisible();

        const monthName = await findByText(/december/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = await findByText("Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(await findByTestId("day-picker")).toBeVisible();

      const someDay = await findByText("16");
      expect(someDay).toBeVisible();

      // Pick date
      fireEvent.click(someDay);

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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(await findByTestId("day-picker")).toBeVisible();

      const someDay = await findByText("16");
      expect(someDay).toBeVisible();

      // Pick date
      fireEvent.click(someDay);

      expect(element).toHaveValue("");
    });

    it("should block/unblock day picking based on isValidDate", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      const handleChange = jest.fn();
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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(await findByTestId("day-picker")).toBeVisible();

      // Click a date (disabled)
      fireEvent.click(await findByText("16"));

      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click another date (not disabled)
      fireEvent.click(await findByText("17"));

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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(await findByTestId("day-picker")).toBeVisible();

      // Go to previous month (twice)
      const prevButton = await findByText("‹");
      expect(prevButton).toBeVisible();
      fireEvent.click(prevButton);
      fireEvent.click(prevButton);

      // Pick date
      fireEvent.click(await findByText("16"));

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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(await findByTestId("day-picker")).toBeVisible();

      // Go to next month (twice)
      const nextButton = await findByText("›");
      expect(nextButton).toBeVisible();
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      // Pick date
      fireEvent.click(await findByText("16"));

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

      expect(await findByLabelText("Some Field")).toHaveValue("06/16/2015");

      // Act
      // Open picker
      fireEvent.click(await findByLabelText("Some Field"));

      // Assert
      expect(await findByTestId("day-picker")).toBeVisible();

      expect(await findByText("16")).toBeVisible();
      expect(await findByText("16")).toHaveClass("rdtActive");
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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("06/16/2015 11:13 PM");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(await findByTestId("day-picker")).toBeVisible();

      const someDay = await findByText("16");
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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("06/16/2015 11:13 PM");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(await findByTestId("day-picker")).toBeVisible();

      const someDay = await findByText("16");
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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("06/16/2015 11:13 PM");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(await findByTestId("day-picker")).toBeVisible();

      const someDay = await findByText("16");
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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("06/16/2015 11:13 PM");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(await findByTestId("day-picker")).toBeVisible();

      const someDay = await findByText("16");
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
      expect(await findByTestId("picker-wrapper")).toBeVisible();
      expect(await findByTestId("month-picker")).toBeVisible();
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
      const element = await findByLabelText("Some Field");
      fireEvent.click(element);

      // Assert
      const picker = await findByTestId("month-picker");
      expect(picker).toBeVisible();

      {
        const row = await findByText(/jan/i);
        expect(row.parentNode).toHaveTextContent("JanFebMarApr");
      }

      {
        const row = await findByText(/may/i);
        expect(row.parentNode).toHaveTextContent("MayJunJulAug");
      }

      {
        const row = await findByText(/sep/i);
        expect(row.parentNode).toHaveTextContent("SepOctNovDec");
      }
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
      const element = await findByLabelText("Some Field");
      fireEvent.focus(element);

      // Assert
      const picker = await findByTestId("month-picker");
      expect(picker).toBeVisible();

      {
        const row = await findByText(/jan/i);
        expect(row.parentNode).toHaveTextContent("JanFebMarApr");
      }

      {
        const row = await findByText(/may/i);
        expect(row.parentNode).toHaveTextContent("MayJunJulAug");
      }

      {
        const row = await findByText(/sep/i);
        expect(row.parentNode).toHaveTextContent("SepOctNovDec");
      }
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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      fireEvent.click(element);

      // Assert
      const someMonth = await findByText(/jun/i);
      fireEvent.click(someMonth);

      expect(element).toHaveValue("06/2019");
    });

    it("should block/unblock month picking based on isValidDate", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      const handleChange = jest.fn();

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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(await findByTestId("month-picker")).toBeVisible();

      // Click a month (disabled)
      fireEvent.click(await findByText(/jan/i));
      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click a month (disabled)
      fireEvent.click(await findByText(/feb/i));
      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click a month (disabled)
      fireEvent.click(await findByText(/nov/i));
      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click a month (disabled)
      fireEvent.click(await findByText(/feb/i));
      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click another date (not disabled)
      fireEvent.click(await findByText(/mar/i));

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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      fireEvent.click(element);

      // Go to previous year (twice)
      const prevButton = await findByText("‹");
      expect(prevButton).toBeVisible();
      fireEvent.click(prevButton);
      fireEvent.click(prevButton);

      const someMonth = await findByText(/jun/i);
      fireEvent.click(someMonth);

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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      fireEvent.click(element);

      // Go to previous year (twice)
      const nextButton = await findByText("›");
      expect(nextButton).toBeVisible();
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      const someMonth = await findByText(/jun/i);
      fireEvent.click(someMonth);

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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("06/2015");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      const someMonth = await findByText(/jun/i);
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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("06/2015 12:00 AM");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      const someMonth = await findByText(/jun/i);
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
      expect(await findByTestId("picker-wrapper")).toBeVisible();
      expect(await findByTestId("year-picker")).toBeVisible();
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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      fireEvent.click(element);

      // Assert
      const picker = await findByText(/2010-2019/i);
      expect(picker).toBeVisible();

      {
        const row = await findByText(/2009/i);
        expect(row.parentNode).toHaveTextContent("2009201020112012");
      }

      {
        const row = await findByText(/2013/i);
        expect(row.parentNode).toHaveTextContent("2013201420152016");
      }

      {
        const row = await findByText(/2017/i);
        expect(row.parentNode).toHaveTextContent("2017201820192020");
      }
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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      fireEvent.focus(element);

      // Assert
      const picker = await findByText(/2010-2019/i);
      expect(picker).toBeVisible();

      {
        const row = await findByText(/2009/i);
        expect(row.parentNode).toHaveTextContent("2009201020112012");
      }

      {
        const row = await findByText(/2013/i);
        expect(row.parentNode).toHaveTextContent("2013201420152016");
      }

      {
        const row = await findByText(/2017/i);
        expect(row.parentNode).toHaveTextContent("2017201820192020");
      }
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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      fireEvent.click(element);

      expect(await findByTestId("year-picker")).toBeVisible();

      const someYear = await findByText("2015");
      expect(someYear).toBeVisible();

      fireEvent.click(someYear);

      // Assert
      expect(element).toHaveValue("2015");
    });

    it("should block/unblock year picking based on isValidDate", async () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      const handleChange = jest.fn();

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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(await findByTestId("year-picker")).toBeVisible();

      // Click a month (disabled)
      fireEvent.click(await findByText("2010"));
      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click a month (disabled)
      fireEvent.click(await findByText("2011"));
      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click a month (disabled)
      fireEvent.click(await findByText("2014"));
      expect(element).toHaveValue("");
      expect(handleChange).toHaveBeenCalledTimes(0);

      // Click another date (not disabled)
      fireEvent.click(await findByText("2019"));

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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      fireEvent.click(element);
      expect(await findByTestId("year-picker")).toBeVisible();

      // Go to previous decade (twice)
      const prevButton = await findByText("‹");
      expect(prevButton).toBeVisible();
      fireEvent.click(prevButton);
      fireEvent.click(prevButton);

      const someYear = await findByText("1990");
      fireEvent.click(someYear);

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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      fireEvent.click(element);
      expect(await findByTestId("year-picker")).toBeVisible();

      // Go to next decade (twice)
      const nextButton = await findByText("›");
      expect(nextButton).toBeVisible();
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      const someYear = await findByText("2035");
      fireEvent.click(someYear);

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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("2015");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      const someYear = await findByText("2015");
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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("2015 12:00 AM");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      const someYear = await findByText("2015");
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
      expect(await findByTestId("picker-wrapper")).toBeVisible();
      expect(await findByTestId("time-picker")).toBeVisible();
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
      const element = await findByLabelText("Some Field");
      fireEvent.click(element);

      // Assert
      expect(await findByTestId("picker-wrapper")).toBeVisible();
      expect(await findByTestId("time-picker")).toBeVisible();
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
      const element = await findByLabelText("Some Field");
      fireEvent.focus(element);

      // Assert
      expect(await findByTestId("picker-wrapper")).toBeVisible();
      expect(await findByTestId("time-picker")).toBeVisible();

      const picker = await findByText(/am/i);
      expect(picker).toBeVisible();

      const textContent = picker.parentNode?.parentNode?.textContent?.replace(
        /\W+/g,
        ""
      );
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
      const element = await findByLabelText("Some Field");
      fireEvent.click(element);

      const picker = await findByTestId("time-picker");
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
      const element = await findByLabelText("Some Field");
      fireEvent.focus(element);

      const picker = await findByText(/pm/i);
      expect(picker).toBeVisible();

      const textContent = picker.parentNode?.parentNode?.textContent?.replace(
        /\W+/g,
        ""
      );
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
      const element = await findByLabelText("Some Field");
      fireEvent.focus(element);

      const picker = await findByTestId("time-picker");
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
      const element = await findByLabelText("Some Field");
      fireEvent.focus(element);

      const picker = await findByText(/pm/i);
      expect(picker).toBeVisible();

      const textContent = picker.parentNode?.parentNode?.textContent?.replace(
        /\W+/g,
        ""
      );
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

      const element = await findByLabelText("Some Field");

      // Act
      fireEvent.focus(element);

      const dayPicker = await findByTestId("day-picker");
      expect(dayPicker).toBeVisible();

      const switcher = await findByTestId("day-mode-switcher");
      expect(switcher).toBeVisible();

      fireEvent.click(switcher);

      // Assert
      const monthPicker = await findByTestId("month-picker");
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

      const element = await findByLabelText("Some Field");

      // Act
      fireEvent.focus(element);

      const dayPicker = await findByTestId("day-picker");
      expect(dayPicker).toBeVisible();

      const switcher = await findByTestId("day-to-time-mode-switcher");
      expect(switcher).toBeVisible();

      fireEvent.click(switcher);

      // Assert
      const timePicker = await findByTestId("time-picker");
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

      const element = await findByLabelText("Some Field");

      // Act
      fireEvent.focus(element);

      const dayPicker = await findByTestId("day-picker");
      expect(dayPicker).toBeVisible();

      // Assert
      const switcher = queryByTestId("day-to-time-mode-switcher");
      expect(switcher).toBeNull();
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

      const element = await findByLabelText("Some Field");
      expect(element).toHaveValue("");
      expect(queryByTestId("picker-wrapper")).toBeNull();

      // Act
      fireEvent.click(element);
      expect(await findByTestId("day-picker")).toBeVisible();

      fireEvent.click(await findByTestId("day-mode-switcher"));

      expect(await findByTestId("month-picker")).toBeVisible();

      fireEvent.click(await findByTestId("month-mode-switcher"));

      expect(await findByTestId("year-picker")).toBeVisible();

      fireEvent.click(await findByTestId("year-mode-switcher"));

      // Assert
      expect(await findByTestId("year-picker")).toBeVisible();
    });
  });

  describe("end-to-end", () => {
    it("should switch through to year mode, and pick a specific date through various pickers", async () => {
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

      const element = await findByLabelText("Some Field");

      // Act
      fireEvent.focus(element);

      {
        const picker = await findByTestId("day-picker");
        expect(picker).toBeVisible();
      }

      // day -> month picker
      {
        const switcher = await findByTestId("day-mode-switcher");
        expect(switcher).toBeVisible();

        fireEvent.click(switcher);

        // Assert
        const picker = await findByTestId("month-picker");
        expect(picker).toBeVisible();
      }

      // month -> year picker
      {
        const switcher = await findByTestId("month-mode-switcher");
        expect(switcher).toBeVisible();

        fireEvent.click(switcher);

        // Assert
        const picker = await findByTestId("year-picker");
        expect(picker).toBeVisible();
      }

      {
        // click a year (switch to month picker)
        fireEvent.click(await findByText("2020"));

        const picker = await findByTestId("month-picker");
        expect(picker).toBeVisible();
      }

      {
        // click a month (switch to day picker)
        fireEvent.click(await findByText("Feb"));

        const picker = await findByTestId("day-picker");
        expect(picker).toBeVisible();
      }

      // click a day
      fireEvent.click(await findByText("11"));

      // Assert
      expect(await findByLabelText("Some Field")).toHaveValue("02/11/2020");
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

      const element = await findByLabelText("Some Field");

      // Act
      fireEvent.focus(element);

      {
        const picker = await findByTestId("day-picker");
        expect(picker).toBeVisible();
      }

      // day -> month picker
      {
        const switcher = await findByTestId("day-mode-switcher");
        expect(switcher).toBeVisible();

        fireEvent.click(switcher);

        // Assert
        const picker = await findByTestId("month-picker");
        expect(picker).toBeVisible();
      }

      // month -> year picker
      {
        const switcher = await findByTestId("month-mode-switcher");
        expect(switcher).toBeVisible();

        fireEvent.click(switcher);

        // Assert
        const picker = await findByTestId("year-picker");
        expect(picker).toBeVisible();
      }

      {
        // click a year (switch to month picker)
        fireEvent.click(await findByText("2020"));

        const picker = await findByTestId("month-picker");
        expect(picker).toBeVisible();
      }

      {
        // click a month (switch to day picker)
        fireEvent.click(await findByText("Feb"));

        const picker = await findByTestId("day-picker");
        expect(picker).toBeVisible();
      }

      // Switch to time mode
      {
        const switcher = await findByTestId("day-to-time-mode-switcher");
        expect(switcher).toBeVisible();

        fireEvent.click(switcher);
      }

      {
        // Assert
        const picker = await findByTestId("time-picker");
        expect(picker).toBeVisible();

        expect(picker.textContent?.replace(/[^\w/]+/g, "")).toMatch(
          /02\/01\/2020120000000AM/i
        );

        // Click to change the time
        const upArrows = await findAllByText("▲");
        expect(upArrows?.length).toBe(5);

        const downArrows = await findAllByText("▼");
        expect(downArrows?.length).toBe(5);

        // Increase hours from 12 to 1
        act(() => {
          userEvent.click(upArrows[0]);
        });

        // Increase minutes from 00 to 05
        for (let i = 0; i < 5; i++) {
          act(() => {
            userEvent.click(upArrows[1]);
          });
        }

        // Increase seconds from 00 to 35
        for (let i = 0; i < 35; i++) {
          act(() => {
            userEvent.click(upArrows[2]);
          });
        }

        // Increase milliseconds from 000 to 321
        for (let i = 0; i < 321; i++) {
          act(() => {
            userEvent.click(upArrows[3]);
          });
        }

        // Decrease from AM to PM
        act(() => {
          userEvent.click(upArrows[4]);
        });

        expect(picker.textContent?.replace(/[^\w/]+/g, "")).toMatch(
          /02\/01\/202010535321PM/i
        );
      }

      // Switch back to day mode
      {
        const switcher = await findByTestId("time-mode-switcher");
        expect(switcher).toBeVisible();

        fireEvent.click(switcher);
      }

      // click a day
      fireEvent.click(await findByText("11"));

      // Assert
      expect(await findByLabelText("Some Field")).toHaveValue(
        "02/11/2020 1:05:35.321 PM"
      );
    });

    describe("events", () => {
      describe("onChange", () => {
        it("should not trigger onChange Date when opening w/ Date", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleChange = jest.fn();

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

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("01/16/2019");

          // Act
          // Open picker
          fireEvent.click(element);

          expect(handleChange).toHaveBeenCalledTimes(0);
        });

        it("should not trigger onChange Date when clicking same date", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleChange = jest.fn();

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

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("01/16/2019");

          // Act
          // Open picker
          fireEvent.click(element);

          // Assert
          expect(await findByTestId("day-picker")).toBeVisible();

          const someDay = await findByText("16");
          expect(someDay).toBeVisible();

          // Pick date
          fireEvent.click(someDay);

          expect(element).toHaveValue("01/16/2019");

          expect(handleChange).toHaveBeenCalledTimes(0);
        });

        it("should trigger onChange Date when picking a first date", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleChange = jest.fn();

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

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("");
          expect(queryByTestId("picker-wrapper")).toBeNull();

          // Act
          // Open picker
          fireEvent.click(element);

          // Assert
          expect(await findByTestId("day-picker")).toBeVisible();

          const someDay = await findByText("16");
          expect(someDay).toBeVisible();

          // Pick date
          fireEvent.click(someDay);

          expect(element).toHaveValue("01/16/2019");

          expect(handleChange).toHaveBeenCalledTimes(1);
          expect(handleChange).toHaveBeenCalledWith(
            new Date(2019, 0, 16, 0, 0, 0, 0)
          );
        });

        it("should trigger onChange Date when picking a new date", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleChange = jest.fn();

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

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("01/16/2019");

          // Act
          // Open picker
          fireEvent.click(element);

          // Assert
          expect(await findByTestId("day-picker")).toBeVisible();

          const someDay = await findByText("17");
          expect(someDay).toBeVisible();

          // Pick date
          fireEvent.click(someDay);

          expect(element).toHaveValue("01/17/2019");

          expect(handleChange).toHaveBeenCalledTimes(1);
          expect(handleChange).toHaveBeenCalledWith(
            new Date(2019, 0, 17, 12, 1, 12, 34)
          );
        });

        it("should trigger onChange input string when picking a date", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleChange = jest.fn();

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

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("");
          expect(queryByTestId("picker-wrapper")).toBeNull();

          // Act
          // Open picker
          fireEvent.click(element);

          // Assert
          expect(await findByTestId("day-picker")).toBeVisible();

          const someDay = await findByText("16");
          expect(someDay).toBeVisible();

          // Pick date
          fireEvent.click(someDay);

          expect(element).toHaveValue("01/16/2019");

          expect(handleChange).toHaveBeenCalledTimes(1);
          expect(handleChange).toHaveBeenCalledWith("01/16/2019");
        });

        it("should trigger onChange input string when picking a date/time", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleChange = jest.fn();

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

          expect(await findByLabelText("Some Field")).toHaveValue("");
          expect(queryByTestId("picker-wrapper")).toBeNull();

          // Act
          // Open picker
          fireEvent.click(await findByLabelText("Some Field"));

          // Assert
          expect(await findByTestId("day-picker")).toBeVisible();
          expect(await findByText("16")).toBeVisible();

          // Pick date
          fireEvent.click(await findByText("16"));

          expect(await findByLabelText("Some Field")).toHaveValue(
            "01/16/2019 12:00 AM"
          );

          expect(handleChange).toHaveBeenCalledTimes(1);
          expect(handleChange).toHaveBeenCalledWith("01/16/2019 12:00 AM");
        });

        it("should trigger onChange input string when increasing time by one step", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));
          const handleChange = jest.fn();
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

          expect(await findByLabelText("Some Field")).toHaveValue("");
          expect(queryByTestId("picker-wrapper")).toBeNull();

          // Act
          // Open picker
          fireEvent.click(await findByLabelText("Some Field"));

          // Assert
          expect(await findByTestId("time-picker")).toBeVisible();

          // Click to change the time
          const upArrows = await findAllByText("▲");
          expect(upArrows?.length).toBe(3);
          const downArrows = await findAllByText("▼");
          expect(downArrows?.length).toBe(3);

          // Increase hours from 12 to 1
          act(() => {
            userEvent.click(upArrows[0]);
          });

          expect(await findByLabelText("Some Field")).toHaveValue("1:00 AM");
          expect(handleChange).toHaveBeenCalledTimes(1);
          expect(handleChange).toHaveBeenCalledWith("1:00 AM");
        });

        it("should trigger onChange input string when increasing time by 3 hour increment", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleChange = jest.fn();

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
                    step: 3
                  }
                }}
              />
            </>
          );

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("");
          expect(queryByTestId("picker-wrapper")).toBeNull();

          // Act
          // Open picker
          fireEvent.click(element);

          // Assert
          expect(await findByTestId("time-picker")).toBeVisible();

          // Click to change the time
          const upArrows = await findAllByText("▲");
          expect(upArrows?.length).toBe(3);

          const downArrows = await findAllByText("▼");
          expect(downArrows?.length).toBe(3);

          // Increase hours from 12 to 3
          act(() => {
            userEvent.click(upArrows[0]);
          });

          expect(element).toHaveValue("3:00 AM");

          expect(handleChange).toHaveBeenCalledTimes(1);
          expect(handleChange).toHaveBeenCalledWith("3:00 AM");

          // Decrease hours from 3 to 12
          act(() => {
            userEvent.click(downArrows[0]);
          });

          expect(element).toHaveValue("12:00 AM");

          expect(handleChange).toHaveBeenCalledTimes(2);
          expect(handleChange).toHaveBeenCalledWith("12:00 AM");
        });

        it("should trigger onChange input string when increasing time by 15 min increment", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleChange = jest.fn();

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
                    step: 15
                  }
                }}
              />
            </>
          );

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("");
          expect(queryByTestId("picker-wrapper")).toBeNull();

          // Act
          // Open picker
          fireEvent.click(element);

          // Assert
          expect(await findByTestId("time-picker")).toBeVisible();

          // Click to change the time
          const upArrows = await findAllByText("▲");
          expect(upArrows?.length).toBe(3);

          const downArrows = await findAllByText("▼");
          expect(downArrows?.length).toBe(3);

          // Increase minutes from 0 to 15
          act(() => {
            userEvent.click(upArrows[1]);
          });

          expect(element).toHaveValue("12:15 AM");

          expect(handleChange).toHaveBeenCalledTimes(1);
          expect(handleChange).toHaveBeenCalledWith("12:15 AM");

          // Decrease minutes from 15 to 0
          act(() => {
            userEvent.click(downArrows[1]);
          });

          expect(element).toHaveValue("12:00 AM");

          expect(handleChange).toHaveBeenCalledTimes(2);
          expect(handleChange).toHaveBeenCalledWith("12:00 AM");
        });

        it("should trigger onChange input string when increasing time by 30 second increment", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleChange = jest.fn();

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
                    step: 30
                  }
                }}
              />
            </>
          );

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("");
          expect(queryByTestId("picker-wrapper")).toBeNull();

          // Act
          // Open picker
          fireEvent.click(element);

          // Assert
          expect(await findByTestId("time-picker")).toBeVisible();

          // Click to change the time
          const upArrows = await findAllByText("▲");
          expect(upArrows?.length).toBe(4);

          const downArrows = await findAllByText("▼");
          expect(downArrows?.length).toBe(4);

          // Increase seconds from 0 to 30
          act(() => {
            userEvent.click(upArrows[2]);
          });

          expect(element).toHaveValue("12:00:30 AM");

          expect(handleChange).toHaveBeenCalledTimes(1);
          expect(handleChange).toHaveBeenCalledWith("12:00:30 AM");

          // Decrease seconds from 30 to 0
          act(() => {
            userEvent.click(downArrows[2]);
          });

          expect(element).toHaveValue("12:00:00 AM");

          expect(handleChange).toHaveBeenCalledTimes(2);
          expect(handleChange).toHaveBeenCalledWith("12:00:00 AM");
        });

        it("should trigger onChange input string when increasing time by 10 milliseconds increment", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleChange = jest.fn();

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
                    step: 10
                  }
                }}
              />
            </>
          );

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("");
          expect(queryByTestId("picker-wrapper")).toBeNull();

          // Act
          // Open picker
          fireEvent.click(element);

          // Assert
          expect(await findByTestId("time-picker")).toBeVisible();

          // Click to change the time
          const upArrows = await findAllByText("▲");
          expect(upArrows?.length).toBe(5);

          const downArrows = await findAllByText("▼");
          expect(downArrows?.length).toBe(5);

          // Increase milliseconds from 0 to 10
          act(() => {
            userEvent.click(upArrows[3]);
          });

          expect(element).toHaveValue("12:00:00.010 AM");

          expect(handleChange).toHaveBeenCalledTimes(1);
          expect(handleChange).toHaveBeenCalledWith("12:00:00.010 AM");

          // Decrease milliseconds from 10 to 0
          act(() => {
            userEvent.click(downArrows[3]);
          });

          expect(element).toHaveValue("12:00:00.000 AM");

          expect(handleChange).toHaveBeenCalledTimes(2);
          expect(handleChange).toHaveBeenCalledWith("12:00:00.000 AM");
        });

        it('should trigger onChange input string once holding down the "up" seconds for a bit of time', async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleChange = jest.fn();

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

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("");
          expect(queryByTestId("picker-wrapper")).toBeNull();

          // Act
          // Open picker
          fireEvent.click(element);

          // Assert
          expect(await findByTestId("time-picker")).toBeVisible();

          // Click to change the time
          const upArrows = await findAllByText("▲");
          expect(upArrows?.length).toBe(4);

          const downArrows = await findAllByText("▼");
          expect(downArrows?.length).toBe(4);

          // Increase seconds
          act(() => {
            jest.useFakeTimers();

            fireEvent.mouseDown(upArrows[2]);

            // Fast forward and exhaust only currently pending timers
            // (but not any new timers that get created during that process)
            jest.runOnlyPendingTimers();

            // Fast forward and exhaust only currently pending timers
            // (but not any new timers that get created during that process)
            jest.runOnlyPendingTimers();

            // Fast forward and exhaust only currently pending timers
            // (but not any new timers that get created during that process)
            jest.runOnlyPendingTimers();

            // Fast forward and exhaust only currently pending timers
            // (but not any new timers that get created during that process)
            jest.runOnlyPendingTimers();

            fireEvent.mouseUp(upArrows[2]);

            jest.useRealTimers();
          });

          expect(element).toHaveValue("12:00:04 AM");

          expect(handleChange).toHaveBeenCalledTimes(1);
          expect(handleChange).toHaveBeenCalledWith("12:00:04 AM");
        });

        it("should trigger onChange utc-ms-timestamp when picking a date", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleChange = jest.fn();

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

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("");
          expect(queryByTestId("picker-wrapper")).toBeNull();

          // Act
          // Open picker
          fireEvent.click(element);

          // Assert
          expect(await findByTestId("day-picker")).toBeVisible();

          const someDay = await findByText("16");
          expect(someDay).toBeVisible();

          // Pick date
          fireEvent.click(someDay);

          expect(element).toHaveValue("01/16/2019");

          expect(handleChange).toHaveBeenCalledTimes(1);
          expect(handleChange).toHaveBeenCalledWith(
            new Date(2019, 0, 16, 0, 0, 0, 0).getTime()
          );
        });
      });

      describe("onFocus", () => {
        it("should trigger onFocus when tabbed in", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleFocus = jest.fn();

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

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("");
          expect(queryByTestId("picker-wrapper")).toBeNull();

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

          const handleFocus = jest.fn();

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

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("");
          expect(queryByTestId("picker-wrapper")).toBeNull();

          // Act
          userEvent.click(element);

          // Should have triggered "onFocus"
          expect(handleFocus).toHaveBeenCalledTimes(1);
        });
      });

      describe("onBlur", () => {
        it("should trigger onBlur with no value when tabbed out with no value", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleBlur = jest.fn();

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

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("");
          expect(queryByTestId("picker-wrapper")).toBeNull();

          // Act
          expect(document.body).toHaveFocus();

          // Tab in
          userEvent.tab();
          expect(element).toHaveFocus();

          // Tab out
          userEvent.tab();
          expect(element).not.toHaveFocus();

          // Should have triggered "onBlur"
          expect(handleBlur).toHaveBeenCalledTimes(1);
          expect(handleBlur).toHaveBeenCalledWith(undefined);
        });

        it("should trigger onBlur with value when tabbed out with value", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleBlur = jest.fn();

          // Arrange
          render(
            <>
              <label htmlFor="some-id">Some Field</label>
              <DateTime
                id="some-id"
                dateFormat={FULL_DATE_FORMAT}
                timeFormat={false}
                value={new Date(2019, 0, 16, 12, 1, 12, 34)}
                onBlur={handleBlur}
              />
              <label htmlFor="another-id">Another Field</label>
              <input id="another-id" type="text" />
            </>
          );

          const element = await findByLabelText("Some Field");
          expect(queryByTestId("picker-wrapper")).toBeNull();

          // Act
          expect(document.body).toHaveFocus();

          // Tab in
          userEvent.tab();
          expect(element).toHaveFocus();

          // Tab out
          userEvent.tab();
          expect(element).not.toHaveFocus();

          // Should have triggered "onBlur"
          expect(handleBlur).toHaveBeenCalledTimes(1);
          expect(handleBlur).toHaveBeenCalledWith(
            new Date(2019, 0, 16, 12, 1, 12, 34)
          );
        });

        it("should trigger onBlur when picking a first date", async () => {
          mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

          const handleBlur = jest.fn();

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

          const element = await findByLabelText("Some Field");
          expect(element).toHaveValue("");
          expect(queryByTestId("picker-wrapper")).toBeNull();

          // Act
          // Open picker
          fireEvent.click(element);

          // Assert
          expect(await findByTestId("day-picker")).toBeVisible();

          const someDay = await findByText("16");
          expect(someDay).toBeVisible();

          // Pick date
          fireEvent.click(someDay);

          expect(element).toHaveValue("01/16/2019");

          expect(handleBlur).toHaveBeenCalledTimes(1);
          expect(handleBlur).toHaveBeenCalledWith(
            new Date(2019, 0, 16, 0, 0, 0, 0)
          );
        });
      });
    });

    describe("keyboard", () => {
      it("should let you type to mark a full date active", async () => {
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

        const element = await findByLabelText("Some Field");
        expect(element).toHaveValue("");
        expect(queryByTestId("picker-wrapper")).toBeNull();

        // Act
        // Open picker
        fireEvent.focus(element);

        // Should start visible with nothing active
        expect(await findByTestId("day-picker")).toBeVisible();
        expect(await findByText("16")).toBeVisible();
        expect(await findByText("16")).not.toHaveClass("rdtActive");

        userEvent.type(element, "06/16/2015");

        // Assert the typed value is now active
        expect(await findByTestId("day-picker")).toBeVisible();
        expect(await findByText("16")).toBeVisible();
        expect(await findByText("16")).toHaveClass("rdtActive");
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

        const element = await findByLabelText("Some Field");
        expect(element).toHaveValue("");
        expect(queryByTestId("picker-wrapper")).toBeNull();

        // Act
        // Open picker
        fireEvent.focus(element);

        // Should start visible with nothing active
        expect(await findByTestId("month-picker")).toBeVisible();
        expect(await findByText(/jun/i)).toBeVisible();
        expect(await findByText(/jun/i)).not.toHaveClass("rdtActive");

        userEvent.type(element, "06/2015");

        // Assert the typed value is now active
        expect(await findByTestId("month-picker")).toBeVisible();
        expect(await findByText(/jun/i)).toBeVisible();
        expect(await findByText(/jun/i)).toHaveClass("rdtActive");
      });

      it("should let you type to mark a year active", async () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        // Arrange
        render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime
              id="some-id"
              dateFormat={FORMATS.YEAR}
              timeFormat={false}
            />
          </>
        );

        const element = await findByLabelText("Some Field");
        expect(element).toHaveValue("");
        expect(queryByTestId("picker-wrapper")).toBeNull();

        // Act
        // Open picker
        fireEvent.focus(element);

        // Should start visible with nothing active
        expect(await findByTestId("year-picker")).toBeVisible();
        expect(await findByText(/2015/i)).toBeVisible();
        expect(await findByText(/2015/i)).not.toHaveClass("rdtActive");

        userEvent.type(element, "2015");

        // Assert the typed value is now active
        expect(await findByTestId("year-picker")).toBeVisible();
        expect(await findByText(/2015/i)).toBeVisible();
        expect(await findByText(/2015/i)).toHaveClass("rdtActive");
      });

      it("should let you type to mark a time active", async () => {
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

        const element = await findByLabelText("Some Field");
        expect(element).toHaveValue("");
        expect(queryByTestId("picker-wrapper")).toBeNull();

        // Act
        // Open picker
        fireEvent.focus(element);

        // Should start visible with nothing active
        const picker = await findByTestId("time-picker");
        expect(picker).toBeVisible();
        {
          const textContent = picker.textContent?.replace(/\W+/g, "");
          expect(textContent).toMatch(/1200AM/i);
        }

        userEvent.type(element, "4:13 PM");

        // Assert the typed value is now active
        expect(await findByTestId("time-picker")).toBeVisible();
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

        const element = await findByLabelText("Some Field");
        expect(element).toHaveValue("");
        expect(queryByTestId("picker-wrapper")).toBeNull();

        // Act
        // Open picker
        fireEvent.focus(element);

        // Should start visible with nothing active
        expect(await findByTestId("day-picker")).toBeVisible();
        expect(await findByText("16")).toBeVisible();
        expect(await findByText("16")).not.toHaveClass("rdtActive");

        userEvent.type(element, "06/16/2015 12:00 AM");

        // Assert the typed value is now active
        expect(await findByTestId("day-picker")).toBeVisible();
        expect(await findByText("16")).toBeVisible();
        expect(await findByText("16")).toHaveClass("rdtActive");
      });

      it("should show when tabbed in", async () => {
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

        const element = await findByLabelText("Some Field");
        expect(element).toHaveValue("");
        expect(queryByTestId("picker-wrapper")).toBeNull();

        // Act
        expect(document.body).toHaveFocus();

        // Open picker
        userEvent.tab();
        expect(element).toHaveFocus();

        // Should become visible
        expect(await findByTestId("picker-wrapper")).toBeVisible();
        expect(await findByTestId("day-picker")).toBeVisible();
      });

      it("should hide when open and hitting enter", async () => {
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

        const element = await findByLabelText("Some Field");
        expect(element).toHaveValue("");
        expect(queryByTestId("picker-wrapper")).toBeNull();

        // Act
        // Open picker
        fireEvent.focus(element);

        // Should become visible
        expect(await findByTestId("picker-wrapper")).toBeVisible();
        expect(await findByTestId("day-picker")).toBeVisible();

        // Hit enter
        fireEvent.keyDown(element, {
          key: "Enter",
          code: 13,
          keyCode: 13,
          charCode: 13
        });
        fireEvent.keyUp(element, {
          key: "Enter",
          code: 13,
          keyCode: 13,
          charCode: 13
        });

        // Assert the picker is closed
        expect(queryByTestId("picker-wrapper")).toBeNull();
        expect(queryByTestId("day-picker")).toBeNull();
      });

      it("should open when closed and hitting down arrow", async () => {
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

        const element = await findByLabelText("Some Field");
        expect(element).toHaveValue("");
        expect(queryByTestId("picker-wrapper")).toBeNull();

        // Hit down arrow
        fireEvent.keyDown(element, {
          key: "ArrowDown",
          code: 40,
          keyCode: 40,
          charCode: 40
        });
        fireEvent.keyUp(element, {
          key: "ArrowDown",
          code: 40,
          keyCode: 40,
          charCode: 40
        });

        // Assert the picker is open
        expect(await findByTestId("picker-wrapper")).toBeVisible();
        expect(await findByTestId("day-picker")).toBeVisible();
      });

      it("should hide when open and hitting escape", async () => {
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

        const element = await findByLabelText("Some Field");
        expect(element).toHaveValue("");
        expect(queryByTestId("picker-wrapper")).toBeNull();

        // Act
        // Open picker
        fireEvent.focus(element);

        // Should become visible
        expect(await findByTestId("picker-wrapper")).toBeVisible();
        expect(await findByTestId("day-picker")).toBeVisible();

        // Hit escape
        fireEvent.keyDown(element, {
          key: "Escape",
          code: 27,
          keyCode: 27,
          charCode: 27
        });
        fireEvent.keyUp(element, {
          key: "Escape",
          code: 27,
          keyCode: 27,
          charCode: 27
        });

        // Assert the picker is closed
        expect(queryByTestId("picker-wrapper")).toBeNull();
        expect(queryByTestId("day-picker")).toBeNull();
      });

      it("should hide when open and hitting tab", async () => {
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

        const element = await findByLabelText("Some Field");
        expect(element).toHaveValue("");
        expect(queryByTestId("picker-wrapper")).toBeNull();

        // Act
        // Open picker
        fireEvent.focus(element);

        // Should become visible
        expect(await findByTestId("picker-wrapper")).toBeVisible();
        expect(await findByTestId("day-picker")).toBeVisible();

        // Hit tab
        fireEvent.keyDown(element, {
          key: "Tab",
          code: 9,
          keyCode: 9,
          charCode: 9
        });
        fireEvent.keyUp(element, {
          key: "Tab",
          code: 9,
          keyCode: 9,
          charCode: 9
        });

        // Assert the picker is closed
        expect(queryByTestId("picker-wrapper")).toBeNull();
        expect(queryByTestId("day-picker")).toBeNull();
      });
    });
  });
});
