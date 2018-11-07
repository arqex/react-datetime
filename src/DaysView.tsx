import * as React from "react";
import addDays from "date-fns/add_days";
import format from "date-fns/format";
import startOfWeek from "date-fns/start_of_week";
import startOfMonth from "date-fns/start_of_month";
import endOfMonth from "date-fns/end_of_month";
import isSameDay from "date-fns/is_same_day";
import isBefore from "date-fns/is_before";
import subMonths from "date-fns/sub_months";
import getDate from "date-fns/get_date";
import cc from "classcat";
import { IsValidDateFunc, SetDateFunc, ShiftFunc, ShowFunc } from ".";

import returnTrue from "./returnTrue";

interface DaysViewProps {
  /*
  Represents the month which is viewed on opening the calendar when there is no selected date.
  This prop is parsed by date-fns, so it is possible to use a date `string` or a `Date` object.
  */
  viewDate?: Date | string;
  shift?: ShiftFunc;
  show?: ShowFunc;
  selectedDate?: Date;

  setDate?: SetDateFunc;

  /*
  Defines the format for the time. It accepts any date-fns time format.
  If true the time will be displayed using the defaults for the current locale.
  If false the timepicker is disabled and the component can be used as datepicker.
  */
  timeFormat?: boolean | string;

  /*
  Define the dates that can be selected. The function receives (currentDate, selectedDate)
  and should return a true or false whether the currentDate is valid or not. See selectable dates.
  */
  isValidDate?: IsValidDateFunc;

  /*
  Customize the way that the days are shown in the day picker. The accepted function has
  the selectedDate, the current date and the default calculated props for the cell,
  and must return a React component. See appearance customization
  */
  renderDay?: (
    props: any,
    currentDate: any,
    selectedDate?: Date
  ) => JSX.Element;

  formatOptions?: any;
}

function defaultRenderDay(
  dayProps,
  currentDate,
  selectedDate,
  formatOptions
): JSX.Element {
  return <td {...dayProps}>{format(currentDate, "D", formatOptions)}</td>;
}

function DaysView({
  viewDate = new Date(),
  selectedDate,
  renderDay,
  isValidDate,
  setDate,
  timeFormat,
  formatOptions,
  shift,
  show
}: DaysViewProps): JSX.Element {
  const dateTime = selectedDate || viewDate;
  const renderer = renderDay || defaultRenderDay;
  const isValid = isValidDate || returnTrue;
  const sunday = startOfWeek(viewDate);

  const prevMonth = subMonths(viewDate, 1);
  const prevMonthLastWeekStart = startOfWeek(endOfMonth(prevMonth));

  return (
    <div className="rdtDays">
      <table>
        <thead>
          <tr>
            <th
              className="rdtPrev"
              onClick={shift && shift("sub", 1, "months")}
            >
              <span>‹</span>
            </th>
            <th
              className="rdtSwitch"
              onClick={show && show("months")}
              colSpan={5}
            >
              {format(viewDate, "MMMM YYYY", formatOptions)}
            </th>
            <th
              className="rdtNext"
              onClick={shift && shift("add", 1, "months")}
            >
              <span>›</span>
            </th>
          </tr>
          <tr>
            {[0, 1, 2, 3, 4, 5, 6].map(colNum => (
              <th key={colNum} className="dow">
                {format(addDays(sunday, colNum), "dd", formatOptions)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3, 4, 5].map(rowNum => {
            // Use 7 columns per row
            const rowStartDay = rowNum * 7;

            return (
              <tr key={format(addDays(prevMonthLastWeekStart, rowStartDay))}>
                {[0, 1, 2, 3, 4, 5, 6].map(d => {
                  const i = d + rowStartDay;
                  const workingDate = addDays(prevMonthLastWeekStart, i);
                  const isDisabled = !isValid(workingDate, selectedDate);

                  const dayProps: any = {
                    key: getDate(workingDate),
                    className: cc([
                      "rdtDay",
                      {
                        rdtOld: isBefore(workingDate, startOfMonth(viewDate)),
                        rdtNew: isBefore(endOfMonth(viewDate), workingDate),
                        rdtActive:
                          selectedDate && isSameDay(workingDate, selectedDate),
                        rdtToday: isSameDay(workingDate, new Date()),
                        rdtDisabled: isDisabled
                      }
                    ])
                  };

                  if (!isDisabled && setDate) {
                    dayProps.onClick = setDate("days", workingDate, true);
                  }

                  return renderer(
                    dayProps,
                    workingDate,
                    selectedDate,
                    formatOptions
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        {typeof timeFormat === "string" && timeFormat.trim() && dateTime ? (
          <tfoot>
            <tr>
              <td
                onClick={show && show("time")}
                colSpan={7}
                className="rdtTimeToggle"
              >
                {format(dateTime, timeFormat, formatOptions)}
              </td>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}

export default DaysView;
