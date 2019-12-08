import * as React from "react";
import { render, fireEvent, getByText } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import DateTime from ".";

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

    const monthName = getByText(document.body, /november/i);
    expect(monthName).toBeVisible();

    const dayOfWeekRow = getByText(document.body, "Su");
    expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
  });

  it("should open December day picker when clicking", () => {
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

    const monthName = getByText(document.body, /december/i);
    expect(monthName).toBeVisible();

    const dayOfWeekRow = getByText(document.body, "Su");
    expect(dayOfWeekRow.parentNode).toHaveTextContent("SuMoTuWeThFrSa");
  });
});
