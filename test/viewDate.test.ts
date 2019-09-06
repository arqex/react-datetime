import * as utils from "./testUtils";
import Enzyme from "enzyme";
import adapter from "enzyme-adapter-react-16";
import { advanceTo as mockDateTo } from "jest-date-mock";
import format from "date-fns/format";
import parse from "date-fns/parse";

Enzyme.configure({ adapter: new adapter() });

// Mock date to get rid of time as a factor to make tests deterministic
mockDateTo(
  parse("9/2/2018 18:24:34:567", "LL/dd/yyyy hh:mm:ss:SSS", undefined as any)
);

describe("with viewDate", () => {
  it("date value", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const strDate = format(date, "LLLL yyyy");
    const component = utils.createDatetime({ viewDate: date });
    expect(utils.getViewDateValue(component)).toEqual(strDate);
  });

  it("Date value", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const strDate = format(date, "LLLL yyyy");
    const component = utils.createDatetime({ viewDate: date });
    expect(utils.getViewDateValue(component)).toEqual(strDate);
  });

  it("string value", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const strDate = `${format(date, "LL/dd/yyyy")} ${format(date, "h:mm a")}`;
    const expectedStrDate = format(date, "LLLL yyyy");
    const component = utils.createDatetime({ viewDate: strDate });
    expect(utils.getViewDateValue(component)).toEqual(expectedStrDate);
  });

  it("UTC value from UTC string", () => {
    const date = new Date(2000, 0, 15, 2, 2, 2, 2);
    const dateUTC = new Date(date.getTime());
    const strDateUTC = `${format(dateUTC, "LL/dd/yyyy")} ${format(
      dateUTC,
      "h:mm a"
    )}`;
    const expectedStrDate = format(dateUTC, "LLLL yyyy");
    const component = utils.createDatetime({ viewDate: strDateUTC, utc: true });
    expect(utils.getViewDateValue(component)).toEqual(expectedStrDate);
  });

  it("invalid string value", () => {
    const strDate = "invalid string";
    const expectedStrDate = format(new Date(), "LLLL yyyy");
    const component = utils.createDatetime({ viewDate: strDate });
    expect(utils.getViewDateValue(component)).toEqual(expectedStrDate);
  });

  it("invalid Date object", () => {
    const date = null;
    const expectedStrDate = format(new Date(), "LLLL yyyy");
    const component = utils.createDatetime({ viewDate: date });
    expect(utils.getViewDateValue(component)).toEqual(expectedStrDate);
  });

  it("viewDate -> picker should change the initial month (viewMode=months)", () => {
    const preDate = new Date(2000, 0, 15, 2, 2, 2, 2);
    const strPreDate = format(preDate, "LLLL yyyy");
    const component = utils.createDatetime({ viewDate: preDate });
    expect(utils.getViewDateValue(component)).toEqual(strPreDate);

    const postDate = new Date(2010, 0, 15, 2, 2, 2, 2);
    const strPostDate = format(postDate, "LLLL yyyy");
    component.setProps({ viewDate: postDate });
    expect(utils.getViewDateValue(component)).toEqual(strPostDate);
  });
});
