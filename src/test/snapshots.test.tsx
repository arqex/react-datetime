import React from "react";
import DateTime from "../";
import CalendarContainer from "../CalendarContainer";
import TimeView from "../TimeView";
import DaysView from "../DaysView";
import MonthsView from "../MonthsView";
import YearsView from "../YearsView";
import renderer from "react-test-renderer";
import { advanceTo as mockDateTo } from "jest-date-mock";

import parse from "date-fns/parse";
import addDays from "date-fns/add_days";
import getDate from "date-fns/get_date";
import isAfter from "date-fns/is_after";

// findDOMNode is not supported by the react-test-renderer,
// and even though this component is not using that method
// a dependency is probably using it. So we need to mock it
// to make the tests pass.
// https://github.com/facebook/react/issues/7371
jest.mock("react-dom", () => ({
  findDOMNode: () => {}
}));

// Mock date to get rid of time as a factor to make tests deterministic
mockDateTo("September 2, 2018 03:24:00");

describe("DateTime component", () => {
  it("everything default: renders correctly", () => {
    const tree = renderer.create(<DateTime />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("value: set to arbitrary value", () => {
    const tree = renderer
      .create(<DateTime value={parse("December 21, 2016 05:36 PM")} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("defaultValue: set to arbitrary value", () => {
    const tree = renderer
      .create(<DateTime defaultValue={parse("December 21, 2016 05:36 PM")} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("dateFormat", () => {
    it("set to true", () => {
      const tree = renderer.create(<DateTime dateFormat={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("set to false", () => {
      const tree = renderer.create(<DateTime dateFormat={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe("timeFormat", () => {
    it("set to true", () => {
      const tree = renderer.create(<DateTime timeFormat={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("set to false", () => {
      const tree = renderer.create(<DateTime timeFormat={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe("input", () => {
    it("input: set to true", () => {
      const tree = renderer.create(<DateTime input={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("input: set to false", () => {
      const tree = renderer.create(<DateTime input={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe("open", () => {
    it("set to true", () => {
      const tree = renderer.create(<DateTime open={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("should support change true -> false", () => {
      const tree = renderer.create(<DateTime open={true} />);
      expect(tree.toJSON()).toMatchSnapshot();

      tree.update(<DateTime open={false} />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it("set to false", () => {
      const tree = renderer.create(<DateTime open={false} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("should support change false -> true", () => {
      const tree = renderer.create(<DateTime open={false} />);
      expect(tree.toJSON()).toMatchSnapshot();

      tree.update(<DateTime open={true} />);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    describe("undefined `open` prop", () => {
      it("should hide when changing prop if closeOnSelect is true", () => {
        const tree = renderer.create(
          <DateTime
            value={parse("December 21, 2016 05:36 PM")}
            closeOnSelect={true}
          />
        );
        expect(tree.toJSON()).toMatchSnapshot();

        // Click into the input field
        tree.root.findByType("input").props.onClick();
        expect(tree.toJSON()).toMatchSnapshot();

        // Change the value
        tree.update(<DateTime value={parse("December 21, 2016 03:36 PM")} />);
        expect(tree.toJSON()).toMatchSnapshot();
      });
    });
  });

  describe("viewMode", () => {
    it("set to days", () => {
      const tree = renderer.create(<DateTime viewMode={"days"} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("set to months", () => {
      const tree = renderer.create(<DateTime viewMode={"months"} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("set to years", () => {
      const tree = renderer.create(<DateTime viewMode={"years"} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("set to time", () => {
      const tree = renderer.create(<DateTime viewMode={"time"} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("should support changing dynamically", () => {
      const tree = renderer.create(<DateTime viewMode={"days"} />);
      expect(tree.toJSON()).toMatchSnapshot();

      tree.update(<DateTime viewMode={"years"} />);

      expect(tree.toJSON()).toMatchSnapshot();
    });
  });

  it("className: set to arbitrary value", () => {
    const tree = renderer
      .create(<DateTime className={"arbitrary-value"} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("inputProps", () => {
    it("with placeholder specified", () => {
      const tree = renderer
        .create(
          <DateTime inputProps={{ placeholder: "arbitrary-placeholder" }} />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("with disabled specified", () => {
      const tree = renderer
        .create(<DateTime inputProps={{ disabled: true }} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("with required specified", () => {
      const tree = renderer
        .create(<DateTime inputProps={{ required: true }} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("with name specified", () => {
      const tree = renderer
        .create(<DateTime inputProps={{ name: "arbitrary-name" }} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("with className specified", () => {
      const tree = renderer
        .create(<DateTime inputProps={{ className: "arbitrary-className" }} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it("isValidDate: only valid if after yesterday", () => {
    const yesterday = addDays(new Date(), -1);
    const valid = current => isAfter(current, yesterday);
    const tree = renderer.create(<DateTime isValidDate={valid} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renderDay: specified", () => {
    const renderDay = (props, currentDate) => (
      <td {...props}>{"0" + getDate(currentDate)}</td>
    );
    const tree = renderer.create(<DateTime renderDay={renderDay} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renderMonth: specified", () => {
    const renderMonth = (props, currentDate) => (
      <td {...props}>{"0" + getDate(currentDate)}</td>
    );
    const tree = renderer
      .create(<DateTime renderMonth={renderMonth} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renderYear: specified", () => {
    const renderYear = (props, currentDate) => (
      <td {...props}>{"0" + getDate(currentDate)}</td>
    );
    const tree = renderer.create(<DateTime renderYear={renderYear} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("CalendarContainer", () => {
  it("everything default: renders correctly", () => {
    const tree = renderer.create(<CalendarContainer />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("TimeView", () => {
  it("everything default: renders correctly", () => {
    const tree = renderer.create(<TimeView />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("DaysView", () => {
  it("everything default: renders correctly", () => {
    const tree = renderer.create(<DaysView />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("MonthsView", () => {
  it("everything default: renders correctly", () => {
    const tree = renderer.create(<MonthsView />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("YearsView", () => {
  it("everything default: renders correctly", () => {
    const tree = renderer.create(<YearsView />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
