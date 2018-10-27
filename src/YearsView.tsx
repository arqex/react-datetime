import * as React from "react";
import getYear from "date-fns/get_year";
import setYear from "date-fns/set_year";
import getDaysInYear from "date-fns/get_days_in_year";
import setDayOfYear from "date-fns/set_day_of_year";
import cc from "classcat";
import { IsValidDateFunc, SetDateFunc, ShiftFunc, ShowFunc } from ".";
import returnTrue from "./returnTrue";

interface YearsViewProps {
  viewDate?: Date;
  shift?: ShiftFunc;
  show?: ShowFunc;
  selectedDate?: Date;

  /*
  Define the dates that can be selected. The function receives (currentDate, selectedDate)
  and should return a true or false whether the currentDate is valid or not. See selectable dates.
  */
  isValidDate?: IsValidDateFunc;

  /*
  Customize the way that the years are shown in the year picker.
  The accepted function has the selectedDate, the current date and the default calculated
  props for the cell, the year to be shown, and must return a React component.
  See appearance customization
  */
  renderYear?: (props: any, year: number, selectedDate?: Date) => JSX.Element;

  setDate?: SetDateFunc;
}

function defaultRenderYear(yearProps: any, year: number): JSX.Element {
  return <td {...yearProps}>{year}</td>;
}

function YearsView({
  selectedDate,
  viewDate = new Date(),
  renderYear,
  isValidDate,
  shift,
  show,
  setDate
}: YearsViewProps): JSX.Element {
  const renderer = renderYear || defaultRenderYear;
  const isValid = isValidDate || returnTrue;

  const startYear = Math.floor(getYear(viewDate) / 10) * 10;

  return (
    <div className="rdtYears">
      <table>
        <thead>
          <tr>
            <th
              className="rdtPrev"
              onClick={shift && shift("sub", 10, "years")}
            >
              <span>‹</span>
            </th>
            <th
              className="rdtSwitch"
              onClick={show && show("years")}
              colSpan={2}
            >
              {startYear}-{startYear + 9}
            </th>
            <th
              className="rdtNext"
              onClick={shift && shift("add", 10, "years")}
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

                  const isDisabled = daysInYear.every(d => !isValid(d));
                  const yearProps: any = {
                    key: year,
                    className: cc([
                      "rdtYear",
                      {
                        rdtDisabled: isDisabled,
                        rdtActive:
                          selectedDate && getYear(selectedDate) === year
                      }
                    ])
                  };

                  if (!isDisabled && setDate) {
                    yearProps.onClick = setDate(
                      "years",
                      setYear(viewDate, year)
                    );
                  }

                  return renderer(yearProps, year, selectedDate);
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
