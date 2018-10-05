import * as React from "react";
import format from "date-fns/format";
import getMonth from "date-fns/get_month";
import setMonth from "date-fns/set_month";
import getYear from "date-fns/get_year";
import getDaysInMonth from "date-fns/get_days_in_month";
import setDate from "date-fns/set_date";
import cc from "classcat";
import noop from "./noop";
import { IsValidDateFunc, SetDateFunc, UpdateSelectedDateFunc } from ".";

interface MonthsViewProps {
  /*
  Manually set the locale for the react-datetime instance.
  date-fns locale needs to be loaded to be used, see i18n docs.
  */
  locale?: any;

  viewDate: Date;
  subtractTime?: any;
  addTime?: any;
  showView?: any;
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

  updateOn: string;

  setDate: SetDateFunc;
  updateSelectedDate: UpdateSelectedDateFunc;
}

class MonthsView extends React.Component<MonthsViewProps, never> {
  static defaultProps = {
    viewDate: new Date(),
    subtractTime: noop,
    showView: noop,
    addTime: noop,
    updateOn: noop,
    setDate: noop,
    updateSelectedDate: noop
  };

  constructor(props) {
    super(props);

    // Bind functions
    this.renderMonths = this.renderMonths.bind(this);
    this.updateSelectedMonth = this.updateSelectedMonth.bind(this);
    this.renderMonth = this.renderMonth.bind(this);
    this.alwaysValidDate = this.alwaysValidDate.bind(this);
    this.getFormatOptions = this.getFormatOptions.bind(this);
  }

  getFormatOptions() {
    return { locale: this.props.locale };
  }

  render() {
    const date = this.props.viewDate;

    return (
      <div className="rdtMonths">
        <table>
          <thead>
            <tr>
              <th
                className="rdtPrev"
                onClick={this.props.subtractTime(1, "years")}
              >
                <span>‹</span>
              </th>
              <th
                className="rdtSwitch"
                onClick={this.props.showView("years")}
                colSpan={2}
                data-val={getYear(this.props.viewDate)}
              >
                {format(date, "YYYY", this.getFormatOptions())}
              </th>
              <th className="rdtNext" onClick={this.props.addTime(1, "years")}>
                <span>›</span>
              </th>
            </tr>
          </thead>
        </table>
        <table>
          <tbody>{this.renderMonths()}</tbody>
        </table>
      </div>
    );
  }

  renderMonths() {
    const date = this.props.selectedDate;
    const year = getYear(this.props.viewDate);
    const renderer = this.props.renderMonth || this.renderMonth;
    const isValid = this.props.isValidDate || this.alwaysValidDate;

    const rows: any[] = [];
    let months: any[] = [];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const currentMonth = setMonth(this.props.viewDate, monthIndex);

      const noOfDaysInMonth = getDaysInMonth(currentMonth);
      const daysInMonth = Array.from({ length: noOfDaysInMonth }, (e, i) => {
        return i + 1;
      });

      const validDay = daysInMonth.find(d => {
        const day = setDate(currentMonth, d);
        return isValid(day);
      });

      const isDisabled = validDay === undefined;
      const props: any = {
        key: monthIndex,
        "data-val": monthIndex,
        className: cc([
          "rdtMonth",
          {
            rdtDisabled: isDisabled,
            rdtActive:
              date && monthIndex === getMonth(date) && year === getYear(date)
          }
        ])
      };

      if (!isDisabled) {
        props.onClick =
          this.props.updateOn === "months"
            ? this.updateSelectedMonth
            : this.props.setDate("months");
      }

      months.push(renderer(props, monthIndex, year, date));

      if (months.length === 4) {
        rows.push(<tr key={monthIndex}>{months}</tr>);

        months = [];
      }
    }

    return rows;
  }

  updateSelectedMonth(event) {
    this.props.updateSelectedDate(event);
  }

  renderMonth(props, month, year, selected) {
    const monthDate = setMonth(new Date(), month);
    return (
      <td {...props}>{format(monthDate, "MMM", this.getFormatOptions())}</td>
    );
  }

  alwaysValidDate() {
    return true;
  }
}

export default MonthsView;
