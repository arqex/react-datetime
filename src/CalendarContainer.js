import React from "react";
import DaysView from "./DaysView";
import MonthsView from "./MonthsView";
import YearsView from "./YearsView";
import TimeView from "./TimeView";

const viewComponents = {
  days: DaysView,
  months: MonthsView,
  years: YearsView,
  time: TimeView
};

const CalendarContainer = props => {
  const { view, viewProps } = props;
  const Component = viewComponents[view || "days"];

  return <Component {...viewProps} />;
};

export default CalendarContainer;
