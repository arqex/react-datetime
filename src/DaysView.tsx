import * as React from "react";
import addDays from "date-fns/add_days";
import format from "date-fns/format";
import getMonth from "date-fns/get_month";
import startOfWeek from "date-fns/start_of_week";
import startOfMonth from "date-fns/start_of_month";
import endOfMonth from "date-fns/end_of_month";
import isSameDay from "date-fns/is_same_day";
import isToday from "date-fns/is_today";
import isBefore from "date-fns/is_before";
import isAfter from "date-fns/is_after";
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

  formatOptions?: any;
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
    this.renderDay = this.renderDay.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }

  render() {
    const date = this.props.viewDate || new Date();
    const theStartOfWeek = startOfWeek(date);
    const { formatOptions } = this.props;

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
                {format(date, "MMMM YYYY", formatOptions)}
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
                {format(addDays(theStartOfWeek, 0), "dd", formatOptions)}
              </th>
              <th className="dow">
                {format(addDays(theStartOfWeek, 1), "dd", formatOptions)}
              </th>
              <th className="dow">
                {format(addDays(theStartOfWeek, 2), "dd", formatOptions)}
              </th>
              <th className="dow">
                {format(addDays(theStartOfWeek, 3), "dd", formatOptions)}
              </th>
              <th className="dow">
                {format(addDays(theStartOfWeek, 4), "dd", formatOptions)}
              </th>
              <th className="dow">
                {format(addDays(theStartOfWeek, 5), "dd", formatOptions)}
              </th>
              <th className="dow">
                {format(addDays(theStartOfWeek, 6), "dd", formatOptions)}
              </th>
            </tr>
          </thead>
          <tbody>{this.renderDays()}</tbody>
          {this.renderFooter()}
        </table>
      </div>
    );
  }

  renderDays(): JSX.Element[] {
    const { viewDate = new Date(), selectedDate } = this.props;
    const prevMonth = subMonths(viewDate, 1);
    const weeks: JSX.Element[] = [];
    let days: JSX.Element[] = [];
    const renderer = this.props.renderDay || this.renderDay;
    const isValid = this.props.isValidDate || returnTrue;

    const prevMonthLastWeekStart = startOfWeek(endOfMonth(prevMonth));

    for (let i = 0; i < 42; i++) {
      const workingDate = addDays(prevMonthLastWeekStart, i);
      const isDisabled = !isValid(workingDate, selectedDate);

      const dayProps: any = {
        key: getDate(workingDate),
        className: cc([
          "rdtDay",
          {
            rdtOld: isBefore(workingDate, startOfMonth(viewDate)),
            rdtNew: isAfter(workingDate, endOfMonth(viewDate)),
            rdtActive: selectedDate && isSameDay(workingDate, selectedDate),
            rdtToday: isToday(workingDate),
            rdtDisabled: isDisabled
          }
        ]),
        "data-val": getDate(workingDate)
      };

      if (!isDisabled) {
        dayProps.onClick = this.props.updateSelectedDate(workingDate, true);
      }

      days.push(renderer(dayProps, workingDate, selectedDate));

      if (days.length === 7) {
        weeks.push(<tr key={format(workingDate)}>{days}</tr>);
        days = [];
      }
    }

    return weeks;
  }

  renderDay(props, currentDate): JSX.Element {
    return (
      <td {...props}>{format(currentDate, "D", this.props.formatOptions)}</td>
    );
  }

  renderFooter(): JSX.Element | null {
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
            {format(date, this.props.timeFormat, this.props.formatOptions)}
          </td>
        </tr>
      </tfoot>
    );
  }
}

export default DaysView;
