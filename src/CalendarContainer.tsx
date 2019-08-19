import * as React from "react";

import TimeView from "./TimeView";
import DaysView from "./DaysView";
import MonthsView from "./MonthsView";
import YearsView from "./YearsView";

function CalendarContainer(props) {
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
