import * as React from "react";
import format from "date-fns/format";
import isSameMonth from "date-fns/is_same_month";
import setMonth from "date-fns/set_month";
import getYear from "date-fns/get_year";
import getDaysInMonth from "date-fns/get_days_in_month";
import setDate from "date-fns/set_date";
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

class MonthsView extends React.Component<MonthsViewProps, never> {
  static defaultProps = {
    viewDate: new Date(),
    shift: noop,
    show: noop,
    setDate: noop
  };

  constructor(props) {
    super(props);

    // Bind functions
    this.renderMonths = this.renderMonths.bind(this);
    this.renderMonth = this.renderMonth.bind(this);
  }

  render() {
    const { viewDate } = this.props;

    return (
      <div className="rdtMonths">
        <table>
          <thead>
            <tr>
              <th
                className="rdtPrev"
                onClick={this.props.shift("sub", 1, "years")}
              >
                <span>‹</span>
              </th>
              <th
                className="rdtSwitch"
                onClick={this.props.show("years")}
                colSpan={2}
              >
                {format(viewDate, "YYYY", this.props.formatOptions)}
              </th>
              <th
                className="rdtNext"
                onClick={this.props.shift("add", 1, "years")}
              >
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

  renderMonths(): JSX.Element[] {
    const { selectedDate, viewDate } = this.props;
    const year = getYear(viewDate);
    const renderer = this.props.renderMonth || this.renderMonth;
    const isValid = this.props.isValidDate || returnTrue;

    const rows: any[] = [];
    let months: any[] = [];

    for (let month = 0; month < 12; month++) {
      const currentMonth = setMonth(viewDate, month);

      const daysInMonths = Array.from(
        { length: getDaysInMonth(currentMonth) },
        (e, i) => setDate(currentMonth, i + 1)
      );

      const isDisabled = daysInMonths.every(d => !isValid(d));
      const props: any = {
        key: month,
        className: cc([
          "rdtMonth",
          {
            rdtDisabled: isDisabled,
            rdtActive: selectedDate && isSameMonth(selectedDate, currentMonth)
          }
        ])
      };

      if (!isDisabled) {
        props.onClick = this.props.setDate("months", setMonth(viewDate, month));
      }

      months.push(renderer(props, month, year, selectedDate));

      if (months.length === 4) {
        rows.push(<tr key={month}>{months}</tr>);

        months = [];
      }
    }

    return rows;
  }

  renderMonth(props, month, year, selected): JSX.Element {
    const monthDate = setMonth(new Date(), month);
    return (
      <td {...props}>{format(monthDate, "MMM", this.props.formatOptions)}</td>
    );
  }
}

export default MonthsView;
