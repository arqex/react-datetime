import parse from "date-fns/parse";
import firstOfWeek from "../firstOfWeek";

describe("firstOfWeek", () => {
  it("should set to the 1st day of the october", () => {
    expect(firstOfWeek(parse("10/5/2018"))).toEqual(parse("9/30/2018"));
  });

  it("should set to the 1st day of the january", () => {
    expect(firstOfWeek(parse("1/5/2018"))).toEqual(parse("12/31/2017"));
  });

  it("should set to the 1st day of the october, keeping time", () => {
    expect(firstOfWeek(parse("10/5/2018 08:32"))).toEqual(
      parse("9/30/2018 08:32")
    );
  });

  it("should set to the 1st day of the january, keeping time", () => {
    expect(firstOfWeek(parse("1/5/2018 08:32"))).toEqual(
      parse("12/31/2017 08:32")
    );
  });
});
