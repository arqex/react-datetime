import React from "react";
import format from "date-fns/format";
import getMonth from "date-fns/get_month";
import setMonth from "date-fns/set_month";
import getYear from "date-fns/get_year";
import getDaysInMonth from "date-fns/get_days_in_month";
import setDate from "date-fns/set_date";
import onClickOutside from "react-onclickoutside";

class MonthsView extends React.Component<any, any> {
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
    const date = this.props.viewDate || new Date();

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
                data-value={getYear(this.props.viewDate)}
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

    for (let i = 0; i < 12; i++) {
      let classes = "rdtMonth";
      const currentMonth = setMonth(this.props.viewDate, i);

      const noOfDaysInMonth = getDaysInMonth(currentMonth);
      const daysInMonth = Array.from({ length: noOfDaysInMonth }, (e, i) => {
        return i + 1;
      });

      const validDay = daysInMonth.find(d => {
        const day = setDate(currentMonth, d);
        return isValid(day);
      });

      const isDisabled = validDay === undefined;

      if (isDisabled) {
        classes += " rdtDisabled";
      }

      if (date && i === getMonth(date) && year === getYear(date)) {
        classes += " rdtActive";
      }

      const props: any = {
        key: i,
        "data-value": i,
        className: classes
      };

      if (!isDisabled) {
        props.onClick =
          this.props.updateOn === "months"
            ? this.updateSelectedMonth
            : this.props.setDate("month");
      }

      months.push(renderer(props, i, year, date));

      if (months.length === 4) {
        rows.push(<tr key={i}>{months}</tr>);

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

  handleClickOutside() {
    this.props.handleClickOutside();
  }
}

export default onClickOutside(MonthsView);
