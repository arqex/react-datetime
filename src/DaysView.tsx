import * as React from "react";
import cc from "classcat";

import addDays from "date-fns/addDays";
import format from "date-fns/format";
import differenceInDays from "date-fns/differenceInDays";
import startOfWeek from "date-fns/startOfWeek";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import isSameDay from "date-fns/isSameDay";
import isBefore from "date-fns/isBefore";
import addMonths from "date-fns/addMonths";
import getDate from "date-fns/getDate";

export interface DaysViewProps {
  timeFormat: string | false;
  viewDate: Date;
  setViewDate: any;
  selectedDate: Date | undefined;
  setSelectedDate: any;
  formatOptions: any;
  setViewMode: any;
  isValidDate: any;
}

function DaysView(props: DaysViewProps) {
  const {
    timeFormat = false,
    viewDate = new Date(),
    setViewDate,
    selectedDate,
    setSelectedDate,
    formatOptions,
    setViewMode,
    isValidDate
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
    <div className="rdtDays" data-testid="day-picker">
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
              data-testid="day-mode-switcher"
              onClick={() => setViewMode("months")}
              colSpan={5}
            >
              {format(viewDate, "LLLL yyyy", formatOptions)}
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
                {format(addDays(sunday, colNum), "iiiiii", formatOptions)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3, 4, 5].map(rowNum => {
            // Use 7 columns per row
            const rowStartDay = rowNum * 7;

            return (
              <tr
                key={format(
                  addDays(prevMonthLastWeekStart, rowStartDay),
                  "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
                )}
              >
                {[0, 1, 2, 3, 4, 5, 6].map(d => {
                  const i = d + rowStartDay;
                  const workingDate = addDays(prevMonthLastWeekStart, i);
                  const isDisabled =
                    typeof isValidDate === "function" &&
                    !isValidDate(workingDate);

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
                      {format(workingDate, "d", formatOptions)}
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
                data-testid="day-to-time-mode-switcher"
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
