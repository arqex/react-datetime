import * as React from "react";
import addDays from "date-fns/add_days";
import format from "date-fns/format";
import getDaysInMonth from "date-fns/get_days_in_month";
import getMonth from "date-fns/get_month";
import getYear from "date-fns/get_year";
import startOfWeek from "date-fns/start_of_week";
import isSameDay from "date-fns/is_same_day";
import isToday from "date-fns/is_today";
import setDate from "date-fns/set_date";
import subMonths from "date-fns/sub_months";
import getDate from "date-fns/get_date";
import cc from "classcat";
import { IsValidDateFunc, UpdateSelectedDateFunc } from ".";
import noop from "./noop";
import returnTrue from "./returnTrue";

interface DaysViewProps {
  /*
  Manually set the locale for the react-datetime instance.
  date-fns locale needs to be loaded to be used, see i18n docs.
  */
  locale?: any;

  /*
  Represents the month which is viewed on opening the calendar when there is no selected date.
  This prop is parsed by date-fns, so it is possible to use a date `string` or a `Date` object.
  */
  viewDate?: Date | string;
  moveTime?: any;
  showView?: any;
  selectedDate?: Date;

  updateSelectedDate: UpdateSelectedDateFunc;

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
}

class DaysView extends React.Component<DaysViewProps, never> {
  static defaultProps = {
    moveTime: noop,
    showView: noop,
    updateSelectedDate: noop
  };

  constructor(props) {
    super(props);

    // Bind functions
    this.renderDays = this.renderDays.bind(this);
    this.updateSelectedDate = this.updateSelectedDate.bind(this);
    this.renderDay = this.renderDay.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.getFormatOptions = this.getFormatOptions.bind(this);
  }

  getFormatOptions(): any {
    return { locale: this.props.locale };
  }

  render() {
    const date = this.props.viewDate || new Date();
    const theStartOfWeek = startOfWeek(date);

    return (
      <div className="rdtDays">
        <table>
          <thead>
            <tr>
              <th
                className="rdtPrev"
                onClick={this.props.moveTime("sub", 1, "months")}
              >
                <span>‹</span>
              </th>
              <th
                className="rdtSwitch"
                onClick={this.props.showView("months")}
                colSpan={5}
                data-val={
                  this.props.viewDate ? getMonth(this.props.viewDate) : 0
                }
              >
                {format(date, "MMMM YYYY", this.getFormatOptions())}
              </th>
              <th
                className="rdtNext"
                onClick={this.props.moveTime("add", 1, "months")}
              >
                <span>›</span>
              </th>
            </tr>
            <tr>
              <th className="dow">
                {format(
                  addDays(theStartOfWeek, 0),
                  "dd",
                  this.getFormatOptions()
                )}
              </th>
              <th className="dow">
                {format(
                  addDays(theStartOfWeek, 1),
                  "dd",
                  this.getFormatOptions()
                )}
              </th>
              <th className="dow">
                {format(
                  addDays(theStartOfWeek, 2),
                  "dd",
                  this.getFormatOptions()
                )}
              </th>
              <th className="dow">
                {format(
                  addDays(theStartOfWeek, 3),
                  "dd",
                  this.getFormatOptions()
                )}
              </th>
              <th className="dow">
                {format(
                  addDays(theStartOfWeek, 4),
                  "dd",
                  this.getFormatOptions()
                )}
              </th>
              <th className="dow">
                {format(
                  addDays(theStartOfWeek, 5),
                  "dd",
                  this.getFormatOptions()
                )}
              </th>
              <th className="dow">
                {format(
                  addDays(theStartOfWeek, 6),
                  "dd",
                  this.getFormatOptions()
                )}
              </th>
            </tr>
          </thead>
          <tbody>{this.renderDays()}</tbody>
          {this.renderFooter()}
        </table>
      </div>
    );
  }

  renderDays() {
    const date = this.props.viewDate || new Date();
    const selectedDate = this.props.selectedDate
      ? this.props.selectedDate
      : undefined;
    const prevMonth = subMonths(date, 1);
    const currentYear = getYear(date);
    const currentMonth = getMonth(date);
    const weeks: any[] = [];
    let days: any[] = [];
    const renderer = this.props.renderDay || this.renderDay;
    const isValid = this.props.isValidDate || returnTrue;

    const prevMonthLastWeekStart = startOfWeek(
      setDate(prevMonth, getDaysInMonth(prevMonth))
    );
    const lastDay = addDays(prevMonthLastWeekStart, 42);
    for (
      let workingDate = prevMonthLastWeekStart;
      workingDate < lastDay;
      workingDate = addDays(workingDate, 1)
    ) {
      const workingYear = getYear(workingDate);
      const workingMonth = getMonth(workingDate);
      const isDisabled = !isValid(workingDate, selectedDate);

      const dayProps: any = {
        key: getDate(workingDate),
        className: cc([
          "rdtDay",
          {
            rdtOld:
              (workingYear === currentYear && workingMonth < currentMonth) ||
              workingYear < currentYear,
            rdtNew:
              (workingYear === currentYear && workingMonth > currentMonth) ||
              workingYear > currentYear,
            rdtActive: selectedDate && isSameDay(workingDate, selectedDate),
            rdtToday: isToday(workingDate),
            rdtDisabled: isDisabled
          }
        ]),
        "data-val": getDate(workingDate)
      };

      if (!isDisabled) {
        dayProps.onClick = this.updateSelectedDate;
      }

      days.push(renderer(dayProps, workingDate, selectedDate));

      if (days.length === 7) {
        weeks.push(<tr key={format(workingDate)}>{days}</tr>);
        days = [];
      }
    }

    return weeks;
  }

  updateSelectedDate(event) {
    this.props.updateSelectedDate(event, true);
  }

  renderDay(props, currentDate) {
    return (
      <td {...props}>{format(currentDate, "D", this.getFormatOptions())}</td>
    );
  }

  renderFooter() {
    const date = this.props.selectedDate || this.props.viewDate;

    if (
      typeof this.props.timeFormat !== "string" ||
      !this.props.timeFormat.trim() ||
      !date
    ) {
      return null;
    }

    return (
      <tfoot>
        <tr>
          <td
            onClick={this.props.showView("time")}
            colSpan={7}
            className="rdtTimeToggle"
          >
            {format(date, this.props.timeFormat, this.getFormatOptions())}
          </td>
        </tr>
      </tfoot>
    );
  }
}

export default DaysView;
