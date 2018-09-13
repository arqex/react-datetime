import React from "react";
import DaysView from "./DaysView";
import MonthsView from "./MonthsView";
import YearsView from "./YearsView";
import TimeView from "./TimeView";
import noop from "./noop";

const viewComponents = {
  days: DaysView,
  months: MonthsView,
  years: YearsView,
  time: TimeView
};

interface CalendarContainerProps {
  view: string;
  viewProps: any;
  onClickOutside: any;
}

class CalendarContainer extends React.Component<CalendarContainerProps, never> {
  static defaultProps = {
    view: "days",
    viewProps: {
      subtractTime: noop,
      showView: noop,
      addTime: noop
    }
  };

  render() {
    const { view, viewProps } = this.props;
    const Component = viewComponents[view];

    return <Component {...viewProps} />;
  }
}

export default CalendarContainer;
