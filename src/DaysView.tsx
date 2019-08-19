import * as React from "react";
import cc from "classcat";

import addDays from "date-fns/add_days";
import format from "date-fns/format";
import differenceInDays from "date-fns/difference_in_days";
import startOfWeek from "date-fns/start_of_week";
import startOfMonth from "date-fns/start_of_month";
import endOfMonth from "date-fns/end_of_month";
import isSameDay from "date-fns/is_same_day";
import isBefore from "date-fns/is_before";
import addMonths from "date-fns/add_months";
import getDate from "date-fns/get_date";
import returnTrue from "./returnTrue";
import noop from "./noop";

function DaysView(props) {
  const {
    timeFormat = false,
    viewDate = new Date(),
    setViewDate = noop,
    selectedDate,
    setSelectedDate = noop,
    formatOptions,
    setViewMode = noop,
    isValidDate = returnTrue
  } = props;

  const sunday = startOfWeek(viewDate);

  const prevMonth = addMonths(viewDate, -1);
  const daysSincePrevMonthLastWeekStart = differenceInDays(
    startOfWeek(endOfMonth(prevMonth)),
    viewDate
  );
  const prevMonthLastWeekStart = addDays(
    viewDate,
    daysSincePrevMonthLastWeekStart
  );

  return (
    <div className="rdtDays">
      <table>
        <thead>
          <tr>
            <th
              className="rdtPrev"
              onClick={() => setViewDate(addMonths(viewDate, -1))}
            >
              <span>‹</span>
            </th>
            <th
              className="rdtSwitch"
              onClick={() => setViewMode("months")}
              colSpan={5}
            >
              {format(viewDate, "MMMM YYYY", formatOptions)}
            </th>
            <th
              className="rdtNext"
              onClick={() => setViewDate(addMonths(viewDate, 1))}
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
                  const isDisabled = !isValidDate(workingDate, selectedDate);

                  return (
                    <td
                      key={getDate(workingDate)}
                      className={cc([
                        "rdtDay",
                        {
                          rdtOld: isBefore(workingDate, startOfMonth(viewDate)),
                          rdtNew: isBefore(endOfMonth(viewDate), workingDate),
                          rdtActive:
                            selectedDate &&
                            isSameDay(workingDate, selectedDate),
                          rdtToday: isSameDay(workingDate, new Date()),
                          rdtDisabled: isDisabled
                        }
                      ])}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedDate(workingDate);
                        }
                      }}
                    >
                      {format(workingDate, "D", formatOptions)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        {typeof timeFormat === "string" && timeFormat.trim() && (
          <tfoot>
            <tr>
              <td
                onClick={() => setViewMode("time")}
                colSpan={7}
                className="rdtTimeToggle"
              >
                {format(viewDate, timeFormat, formatOptions)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default DaysView;
