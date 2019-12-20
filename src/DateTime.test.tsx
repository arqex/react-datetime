import * as React from "react";
import {
  render,
  act,
  fireEvent,
  getByText,
  getByTestId,
  queryByTestId,
  getAllByText
  //queryByText
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import RawDateTime from "./index";

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
  it("should render an input", () => {
    const { container } = render(<DateTime />);

    expect(container.firstChild).toHaveValue("");
  });

  it("should render an input with className", () => {
    const { container } = render(<DateTime className="form-control" />);

    expect(container.firstChild).toHaveClass("form-control");
  });

  it("should render an input with id", () => {
    const { container } = render(<DateTime id="some-id" />);

    expect(container.firstChild).toHaveAttribute("id", "some-id");
  });

  it("should render an with a invalid string value", () => {
    const { container } = render(<DateTime value="test" />);

    expect(container.firstChild).toHaveValue("test");
  });

  it("should render an with a date string value", () => {
    const { container } = render(<DateTime value="06/16/2015 12:00 AM" />);

    expect(container.firstChild).toHaveValue("06/16/2015 12:00 AM");
  });

  describe("day picker", () => {
    it("should open day picker when clicking", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/dd/yyyy" />
        </>
      );

      // Act
      const element = getByLabelText("Some Field");
      fireEvent.click(element);

      // Assert
      const picker = getByTestId(document.body, "day-picker");
      expect(picker).toBeVisible();
    });

    it("should open day picker on focus", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/dd/yyyy" />
        </>
      );

      // Act
      const element = getByLabelText("Some Field");
      fireEvent.focus(element);

      // Assert
      const picker = getByTestId(document.body, "day-picker");
      expect(picker).toBeVisible();
    });

    // it("should close day picker on blur", () => {
    //   mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

    //   // Arrange
    //   const { getByLabelText } = render(
    //     <>
    //       <label htmlFor="some-id">Some Field</label>
    //       <DateTime id="some-id" dateFormat="LL/dd/yyyy" />
    //     </>
    //   );

    //   const element = getByLabelText("Some Field");

    //   // Act
    //   fireEvent.focus(element);

    //   // Assert
    //   const monthName = getByText(document.body, /january/i);
    //   expect(monthName).toBeVisible();

    //   fireEvent.blur(element);

    //   expect(queryByText(document.body, /january/i)).toBeNull();
    // });

    describe("should open various months based on current date", () => {
      it("should open january day picker when clicking", () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = getByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const monthName = getByText(document.body, /january/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = getByText(document.body, "Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open february day picker when clicking", () => {
        mockDate(new Date(2019, 1, 1, 12, 1, 12, 34));

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = getByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const monthName = getByText(document.body, /february/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = getByText(document.body, "Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open march day picker when clicking", () => {
        mockDate(new Date(2019, 2, 1, 12, 1, 12, 34));

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = getByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const monthName = getByText(document.body, /march/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = getByText(document.body, "Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open april day picker when clicking", () => {
        mockDate(new Date(2019, 3, 1, 12, 1, 12, 34));

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = getByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const monthName = getByText(document.body, /april/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = getByText(document.body, "Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open may day picker when clicking", () => {
        mockDate(new Date(2019, 4, 1, 12, 1, 12, 34));

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = getByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const monthName = getByText(document.body, /may/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = getByText(document.body, "Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open june day picker when clicking", () => {
        mockDate(new Date(2019, 5, 1, 12, 1, 12, 34));

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = getByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const monthName = getByText(document.body, /june/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = getByText(document.body, "Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open july day picker when clicking", () => {
        mockDate(new Date(2019, 6, 1, 12, 1, 12, 34));

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = getByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const monthName = getByText(document.body, /july/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = getByText(document.body, "Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open august day picker when clicking", () => {
        mockDate(new Date(2019, 7, 1, 12, 1, 12, 34));

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = getByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const monthName = getByText(document.body, /august/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = getByText(document.body, "Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open september day picker when clicking", () => {
        mockDate(new Date(2019, 8, 1, 12, 1, 12, 34));

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = getByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const monthName = getByText(document.body, /september/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = getByText(document.body, "Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open october day picker when clicking", () => {
        mockDate(new Date(2019, 9, 1, 12, 1, 12, 34));

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = getByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const monthName = getByText(document.body, /october/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = getByText(document.body, "Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open november day picker when clicking", () => {
        mockDate(new Date(2019, 10, 1, 12, 1, 12, 34));

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = getByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const monthName = getByText(document.body, /november/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = getByText(document.body, "Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
      });

      it("should open december day picker when clicking", () => {
        mockDate(new Date(2019, 11, 1, 12, 1, 12, 34));

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime id="some-id" />
          </>
        );

        // Act
        const element = getByLabelText("Some Field");
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const monthName = getByText(document.body, /december/i);
        expect(monthName).toBeVisible();

        const dayOfWeekRow = getByText(document.body, "Su");
        expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
      });
    });

    it("should choose day from picker", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/dd/yyyy" timeFormat={false} />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(getByTestId(document.body, "day-picker")).toBeVisible();

      const someDay = getByText(document.body, "16");
      expect(someDay).toBeVisible();

      // Pick date
      fireEvent.click(someDay);

      expect(element).toHaveValue("01/16/2019");
    });

    it("should navigate to previous months from picker", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/dd/yyyy" timeFormat={false} />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(getByTestId(document.body, "day-picker")).toBeVisible();

      // Go to previous month (twice)
      const prevButton = getByText(document.body, "‹");
      expect(prevButton).toBeVisible();
      fireEvent.click(prevButton);
      fireEvent.click(prevButton);

      // Pick date
      fireEvent.click(getByText(document.body, "16"));

      expect(element).toHaveValue("11/16/2018");
    });

    it("should navigate to next months from picker", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/dd/yyyy" timeFormat={false} />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(getByTestId(document.body, "day-picker")).toBeVisible();

      // Go to next month (twice)
      const nextButton = getByText(document.body, "›");
      expect(nextButton).toBeVisible();
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      // Pick date
      fireEvent.click(getByText(document.body, "16"));

      expect(element).toHaveValue("03/16/2019");
    });

    it("should mark date value as active with just date", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat="LL/dd/yyyy"
            timeFormat={false}
            value="06/16/2015"
          />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("06/16/2015");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(getByTestId(document.body, "day-picker")).toBeVisible();

      const someDay = getByText(document.body, "16");
      expect(someDay).toBeVisible();
      expect(someDay).toHaveClass("rdtActive");
    });

    it("should mark date value as active with date and time", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat="LL/dd/yyyy"
            timeFormat="h:mm a"
            value="06/16/2015 12:00 AM"
          />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("06/16/2015 12:00 AM");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      expect(getByTestId(document.body, "day-picker")).toBeVisible();

      const someDay = getByText(document.body, "16");
      expect(someDay).toBeVisible();
      expect(someDay).toHaveClass("rdtActive");
    });
  });

  describe("month picker", () => {
    it("should open month picker when clicking", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/yyyy" />
        </>
      );

      // Act
      const element = getByLabelText("Some Field");
      fireEvent.click(element);

      // Assert
      const picker = getByTestId(document.body, "month-picker");
      expect(picker).toBeVisible();

      {
        const row = getByText(document.body, /jan/i);
        expect(row.parentNode).toHaveTextContent("JanFebMarApr");
      }

      {
        const row = getByText(document.body, /may/i);
        expect(row.parentNode).toHaveTextContent("MayJunJulAug");
      }

      {
        const row = getByText(document.body, /sep/i);
        expect(row.parentNode).toHaveTextContent("SepOctNovDec");
      }
    });

    it("should open month picker on focus", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/yyyy" />
        </>
      );

      // Act
      const element = getByLabelText("Some Field");
      fireEvent.focus(element);

      // Assert
      const picker = getByTestId(document.body, "month-picker");
      expect(picker).toBeVisible();

      {
        const row = getByText(document.body, /jan/i);
        expect(row.parentNode).toHaveTextContent("JanFebMarApr");
      }

      {
        const row = getByText(document.body, /may/i);
        expect(row.parentNode).toHaveTextContent("MayJunJulAug");
      }

      {
        const row = getByText(document.body, /sep/i);
        expect(row.parentNode).toHaveTextContent("SepOctNovDec");
      }
    });

    // it("should close month picker on blur", () => {
    //   mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

    //   // Arrange
    //   const { getByLabelText } = render(
    //     <>
    //       <label htmlFor="some-id">Some Field</label>
    //       <DateTime id="some-id" dateFormat="LL/yyyy" />
    //     </>
    //   );

    //   const element = getByLabelText("Some Field");

    //   // Act
    //   fireEvent.focus(element);

    //   // Assert
    //   const picker = getByTestId(document.body, "month-picker");
    //   expect(picker).toBeVisible();

    //   fireEvent.blur(element);

    //   expect(queryByText(document.body, /jan/i)).toBeNull();
    // });

    it("should choose month from picker", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/yyyy" timeFormat={false} />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("");

      // Act
      fireEvent.click(element);

      // Assert
      const someMonth = getByText(document.body, /jun/i);
      fireEvent.click(someMonth);

      expect(element).toHaveValue("06/2019");
    });

    it("should navigate to previous year's months from picker", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/yyyy" timeFormat={false} />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("");

      // Act
      fireEvent.click(element);

      // Go to previous year (twice)
      const prevButton = getByText(document.body, "‹");
      expect(prevButton).toBeVisible();
      fireEvent.click(prevButton);
      fireEvent.click(prevButton);

      const someMonth = getByText(document.body, /jun/i);
      fireEvent.click(someMonth);

      // Assert
      expect(element).toHaveValue("06/2017");
    });

    it("should navigate to next year's months from picker", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/yyyy" timeFormat={false} />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("");

      // Act
      fireEvent.click(element);

      // Go to previous year (twice)
      const nextButton = getByText(document.body, "›");
      expect(nextButton).toBeVisible();
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      const someMonth = getByText(document.body, /jun/i);
      fireEvent.click(someMonth);

      // Assert
      expect(element).toHaveValue("06/2021");
    });

    it("should mark month value as active with just date", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat="LL/yyyy"
            timeFormat={false}
            value="06/2015"
          />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("06/2015");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      const someMonth = getByText(document.body, /jun/i);
      expect(someMonth).toBeVisible();
      expect(someMonth).toHaveClass("rdtActive");
    });

    it("should mark month value as active with date and time", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat="LL/yyyy"
            timeFormat="h:mm a"
            value="06/2015 12:00 AM"
          />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("06/2015 12:00 AM");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      const someMonth = getByText(document.body, /jun/i);
      expect(someMonth).toBeVisible();
      expect(someMonth).toHaveClass("rdtActive");
    });
  });

  describe("year picker", () => {
    it("should open year picker when clicking", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="yyyy" />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("");

      // Act
      fireEvent.click(element);

      // Assert
      const picker = getByText(document.body, /2010-2019/i);
      expect(picker).toBeVisible();

      {
        const row = getByText(document.body, /2009/i);
        expect(row.parentNode).toHaveTextContent("2009201020112012");
      }

      {
        const row = getByText(document.body, /2013/i);
        expect(row.parentNode).toHaveTextContent("2013201420152016");
      }

      {
        const row = getByText(document.body, /2017/i);
        expect(row.parentNode).toHaveTextContent("2017201820192020");
      }
    });

    it("should open year picker on focus", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="yyyy" />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("");

      // Act
      fireEvent.focus(element);

      // Assert
      const picker = getByText(document.body, /2010-2019/i);
      expect(picker).toBeVisible();

      {
        const row = getByText(document.body, /2009/i);
        expect(row.parentNode).toHaveTextContent("2009201020112012");
      }

      {
        const row = getByText(document.body, /2013/i);
        expect(row.parentNode).toHaveTextContent("2013201420152016");
      }

      {
        const row = getByText(document.body, /2017/i);
        expect(row.parentNode).toHaveTextContent("2017201820192020");
      }
    });

    // it("should close year picker on blur", () => {
    //   mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

    //   // Arrange
    //   const { getByLabelText } = render(
    //     <>
    //       <label htmlFor="some-id">Some Field</label>
    //       <DateTime id="some-id" dateFormat="yyyy" />
    //     </>
    //   );

    //   const element = getByLabelText("Some Field");
    //   expect(element).toHaveValue("");

    //   // Act
    //   fireEvent.focus(element);

    //   // Assert
    //   const picker = getByText(document.body, /2010-2019/i);
    //   expect(picker).toBeVisible();

    //   fireEvent.blur(element);

    //   expect(queryByText(document.body, /2010-2019/i)).toBeNull();
    // });

    it("should choose year from picker", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="yyyy" timeFormat={false} />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("");

      // Act
      fireEvent.click(element);

      expect(getByTestId(document.body, "year-picker")).toBeVisible();

      const someYear = getByText(document.body, "2015");
      expect(someYear).toBeVisible();

      fireEvent.click(someYear);

      // Assert
      expect(element).toHaveValue("2015");
    });

    it("should navigate to previous decades from picker", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="yyyy" timeFormat={false} />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("");

      // Act
      fireEvent.click(element);
      expect(getByTestId(document.body, "year-picker")).toBeVisible();

      // Go to previous decade (twice)
      const prevButton = getByText(document.body, "‹");
      expect(prevButton).toBeVisible();
      fireEvent.click(prevButton);
      fireEvent.click(prevButton);

      const someYear = getByText(document.body, "1990");
      fireEvent.click(someYear);

      // Assert
      expect(element).toHaveValue("1990");
    });

    it("should navigate to next decades from picker", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="yyyy" timeFormat={false} />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("");

      // Act
      fireEvent.click(element);
      expect(getByTestId(document.body, "year-picker")).toBeVisible();

      // Go to next decade (twice)
      const nextButton = getByText(document.body, "›");
      expect(nextButton).toBeVisible();
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      const someYear = getByText(document.body, "2035");
      fireEvent.click(someYear);

      // Assert
      expect(element).toHaveValue("2035");
    });

    it("should mark year value as active with just date", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat="yyyy"
            timeFormat={false}
            value="2015"
          />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("2015");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      const someYear = getByText(document.body, "2015");
      expect(someYear).toBeVisible();
      expect(someYear).toHaveClass("rdtActive");
    });

    it("should mark year value as active with date and time", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat="yyyy"
            timeFormat="h:mm a"
            value="2015 12:00 AM"
          />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("2015 12:00 AM");

      // Act
      // Open picker
      fireEvent.click(element);

      // Assert
      const someYear = getByText(document.body, "2015");
      expect(someYear).toBeVisible();
      expect(someYear).toHaveClass("rdtActive");
    });
  });

  describe("time picker", () => {
    it("should open time picker when clicking", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat={false} timeFormat="h:mm a" />
        </>
      );

      // Act
      const element = getByLabelText("Some Field");
      fireEvent.click(element);

      const picker = getByText(document.body, /am/i);
      expect(picker).toBeVisible();

      const textContent = picker.parentNode?.parentNode?.textContent?.replace(
        /\W+/g,
        ""
      );
      expect(textContent).toMatch(/1200AM/i);
    });

    it("should open time picker on focus", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat={false} timeFormat="h:mm a" />
        </>
      );

      // Act
      const element = getByLabelText("Some Field");
      fireEvent.focus(element);

      const picker = getByText(document.body, /am/i);
      expect(picker).toBeVisible();

      const textContent = picker.parentNode?.parentNode?.textContent?.replace(
        /\W+/g,
        ""
      );
      expect(textContent).toMatch(/1200AM/i);
    });

    // it("should close time picker on blur", () => {
    //   mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

    //   // Arrange
    //   const { getByLabelText } = render(
    //     <>
    //       <label htmlFor="some-id">Some Field</label>
    //       <DateTime id="some-id" dateFormat={false} timeFormat="h:mm a" />
    //     </>
    //   );

    //   const element = getByLabelText("Some Field");

    //   // Act
    //   fireEvent.focus(element);

    //   const picker = getByText(document.body, /am/i);
    //   expect(picker).toBeVisible();

    //   fireEvent.blur(element);

    //   expect(queryByText(document.body, /am/i)).toBeNull();
    // });

    it("should use value when opening", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={false}
            timeFormat="h:mm a"
            value="2:13 PM"
          />
        </>
      );

      // Act
      const element = getByLabelText("Some Field");
      fireEvent.focus(element);

      const picker = getByText(document.body, /pm/i);
      expect(picker).toBeVisible();

      const textContent = picker.parentNode?.parentNode?.textContent?.replace(
        /\W+/g,
        ""
      );
      expect(textContent).toMatch(/213pm/i);
    });

    it("should show Date value as time when opening", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat={false}
            timeFormat="h:mm:ss.SSS a"
            value={new Date()}
          />
        </>
      );

      // Act
      const element = getByLabelText("Some Field");
      fireEvent.focus(element);

      const picker = getByText(document.body, /pm/i);
      expect(picker).toBeVisible();

      const textContent = picker.parentNode?.parentNode?.textContent?.replace(
        /\W+/g,
        ""
      );
      expect(textContent).toMatch(/120112034pm/i);
    });
  });

  describe("switchers", () => {
    it("should switch to 'month mode' from 'day mode' when month picker is supported", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/dd/yyyy" timeFormat={false} />
        </>
      );

      const element = getByLabelText("Some Field");

      // Act
      fireEvent.focus(element);

      const dayPicker = getByTestId(document.body, "day-picker");
      expect(dayPicker).toBeVisible();

      const switcher = getByTestId(document.body, "day-mode-switcher");
      expect(switcher).toBeVisible();

      fireEvent.click(switcher);

      // Assert
      const monthPicker = getByTestId(document.body, "month-picker");
      expect(monthPicker).toBeVisible();
    });

    it("should switch to 'time mode' when time picker is supported", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/dd/yyyy" timeFormat="h:mm a" />
        </>
      );

      const element = getByLabelText("Some Field");

      // Act
      fireEvent.focus(element);

      const dayPicker = getByTestId(document.body, "day-picker");
      expect(dayPicker).toBeVisible();

      const switcher = getByTestId(document.body, "day-to-time-mode-switcher");
      expect(switcher).toBeVisible();

      fireEvent.click(switcher);

      // Assert
      const timePicker = getByTestId(document.body, "time-picker");
      expect(timePicker).toBeVisible();
    });

    it("should not switch to 'time mode' when time picker is not supported", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/dd/yyyy" timeFormat={false} />
        </>
      );

      const element = getByLabelText("Some Field");

      // Act
      fireEvent.focus(element);

      const dayPicker = getByTestId(document.body, "day-picker");
      expect(dayPicker).toBeVisible();

      // Assert
      const switcher = queryByTestId(
        document.body,
        "day-to-time-mode-switcher"
      );
      expect(switcher).toBeNull();
    });

    it("should stay on year picker when already on year picker", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/dd/yyyy" timeFormat={false} />
        </>
      );

      const element = getByLabelText("Some Field");
      expect(element).toHaveValue("");

      // Act
      fireEvent.click(element);
      expect(getByTestId(document.body, "day-picker")).toBeVisible();

      fireEvent.click(getByTestId(document.body, "day-mode-switcher"));

      expect(getByTestId(document.body, "month-picker")).toBeVisible();

      fireEvent.click(getByTestId(document.body, "month-mode-switcher"));

      expect(getByTestId(document.body, "year-picker")).toBeVisible();

      fireEvent.click(getByTestId(document.body, "year-mode-switcher"));

      // Assert
      expect(getByTestId(document.body, "year-picker")).toBeVisible();
    });
  });

  describe("e2e", () => {
    it("should switch through to year mode, and pick a specific date through various pickers", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime id="some-id" dateFormat="LL/dd/yyyy" timeFormat={false} />
        </>
      );

      const element = getByLabelText("Some Field");

      // Act
      fireEvent.focus(element);

      {
        const picker = getByTestId(document.body, "day-picker");
        expect(picker).toBeVisible();
      }

      // day -> month picker
      {
        const switcher = getByTestId(document.body, "day-mode-switcher");
        expect(switcher).toBeVisible();

        fireEvent.click(switcher);

        // Assert
        const picker = getByTestId(document.body, "month-picker");
        expect(picker).toBeVisible();
      }

      // month -> year picker
      {
        const switcher = getByTestId(document.body, "month-mode-switcher");
        expect(switcher).toBeVisible();

        fireEvent.click(switcher);

        // Assert
        const picker = getByTestId(document.body, "year-picker");
        expect(picker).toBeVisible();
      }

      {
        // click a year (switch to month picker)
        fireEvent.click(getByText(document.body, "2020"));

        const picker = getByTestId(document.body, "month-picker");
        expect(picker).toBeVisible();
      }

      {
        // click a month (switch to day picker)
        fireEvent.click(getByText(document.body, "Feb"));

        const picker = getByTestId(document.body, "day-picker");
        expect(picker).toBeVisible();
      }

      // click a day
      fireEvent.click(getByText(document.body, "11"));

      // Assert
      expect(getByLabelText("Some Field")).toHaveValue("02/11/2020");
    });

    it("should switch through to year mode, and pick a specific date/time through various pickers", () => {
      mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

      // Arrange
      const { getByLabelText } = render(
        <>
          <label htmlFor="some-id">Some Field</label>
          <DateTime
            id="some-id"
            dateFormat="LL/dd/yyyy"
            timeFormat="h:mm:ss.SSS a"
          />
        </>
      );

      const element = getByLabelText("Some Field");

      // Act
      fireEvent.focus(element);

      {
        const picker = getByTestId(document.body, "day-picker");
        expect(picker).toBeVisible();
      }

      // day -> month picker
      {
        const switcher = getByTestId(document.body, "day-mode-switcher");
        expect(switcher).toBeVisible();

        fireEvent.click(switcher);

        // Assert
        const picker = getByTestId(document.body, "month-picker");
        expect(picker).toBeVisible();
      }

      // month -> year picker
      {
        const switcher = getByTestId(document.body, "month-mode-switcher");
        expect(switcher).toBeVisible();

        fireEvent.click(switcher);

        // Assert
        const picker = getByTestId(document.body, "year-picker");
        expect(picker).toBeVisible();
      }

      {
        // click a year (switch to month picker)
        fireEvent.click(getByText(document.body, "2020"));

        const picker = getByTestId(document.body, "month-picker");
        expect(picker).toBeVisible();
      }

      {
        // click a month (switch to day picker)
        fireEvent.click(getByText(document.body, "Feb"));

        const picker = getByTestId(document.body, "day-picker");
        expect(picker).toBeVisible();
      }

      // Switch to time mode
      {
        const switcher = getByTestId(
          document.body,
          "day-to-time-mode-switcher"
        );
        expect(switcher).toBeVisible();

        fireEvent.click(switcher);
      }

      {
        // Assert
        const picker = getByTestId(document.body, "time-picker");
        expect(picker).toBeVisible();

        expect(picker.textContent?.replace(/[^\w/]+/g, "")).toMatch(
          /02\/01\/2020120000000AM/i
        );

        // Click to change the time
        const upArrows = getAllByText(document.body, "▲");
        expect(upArrows?.length).toBe(5);

        const downArrows = getAllByText(document.body, "▼");
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
        const switcher = getByTestId(document.body, "time-mode-switcher");
        expect(switcher).toBeVisible();

        fireEvent.click(switcher);
      }

      // click a day
      fireEvent.click(getByText(document.body, "11"));

      // Assert
      expect(getByLabelText("Some Field")).toHaveValue(
        "02/11/2020 1:05:35.321 PM"
      );
    });

    describe("events", () => {
      it("should not trigger onChange Date with no change", () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        const handleChange = jest.fn();

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime
              id="some-id"
              dateFormat="LL/dd/yyyy"
              timeFormat={false}
              onChange={handleChange}
              value={new Date(2019, 0, 16, 12, 1, 12, 34)}
            />
          </>
        );

        const element = getByLabelText("Some Field");
        expect(element).toHaveValue("01/16/2019");

        // Act
        // Open picker
        fireEvent.click(element);

        expect(handleChange).toHaveBeenCalledTimes(0);
      });

      it("should not trigger onChange Date when clicking same date", () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        const handleChange = jest.fn();

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime
              id="some-id"
              dateFormat="LL/dd/yyyy"
              timeFormat={false}
              onChange={handleChange}
              value={new Date(2019, 0, 16, 12, 1, 12, 34)}
            />
          </>
        );

        const element = getByLabelText("Some Field");
        expect(element).toHaveValue("01/16/2019");

        // Act
        // Open picker
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const someDay = getByText(document.body, "16");
        expect(someDay).toBeVisible();

        // Pick date
        fireEvent.click(someDay);

        expect(element).toHaveValue("01/16/2019");

        expect(handleChange).toHaveBeenCalledTimes(0);
      });

      it("should trigger onChange Date when picking a first date", () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        const handleChange = jest.fn();

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime
              id="some-id"
              dateFormat="LL/dd/yyyy"
              timeFormat={false}
              onChange={handleChange}
            />
          </>
        );

        const element = getByLabelText("Some Field");
        expect(element).toHaveValue("");

        // Act
        // Open picker
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const someDay = getByText(document.body, "16");
        expect(someDay).toBeVisible();

        // Pick date
        fireEvent.click(someDay);

        expect(element).toHaveValue("01/16/2019");

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(
          new Date(2019, 0, 16, 0, 0, 0, 0)
        );
      });

      it("should trigger onChange Date when picking a new date", () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        const handleChange = jest.fn();

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime
              id="some-id"
              dateFormat="LL/dd/yyyy"
              timeFormat={false}
              onChange={handleChange}
              value={new Date(2019, 0, 16, 12, 1, 12, 34)}
            />
          </>
        );

        const element = getByLabelText("Some Field");
        expect(element).toHaveValue("01/16/2019");

        // Act
        // Open picker
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const someDay = getByText(document.body, "17");
        expect(someDay).toBeVisible();

        // Pick date
        fireEvent.click(someDay);

        expect(element).toHaveValue("01/17/2019");

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(
          new Date(2019, 0, 17, 12, 1, 12, 34)
        );
      });

      it("should trigger onChange input string when picking a date", () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        const handleChange = jest.fn();

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime
              id="some-id"
              dateFormat="LL/dd/yyyy"
              timeFormat={false}
              onChange={handleChange}
              dateTypeMode="input-format"
            />
          </>
        );

        const element = getByLabelText("Some Field");
        expect(element).toHaveValue("");

        // Act
        // Open picker
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const someDay = getByText(document.body, "16");
        expect(someDay).toBeVisible();

        // Pick date
        fireEvent.click(someDay);

        expect(element).toHaveValue("01/16/2019");

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith("01/16/2019");
      });

      it("should trigger onChange input string when picking a date/time", () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        const handleChange = jest.fn();

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime
              id="some-id"
              dateFormat="LL/dd/yyyy"
              timeFormat="h:mm a"
              onChange={handleChange}
              dateTypeMode="input-format"
            />
          </>
        );

        const element = getByLabelText("Some Field");
        expect(element).toHaveValue("");

        // Act
        // Open picker
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const someDay = getByText(document.body, "16");
        expect(someDay).toBeVisible();

        // Pick date
        fireEvent.click(someDay);

        expect(element).toHaveValue("01/16/2019 12:00 AM");

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith("01/16/2019 12:00 AM");
      });

      it("should trigger onChange input string when increasing time by one step", () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        const handleChange = jest.fn();

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime
              id="some-id"
              dateFormat={false}
              timeFormat="h:mm a"
              onChange={handleChange}
              dateTypeMode="input-format"
            />
          </>
        );

        const element = getByLabelText("Some Field");
        expect(element).toHaveValue("");

        // Act
        // Open picker
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "time-picker")).toBeVisible();

        // Click to change the time
        const upArrows = getAllByText(document.body, "▲");
        expect(upArrows?.length).toBe(3);

        const downArrows = getAllByText(document.body, "▼");
        expect(downArrows?.length).toBe(3);

        // Increase hours from 12 to 1
        act(() => {
          userEvent.click(upArrows[0]);
        });

        expect(element).toHaveValue("1:00 AM");

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith("1:00 AM");
      });

      it("should trigger onChange input string when increasing time by 3 hour increment", () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        const handleChange = jest.fn();

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime
              id="some-id"
              dateFormat={false}
              timeFormat="h:mm a"
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

        const element = getByLabelText("Some Field");
        expect(element).toHaveValue("");

        // Act
        // Open picker
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "time-picker")).toBeVisible();

        // Click to change the time
        const upArrows = getAllByText(document.body, "▲");
        expect(upArrows?.length).toBe(3);

        const downArrows = getAllByText(document.body, "▼");
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

      it("should trigger onChange input string when increasing time by 15 min increment", () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        const handleChange = jest.fn();

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime
              id="some-id"
              dateFormat={false}
              timeFormat="h:mm a"
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

        const element = getByLabelText("Some Field");
        expect(element).toHaveValue("");

        // Act
        // Open picker
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "time-picker")).toBeVisible();

        // Click to change the time
        const upArrows = getAllByText(document.body, "▲");
        expect(upArrows?.length).toBe(3);

        const downArrows = getAllByText(document.body, "▼");
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

      it("should trigger onChange input string when increasing time by 30 second increment", () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        const handleChange = jest.fn();

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime
              id="some-id"
              dateFormat={false}
              timeFormat="h:mm:ss a"
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

        const element = getByLabelText("Some Field");
        expect(element).toHaveValue("");

        // Act
        // Open picker
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "time-picker")).toBeVisible();

        // Click to change the time
        const upArrows = getAllByText(document.body, "▲");
        expect(upArrows?.length).toBe(4);

        const downArrows = getAllByText(document.body, "▼");
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

      it("should trigger onChange input string when increasing time by 10 milliseconds increment", () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        const handleChange = jest.fn();

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime
              id="some-id"
              dateFormat={false}
              timeFormat="h:mm:ss.SSS a"
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

        const element = getByLabelText("Some Field");
        expect(element).toHaveValue("");

        // Act
        // Open picker
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "time-picker")).toBeVisible();

        // Click to change the time
        const upArrows = getAllByText(document.body, "▲");
        expect(upArrows?.length).toBe(5);

        const downArrows = getAllByText(document.body, "▼");
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

      it('should trigger onChange input string once holding down the "up" seconds for a bit of time', () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        const handleChange = jest.fn();

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime
              id="some-id"
              dateFormat={false}
              timeFormat="h:mm:ss a"
              onChange={handleChange}
              dateTypeMode="input-format"
            />
          </>
        );

        const element = getByLabelText("Some Field");
        expect(element).toHaveValue("");

        // Act
        // Open picker
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "time-picker")).toBeVisible();

        // Click to change the time
        const upArrows = getAllByText(document.body, "▲");
        expect(upArrows?.length).toBe(4);

        const downArrows = getAllByText(document.body, "▼");
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

      it("should trigger onChange utc-ms-timestamp when picking a date", () => {
        mockDate(new Date(2019, 0, 1, 12, 1, 12, 34));

        const handleChange = jest.fn();

        // Arrange
        const { getByLabelText } = render(
          <>
            <label htmlFor="some-id">Some Field</label>
            <DateTime
              id="some-id"
              dateFormat="LL/dd/yyyy"
              timeFormat={false}
              onChange={handleChange}
              dateTypeMode="utc-ms-timestamp"
            />
          </>
        );

        const element = getByLabelText("Some Field");
        expect(element).toHaveValue("");

        // Act
        // Open picker
        fireEvent.click(element);

        // Assert
        expect(getByTestId(document.body, "day-picker")).toBeVisible();

        const someDay = getByText(document.body, "16");
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
  });
});
