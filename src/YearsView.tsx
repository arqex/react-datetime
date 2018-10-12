import * as React from "react";
import getYear from "date-fns/get_year";
import setYear from "date-fns/set_year";
import getDaysInYear from "date-fns/get_days_in_year";
import setDayOfYear from "date-fns/set_day_of_year";
import cc from "classcat";
import noop from "./noop";
import { IsValidDateFunc, SetDateFunc, ShiftFunc, ShowFunc } from ".";
import returnTrue from "./returnTrue";

interface YearsViewProps {
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
  Customize the way that the years are shown in the year picker.
  The accepted function has the selectedDate, the current date and the default calculated
  props for the cell, the year to be shown, and must return a React component.
  See appearance customization
  */
  renderYear?: (props: any, year: number, selectedDate?: Date) => JSX.Element;

  setDate: SetDateFunc;
}

class YearsView extends React.Component<YearsViewProps, never> {
  static defaultProps = {
    viewDate: new Date(),
    shift: noop,
    show: noop,
    setDate: noop
  };

  constructor(props) {
    super(props);

    // Bind functions
    this.renderYears = this.renderYears.bind(this);
    this.renderYear = this.renderYear.bind(this);
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
                onClick={this.props.shift("sub", 10, "years")}
              >
                <span>‹</span>
              </th>
              <th
                className="rdtSwitch"
                onClick={this.props.show("years")}
                colSpan={2}
              >
                {year}-{year + 9}
              </th>
              <th
                className="rdtNext"
                onClick={this.props.shift("add", 10, "years")}
              >
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

  renderYears(startYear: number): JSX.Element[] {
    const renderer = this.props.renderYear || this.renderYear;
    const { selectedDate, viewDate } = this.props;
    const isValid = this.props.isValidDate || returnTrue;
    let years: JSX.Element[] = [];
    const rows: JSX.Element[] = [];

    for (let year = startYear - 1; year < startYear + 11; year++) {
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
            rdtActive: selectedDate && getYear(selectedDate) === year
          }
        ])
      };

      if (!isDisabled) {
        yearProps.onClick = this.props.setDate(
          "years",
          setYear(selectedDate || viewDate, year)
        );
      }

      years.push(renderer(yearProps, year, selectedDate));

      if (years.length === 4) {
        rows.push(<tr key={year}>{years}</tr>);
        years = [];
      }
    }

    return rows;
  }

  renderYear(yearProps, year: number): JSX.Element {
    return <td {...yearProps}>{year}</td>;
  }
}

export default YearsView;
