import * as React from "react";
import format from "date-fns/format";
import isSameMonth from "date-fns/is_same_month";
import setMonth from "date-fns/set_month";
import getYear from "date-fns/get_year";
import getDaysInMonth from "date-fns/get_days_in_month";
import rawSetDate from "date-fns/set_date";
import cc from "classcat";
import noop from "./noop";
import { IsValidDateFunc, SetDateFunc, ShiftFunc, ShowFunc } from ".";
import returnTrue from "./returnTrue";

interface MonthsViewProps {
  /*
  Manually set the locale for the react-datetime instance.
  date-fns locale needs to be loaded to be used, see i18n docs.
  */
  locale?: any;

  viewDate: Date;
  shift: ShiftFunc;
  show: ShowFunc;
  selectedDate?: Date;

  /*
  Define the dates that can be selected. The function receives (currentDate, selectedDate)
  and should return a true or false whether the currentDate is valid or not. See selectable dates.
  */
  isValidDate?: IsValidDateFunc;

  /*
  Customize the way that the months are shown in the month picker.
  The accepted function has the selectedDate, the current date and the default calculated
  props for the cell, the month and the year to be shown, and must return a
  React component. See appearance customization
  */
  renderMonth?: (
    props: any,
    month: number,
    year: number,
    selectedDate?: Date
  ) => JSX.Element;

  setDate: SetDateFunc;

  formatOptions?: any;
}

function defaultRenderMonth(
  props,
  month,
  year,
  selected,
  formatOptions
): JSX.Element {
  const monthDate = setMonth(new Date(), month);
  return <td {...props}>{format(monthDate, "MMM", formatOptions)}</td>;
}

function MonthsView(props: MonthsViewProps) {
  const {
    selectedDate,
    viewDate,
    renderMonth,
    isValidDate,
    shift,
    show,
    setDate,
    formatOptions
  } = props;
  const year = getYear(viewDate);
  const renderer = renderMonth || defaultRenderMonth;
  const isValid = isValidDate || returnTrue;

  return (
    <div className="rdtMonths">
      <table>
        <thead>
          <tr>
            <th className="rdtPrev" onClick={shift("sub", 1, "years")}>
              <span>‹</span>
            </th>
            <th className="rdtSwitch" onClick={show("years")} colSpan={2}>
              {format(viewDate, "YYYY", formatOptions)}
            </th>
            <th className="rdtNext" onClick={shift("add", 1, "years")}>
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
                    (e, i) => rawSetDate(currentMonth, i + 1)
                  );

                  const isDisabled = daysInMonths.every(d => !isValid(d));
                  const props: any = {
                    key: month,
                    className: cc([
                      "rdtMonth",
                      {
                        rdtDisabled: isDisabled,
                        rdtActive:
                          selectedDate &&
                          isSameMonth(selectedDate, currentMonth)
                      }
                    ])
                  };

                  if (!isDisabled) {
                    props.onClick = setDate(
                      "months",
                      setMonth(viewDate, month)
                    );
                  }

                  return renderer(
                    props,
                    month,
                    year,
                    selectedDate,
                    formatOptions
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

MonthsView.defaultProps = {
  viewDate: new Date(),
  shift: noop,
  show: noop,
  setDate: noop
};

export default MonthsView;
