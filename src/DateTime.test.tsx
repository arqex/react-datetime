import * as React from "react";
import { render, fireEvent, getByText } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RawDateTime from ".";

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

function mockDate(isoDate) {
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

    expect(container.firstChild).toMatchInlineSnapshot(`
        <input
          type="text"
          value=""
        />
      `);
  });

  it("should render an input with className", () => {
    const { container } = render(<DateTime className="form-control" />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <input
        class="form-control"
        type="text"
        value=""
      />
    `);
  });

  it("should render an input with id", () => {
    const { container } = render(<DateTime id="some-id" />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <input
        id="some-id"
        type="text"
        value=""
      />
    `);
  });

  describe("default - day picker", () => {
    it("should open day picker when clicking", () => {
      mockDate(new Date(2019, 0, 1, 12, 0, 0, 0));

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
      const monthName = getByText(document.body, /january/i);
      expect(monthName).toBeVisible();

      const dayOfWeekRow = getByText(document.body, "Su");
      expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
    });

    it("should open day picker on focus", () => {
      mockDate(new Date(2019, 0, 1, 12, 0, 0, 0));

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
      const monthName = getByText(document.body, /january/i);
      expect(monthName).toBeVisible();

      const dayOfWeekRow = getByText(document.body, "Su");
      expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
    });

    it("should open january day picker when clicking", () => {
      mockDate(new Date(2019, 0, 1, 12, 0, 0, 0));

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
      const monthName = getByText(document.body, /january/i);
      expect(monthName).toBeVisible();

      const dayOfWeekRow = getByText(document.body, "Su");
      expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
    });

    it("should open february day picker when clicking", () => {
      mockDate(new Date(2019, 1, 1, 12, 0, 0, 0));

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
      const monthName = getByText(document.body, /february/i);
      expect(monthName).toBeVisible();

      const dayOfWeekRow = getByText(document.body, "Su");
      expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
    });

    it("should open march day picker when clicking", () => {
      mockDate(new Date(2019, 2, 1, 12, 0, 0, 0));

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
      const monthName = getByText(document.body, /march/i);
      expect(monthName).toBeVisible();

      const dayOfWeekRow = getByText(document.body, "Su");
      expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
    });

    it("should open april day picker when clicking", () => {
      mockDate(new Date(2019, 3, 1, 12, 0, 0, 0));

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
      const monthName = getByText(document.body, /april/i);
      expect(monthName).toBeVisible();

      const dayOfWeekRow = getByText(document.body, "Su");
      expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
    });

    it("should open may day picker when clicking", () => {
      mockDate(new Date(2019, 4, 1, 12, 0, 0, 0));

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
      const monthName = getByText(document.body, /may/i);
      expect(monthName).toBeVisible();

      const dayOfWeekRow = getByText(document.body, "Su");
      expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
    });

    it("should open june day picker when clicking", () => {
      mockDate(new Date(2019, 5, 1, 12, 0, 0, 0));

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
      const monthName = getByText(document.body, /june/i);
      expect(monthName).toBeVisible();

      const dayOfWeekRow = getByText(document.body, "Su");
      expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
    });

    it("should open july day picker when clicking", () => {
      mockDate(new Date(2019, 6, 1, 12, 0, 0, 0));

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
      const monthName = getByText(document.body, /july/i);
      expect(monthName).toBeVisible();

      const dayOfWeekRow = getByText(document.body, "Su");
      expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
    });

    it("should open august day picker when clicking", () => {
      mockDate(new Date(2019, 7, 1, 12, 0, 0, 0));

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
      const monthName = getByText(document.body, /august/i);
      expect(monthName).toBeVisible();

      const dayOfWeekRow = getByText(document.body, "Su");
      expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
    });

    it("should open september day picker when clicking", () => {
      mockDate(new Date(2019, 8, 1, 12, 0, 0, 0));

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
      const monthName = getByText(document.body, /september/i);
      expect(monthName).toBeVisible();

      const dayOfWeekRow = getByText(document.body, "Su");
      expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
    });

    it("should open october day picker when clicking", () => {
      mockDate(new Date(2019, 9, 1, 12, 0, 0, 0));

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
      const monthName = getByText(document.body, /october/i);
      expect(monthName).toBeVisible();

      const dayOfWeekRow = getByText(document.body, "Su");
      expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
    });

    it("should open november day picker when clicking", () => {
      mockDate(new Date(2019, 10, 1, 12, 0, 0, 0));

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
      const monthName = getByText(document.body, /november/i);
      expect(monthName).toBeVisible();

      const dayOfWeekRow = getByText(document.body, "Su");
      expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
    });

    it("should open december day picker when clicking", () => {
      mockDate(new Date(2019, 11, 1, 12, 0, 0, 0));

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
      const monthName = getByText(document.body, /december/i);
      expect(monthName).toBeVisible();

      const dayOfWeekRow = getByText(document.body, "Su");
      expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
    });

    it("should choose day from picker", () => {
      mockDate(new Date(2019, 0, 1, 12, 0, 0, 0));

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

      // Assert
      const someDay = getByText(document.body, "16");
      expect(someDay).toBeVisible();

      fireEvent.click(someDay);

      expect(element).toHaveValue("01/16/2019");
    });
  });

  describe("month picker", () => {
    it("should open month picker when clicking", () => {
      mockDate(new Date(2019, 0, 1, 12, 0, 0, 0));

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
      const picker = getByText(document.body, /jan/i);
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
      mockDate(new Date(2019, 0, 1, 12, 0, 0, 0));

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
      const picker = getByText(document.body, /jan/i);
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

    it("should choose month from picker", () => {
      mockDate(new Date(2019, 0, 1, 12, 0, 0, 0));

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
  });

  describe("year picker", () => {
    it("should open year picker when clicking", () => {
      mockDate(new Date(2019, 0, 1, 12, 0, 0, 0));

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
      mockDate(new Date(2019, 0, 1, 12, 0, 0, 0));

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

    it("should choose year from picker", () => {
      mockDate(new Date(2019, 0, 1, 12, 0, 0, 0));

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

      const someYear = getByText(document.body, "2015");
      expect(someYear).toBeVisible();

      fireEvent.click(someYear);

      // Assert
      expect(element).toHaveValue("2015");
    });
  });

  describe("time picker", () => {
    it("should open time picker when clicking", () => {
      mockDate(new Date(2019, 0, 1, 12, 0, 0, 0));

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
      mockDate(new Date(2019, 0, 1, 12, 0, 0, 0));

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
  });
});
