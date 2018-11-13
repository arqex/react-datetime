import * as React from "react";
import onClickOutside from "react-onclickoutside";
import Days from "./DaysView";
import Months from "./MonthsView";
import Years from "./YearsView";
import Time from "./TimeView";
import noop from "./noop";

const views = {
  days: Days,
  months: Months,
  years: Years,
  time: Time
};

interface CalendarContainerProps {
  view: "years" | "months" | "days" | "time";
  viewProps: any;
  onClickOutside: any;
}

class CalendarContainer extends React.Component<CalendarContainerProps, never> {
  static defaultProps = {
    view: "days",
    onClickOutside: noop,
    viewProps: {}
  };

  handleClickOutside() {
    this.props.onClickOutside();
  }

  render() {
    const { view, viewProps } = this.props;
    const Component = views[view];

    return <Component {...viewProps} readonly={!!viewProps.value} />;
  }
}

export default onClickOutside(CalendarContainer);
