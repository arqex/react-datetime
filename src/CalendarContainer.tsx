import * as React from "react";
import cc from "classcat";

import TimeView, { TimeViewProps } from "./TimeView";
import DaysView, { DaysViewProps } from "./DaysView";
import MonthsView, { MonthsViewProps } from "./MonthsView";
import YearsView, { YearsViewProps } from "./YearsView";
import { ViewMode } from "./.";
import { ForwardedRef } from "react";

const viewLookup = {
  time: TimeView,
  months: MonthsView,
  years: YearsView,
  days: DaysView,
};

interface CalendarContainerProps {
  viewMode: ViewMode | undefined;
  isStatic: boolean;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const CalendarContainer = React.forwardRef(function CalendarContainer(
  props: CalendarContainerProps &
    TimeViewProps &
    DaysViewProps &
    MonthsViewProps &
    YearsViewProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const { viewMode, isStatic, id, className, style, ...rest } = props;
  if (!viewMode) {
    return null;
  }

  const CalendarElement = viewLookup[viewMode];

  return (
    <div
      ref={ref}
      id={id}
      data-testid="picker-wrapper"
      className={cc(["rdtPicker", className, { rdtStatic: isStatic }])}
      style={style}
    >
      {CalendarElement && <CalendarElement {...rest} />}
    </div>
  );
});

export default CalendarContainer;
