import React from "react";
import getYear from "date-fns/get_year";
import setYear from "date-fns/set_year";
import getDaysInYear from "date-fns/get_days_in_year";
import setDayOfYear from "date-fns/set_day_of_year";
import noop from "./noop";

class YearsView extends React.Component<any, any> {
  static defaultProps = {
    viewDate: new Date(),
    subtractTime: noop,
    showView: noop,
    addTime: noop,
    setDate: noop
  };

  constructor(props) {
    super(props);

    // Bind functions
    this.renderYears = this.renderYears.bind(this);
    this.updateSelectedYear = this.updateSelectedYear.bind(this);
    this.renderYear = this.renderYear.bind(this);
    this.alwaysValidDate = this.alwaysValidDate.bind(this);
  }

  render() {
    const year = Math.floor(getYear(this.props.viewDate) / 10) * 10;

    return (
      <div className="rdtYears">
        <table>
          <thead>
            <tr>
              <th
                className="rdtPrev"
                onClick={this.props.subtractTime(10, "years")}
              >
                <span>‹</span>
              </th>
              <th
                className="rdtSwitch"
                onClick={this.props.showView("years")}
                colSpan={2}
              >
                {year}-{year + 9}
              </th>
              <th className="rdtNext" onClick={this.props.addTime(10, "years")}>
                <span>›</span>
              </th>
            </tr>
          </thead>
        </table>
        <table>
          <tbody>{this.renderYears(year)}</tbody>
        </table>
      </div>
    );
  }

  renderYears(year) {
    const renderer = this.props.renderYear || this.renderYear;
    const selectedDate = this.props.selectedDate;
    const date = this.props.viewDate || new Date();
    const isValid = this.props.isValidDate || this.alwaysValidDate;
    let years: any[] = [];
    const rows: any[] = [];

    year--;
    for (let i = -1; i < 11; i++, year++) {
      let classes = "rdtYear";
      const currentYear = setYear(date, year);

      const noOfDaysInYear = getDaysInYear(date);
      const daysInYear = Array.from({ length: noOfDaysInYear }, (e, i) => {
        return i + 1;
      });

      const validDay = daysInYear.find(d => {
        const day = setDayOfYear(currentYear, d);
        return isValid(day);
      });

      const isDisabled = validDay === undefined;

      if (isDisabled) {
        classes += " rdtDisabled";
      }

      if (selectedDate && getYear(selectedDate) === year) {
        classes += " rdtActive";
      }

      const props: any = {
        key: year,
        "data-value": year,
        className: classes
      };

      if (!isDisabled) {
        props.onClick =
          this.props.updateOn === "years"
            ? this.updateSelectedYear
            : this.props.setDate("year");
      }

      years.push(
        renderer(props, year, selectedDate && new Date(selectedDate.getTime()))
      );

      if (years.length === 4) {
        rows.push(<tr key={i}>{years}</tr>);
        years = [];
      }
    }

    return rows;
  }

  updateSelectedYear(event) {
    this.props.updateSelectedDate(event);
  }

  renderYear(props, year) {
    return <td {...props}>{year}</td>;
  }

  alwaysValidDate() {
    return true;
  }
}

export default YearsView;
