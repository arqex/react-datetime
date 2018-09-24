import React from "react";
import * as utils from "./testUtils";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { advanceTo as mockDateTo } from "jest-date-mock";

import format from "date-fns/format";
import parse from "date-fns/parse";
import isBefore from "date-fns/is_before";
import getHours from "date-fns/get_hours";
import getMinutes from "date-fns/get_minutes";
import getSeconds from "date-fns/get_seconds";
import getMilliseconds from "date-fns/get_milliseconds";
import getDate from "date-fns/get_date";
import getMonth from "date-fns/get_month";
import getYear from "date-fns/get_year";
import nl from "date-fns/locale/nl";
import fr from "date-fns/locale/fr";

Enzyme.configure({ adapter: new Adapter() });

// Mock date to get rid of time as a factor to make tests deterministic
mockDateTo("September 2, 2018 03:24:00");

describe("DateTime", () => {
  it("create component", () => {
    const component = utils.createDatetime({});

    expect(component).toBeDefined();
    expect(component.find(".rdt > .form-control").length).toEqual(1);
    expect(component.find(".rdt > .rdtPicker").length).toEqual(1);
  });

  it("viewMode=days: renders days, week days, month, year", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      viewMode: "days",
      defaultValue: date
    });
    utils.openDatepicker(component);

    // Month and year
    expect(component.find(".rdtSwitch").text()).toEqual("January 2000");

    // Week days
    const expectedWeekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const actualWeekdays = component
      .find(".rdtDays .dow")
      .map(element => element.text());
    expect(actualWeekdays).toEqual(expectedWeekDays);

    // Dates
    // "Old" dates belonging to prev month
    const oldDatesIndexes = [0, 1, 2, 3, 4, 5];
    oldDatesIndexes.forEach(index => {
      expect(utils.getNthDay(component, index).hasClass("rdtOld")).toBeTruthy();
    });

    // Dates belonging to current month
    for (let i = 6; i < 37; i++) {
      expect(utils.getNthDay(component, i).hasClass("rdtDay")).toBeTruthy();
      expect(utils.getNthDay(component, i).hasClass("rdtOld")).toBeFalsy();
      expect(utils.getNthDay(component, i).hasClass("rdtNew")).toBeFalsy();
    }

    // "New" dates belonging to next month
    const nextDatesIndexes = [37, 38, 39, 40, 41];
    nextDatesIndexes.forEach(index => {
      expect(utils.getNthDay(component, index).hasClass("rdtNew")).toBeTruthy();
    });
  });

  it("switch from day view to time view and back", () => {
    const component = utils.createDatetime({});

    expect(utils.isDayView(component)).toBeTruthy();
    utils.clickOnElement(component.find(".rdtTimeToggle"));
    expect(utils.isTimeView(component)).toBeTruthy();
    utils.clickOnElement(component.find(".rdtSwitch"));
    expect(utils.isDayView(component)).toBeTruthy();
  });

  it("persistent valid months going monthView->yearView->monthView", () => {
    const dateBefore = "2018-06-01";
    const component = utils.createDatetime({
      viewMode: "months",
      isValidDate: current => isBefore(current, parse(dateBefore))
    });

    expect(utils.isMonthView(component)).toBeTruthy();
    expect(utils.getNthMonth(component, 4).hasClass("rdtDisabled")).toEqual(
      false
    );
    expect(utils.getNthMonth(component, 5).hasClass("rdtDisabled")).toEqual(
      true
    );

    // Go to year view
    utils.clickOnElement(component.find(".rdtSwitch"));
    expect(utils.isYearView(component)).toBeTruthy();

    expect(utils.getNthYear(component, 0).hasClass("rdtDisabled")).toEqual(
      false
    );
    expect(utils.getNthYear(component, 10).hasClass("rdtDisabled")).toEqual(
      true
    );

    utils.clickNthYear(component, 9);
    expect(utils.getNthMonth(component, 4).hasClass("rdtDisabled")).toEqual(
      false
    );
    expect(utils.getNthMonth(component, 5).hasClass("rdtDisabled")).toEqual(
      true
    );
  });

  it("step through views", () => {
    const component = utils.createDatetime({ viewMode: "time" });

    expect(utils.isTimeView(component)).toBeTruthy();
    utils.clickOnElement(component.find(".rdtSwitch"));
    expect(utils.isDayView(component)).toBeTruthy();
    utils.clickOnElement(component.find(".rdtSwitch"));
    expect(utils.isMonthView(component)).toBeTruthy();
    utils.clickOnElement(component.find(".rdtSwitch"));
    expect(utils.isYearView(component)).toBeTruthy();
  });

  it("toggles calendar when open prop changes", () => {
    const component = utils.createDatetime({ open: false });
    expect(utils.isOpen(component)).toBeFalsy();
    expect(component.find(".rdtOpen").length).toEqual(0);
    component.setProps({ open: true });
    expect(utils.isOpen(component)).toBeTruthy();
    expect(component.find(".rdtOpen").length).toEqual(1);
    component.setProps({ open: false });
    expect(utils.isOpen(component)).toBeFalsy();
    expect(component.find(".rdtOpen").length).toEqual(0);
  });

  it("selectYear", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      viewMode: "years",
      defaultValue: date
    });
    expect(utils.isYearView(component)).toBeTruthy();
    expect(component.find(".rdtSwitch").text()).toEqual("2000-2009");

    // Click first year (1999)
    utils.clickOnElement(component.find(".rdtYear").at(0));
    expect(utils.isMonthView(component)).toBeTruthy();
    expect(component.find(".rdtSwitch").text()).toEqual("1999");
  });

  it("increase decade", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      viewMode: "years",
      defaultValue: date
    });

    expect(component.find(".rdtSwitch").text()).toEqual("2000-2009");
    utils.clickOnElement(component.find(".rdtNext span").at(0));
    expect(component.find(".rdtSwitch").text()).toEqual("2010-2019");
    utils.clickOnElement(component.find(".rdtNext span").at(0));
    expect(component.find(".rdtSwitch").text()).toEqual("2020-2029");
  });

  it("decrease decade", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      viewMode: "years",
      defaultValue: date
    });

    expect(component.find(".rdtSwitch").text()).toEqual("2000-2009");
    utils.clickOnElement(component.find(".rdtPrev span").at(0));
    expect(component.find(".rdtSwitch").text()).toEqual("1990-1999");
    utils.clickOnElement(component.find(".rdtPrev span").at(0));
    expect(component.find(".rdtSwitch").text()).toEqual("1980-1989");
  });

  it("select month", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      viewMode: "months",
      defaultValue: date
    });

    expect(utils.isMonthView(component)).toBeTruthy();
    expect(component.find(".rdtSwitch").text()).toEqual("2000");
    // Click any month to enter day view
    utils.clickNthMonth(component, 1);
    expect(utils.isDayView(component)).toBeTruthy();
    expect(
      component
        .find(".rdtSwitch")
        .getDOMNode()
        .getAttribute("data-value")
    ).toEqual("1");
  });

  it("increase year", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      viewMode: "months",
      defaultValue: date
    });

    expect(component.find(".rdtSwitch").text()).toEqual("2000");
    utils.clickOnElement(component.find(".rdtNext span").at(0));
    expect(component.find(".rdtSwitch").text()).toEqual("2001");
    utils.clickOnElement(component.find(".rdtNext span").at(0));
    expect(component.find(".rdtSwitch").text()).toEqual("2002");
  });

  it("decrease year", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      viewMode: "months",
      defaultValue: date
    });

    expect(component.find(".rdtSwitch").text()).toEqual("2000");
    utils.clickOnElement(component.find(".rdtPrev span").at(0));
    expect(component.find(".rdtSwitch").text()).toEqual("1999");
    utils.clickOnElement(component.find(".rdtPrev span").at(0));
    expect(component.find(".rdtSwitch").text()).toEqual("1998");
  });

  it("increase month", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({ defaultValue: date });

    expect(component.find(".rdtSwitch").text()).toEqual("January 2000");
    expect(
      component
        .find(".rdtSwitch")
        .getDOMNode()
        .getAttribute("data-value")
    ).toEqual("0");
    utils.clickOnElement(component.find(".rdtNext span").at(0));
    expect(component.find(".rdtSwitch").text()).toEqual("February 2000");
    expect(
      component
        .find(".rdtSwitch")
        .getDOMNode()
        .getAttribute("data-value")
    ).toEqual("1");
    utils.clickOnElement(component.find(".rdtNext span").at(0));
    expect(component.find(".rdtSwitch").text()).toEqual("March 2000");
    expect(
      component
        .find(".rdtSwitch")
        .getDOMNode()
        .getAttribute("data-value")
    ).toEqual("2");
  });

  it("decrease month", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({ defaultValue: date });

    expect(component.find(".rdtSwitch").text()).toEqual("January 2000");
    expect(
      component
        .find(".rdtSwitch")
        .getDOMNode()
        .getAttribute("data-value")
    ).toEqual("0");
    utils.clickOnElement(component.find(".rdtPrev span").at(0));
    expect(component.find(".rdtSwitch").text()).toEqual("December 1999");
    expect(
      component
        .find(".rdtSwitch")
        .getDOMNode()
        .getAttribute("data-value")
    ).toEqual("11");
    utils.clickOnElement(component.find(".rdtPrev span").at(0));
    expect(component.find(".rdtSwitch").text()).toEqual("November 1999");
    expect(
      component
        .find(".rdtSwitch")
        .getDOMNode()
        .getAttribute("data-value")
    ).toEqual("10");
  });

  it("should switch to previous month's view when clicking a day in the previous month", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({ defaultValue: date });

    utils.openDatepicker(component);
    utils.clickNthDay(component, 0);

    expect(utils.getInputValue(component)).toEqual(
      "12/26/1999 2:02 AM"
    );

    expect(component.find(".rdtSwitch").text()).toEqual("December 1999");
  });

  it("should switch to next month's view when clicking a day in the next month", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({ defaultValue: date });

    utils.openDatepicker(component);
    utils.clickNthDay(component, 41);

    expect(utils.getInputValue(component)).toEqual(
      "02/05/2000 2:02 AM"
    );

    expect(component.find(".rdtSwitch").text()).toEqual("February 2000");
  });

  it("open picker", () => {
    const component = utils.createDatetime({});
    expect(utils.isOpen(component)).toBeFalsy();
    utils.openDatepicker(component);
    expect(utils.isOpen(component)).toBeTruthy();
  });

  it("opens picker when clicking on input", () => {
    const component = utils.createDatetime({});
    expect(utils.isOpen(component)).toBeFalsy();
    component.find(".form-control").simulate("click");
    expect(utils.isOpen(component)).toBeTruthy();
  });

  it("sets CSS class on selected item (day)", () => {
    const component = utils.createDatetime({ viewMode: "days" });
    utils.openDatepicker(component);
    utils.clickNthDay(component, 13);
    expect(utils.getNthDay(component, 13).hasClass("rdtActive")).toBeTruthy();
  });

  it("sets CSS class on selected item (month)", () => {
    const component = utils.createDatetime({
      viewMode: "months",
      dateFormat: "YYYY-MM"
    });
    utils.openDatepicker(component);
    utils.clickNthMonth(component, 4);
    expect(utils.getNthMonth(component, 4).hasClass("rdtActive")).toBeTruthy();
  });

  it("sets CSS class on selected item (year)", () => {
    const component = utils.createDatetime({
      viewMode: "years",
      dateFormat: "YYYY"
    });
    utils.openDatepicker(component);
    utils.clickNthYear(component, 3);
    expect(utils.getNthYear(component, 3).hasClass("rdtActive")).toBeTruthy();
  });

  it("sets CSS class on days outside of month", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const prevMonthDaysIndexes = [0, 1, 2, 3, 4, 5];
    const nextMonthDaysIndexes = [37, 38, 39, 40, 41];
    const component = utils.createDatetime({
      viewMode: "days",
      defaultValue: date
    });

    utils.openDatepicker(component);

    prevMonthDaysIndexes.forEach(index => {
      expect(utils.getNthDay(component, index).hasClass("rdtOld")).toBeTruthy();
    });
    nextMonthDaysIndexes.forEach(index => {
      expect(utils.getNthDay(component, index).hasClass("rdtNew")).toBeTruthy();
    });
  });

  it("selected day persists (in UI) when navigating to prev month", () => {
    const date = new Date(2000, 0, 3, 2, 2, 2, 2);
    const component = utils.createDatetime({
      viewMode: "days",
      defaultValue: date
    });

    utils.openDatepicker(component);
    expect(utils.getNthDay(component, 8).hasClass("rdtActive")).toBeTruthy();
    // Go to previous month
    utils.clickOnElement(component.find(".rdtDays .rdtPrev span"));
    expect(utils.getNthDay(component, 36).hasClass("rdtActive")).toBeTruthy();
  });

  it("sets CSS class on today date", () => {
    const specificDate = new Date();
    const component = utils.createDatetime({ defaultValue: specificDate });

    utils.openDatepicker(component);
    expect(component.find(".rdtDay.rdtToday").text()).toEqual(
      format(specificDate, "D")
    );
  });

  // Proof of bug [FIXED]
  it("should show correct selected month when traversing view modes", () => {
    const date = new Date(2000, 4, 3, 2, 2, 2, 2);
    const component = utils.createDatetime({
      viewMode: "days",
      defaultValue: date
    });

    utils.openDatepicker(component);

    // Go to month view
    utils.clickOnElement(component.find(".rdtSwitch"));

    // Here the selected month is _May_, which is correct
    expect(
      component
        .find(".rdtMonth")
        .find(".rdtActive")
        .text()
    ).toEqual("May");

    // Go to year view
    utils.clickOnElement(component.find(".rdtSwitch"));

    // Click the selected year (2000)
    utils.clickNthYear(component, 1);

    // The selected month is _May_ again
    expect(
      component
        .find(".rdtMonth")
        .find(".rdtActive")
        .text()
    ).toEqual("May");
  });

  describe("with custom props", () => {
    it("input=false", () => {
      const component = utils.createDatetime({ input: false });
      expect(component.find(".rdt > .form-control").length).toEqual(0);
      expect(component.find(".rdt > .rdtPicker").length).toEqual(1);
    });

    it("dateFormat", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        value: date,
        dateFormat: "M&D"
      });
      expect(utils.getInputValue(component)).toEqual(
        format(date, "M&D h:mm A")
      );
    });

    it("dateFormat=false", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        value: date,
        dateFormat: false
      });
      expect(utils.getInputValue(component)).toEqual(format(date, "h:mm A"));
      // Make sure time view is active
      expect(utils.isTimeView(component)).toBeTruthy();
      // Make sure the date toggle is not rendered
      expect(component.find("thead").length).toEqual(0);
    });

    it("timeFormat", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const timeFormat = "HH:mm:ss:SSS";
      const component = utils.createDatetime({
        value: date,
        timeFormat: timeFormat
      });
      expect(utils.getInputValue(component)).toEqual(
        format(date, "MM/DD/YYYY " + timeFormat)
      );
    });

    it("timeFormat=false", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        value: date,
        timeFormat: false
      });

      expect(utils.getInputValue(component)).toEqual(
        format(date, "MM/DD/YYYY")
      );
      // Make sure day view is active
      expect(utils.isDayView(component)).toBeTruthy();
      // Make sure the time toggle is not rendered
      expect(component.find(".timeToggle").length).toEqual(0);
    });

    it("timeFormat with lowercase 'am'", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const format = "HH:mm:ss:SSS a";
      const component = utils.createDatetime({
        value: date,
        timeFormat: format
      });
      expect(utils.getInputValue(component)).toEqual(
        expect.stringMatching(".*am$")
      );
    });

    it("timeFormat with uppercase 'AM'", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const format = "HH:mm:ss:SSS A";
      const component = utils.createDatetime({
        value: date,
        timeFormat: format
      });
      expect(utils.getInputValue(component)).toEqual(
        expect.stringMatching(".*AM$")
      );
    });

    it("viewMode=years", () => {
      const component = utils.createDatetime({ viewMode: "years" });
      expect(utils.isYearView(component)).toBeTruthy();
    });

    it("viewMode=months", () => {
      const component = utils.createDatetime({ viewMode: "months" });
      expect(utils.isMonthView(component)).toBeTruthy();
    });

    it("viewMode=time", () => {
      const component = utils.createDatetime({ viewMode: "time" });
      expect(utils.isTimeView(component)).toBeTruthy();
    });

    it("className -> type string", () => {
      const component = utils.createDatetimeShallow({
        className: "custom-class"
      });
      expect(component.find(".custom-class").length).toEqual(1);
    });

    it("className -> type string array", () => {
      const component = utils.createDatetime({
        className: ["custom-class1", "custom-class2"]
      });
      expect(component.find(".custom-class1").length).toEqual(1);
      expect(component.find(".custom-class2").length).toEqual(1);
    });

    it("inputProps", () => {
      const component = utils.createDatetime({
        inputProps: {
          className: "custom-class",
          type: "email",
          placeholder: "custom-placeholder"
        }
      });
      expect(component.find("input.custom-class").length).toEqual(1);
      expect(component.find("input").getDOMNode().type).toEqual("email");
      expect(component.find("input").getDOMNode().placeholder).toEqual(
        "custom-placeholder"
      );
    });

    it("renderInput", () => {
      const renderInput = (props, openCalendar, closeCalendar) => {
        return (
          <div>
            <input {...props} />
            <button className="custom-open" onClick={openCalendar}>
              open calendar
            </button>
            <button className="custom-close" onClick={closeCalendar}>
              close calendar
            </button>
          </div>
        );
      };
      const component = utils.createDatetime({ renderInput });

      expect(component.find("button.custom-open").length).toEqual(1);
      expect(utils.isOpen(component)).toBeFalsy();
      utils.clickOnElement(component.find("button.custom-open"));
      expect(utils.isOpen(component)).toBeTruthy();
      utils.clickOnElement(component.find("button.custom-open"));
      expect(utils.isOpen(component)).toBeTruthy();

      expect(component.find("button.custom-close").length).toEqual(1);
      utils.clickOnElement(component.find("button.custom-close"));
      expect(utils.isOpen(component)).toBeFalsy();
      utils.clickOnElement(component.find("button.custom-close"));
      expect(utils.isOpen(component)).toBeFalsy();
    });

    it("renderDay", () => {
      let props: any = {};
      let currentDate = "";
      let selectedDate = "";
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const renderDayFn = (fnProps, current, selected) => {
        props = fnProps;
        currentDate = current;
        selectedDate = selected;

        return <td {...fnProps}>custom-content</td>;
      };

      const component = utils.createDatetime({
        value: date,
        renderDay: renderDayFn
      });

      // Last day should be 5th of february
      expect(getDate(currentDate)).toEqual(5);
      expect(getMonth(currentDate)).toEqual(1);

      // The date must be the same
      expect(selectedDate).toEqual(date);

      // There should be a onClick function in the props
      expect(typeof props.onClick).toEqual("function");

      // The cell text should match
      expect(
        component
          .find(".rdtDay")
          .at(0)
          .text()
      ).toEqual("custom-content");
    });

    it("renderMonth", () => {
      let props: any = {};
      let month = "";
      let year = "";
      let selectedDate = "";
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const renderMonthFn = (fnProps, fnMonth, fnYear, selected) => {
        props = fnProps;
        month = fnMonth;
        year = fnYear;
        selectedDate = selected;

        return <td {...fnProps}>custom-content</td>;
      };

      const component = utils.createDatetime({
        value: date,
        viewMode: "months",
        renderMonth: renderMonthFn
      });

      expect(month).toEqual(11);
      expect(year).toEqual(2000);

      // The date must be the same
      expect(selectedDate).toEqual(date);

      // There should be a onClick function in the props
      expect(typeof props.onClick).toEqual("function");

      // The cell text should match
      expect(
        component
          .find(".rdtMonth")
          .at(0)
          .text()
      ).toEqual("custom-content");
    });

    it("renderYear", () => {
      let props: any = {};
      let year = "";
      let selectedDate = "";
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const renderYearFn = (fnProps, fnYear, selected) => {
        props = fnProps;
        year = fnYear;
        selectedDate = selected;

        return <td {...fnProps}>custom-content</td>;
      };

      const component = utils.createDatetime({
        value: date,
        viewMode: "years",
        renderYear: renderYearFn
      });

      expect(year).toEqual(2010);

      // The date must be the same
      expect(selectedDate).toEqual(date);

      // There should be a onClick function in the props
      expect(typeof props.onClick).toEqual("function");

      // The cell text should match
      expect(
        component
          .find(".rdtYear")
          .at(0)
          .text()
      ).toEqual("custom-content");
    });

    it("closeOnTab=true", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({ value: date });

      expect(utils.isOpen(component)).toBeFalsy();
      utils.openDatepicker(component);
      expect(utils.isOpen(component)).toBeTruthy();
      component
        .find(".form-control")
        .simulate("keyDown", { key: "Tab", keyCode: 9, which: 9 });
      expect(utils.isOpen(component)).toBeFalsy();
    });

    it("closeOnTab=false", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        value: date,
        closeOnTab: false
      });

      expect(utils.isOpen(component)).toBeFalsy();
      utils.openDatepicker(component);
      expect(utils.isOpen(component)).toBeTruthy();
      component
        .find(".form-control")
        .simulate("keyDown", { key: "Tab", keyCode: 9, which: 9 });
      expect(utils.isOpen(component)).toBeTruthy();
    });

    it("disableOnClickOutside=true", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        value: date,
        disableOnClickOutside: true
      });

      expect(utils.isOpen(component)).toBeFalsy();
      utils.openDatepicker(component);
      expect(utils.isOpen(component)).toBeTruthy();
      document.dispatchEvent(new Event("mousedown"));
      component.update();
      expect(utils.isOpen(component)).toBeTruthy();
    });

    it("disableOnClickOutside=false", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        value: date,
        disableOnClickOutside: false
      });

      expect(utils.isOpen(component)).toBeFalsy();
      utils.openDatepicker(component);
      expect(utils.isOpen(component)).toBeTruthy();
      document.dispatchEvent(new Event("mousedown"));
      component.update();
      expect(utils.isOpen(component)).toBeFalsy();
    });

    it("increase hour with value provided should do nothing", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        value: date
      });

      // Check hour
      expect(utils.getHours(component)).toEqual("2");
      utils.increaseHour(component);
      expect(utils.getHours(component)).toEqual("2");
    });

    it("increase hour with no value/defaultValue provided", done => {
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        onChange: selected => {
          expect(getHours(selected)).toEqual(13);
          done();
        }
      });

      // Check hour
      expect(utils.getHours(component)).toEqual("12");
      utils.increaseHour(component);
      expect(utils.getHours(component)).toEqual("13");
    });

    it("increase hours", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date,
        onChange: selected => {
          expect(getHours(selected)).toEqual(3);
          done();
        }
      });

      // Check hour
      expect(utils.getHours(component)).toEqual("2");
      utils.increaseHour(component);
      expect(utils.getHours(component)).toEqual("3");
    });

    it("increase minute with value provided should do nothing", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        value: date
      });

      // Check minute
      expect(utils.getMinutes(component)).toEqual("02");
      utils.increaseMinute(component);
      expect(utils.getMinutes(component)).toEqual("02");
    });

    it("increase minute with no value/defaultValue provided", done => {
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        onChange: selected => {
          expect(getMinutes(selected)).toEqual(1);
          done();
        }
      });

      // Check minute
      expect(utils.getMinutes(component)).toEqual("00");
      utils.increaseMinute(component);
      expect(utils.getMinutes(component)).toEqual("01");
    });

    it("increase minutes", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date,
        onChange: selected => {
          expect(getMinutes(selected)).toEqual(3);
          done();
        }
      });

      // Check minute
      expect(utils.getMinutes(component)).toEqual("02");
      utils.increaseMinute(component);
      expect(utils.getMinutes(component)).toEqual("03");
    });

    it("increase second with value provided should do nothing", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        value: date
      });

      // Check second
      expect(utils.getSeconds(component)).toEqual("02");
      utils.increaseSecond(component);
      expect(utils.getSeconds(component)).toEqual("02");
    });

    it("increase second with no value/defaultValue provided", done => {
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        onChange: selected => {
          expect(getSeconds(selected)).toEqual(1);
          done();
        }
      });

      // Check second
      expect(utils.getSeconds(component)).toEqual("00");
      utils.increaseSecond(component);
      expect(utils.getSeconds(component)).toEqual("01");
    });

    it("increase seconds", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date,
        onChange: selected => {
          expect(getSeconds(selected)).toEqual(3);
          done();
        }
      });

      // Check second
      expect(utils.getSeconds(component)).toEqual("02");
      utils.increaseSecond(component);
      expect(utils.getSeconds(component)).toEqual("03");
    });

    it("increase millisecond with value provided should do nothing", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        value: date
      });

      // Check millisecond
      expect(utils.getMilliseconds(component)).toEqual("002");
      utils.increaseMillisecond(component);
      expect(utils.getMilliseconds(component)).toEqual("002");
    });

    it("increase millisecond with no value/defaultValue provided", done => {
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        onChange: selected => {
          expect(getMilliseconds(selected)).toEqual(1);
          done();
        }
      });

      // Check millisecond
      expect(utils.getMilliseconds(component)).toEqual("000");
      utils.increaseMillisecond(component);
      expect(utils.getMilliseconds(component)).toEqual("001");
    });

    it("increase milliseconds", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date,
        onChange: selected => {
          expect(getMilliseconds(selected)).toEqual(3);
          done();
        }
      });

      // Check millisecond
      expect(utils.getMilliseconds(component)).toEqual("002");
      utils.increaseMillisecond(component);
      expect(utils.getMilliseconds(component)).toEqual("003");
    });

    it("decrease hours", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date,
        onChange: selected => {
          expect(getHours(selected)).toEqual(1);
          done();
        }
      });

      // Check hour
      expect(utils.getHours(component)).toEqual("2");
      utils.decreaseHour(component);
      expect(utils.getHours(component)).toEqual("1");
    });

    it("decrease minutes", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date,
        onChange: selected => {
          expect(getMinutes(selected)).toEqual(1);
          done();
        }
      });

      // Check minute
      expect(utils.getMinutes(component)).toEqual("02");
      utils.decreaseMinute(component);
      expect(utils.getMinutes(component)).toEqual("01");
    });

    it("decrease seconds", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date,
        onChange: selected => {
          expect(getSeconds(selected)).toEqual(1);
          done();
        }
      });

      // Check second
      expect(utils.getSeconds(component)).toEqual("02");
      utils.decreaseSecond(component);
      expect(utils.getSeconds(component)).toEqual("01");
    });

    it("decrease milliseconds", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date,
        onChange: selected => {
          expect(getMilliseconds(selected)).toEqual(1);
          done();
        }
      });

      // Check millisecond
      expect(utils.getMilliseconds(component)).toEqual("002");
      utils.decreaseMillisecond(component);
      expect(utils.getMilliseconds(component)).toEqual("001");
    });

    it("right click on increase hour should do nothing", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date
      });

      expect(utils.getHours(component)).toEqual("2");
      utils.rightClickIncreaseHour(component);
      expect(utils.getHours(component)).toEqual("2");
    });

    it("right click on decrease hour should do nothing", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date
      });

      expect(utils.getHours(component)).toEqual("2");
      utils.rightClickDecreaseHour(component);
      expect(utils.getHours(component)).toEqual("2");
    });

    it("right click on increase minute should do nothing", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date
      });

      expect(utils.getMinutes(component)).toEqual("02");
      utils.rightClickIncreaseMinute(component);
      expect(utils.getMinutes(component)).toEqual("02");
    });

    it("right click on decrease minute should do nothing", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date
      });

      expect(utils.getMinutes(component)).toEqual("02");
      utils.rightClickDecreaseMinute(component);
      expect(utils.getMinutes(component)).toEqual("02");
    });

    it("right click on increase second should do nothing", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date
      });

      expect(utils.getSeconds(component)).toEqual("02");
      utils.rightClickIncreaseSecond(component);
      expect(utils.getSeconds(component)).toEqual("02");
    });

    it("right click on decrease second should do nothing", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date
      });

      expect(utils.getSeconds(component)).toEqual("02");
      utils.rightClickDecreaseSecond(component);
      expect(utils.getSeconds(component)).toEqual("02");
    });

    it("right click on increase millisecond should do nothing", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date
      });

      expect(utils.getMilliseconds(component)).toEqual("002");
      utils.rightClickIncreaseMillisecond(component);
      expect(utils.getMilliseconds(component)).toEqual("002");
    });

    it("right click on decrease millisecond should do nothing", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date
      });

      expect(utils.getMilliseconds(component)).toEqual("002");
      utils.rightClickDecreaseMillisecond(component);
      expect(utils.getMilliseconds(component)).toEqual("002");
    });

    it("Toggle down through day part (AM/PM)", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS A",
        viewMode: "time",
        defaultValue: date,
        open: true
      });

      // Toggle through day part (AM/PM)
      expect(utils.getDayPart(component)).toEqual("AM");
      utils.decreaseDayPart(component);
      expect(utils.getDayPart(component)).toEqual("PM");
      utils.decreaseDayPart(component);
      expect(utils.getDayPart(component)).toEqual("AM");
      utils.decreaseDayPart(component);
      expect(utils.getDayPart(component)).toEqual("PM");
      utils.decreaseDayPart(component);
      expect(utils.getDayPart(component)).toEqual("AM");
    });

    it("Toggle up through day part (AM/PM)", () => {
      const date = new Date(2000, 0, 15, 14, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS A",
        viewMode: "time",
        defaultValue: date
      });

      // Toggle through day part (AM/PM)
      expect(utils.getDayPart(component)).toEqual("PM");
      utils.increaseDayPart(component);
      expect(utils.getDayPart(component)).toEqual("AM");
      utils.increaseDayPart(component);
      expect(utils.getDayPart(component)).toEqual("PM");
      utils.increaseDayPart(component);
      expect(utils.getDayPart(component)).toEqual("AM");
      utils.increaseDayPart(component);
      expect(utils.getDayPart(component)).toEqual("PM");
    });

    it("timeConstraints -> increase hour", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date,
        timeConstraints: {
          hours: { max: 6, step: 8 },
          minutes: { step: 15 }
        },
        onChange: selected => {
          expect(getHours(selected)).toEqual(3);
          done();
        }
      });

      utils.increaseHour(component);
      expect(utils.getHours(component)).toEqual("3");
    });

    it("timeConstraints -> increase minutes", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date,
        timeConstraints: {
          hours: { max: 6, step: 8 },
          minutes: { step: 15 }
        },
        onChange: selected => {
          expect(getMinutes(selected)).toEqual(17);
          done();
        }
      });

      utils.increaseMinute(component);
      expect(utils.getMinutes(component)).toEqual("17");
    });

    it("timeConstraints -> increase seconds", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date,
        timeConstraints: {
          hours: { max: 6, step: 8 },
          minutes: { step: 15 }
        },
        onChange: selected => {
          expect(getSeconds(selected)).toEqual(3);
          done();
        }
      });

      utils.increaseSecond(component);
      expect(utils.getSeconds(component)).toEqual("03");
    });

    it("timeConstraints -> increase milliseconds", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date,
        timeConstraints: {
          hours: { max: 6, step: 8 },
          minutes: { step: 15 }
        },
        onChange: selected => {
          expect(getMilliseconds(selected)).toEqual(3);
          done();
        }
      });

      utils.increaseMillisecond(component);
      expect(utils.getMilliseconds(component)).toEqual("003");
    });

    it("timeConstraints -> decrease time", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS",
        viewMode: "time",
        defaultValue: date,
        timeConstraints: { minutes: { step: 15 } },
        onChange: selected => {
          expect(getMinutes(selected)).toEqual(47);
          done();
        }
      });

      utils.decreaseMinute(component);
      expect(utils.getMinutes(component)).toEqual("47");
    });

    it("isValidDate -> disable months", () => {
      const dateBefore = parse("2018-06-01");
      const component = utils.createDatetime({
        viewMode: "months",
        isValidDate: current => isBefore(current, dateBefore)
      });

      expect(utils.getNthMonth(component, 0).hasClass("rdtDisabled")).toEqual(
        false
      );
      expect(utils.getNthMonth(component, 4).hasClass("rdtDisabled")).toEqual(
        false
      );
      expect(utils.getNthMonth(component, 5).hasClass("rdtDisabled")).toEqual(
        true
      );
      expect(utils.getNthMonth(component, 11).hasClass("rdtDisabled")).toEqual(
        true
      );
    });

    it("isValidDate -> disable years", () => {
      const component = utils.createDatetime({
        viewMode: "years",
        isValidDate: current => isBefore(current, parse("2016-01-01"))
      });

      expect(utils.getNthYear(component, 0).hasClass("rdtDisabled")).toEqual(
        false
      );
      expect(utils.getNthYear(component, 6).hasClass("rdtDisabled")).toEqual(
        false
      );
      expect(utils.getNthYear(component, 7).hasClass("rdtDisabled")).toEqual(
        true
      );
    });

    it("locale", () => {
      const component = utils.createDatetime({ locale: nl });
      const expectedWeekDays = ["zo", "ma", "di", "wo", "do", "vr", "za"];
      const actualWeekDays = component
        .find(".rdtDays .dow")
        .map(element => element.text().toLowerCase());

      expect(actualWeekDays).toEqual(expectedWeekDays);
    });

    it("locale with viewMode=months", () => {
      const component = utils.createDatetime({
        locale: nl,
        viewMode: "months"
      });
      const expectedMonths = ["mar", "mei"];
      const actualMonths = [
        utils.getNthMonth(component, 2).text(),
        utils.getNthMonth(component, 4).text()
      ];

      expect(actualMonths).toEqual(expectedMonths);
    });

    it("closeOnSelect=true without controlled value", done => {
      const component = utils.createDatetime({ closeOnSelect: true });

      // A unknown race condition is causing this test to fail without this time out,
      // and when the test fails it says:
      // 'Timeout - Async callback was not invoked within timeout'
      // Ideally it would say something else but at least we know the tests are passing now
      setTimeout(() => {
        expect(utils.isOpen(component)).toBeFalsy();
        utils.openDatepicker(component);
        expect(utils.isOpen(component)).toBeTruthy();
        utils.clickNthDay(component, 2);
        expect(utils.isOpen(component)).toBeFalsy();
        done();
      }, 0);
    });

    it("closeOnSelect=false with controlled value", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({ value: date, closeOnSelect: false });

      // A unknown race condition is causing this test to fail without this time out,
      // and when the test fails it says:
      // 'Timeout - Async callback was not invoked within timeout'
      // Ideally it would say something else but at least we know the tests are passing now
      setTimeout(() => {
        expect(utils.isOpen(component)).toBeFalsy();
        utils.openDatepicker(component);
        expect(utils.isOpen(component)).toBeTruthy();
        utils.clickNthDay(component, 2);
        expect(utils.isOpen(component)).toBeTruthy();
        done();
      }, 0);
    });

    it("closeOnSelect=false without controlled value", done => {
      const component = utils.createDatetime({ closeOnSelect: false });

      // A unknown race condition is causing this test to fail without this time out,
      // and when the test fails it says:
      // 'Timeout - Async callback was not invoked within timeout'
      // Ideally it would say something else but at least we know the tests are passing now
      setTimeout(() => {
        expect(utils.isOpen(component)).toBeFalsy();
        utils.openDatepicker(component);
        expect(utils.isOpen(component)).toBeTruthy();
        utils.clickNthDay(component, 2);
        expect(utils.isOpen(component)).toBeTruthy();
        done();
      }, 0);
    });

    it("closeOnSelect=true with controlled value", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({ value: date, closeOnSelect: true });

      // A unknown race condition is causing this test to fail without this time out,
      // and when the test fails it says:
      // 'Timeout - Async callback was not invoked within timeout'
      // Ideally it would say something else but at least we know the tests are passing now
      setTimeout(() => {
        expect(utils.isOpen(component)).toBeFalsy();
        utils.openDatepicker(component);
        expect(utils.isOpen(component)).toBeTruthy();
        utils.clickNthDay(component, 2);
        expect(utils.isOpen(component)).toBeFalsy();
        done();
      }, 0);
    });

    describe("defaultValue of type", () => {
      it("date", () => {
        const date = new Date(2000, 0, 15, 2, 2, 2, 2);
        const strDate =
          format(date, "MM/DD/YYYY") + " " + format(date, "h:mm A");
        const component = utils.createDatetime({ defaultValue: date });
        expect(utils.getInputValue(component)).toEqual(strDate);
      });

      it("Date", () => {
        const date = new Date(2000, 0, 15, 2, 2, 2, 2);
        const strDate =
          format(date, "MM/DD/YYYY") + " " + format(date, "h:mm A");
        const component = utils.createDatetime({ defaultValue: date });
        expect(utils.getInputValue(component)).toEqual(strDate);
      });

      it("string", () => {
        const date = new Date(2000, 0, 15, 2, 2, 2, 2);
        const strDate =
          format(date, "MM/DD/YYYY") + " " + format(date, "h:mm A");
        const component = utils.createDatetime({ defaultValue: strDate });
        expect(utils.getInputValue(component)).toEqual(strDate);
      });
    });

    describe("timeFormat with", () => {
      it("milliseconds", () => {
        const component = utils.createDatetime({
          viewMode: "time",
          timeFormat: "HH:mm:ss:SSS"
        });
        expect(component.find(".rdtCounter").length).toEqual(4);
      });

      it("seconds", () => {
        const component = utils.createDatetime({
          viewMode: "time",
          timeFormat: "HH:mm:ss"
        });
        expect(component.find(".rdtCounter").length).toEqual(3);
      });

      it("minutes", () => {
        const component = utils.createDatetime({
          viewMode: "time",
          timeFormat: "HH:mm"
        });
        expect(component.find(".rdtCounter").length).toEqual(2);
      });

      it("hours", () => {
        const component = utils.createDatetime({
          viewMode: "time",
          timeFormat: "HH"
        });
        expect(component.find(".rdtCounter").length).toEqual(1);
      });
    });

    describe("being updated and should trigger update", () => {
      it("dateFormat -> value should change format", done => {
        const date = new Date(2000, 0, 15, 2, 2, 2, 2);
        const component = utils.createDatetime({
          dateFormat: "YYYY-MM-DD",
          timeFormat: false,
          defaultValue: date
        });

        const valueBefore = utils.getInputValue(component);
        // A unknown race condition is causing this test to fail without this time out,
        // and when the test fails it says:
        // 'Timeout - Async callback was not invoked within timeout'
        // Ideally it would say something else but at least we know the tests are passing now
        setTimeout(() => {
          component.setProps({ dateFormat: "DD.MM.YYYY" });
          const valueAfter = utils.getInputValue(component);

          expect(valueBefore).not.toEqual(valueAfter);
          done();
        }, 0);
      });

      it("UTC -> value should change format (true->false)", () => {
        const date = new Date(2000, 0, 15, 2, 2, 2, 2);
        const component = utils.createDatetime({ value: date, utc: true });

        const valueBefore = utils.getInputValue(component);
        component.setProps({ utc: false }, () => {
          const valueAfter = utils.getInputValue(component);

          expect(valueBefore).not.toEqual(valueAfter);
        });
      });

      it("UTC -> value should change format (true->false) without date", () => {
        const component = utils.createDatetime({ utc: true });

        const valueBefore = utils.getInputValue(component);
        expect(valueBefore).toEqual("");

        component.setProps({ utc: false }, () => {
          const valueAfter = utils.getInputValue(component);
          expect(valueAfter).toEqual("");
        });
      });

      it("UTC -> value should change format (false->true)", () => {
        const date = new Date(2000, 0, 15, 2, 2, 2, 2);
        const component = utils.createDatetime({ value: date, utc: false });

        const valueBefore = utils.getInputValue(component);
        component.setProps({ utc: true }, () => {
          const valueAfter = utils.getInputValue(component);

          expect(valueBefore).not.toEqual(valueAfter);
        });
      });

      it("UTC -> value should change format (false->true) without date", () => {
        const component = utils.createDatetime({ utc: false });

        const valueBefore = utils.getInputValue(component);
        expect(valueBefore).toEqual("");

        component.setProps({ utc: true }, () => {
          const valueAfter = utils.getInputValue(component);
          expect(valueAfter).toEqual("");
        });
      });

      it("locale -> value should change format (nl->fr)", () => {
        const date = new Date(2000, 0, 15, 2, 2, 2, 2);
        const component = utils.createDatetime({ dateFormat: "MMMM Do YYYY", value: date, locale: nl });

        const valueBefore = utils.getInputValue(component);
        component.setProps({ locale: fr }, () => {
          const valueAfter = utils.getInputValue(component);

          expect(valueBefore).not.toEqual(valueAfter);
        });
      });

      it("locale -> value should change format (nl->fr) without date", () => {
        const component = utils.createDatetime({ dateFormat: "MMMM Do YYYY", locale: nl });

        const valueBefore = utils.getInputValue(component);
        expect(valueBefore).toEqual("");

        component.setProps({ locale: fr }, () => {
          const valueAfter = utils.getInputValue(component);
          expect(valueAfter).toEqual("");
        });
      });

      it("locale -> picker should change language (viewMode=days)", () => {
        const component = utils.createDatetime({
          viewMode: "days",
          locale: nl
        });
        const weekdaysBefore = component
          .find(".rdtDays .dow")
          .map(element => element.text());

        component.setProps({ locale: fr });
        const weekdaysAfter = component
          .find(".rdtDays .dow")
          .map(element => element.text());

        expect(weekdaysBefore).not.toEqual(weekdaysAfter);
      });

      it("locale -> picker should change language (viewMode=months)", () => {
        const component = utils.createDatetime({
          viewMode: "months",
          locale: nl
        });
        const monthsBefore = [
          utils.getNthMonth(component, 2).text(),
          utils.getNthMonth(component, 4).text()
        ];

        component.setProps({ locale: fr });
        const monthsAfter = [
          utils.getNthMonth(component, 2).text(),
          utils.getNthMonth(component, 4).text()
        ];

        expect(monthsBefore).not.toEqual(monthsAfter);
      });

      it("TimeView -> value should change format (AM -> am)", () => {
        const date = new Date(2000, 0, 15, 2, 2, 2, 2);
        const component = utils.createDatetime({
          viewMode: "time",
          value: date,
          dateFormat: false,
          timeFormat: " A"
        });

        const valueBefore = utils.getInputValue(component);
        expect(valueBefore).toEqual(" AM");
        component.setProps({ timeFormat: " a" }, () => {
          const valueAfter = utils.getInputValue(component);

          expect(valueAfter).toEqual(" am");
        });
      });

      it("TimeView -> value should change format (pm -> PM)", () => {
        const date = new Date(2000, 0, 15, 14, 2, 2, 2);
        const component = utils.createDatetime({
          viewMode: "time",
          value: date,
          dateFormat: false,
          timeFormat: " a"
        });

        const valueBefore = utils.getInputValue(component);
        expect(valueBefore).toEqual(" pm");
        component.setProps({ timeFormat: " A" }, () => {
          const valueAfter = utils.getInputValue(component);

          expect(valueAfter).toEqual(" PM");
        });
      });
    });
  });

  describe("event listeners", () => {
    describe("onBlur", () => {
      it("when selecting a date", () => {
        const date = new Date(2000, 0, 15, 2, 2, 2, 2);
        const onBlurFn = jest.fn();
        const component = utils.createDatetime({
          value: date,
          onBlur: onBlurFn,
          closeOnSelect: true
        });

        utils.openDatepicker(component);
        // Close component by selecting a date
        utils.clickNthDay(component, 2);
        expect(onBlurFn).toHaveBeenCalledTimes(1);
      });

      it("when selecting date (value=null and closeOnSelect=true)", () => {
        const onBlurFn = jest.fn();
        const component = utils.createDatetime({
          value: null,
          onBlur: onBlurFn,
          closeOnSelect: true
        });

        utils.openDatepicker(component);
        // Close component by selecting a date
        utils.clickNthDay(component, 2);
        expect(onBlurFn).toHaveBeenCalledTimes(1);
      });

      it("when selecting date (value=null and closeOnSelect=false)", () => {
        const onBlurFn = jest.fn();
        const component = utils.createDatetime({
          value: null,
          onBlur: onBlurFn,
          closeOnSelect: false
        });

        utils.openDatepicker(component);
        // Close component by selecting a date
        utils.clickNthDay(component, 2);
        expect(onBlurFn).not.toHaveBeenCalled();
      });
    });

    it("onFocus when opening datepicker", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const onFocusFn = jest.fn();
      const component = utils.createDatetime({
        value: date,
        onFocus: onFocusFn
      });

      utils.openDatepicker(component);
      expect(onFocusFn).toHaveBeenCalledTimes(1);
    });

    describe("onViewModeChange", () => {
      it("when switch from days to time view mode", () => {
        const component = utils.createDatetime({
          onViewModeChange: viewMode => {
            expect(viewMode).toEqual("time");
          }
        });
        expect(utils.isDayView(component)).toBeTruthy();
        utils.clickOnElement(component.find(".rdtTimeToggle"));
        expect(utils.isTimeView(component)).toBeTruthy();
      });

      it("when switch from time to days view mode", () => {
        const component = utils.createDatetime({
          viewMode: "time",
          onViewModeChange: viewMode => {
            expect(viewMode).toEqual("days");
          }
        });
        expect(utils.isTimeView(component)).toBeTruthy();
        utils.clickOnElement(component.find(".rdtSwitch"));
        expect(utils.isDayView(component)).toBeTruthy();
      });

      it("when switch from days to months view mode", () => {
        const component = utils.createDatetime({
          onViewModeChange: viewMode => {
            expect(viewMode).toEqual("months");
          }
        });
        expect(utils.isDayView(component)).toBeTruthy();
        utils.clickOnElement(component.find(".rdtSwitch"));
        expect(utils.isMonthView(component)).toBeTruthy();
      });

      it("when switch from months to years view mode", () => {
        const component = utils.createDatetime({
          viewMode: "months",
          onViewModeChange: viewMode => {
            expect(viewMode).toEqual("years");
          }
        });
        expect(utils.isMonthView(component)).toBeTruthy();
        utils.clickOnElement(component.find(".rdtSwitch"));
        expect(utils.isYearView(component)).toBeTruthy();
      });

      it("only when switch from years to months view mode", () => {
        const component = utils.createDatetime({
          viewMode: "years",
          onViewModeChange: viewMode => {
            expect(viewMode).toEqual("months");
          }
        });
        expect(utils.isYearView(component)).toBeTruthy();
        utils.clickOnElement(component.find(".rdtSwitch"));
        expect(utils.isYearView(component)).toBeTruthy();
        utils.clickNthYear(component, 2);
        expect(utils.isMonthView(component)).toBeTruthy();
      });

      it("when switch from months to days view mode", () => {
        const component = utils.createDatetime({
          viewMode: "months",
          onViewModeChange: viewMode => {
            expect(viewMode).toEqual("days");
          }
        });
        expect(utils.isMonthView(component)).toBeTruthy();
        utils.clickNthMonth(component, 2);
        expect(utils.isDayView(component)).toBeTruthy();
      });
    });

    describe("onChange", () => {
      it("trigger only when last selection type is selected", () => {
        // By selection type I mean if you CAN select day, then selecting a month
        // should not trigger onChange
        const onChangeFn = jest.fn();
        const component = utils.createDatetime({
          viewMode: "years",
          onChange: onChangeFn
        });

        utils.openDatepicker(component);

        utils.clickNthYear(component, 2);
        expect(onChangeFn).not.toHaveBeenCalled();

        utils.clickNthMonth(component, 2);
        expect(onChangeFn).not.toHaveBeenCalled();

        utils.clickNthDay(component, 2);
        expect(onChangeFn).toHaveBeenCalled();
      });

      it("when selecting date", done => {
        const date = new Date(2000, 0, 15, 2, 2, 2, 2);
        const component = utils.createDatetime({
          defaultValue: date,
          onChange: selected => {
            expect(getDate(selected)).toEqual(2);
            expect(getMonth(selected)).toEqual(getMonth(date));
            expect(getYear(selected)).toEqual(getYear(date));
            done();
          }
        });

        utils.clickNthDay(component, 7);
      });

      it("when selecting multiple date in a row", done => {
        let i = 0;
        const date = new Date(2000, 0, 15, 2, 2, 2, 2);
        const component = utils.createDatetime({
          defaultValue: date,
          onChange: selected => {
            i++;
            if (i === 1) {
              expect(getDate(selected)).toEqual(2);
              expect(getMonth(selected)).toEqual(getMonth(date));
              expect(getYear(selected)).toEqual(getYear(date));
            } else if (i === 2) {
              expect(getDate(selected)).toEqual(3);
              expect(getMonth(selected)).toEqual(getMonth(date));
              expect(getYear(selected)).toEqual(getYear(date));
            } else if (i === 3) {
              expect(getDate(selected)).toEqual(4);
              expect(getMonth(selected)).toEqual(getMonth(date));
              expect(getYear(selected)).toEqual(getYear(date));
              done();
            }
          }
        });

        utils.clickNthDay(component, 7);
        utils.clickNthDay(component, 8);
        utils.clickNthDay(component, 9);
      });

      it("when selecting month", () => {
        const date = Date.UTC(2000, 0, 15, 2, 2, 2, 2);
        const onChangeFn = jest.fn();
        const component = utils.createDatetime({
          defaultValue: date,
          dateFormat: "YYYY-MM",
          onChange: onChangeFn
        });

        utils.clickNthMonth(component, 2);
        expect(onChangeFn).toHaveBeenCalledTimes(1);
        expect(onChangeFn.mock.calls[0][0].toJSON()).toEqual(
          "2000-03-15T02:02:02.002Z"
        );
      });

      // Passes locally but not on Travis
      it("when selecting year", () => {
        const date = Date.UTC(2000, 0, 15, 2, 2, 2, 2);
        const onChangeFn = jest.fn();
        const component = utils.createDatetime({
          defaultValue: date,
          dateFormat: "YYYY",
          onChange: onChangeFn
        });

        utils.clickNthYear(component, 2);
        expect(onChangeFn).toHaveBeenCalledTimes(1);
        expect(onChangeFn.mock.calls[0][0].toJSON()).toEqual(
          "2001-01-15T02:02:02.002Z"
        );
      });
    });
  });

  describe("onNavigateForward", () => {
    it("when moving to next month", () => {
      const component = utils.createDatetime({
        onNavigateForward: (amount, type) => {
          expect(amount).toEqual(1);
          expect(type).toEqual("months");
        }
      });

      utils.clickOnElement(component.find(".rdtNext"));
    });

    it("when moving to next year", () => {
      const component = utils.createDatetime({
        viewMode: "months",
        onNavigateForward: (amount, type) => {
          expect(amount).toEqual(1);
          expect(type).toEqual("years");
        }
      });

      utils.clickOnElement(component.find(".rdtNext"));
    });

    it("when moving decade forward", () => {
      const component = utils.createDatetime({
        viewMode: "years",
        onNavigateForward: (amount, type) => {
          expect(amount).toEqual(10);
          expect(type).toEqual("years");
        }
      });

      utils.clickOnElement(component.find(".rdtNext"));
    });
  });

  describe("onNavigateBack", () => {
    it("when moving to previous month", () => {
      const component = utils.createDatetime({
        onNavigateBack: (amount, type) => {
          expect(amount).toEqual(1);
          expect(type).toEqual("months");
        }
      });

      utils.clickOnElement(component.find(".rdtPrev"));
    });

    it("when moving to previous year", () => {
      const component = utils.createDatetime({
        viewMode: "months",
        onNavigateBack: (amount, type) => {
          expect(amount).toEqual(1);
          expect(type).toEqual("years");
        }
      });

      utils.clickOnElement(component.find(".rdtPrev"));
    });

    it("when moving decade back", () => {
      const component = utils.createDatetime({
        viewMode: "years",
        onNavigateBack: (amount, type) => {
          expect(amount).toEqual(10);
          expect(type).toEqual("years");
        }
      });

      utils.clickOnElement(component.find(".rdtPrev"));
    });
  });

  describe("with set value", () => {
    it("date value", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const strDate = format(date, "MM/DD/YYYY") + " " + format(date, "h:mm A");
      const component = utils.createDatetime({ value: date });
      expect(utils.getInputValue(component)).toEqual(strDate);
    });

    it("Date value", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const strDate = format(date, "MM/DD/YYYY") + " " + format(date, "h:mm A");
      const component = utils.createDatetime({ value: date });
      expect(utils.getInputValue(component)).toEqual(strDate);
    });

    it("string value", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const strDate = format(date, "MM/DD/YYYY") + " " + format(date, "h:mm A");
      const component = utils.createDatetime({ value: strDate });
      expect(utils.getInputValue(component)).toEqual(strDate);
    });

    it("UTC value from local Date", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const dateUTC = date;
      const strDateUTC =
        format(dateUTC, "MM/DD/YYYY") + " " + format(dateUTC, "h:mm A");
      const component = utils.createDatetime({ value: date, utc: true });
      expect(utils.getInputValue(component)).toEqual(strDateUTC);
    });

    it("UTC value from UTC Date", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const dateUTC = date;
      const strDateUTC =
        format(dateUTC, "MM/DD/YYYY") + " " + format(dateUTC, "h:mm A");
      const component = utils.createDatetime({ value: dateUTC, utc: true });
      expect(utils.getInputValue(component)).toEqual(strDateUTC);
    });

    it("UTC value from UTC string", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const dateUTC = date;
      const strDateUTC =
        format(dateUTC, "MM/DD/YYYY") + " " + format(dateUTC, "h:mm A");
      const component = utils.createDatetime({ value: strDateUTC, utc: true });
      expect(utils.getInputValue(component)).toEqual(strDateUTC);
    });

    it("invalid string value", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const strDate = format(date, "MM/DD/YYYY") + " " + format(date, "h:mm A");
      const component = utils.createDatetime({
        defaultValue: "invalid-value",
        onChange: updated => {
          expect(format(date, "MM/DD/YYYY h:mm A")).toEqual(
            format(updated, "MM/DD/YYYY h:mm A")
          );
          done();
        }
      });

      expect(component.find(".form-control").getDOMNode().value).toEqual(
        "invalid-value"
      );
      component
        .find(".form-control")
        .simulate("change", { target: { value: strDate } });
    });

    it("delete invalid string value", done => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        defaultValue: date,
        onChange: date => {
          expect(date).toEqual("");
          done();
        }
      });

      component
        .find(".form-control")
        .simulate("change", { target: { value: "" } });
    });

    it("invalid Date object", done => {
      const invalidValue = parse("bad");
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const strDate = format(date, "MM/DD/YYYY") + " " + format(date, "h:mm A");
      const component = utils.createDatetime({
        value: invalidValue,
        onChange: updated => {
          expect(format(date, "MM/DD/YYYY h:mm A")).toEqual(
            format(updated, "MM/DD/YYYY h:mm A")
          );
          done();
        }
      });

      expect(component.find(".form-control").getDOMNode().value).toEqual("");
      component
        .find(".form-control")
        .simulate("change", { target: { value: strDate } });
    });
  });
});
