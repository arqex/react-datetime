import React from "react";
import { mount, shallow } from "enzyme";
import DateTime from "../src/";

const _simulateClickOnElement = element => {
  return element.simulate("click");
};

export const triggerDocumentUp = () => {
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
};

export const createDatetime = (props: any) => {
  return mount(<DateTime {...props} />);
};

export const createDatetimeShallow = (props: any) => {
  return shallow(<DateTime {...props} />);
};

/*
 * Click Simulations
 */
export const openDatepicker = datetime => {
  datetime.find(".rdt input").simulate("focus");
};

export const clickOnElement = element => {
  return _simulateClickOnElement(element);
};

export const clickNthDay = (datetime, n) => {
  openDatepicker(datetime);
  return _simulateClickOnElement(datetime.find(".rdtDay").at(n));
};

export const clickNthMonth = (datetime, n) => {
  openDatepicker(datetime);
  return _simulateClickOnElement(datetime.find(".rdtMonth").at(n));
};

export const clickNthYear = (datetime, n) => {
  openDatepicker(datetime);
  return _simulateClickOnElement(datetime.find(".rdtYear").at(n));
};

/*
 * Boolean Checks
 */
export const isOpen = datetime => {
  return datetime.find(".rdt.rdtOpen").length === 1;
};

export const isDayView = datetime => {
  openDatepicker(datetime);
  return datetime.find(".rdtPicker .rdtDays").length === 1;
};

export const isMonthView = datetime => {
  openDatepicker(datetime);
  return datetime.find(".rdtPicker .rdtMonths").length === 1;
};

export const isYearView = datetime => {
  openDatepicker(datetime);
  return datetime.find(".rdtPicker .rdtYears").length === 1;
};

export const isTimeView = datetime => {
  openDatepicker(datetime);
  return datetime.find(".rdtPicker .rdtTime").length === 1;
};

/*
 * Change Time Values
 *
 * These functions only work when the time view is open
 */
export const increaseHour = (datetime, triggerUp = true) => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(0)
    .simulate("mouseDown");

  if (triggerUp) {
    triggerDocumentUp();
  }
};

export const decreaseHour = (datetime, triggerUp = true) => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(1)
    .simulate("mouseDown");

  if (triggerUp) {
    triggerDocumentUp();
  }
};

export const increaseMinute = (datetime, triggerUp = true) => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(2)
    .simulate("mouseDown");

  if (triggerUp) {
    triggerDocumentUp();
  }
};

export const decreaseMinute = (datetime, triggerUp = true) => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(3)
    .simulate("mouseDown");

  if (triggerUp) {
    triggerDocumentUp();
  }
};

export const increaseSecond = (datetime, triggerUp = true) => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(4)
    .simulate("mouseDown");

  if (triggerUp) {
    triggerDocumentUp();
  }
};

export const decreaseSecond = (datetime, triggerUp = true) => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(5)
    .simulate("mouseDown");

  if (triggerUp) {
    triggerDocumentUp();
  }
};

export const increaseMillisecond = (datetime, triggerUp = true) => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(6)
    .simulate("mouseDown");

  if (triggerUp) {
    triggerDocumentUp();
  }
};

export const decreaseMillisecond = (datetime, triggerUp = true) => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(7)
    .simulate("mouseDown");

  if (triggerUp) {
    triggerDocumentUp();
  }
};

export const increaseDayPart = (datetime, triggerUp = true) => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(8)
    .simulate("mouseDown");

  if (triggerUp) {
    triggerDocumentUp();
  }
};

export const decreaseDayPart = (datetime, triggerUp = true) => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(9)
    .simulate("mouseDown");

  if (triggerUp) {
    triggerDocumentUp();
  }
};

export const rightClickIncreaseHour = datetime => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(0)
    .simulate("contextmenu");
};

export const rightClickDecreaseHour = datetime => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(1)
    .simulate("contextmenu");
};

export const rightClickIncreaseMinute = datetime => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(2)
    .simulate("contextmenu");
};

export const rightClickDecreaseMinute = datetime => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(3)
    .simulate("contextmenu");
};

export const rightClickIncreaseSecond = datetime => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(4)
    .simulate("contextmenu");
};

export const rightClickDecreaseSecond = datetime => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(5)
    .simulate("contextmenu");
};

export const rightClickIncreaseMillisecond = datetime => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(6)
    .simulate("contextmenu");
};

export const rightClickDecreaseMillisecond = datetime => {
  openDatepicker(datetime);

  datetime
    .find(".rdtCounter .rdtBtn")
    .at(7)
    .simulate("contextmenu");
};

/*
 * Get Values
 */
export const getNthDay = (datetime, n) => {
  openDatepicker(datetime);

  return datetime.find(".rdtDay").at(n);
};

export const getNthMonth = (datetime, n) => {
  openDatepicker(datetime);

  return datetime.find(".rdtMonth").at(n);
};

export const getNthYear = (datetime, n) => {
  openDatepicker(datetime);

  return datetime.find(".rdtYear").at(n);
};

export const getHours = datetime => {
  openDatepicker(datetime);

  return datetime
    .find(".rdtCount")
    .at(0)
    .text();
};

export const getMinutes = datetime => {
  openDatepicker(datetime);

  return datetime
    .find(".rdtCount")
    .at(1)
    .text();
};

export const getSeconds = datetime => {
  openDatepicker(datetime);

  return datetime
    .find(".rdtCount")
    .at(2)
    .text();
};

export const getMilliseconds = datetime => {
  openDatepicker(datetime);

  return datetime
    .find(".rdtCount")
    .at(3)
    .text();
};

export const getDayPart = datetime => {
  openDatepicker(datetime);

  const element = datetime.find(".rdtCount").at(4);
  return element.exists() ? element.text() : "";
};

export const getInputValue = datetime => {
  return datetime.find(".rdt input").getDOMNode().value;
};

export const getViewDateValue = datetime => {
  openDatepicker(datetime);

  return datetime.find(".rdtSwitch").getDOMNode().innerHTML;
};
