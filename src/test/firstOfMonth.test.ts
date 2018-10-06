import parse from "date-fns/parse";
import firstOfMonth from "../firstOfMonth";

describe("firstOfMonth", () => {
  it("should set to the 1st day of the october", () => {
    expect(firstOfMonth(parse("10/5/2018"))).toEqual(parse("10/1/2018"));
  });

  it("should set to the 1st day of the january", () => {
    expect(firstOfMonth(parse("1/5/2018"))).toEqual(parse("1/1/2018"));
  });

  it("should set to the 1st day of the october, keeping time", () => {
    expect(firstOfMonth(parse("10/5/2018 08:32"))).toEqual(
      parse("10/1/2018 08:32")
    );
  });

  it("should set to the 1st day of the january, keeping time", () => {
    expect(firstOfMonth(parse("1/5/2018 08:32"))).toEqual(
      parse("1/1/2018 08:32")
    );
  });
});
