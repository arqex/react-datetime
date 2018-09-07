import React, { Component } from "react";
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
import onClickOutside from "react-onclickoutside";

class DaysView extends Component {
  constructor(props) {
    super(props);

    // Bind functions
    this.renderDays = this.renderDays.bind(this);
    this.updateSelectedDate = this.updateSelectedDate.bind(this);
    this.renderDay = this.renderDay.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.alwaysValidDate = this.alwaysValidDate.bind(this);
    this.getFormatOptions = this.getFormatOptions.bind(this);
  }

  getFormatOptions() {
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
                onClick={this.props.subtractTime(1, "months")}
              >
                <span>‹</span>
              </th>
              <th
                className="rdtSwitch"
                onClick={this.props.showView("months")}
                colSpan={5}
                data-value={getMonth(this.props.viewDate)}
              >
                {format(date, "MMMM YYYY", this.getFormatOptions())}
              </th>
              <th className="rdtNext" onClick={this.props.addTime(1, "months")}>
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
    const weeks = [];
    let days = [];
    const renderer = this.props.renderDay || this.renderDay;
    const isValid = this.props.isValidDate || this.alwaysValidDate;

    const prevMonthLastWeekStart = startOfWeek(
      setDate(prevMonth, getDaysInMonth(prevMonth))
    );
    const lastDay = addDays(prevMonthLastWeekStart, 42);
    for (
      let workingDate = prevMonthLastWeekStart;
      workingDate < lastDay;
      workingDate = addDays(workingDate, 1)
    ) {
      let classes = "rdtDay";

      const workingYear = getYear(workingDate);
      const workingMonth = getMonth(workingDate);
      if (
        (workingYear === currentYear && workingMonth < currentMonth) ||
        workingYear < currentYear
      ) {
        classes += " rdtOld";
      } else if (
        (workingYear === currentYear && workingMonth > currentMonth) ||
        workingYear > currentYear
      ) {
        classes += " rdtNew";
      }

      if (selectedDate && isSameDay(workingDate, selectedDate)) {
        classes += " rdtActive";
      }

      if (isToday(workingDate)) {
        classes += " rdtToday";
      }

      const isDisabled = !isValid(workingDate, selectedDate);
      if (isDisabled) {
        classes += " rdtDisabled";
      }

      const dayProps = {
        key: getDate(workingDate),
        className: classes,
        "data-value": getDate(workingDate)
      };

      if (!isDisabled) {
        dayProps.onClick = this.updateSelectedDate;
      }

      days.push(renderer(dayProps, workingDate, selectedDate));

      if (days.length === 7) {
        weeks.push(<tr key={workingDate}>{days}</tr>);
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
    if (!this.props.timeFormat) {
      return null;
    }

    const date = this.props.selectedDate || this.props.viewDate;

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

  alwaysValidDate() {
    return 1;
  }

  handleClickOutside() {
    this.props.handleClickOutside();
  }
}

export default onClickOutside(DaysView);
