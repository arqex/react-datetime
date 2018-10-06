import parse from "date-fns/parse";
import firstOfYear from "../firstOfYear";

describe("firstOfYear", () => {
  it("should set to the 1st day of the october", () => {
    expect(firstOfYear(parse("10/5/2018"))).toEqual(parse("1/1/2018"));
  });

  it("should set to the 1st day of the january", () => {
    expect(firstOfYear(parse("1/5/2018"))).toEqual(parse("1/1/2018"));
  });

  it("should set to the 1st day of the october, keeping time", () => {
    expect(firstOfYear(parse("10/5/2018 08:32"))).toEqual(
      parse("1/1/2018 08:32")
    );
  });

  it("should set to the 1st day of the january, keeping time", () => {
    expect(firstOfYear(parse("1/5/2018 08:32"))).toEqual(
      parse("1/1/2018 08:32")
    );
  });
});
