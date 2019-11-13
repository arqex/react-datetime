import * as React from "react";

import TimeView, { TimeViewProps } from "./TimeView";
import DaysView, { DaysViewProps } from "./DaysView";
import MonthsView, { MonthsViewProps } from "./MonthsView";
import YearsView, { YearsViewProps } from "./YearsView";
import { ViewMode } from "./.";

interface CalendarContainerProps {
  viewMode: ViewMode | undefined;
}

const CalendarContainer = React.forwardRef(function CalendarContainer(
  props: CalendarContainerProps &
    TimeViewProps &
    DaysViewProps &
    MonthsViewProps &
    YearsViewProps,
  ref: any
) {
  const { viewMode, ...rest } = props;

  let el: JSX.Element | undefined;
  switch (viewMode) {
    case "time":
      el = <TimeView {...rest} />;
      break;

    case "months":
      el = <MonthsView {...rest} />;
      break;

    case "years":
      el = <YearsView {...rest} />;
      break;

    case "days":
    default:
      el = <DaysView {...rest} />;
      break;
  }

  return (
    <div ref={ref} className="rdtPicker">
      {el}
    </div>
  );
});

export default CalendarContainer;
