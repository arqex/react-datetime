import * as React from "react";
import cc from "classcat";

import format from "date-fns/format";
import addYears from "date-fns/add_years";
import isSameMonth from "date-fns/is_same_month";
import setMonth from "date-fns/set_month";
import getDaysInMonth from "date-fns/get_days_in_month";
import setDate from "date-fns/set_date";

import returnTrue from "./returnTrue";
import noop from "./noop";

function MonthsView(props) {
  const {
    viewDate = new Date(),
    setViewDate = noop,
    selectedDate,
    setSelectedDate = noop,
    formatOptions,
    setViewMode = noop,
    isValidDate = returnTrue
  } = props;

  return (
    <div className="rdtMonths">
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
              onClick={() => setViewMode("years")}
              colSpan={2}
            >
              {format(viewDate, "YYYY", formatOptions)}
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

                  const isDisabled = daysInMonths.every(d => !isValidDate(d));
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
                      {format(monthDate, "MMM", formatOptions)}
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
