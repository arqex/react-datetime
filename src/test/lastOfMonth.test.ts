import parse from "date-fns/parse";
import lastOfMonth from "../lastOfMonth";

describe("lastOfMonth", () => {
  it("should set to the 1st day of the october", () => {
    expect(lastOfMonth(parse("10/5/2018"))).toEqual(parse("10/31/2018"));
  });

  it("should set to the 1st day of the january", () => {
    expect(lastOfMonth(parse("1/5/2018"))).toEqual(parse("1/31/2018"));
  });

  it("should set to the 1st day of the october, keeping time", () => {
    expect(lastOfMonth(parse("10/5/2018 08:32"))).toEqual(
      parse("10/31/2018 08:32")
    );
  });

  it("should set to the 1st day of the january, keeping time", () => {
    expect(lastOfMonth(parse("1/5/2018 08:32"))).toEqual(
      parse("1/31/2018 08:32")
    );
  });
});
