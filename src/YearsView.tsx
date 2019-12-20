import * as React from "react";
import cc from "classcat";

import format from "date-fns/format";
import addYears from "date-fns/addYears";
import getYear from "date-fns/getYear";
import setYear from "date-fns/setYear";
import getDaysInYear from "date-fns/getDaysInYear";
import setDayOfYear from "date-fns/setDayOfYear";
import isSameYear from "date-fns/isSameYear";
import { FormatOptions, ViewMode } from "./index";

export interface YearsViewProps {
  viewDate: Date;
  setViewDate: (newViewDate: Date | undefined) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (newDate: Date, tryClose?: boolean) => void;
  formatOptions: FormatOptions;
  setViewMode: (newViewMode: ViewMode) => void;
  isValidDate?: (date: Date) => boolean;
}

function YearsView(props: YearsViewProps) {
  const {
    viewDate = new Date(),
    setViewDate,
    selectedDate,
    setSelectedDate,
    formatOptions,
    setViewMode,
    isValidDate
  } = props;

  const startYear = Math.floor(getYear(viewDate) / 10) * 10;

  return (
    <div className="rdtYears" data-testid="year-picker">
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
              data-testid="year-mode-switcher"
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

                  const isDisabled = daysInYear.every(
                    d => typeof isValidDate === "function" && !isValidDate(d)
                  );

                  const isActive =
                    selectedDate && isSameYear(selectedDate, currentYear);

                  return (
                    <td
                      key={year}
                      className={cc([
                        "rdtYear",
                        {
                          rdtDisabled: isDisabled,
                          rdtActive: isActive
                        }
                      ])}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedDate(setYear(viewDate, year));
                        }
                      }}
                    >
                      {format(currentYear, "yyyy", formatOptions)}
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
