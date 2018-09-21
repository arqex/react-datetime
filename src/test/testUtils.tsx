import React from "react";
import { mount, shallow } from "enzyme";
import DateTime from "../";

const _simulateClickOnElement = element => {
  if (element.length === 0) {
    // eslint-disable-next-line no-console
    console.warn("Element not clicked since it doesn't exist");
    return null;
  }

  return element.simulate("click");
};

export const createDatetime = (props = {}) => {
  return mount(<DateTime {...props} />);
};

export const createDatetimeShallow = (props = {}) => {
  return shallow(<DateTime {...props} />);
};

/*
	 * Click Simulations
	 */
export const openDatepicker = datetime => {
  datetime.find(".form-control").simulate("focus");
};

export const clickOnElement = element => {
  return _simulateClickOnElement(element);
};

export const clickNthDay = (datetime, n) => {
  return _simulateClickOnElement(datetime.find(".rdtDay").at(n));
};

export const clickNthMonth = (datetime, n) => {
  return _simulateClickOnElement(datetime.find(".rdtMonth").at(n));
};

export const clickNthYear = (datetime, n) => {
  return _simulateClickOnElement(datetime.find(".rdtYear").at(n));
};

/*
	 * Boolean Checks
	 */
export const isOpen = datetime => {
  return datetime.find(".rdt.rdtOpen").length === 1;
};

export const isDayView = datetime => {
  return datetime.find(".rdtPicker .rdtDays").length === 1;
};

export const isMonthView = datetime => {
  return datetime.find(".rdtPicker .rdtMonths").length === 1;
};

export const isYearView = datetime => {
  return datetime.find(".rdtPicker .rdtYears").length === 1;
};

export const isTimeView = datetime => {
  return datetime.find(".rdtPicker .rdtTime").length === 1;
};

/*
	 * Change Time Values
	 *
	 * These functions only work when the time view is open
	 */
export const increaseHour = datetime => {
  datetime
    .find(".rdtCounter .rdtBtn")
    .at(0)
    .simulate("mouseDown");
};

export const decreaseHour = datetime => {
  datetime
    .find(".rdtCounter .rdtBtn")
    .at(1)
    .simulate("mouseDown");
};

export const increaseMinute = datetime => {
  datetime
    .find(".rdtCounter .rdtBtn")
    .at(2)
    .simulate("mouseDown");
};

export const decreaseMinute = datetime => {
  datetime
    .find(".rdtCounter .rdtBtn")
    .at(3)
    .simulate("mouseDown");
};

export const increaseSecond = datetime => {
  datetime
    .find(".rdtCounter .rdtBtn")
    .at(4)
    .simulate("mouseDown");
};

export const decreaseSecond = datetime => {
  datetime
    .find(".rdtCounter .rdtBtn")
    .at(5)
    .simulate("mouseDown");
};

/*
	 * Get Values
	 */
export const getNthDay = (datetime, n) => {
  return datetime.find(".rdtDay").at(n);
};

export const getNthMonth = (datetime, n) => {
  return datetime.find(".rdtMonth").at(n);
};

export const getNthYear = (datetime, n) => {
  return datetime.find(".rdtYear").at(n);
};

export const getHours = datetime => {
  return datetime
    .find(".rdtCount")
    .at(0)
    .text();
};

export const getMinutes = datetime => {
  return datetime
    .find(".rdtCount")
    .at(1)
    .text();
};

export const getSeconds = datetime => {
  return datetime
    .find(".rdtCount")
    .at(2)
    .text();
};

export const getInputValue = datetime => {
  return datetime.find(".rdt > .form-control").getDOMNode().value;
};

export const getViewDateValue = datetime => {
  return datetime.find(".rdtSwitch").getDOMNode().innerHTML;
};
