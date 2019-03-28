import * as utils from "./testUtils";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { advanceTo as mockDateTo } from "jest-date-mock";
import parse from "date-fns/parse";

Enzyme.configure({ adapter: new Adapter() });

// Mock date to get rid of time as a factor to make tests deterministic
mockDateTo(parse("September 2, 2018 18:24:34:567"));

describe("timer tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("long increase hour", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      timeFormat: "HH:mm:ss:SSS",
      viewMode: "time",
      defaultValue: date
    });

    utils.increaseHour(component, false);

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getHours(component)).toEqual("4");

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getHours(component)).toEqual("6");

    utils.triggerDocumentUp();

    expect(utils.getHours(component)).toEqual("6");
  });

  it("long decrease hour", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      timeFormat: "HH:mm:ss:SSS",
      viewMode: "time",
      defaultValue: date
    });

    utils.decreaseHour(component, false);

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getHours(component)).toEqual("0");

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getHours(component)).toEqual("22");

    utils.triggerDocumentUp();

    expect(utils.getHours(component)).toEqual("22");
  });

  it("long increase minute", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      timeFormat: "HH:mm:ss:SSS",
      viewMode: "time",
      defaultValue: date
    });

    utils.increaseMinute(component, false);

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getMinutes(component)).toEqual("04");

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getMinutes(component)).toEqual("06");

    utils.triggerDocumentUp();

    expect(utils.getMinutes(component)).toEqual("06");
  });

  it("long decrease minute", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      timeFormat: "HH:mm:ss:SSS",
      viewMode: "time",
      defaultValue: date
    });

    utils.decreaseMinute(component, false);

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getMinutes(component)).toEqual("00");

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getMinutes(component)).toEqual("58");

    utils.triggerDocumentUp();

    expect(utils.getMinutes(component)).toEqual("58");
  });

  it("long increase second", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      timeFormat: "HH:mm:ss:SSS",
      viewMode: "time",
      defaultValue: date
    });

    utils.increaseSecond(component, false);

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getSeconds(component)).toEqual("04");

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getSeconds(component)).toEqual("06");

    utils.triggerDocumentUp();

    expect(utils.getSeconds(component)).toEqual("06");
  });

  it("long decrease second", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      timeFormat: "HH:mm:ss:SSS",
      viewMode: "time",
      defaultValue: date
    });

    utils.decreaseSecond(component, false);

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getSeconds(component)).toEqual("00");

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getSeconds(component)).toEqual("58");

    utils.triggerDocumentUp();

    expect(utils.getSeconds(component)).toEqual("58");
  });

  it("long increase millisecond", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      timeFormat: "HH:mm:ss:SSS",
      viewMode: "time",
      defaultValue: date
    });

    utils.increaseMillisecond(component, false);

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getMilliseconds(component)).toEqual("004");

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getMilliseconds(component)).toEqual("006");

    utils.triggerDocumentUp();

    expect(utils.getMilliseconds(component)).toEqual("006");
  });

  it("long decrease millisecond", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const component = utils.createDatetime({
      timeFormat: "HH:mm:ss:SSS",
      viewMode: "time",
      defaultValue: date
    });

    utils.decreaseMillisecond(component, false);

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getMilliseconds(component)).toEqual("000");

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(utils.getMilliseconds(component)).toEqual("998");

    utils.triggerDocumentUp();

    expect(utils.getMilliseconds(component)).toEqual("998");
  });

  describe("long increase daypart", () => {
    it("should do nothing if the release is off of the arrow", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS A",
        viewMode: "time",
        defaultValue: date
      });

      utils.increaseDayPart(component, false);

      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();

      expect(utils.getDayPart(component)).toEqual("PM");

      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();

      expect(utils.getDayPart(component)).toEqual("PM");

      utils.triggerDocumentUp();

      expect(utils.getDayPart(component)).toEqual("PM");
    });
  });

  describe("long decrease daypart", () => {
    it("should do nothing if the release is off of the arrow", () => {
      const date = new Date(2000, 0, 15, 2, 2, 2, 2);
      const component = utils.createDatetime({
        timeFormat: "HH:mm:ss:SSS A",
        viewMode: "time",
        defaultValue: date
      });

      utils.decreaseDayPart(component, false);

      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();

      expect(utils.getDayPart(component)).toEqual("PM");

      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();

      expect(utils.getDayPart(component)).toEqual("PM");

      utils.triggerDocumentUp();

      expect(utils.getDayPart(component)).toEqual("PM");
    });
  });
});
