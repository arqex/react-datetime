import React from "react";
import { mount, shallow } from "enzyme";
import DateTime from "../";

const _simulateClickOnElement = element => {
  return element.simulate("click");
};

const triggerDocumentUp = (time = 0) => {
  setTimeout(() => {
    {
      const evt = document.createEvent("HTMLEvents");
      evt.initEvent("mouseup", false, true);
      document.body.dispatchEvent(evt);
    }

    {
      const evt = document.createEvent("HTMLEvents");
      evt.initEvent("touchend", false, true);
      document.body.dispatchEvent(evt);
    }
  }, time);
};

module.exports = {
  createDatetime: props => {
    return mount(<DateTime {...props} />);
  },

  createDatetimeShallow: props => {
    return shallow(<DateTime {...props} />);
  },

  /*
	 * Click Simulations
	 */
  openDatepicker: (datetime, time) => {
    datetime.find(".form-control").simulate("focus");
  },

  clickOnElement: element => {
    return _simulateClickOnElement(element);
  },

  clickNthDay: (datetime, n) => {
    return _simulateClickOnElement(datetime.find(".rdtDay").at(n));
  },

  clickNthMonth: (datetime, n) => {
    return _simulateClickOnElement(datetime.find(".rdtMonth").at(n));
  },

  clickNthYear: (datetime, n) => {
    return _simulateClickOnElement(datetime.find(".rdtYear").at(n));
  },

  /*
	 * Boolean Checks
	 */
  isOpen: datetime => {
    return datetime.find(".rdt.rdtOpen").length === 1;
  },

  isDayView: datetime => {
    return datetime.find(".rdtPicker .rdtDays").length === 1;
  },

  isMonthView: datetime => {
    return datetime.find(".rdtPicker .rdtMonths").length === 1;
  },

  isYearView: datetime => {
    return datetime.find(".rdtPicker .rdtYears").length === 1;
  },

  isTimeView: datetime => {
    return datetime.find(".rdtPicker .rdtTime").length === 1;
  },

  /*
	 * Change Time Values
	 *
	 * These functions only work when the time view is open
	 */
  increaseHour: (datetime, time) => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(0)
      .simulate("mouseDown");

    triggerDocumentUp(time);
  },

  decreaseHour: (datetime, time) => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(1)
      .simulate("mouseDown");

    triggerDocumentUp(time);
  },

  increaseMinute: (datetime, time) => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(2)
      .simulate("mouseDown");

    triggerDocumentUp(time);
  },

  decreaseMinute: (datetime, time) => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(3)
      .simulate("mouseDown");

    triggerDocumentUp(time);
  },

  increaseSecond: (datetime, time) => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(4)
      .simulate("mouseDown");

    triggerDocumentUp(time);
  },

  decreaseSecond: (datetime, time) => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(5)
      .simulate("mouseDown");

    triggerDocumentUp(time);
  },

  increaseMillisecond: (datetime, time) => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(6)
      .simulate("mouseDown");

    triggerDocumentUp(time);
  },

  decreaseMillisecond: (datetime, time) => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(7)
      .simulate("mouseDown");

    triggerDocumentUp(time);
  },

  increaseDayPart: (datetime, time) => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(6)
      .simulate("mouseDown");

    triggerDocumentUp(time);
  },

  decreaseDayPart: (datetime, time) => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(7)
      .simulate("mouseDown");

    triggerDocumentUp(time);
  },

  rightClickIncreaseHour: datetime => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(0)
      .simulate("contextmenu");
  },

  rightClickDecreaseHour: datetime => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(1)
      .simulate("contextmenu");
  },

  rightClickIncreaseMinute: datetime => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(2)
      .simulate("contextmenu");
  },

  rightClickDecreaseMinute: datetime => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(3)
      .simulate("contextmenu");
  },

  rightClickIncreaseSecond: datetime => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(4)
      .simulate("contextmenu");
  },

  rightClickDecreaseSecond: datetime => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(5)
      .simulate("contextmenu");
  },

  rightClickIncreaseMillisecond: datetime => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(6)
      .simulate("contextmenu");
  },

  rightClickDecreaseMillisecond: datetime => {
    datetime
      .find(".rdtCounter .rdtBtn")
      .at(7)
      .simulate("contextmenu");
  },

  /*
	 * Get Values
	 */
  getNthDay: (datetime, n) => {
    return datetime.find(".rdtDay").at(n);
  },

  getNthMonth: (datetime, n) => {
    return datetime.find(".rdtMonth").at(n);
  },

  getNthYear: (datetime, n) => {
    return datetime.find(".rdtYear").at(n);
  },

  getHours: datetime => {
    return datetime
      .find(".rdtCount")
      .at(0)
      .text();
  },

  getMinutes: datetime => {
    return datetime
      .find(".rdtCount")
      .at(1)
      .text();
  },

  getSeconds: datetime => {
    return datetime
      .find(".rdtCount")
      .at(2)
      .text();
  },

  getMilliseconds: datetime => {
    return datetime
      .find(".rdtCount")
      .at(3)
      .text();
  },

  getDayPart: datetime => {
    return datetime
      .find(".rdtCount")
      .at(3)
      .text();
  },

  getInputValue: datetime => {
    return datetime.find(".rdt > .form-control").getDOMNode().value;
  },

  getViewDateValue: datetime => {
    return datetime.find(".rdtSwitch").getDOMNode().innerHTML;
  }
};
