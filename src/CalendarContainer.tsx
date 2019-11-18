import * as React from "react";
import cc from "classcat";

import TimeView, { TimeViewProps } from "./TimeView";
import DaysView, { DaysViewProps } from "./DaysView";
import MonthsView, { MonthsViewProps } from "./MonthsView";
import YearsView, { YearsViewProps } from "./YearsView";
import { ViewMode } from "./.";

interface CalendarContainerProps {
  viewMode: ViewMode | undefined;
  isStatic?: boolean;
}

const CalendarContainer = React.forwardRef(function CalendarContainer(
  props: CalendarContainerProps &
    TimeViewProps &
    DaysViewProps &
    MonthsViewProps &
    YearsViewProps,
  ref: any
) {
  const { viewMode, isStatic = true, ...rest } = props;

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
    <div ref={ref} className={cc(["rdtPicker", { rdtStatic: isStatic }])}>
      {el}
    </div>
  );
});

export default CalendarContainer;
