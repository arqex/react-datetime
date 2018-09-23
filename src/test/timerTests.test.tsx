import * as utils from "./testUtils";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { advanceTo as mockDateTo } from "jest-date-mock";

Enzyme.configure({ adapter: new Adapter() });

// Mock date to get rid of time as a factor to make tests deterministic
mockDateTo("September 2, 2018 03:24:00");

describe("timer tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("long increase time", () => {
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

  it("long decrease time", () => {
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
});
