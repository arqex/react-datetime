import * as React from "react";
import cc from "classcat";

import format from "date-fns/format";
import addYears from "date-fns/add_years";
import getYear from "date-fns/get_year";
import setYear from "date-fns/set_year";
import getDaysInYear from "date-fns/get_days_in_year";
import setDayOfYear from "date-fns/set_day_of_year";

import returnTrue from "./returnTrue";
import noop from "./noop";

export interface YearsViewProps {
  viewDate: Date;
  setViewDate: any;
  selectedDate: Date | undefined;
  setSelectedDate: any;
  formatOptions: any;
  setViewMode: any;
  isValidDate: any;
}

function YearsView(props: YearsViewProps) {
  const {
    viewDate = new Date(),
    setViewDate = noop,
    selectedDate,
    setSelectedDate = noop,
    formatOptions,
    setViewMode = noop,
    isValidDate = returnTrue
  } = props;

  const startYear = Math.floor(getYear(viewDate) / 10) * 10;

  return (
    <div className="rdtYears">
      <table>
        <thead>
          <tr>
            <th
              className="rdtPrev"
              onClick={() => setViewDate(addYears(viewDate, -10))}
            >
              <span>‹</span>
            </th>
            <th
              className="rdtSwitch"
              onClick={() => setViewMode("years")}
              colSpan={2}
            >
              {startYear}-{startYear + 9}
            </th>
            <th
              className="rdtNext"
              onClick={() => setViewDate(addYears(viewDate, 10))}
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
            const rowStartYear = startYear - 1 + rowNum * 4;

            return (
              <tr key={rowStartYear}>
                {[0, 1, 2, 3].map(y => {
                  const year = y + rowStartYear;
                  const currentYear = setYear(viewDate, year);

                  const daysInYear = Array.from(
                    { length: getDaysInYear(viewDate) },
                    (e, i) => setDayOfYear(currentYear, i + 1)
                  );

                  const isDisabled = daysInYear.every(d => !isValidDate(d));

                  return (
                    <td
                      key={year}
                      className={cc([
                        "rdtYear",
                        {
                          rdtDisabled: isDisabled,
                          rdtActive:
                            selectedDate && getYear(selectedDate) === year
                        }
                      ])}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedDate(setYear(viewDate, year));
                        }
                      }}
                    >
                      {format(currentYear, "YYYY", formatOptions)}
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

export default YearsView;
