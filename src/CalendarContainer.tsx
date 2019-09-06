import * as React from "react";

import TimeView, { TimeViewProps } from "./TimeView";
import DaysView, { DaysViewProps } from "./DaysView";
import MonthsView, { MonthsViewProps } from "./MonthsView";
import YearsView, { YearsViewProps } from "./YearsView";
import { ViewMode } from "./.";

interface CalendarContainerProps {
  viewMode: ViewMode | undefined;
}

function CalendarContainer(
  props: CalendarContainerProps &
    TimeViewProps &
    DaysViewProps &
    MonthsViewProps &
    YearsViewProps
) {
  const { viewMode, ...rest } = props;

  switch (viewMode) {
    case "time":
      return <TimeView {...rest} />;

    case "days":
      return <DaysView {...rest} />;

    case "months":
      return <MonthsView {...rest} />;

    case "years":
      return <YearsView {...rest} />;
  }

  throw new Error("Unsupported view mode.");
}

export default CalendarContainer;
