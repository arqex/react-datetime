import * as React from "react";
import cc from "classcat";

import format from "date-fns/format";
import addYears from "date-fns/addYears";
import isSameMonth from "date-fns/isSameMonth";
import setMonth from "date-fns/setMonth";
import getDaysInMonth from "date-fns/getDaysInMonth";
import setDate from "date-fns/setDate";

export interface MonthsViewProps {
  viewDate: Date;
  setViewDate: any;
  selectedDate: Date | undefined;
  setSelectedDate: any;
  formatOptions: any;
  setViewMode: any;
  isValidDate: any;
}

function MonthsView(props: MonthsViewProps) {
  const {
    viewDate = new Date(),
    setViewDate,
    selectedDate,
    setSelectedDate,
    formatOptions,
    setViewMode,
    isValidDate
  } = props;

  return (
    <div className="rdtMonths" data-testid="month-picker">
      <table>
        <thead>
          <tr>
            <th
              className="rdtPrev"
              onClick={() => setViewDate(addYears(viewDate, -1))}
            >
              <span>‹</span>
            </th>
            <th
              className="rdtSwitch"
              data-testid="month-mode-switcher"
              onClick={() => setViewMode("years")}
              colSpan={2}
            >
              {format(viewDate, "yyyy", formatOptions)}
            </th>
            <th
              className="rdtNext"
              onClick={() => setViewDate(addYears(viewDate, 1))}
            >
              <span>›</span>
            </th>
          </tr>
        </thead>
      </table>
      <table>
        <tbody>
          {[0, 1, 2].map(rowNum => {
            // Use 4 columns per row
            const rowStartMonth = rowNum * 4;

            return (
              <tr key={rowStartMonth}>
                {[0, 1, 2, 3].map(m => {
                  const month = m + rowStartMonth;
                  const currentMonth = setMonth(viewDate, month);

                  const daysInMonths = Array.from(
                    { length: getDaysInMonth(currentMonth) },
                    (e, i) => setDate(currentMonth, i + 1)
                  );

                  const isDisabled = daysInMonths.every(
                    d => typeof isValidDate === "function" && !isValidDate(d)
                  );
                  const monthDate = setMonth(new Date(), month);

                  return (
                    <td
                      key={month}
                      className={cc([
                        "rdtMonth",
                        {
                          rdtDisabled: isDisabled,
                          rdtActive:
                            selectedDate &&
                            isSameMonth(selectedDate, currentMonth)
                        }
                      ])}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedDate(setMonth(viewDate, month));
                        }
                      }}
                    >
                      {format(monthDate, "LLL", formatOptions)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MonthsView;
