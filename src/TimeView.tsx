import React from "react";
import format from "date-fns/format";
import getHours from "date-fns/get_hours";
import { TimeConstraints, SetTimeFunc, allowedSetTime } from "./";
import noop from "./noop";
import disableContextMenu from "./disableContextMenu";
import padStart from "./padStart";

const CounterComponent = props => {
  const { showPrefixSeparator, onIncrease, onDecrease, children } = props;

  return (
    <React.Fragment>
      {showPrefixSeparator && <div className="rdtCounterSeparator">:</div>}
      <div className="rdtCounter">
        <span
          className="rdtBtn"
          onMouseDown={onIncrease}
          onContextMenu={disableContextMenu}
        >
          ▲
        </span>
        <div className="rdtCount">{children}</div>
        <span
          className="rdtBtn"
          onMouseDown={onDecrease}
          onContextMenu={disableContextMenu}
        >
          ▼
        </span>
      </div>
    </React.Fragment>
  );
};

const padValues = {
  hours: 1,
  minutes: 2,
  seconds: 2,
  milliseconds: 3
};

interface TimeViewProps {
  readonly: boolean;

  /*
  Manually set the locale for the react-datetime instance.
  date-fns locale needs to be loaded to be used, see i18n docs.
  */
  locale?: any;

  timeConstraints?: TimeConstraints;

  setTime: SetTimeFunc;

  /*
  Defines the format for the date. It accepts any date-fns date format.
  If true the date will be displayed using the defaults for the current locale.
  If false the datepicker is disabled and the component can be used as timepicker.
  */
  dateFormat?: string | false;

  /*
  Defines the format for the time. It accepts any date-fns time format.
  If true the time will be displayed using the defaults for the current locale.
  If false the timepicker is disabled and the component can be used as datepicker.
  */
  timeFormat?: string | false;

  viewDate: Date;
  showView?: any;
  selectedDate?: Date;
}

type DayParts = "am" | "pm" | "AM" | "PM" | undefined;

interface TimeViewState {
  timestamp: Date;

  daypart: DayParts;
  counters: ("hours" | "minutes" | "seconds" | "milliseconds")[];

  hours: number;
  minutes: string;
  seconds: string;
  milliseconds: string;
}

class TimeView extends React.Component<TimeViewProps, TimeViewState> {
  static defaultProps = {
    viewDate: new Date(),
    setTime: noop
  };

  timeConstraints: TimeConstraints;
  timer: any;
  increaseTimer: any;
  mouseUpListener: any;

  constructor(props) {
    super(props);

    this.state = this.calculateState(props);

    // Bind functions
    this.onStartClicking = this.onStartClicking.bind(this);
    this.toggleDayPart = this.toggleDayPart.bind(this);
    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
    this.calculateState = this.calculateState.bind(this);
    this.getFormatOptions = this.getFormatOptions.bind(this);
  }

  getFormatOptions() {
    return { locale: this.props.locale };
  }

  componentDidMount() {
    this.timeConstraints = {
      hours: {
        min: 0,
        max: 23,
        step: 1
      },
      minutes: {
        min: 0,
        max: 59,
        step: 1
      },
      seconds: {
        min: 0,
        max: 59,
        step: 1
      },
      milliseconds: {
        min: 0,
        max: 999,
        step: 1
      }
    };

    if (this.props.timeConstraints) {
      ["hours", "minutes", "seconds", "millisecond"].forEach(type => {
        if (this.props.timeConstraints && this.props.timeConstraints[type]) {
          this.timeConstraints[type] = {
            ...this.timeConstraints[type],
            ...this.props.timeConstraints[type]
          };
        }
      });
    }

    this.setState(this.calculateState(this.props));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(this.calculateState(nextProps));
  }

  onStartClicking(action, type) {
    return () => {
      const { readonly } = this.props;

      if (!readonly) {
        const update = {};
        update[type] = this[action](type);

        this.setState(update);

        this.timer = setTimeout(() => {
          this.increaseTimer = setInterval(() => {
            update[type] = this[action](type);
            this.setState(update);
          }, 70);
        }, 500);

        this.mouseUpListener = () => {
          clearTimeout(this.timer);
          clearInterval(this.increaseTimer);
          this.props.setTime(type, this.state[type]);
          document.body.removeEventListener("mouseup", this.mouseUpListener);
          document.body.removeEventListener("touchend", this.mouseUpListener);
        };

        document.body.addEventListener("mouseup", this.mouseUpListener);
        document.body.addEventListener("touchend", this.mouseUpListener);
      }
    };
  }

  toggleDayPart() {
    const hours = getHours(this.state.timestamp);
    const newHours = hours >= 12 ? hours - 12 : hours + 12;

    this.props.setTime(allowedSetTime.HOURS, `${newHours}`);
  }

  increase(type) {
    const constraints = this.timeConstraints[type];

    let value = parseInt(this.state[type], 10) + constraints.step;
    if (value > constraints.max) {
      value = constraints.min + (value - (constraints.max + 1));
    }

    return padStart(`${value}`, padValues[type]);
  }

  decrease(type) {
    const constraints = this.timeConstraints[type];

    let value = parseInt(this.state[type], 10) - constraints.step;
    if (value < constraints.min) {
      value = constraints.max + 1 - (constraints.min - value);
    }

    return padStart(`${value}`, padValues[type]);
  }

  calculateState(props): TimeViewState {
    const date = props.selectedDate || props.viewDate;
    const timeFormat =
      typeof props.timeFormat === "string" ? props.timeFormat : "";
    const counters: ("hours" | "minutes" | "seconds" | "milliseconds")[] = [];

    if (timeFormat.toLowerCase().indexOf("h") !== -1) {
      counters.push("hours");
    }

    if (timeFormat.indexOf("m") !== -1) {
      counters.push("minutes");
    }

    if (timeFormat.indexOf("s") !== -1) {
      counters.push("seconds");
    }

    if (timeFormat.indexOf("S") !== -1) {
      counters.push("milliseconds");
    }

    let daypart: DayParts = undefined;
    if (timeFormat.indexOf(" a") !== -1) {
      daypart = getHours(date) >= 12 ? "pm" : "am";
    } else if (timeFormat.indexOf(" A") !== -1) {
      daypart = getHours(date) >= 12 ? "PM" : "AM";
    }

    let hours = getHours(date);
    if (timeFormat.indexOf(" a") !== -1) {
      hours = ((hours - 1) % 12) + 1;
    }

    if (hours === 0) {
      hours = 12;
    }

    return {
      timestamp: date,
      hours: hours,
      minutes: format(date, "mm", this.getFormatOptions()),
      seconds: format(date, "ss", this.getFormatOptions()),
      milliseconds: format(date, "SSS", this.getFormatOptions()),
      daypart: daypart,
      counters: counters
    };
  }

  render() {
    return (
      <div className="rdtTime">
        <table>
          {this.props.dateFormat ? (
            <thead>
              <tr>
                <th
                  className="rdtSwitch"
                  colSpan={4}
                  onClick={this.props.showView("days")}
                >
                  {format(this.state.timestamp, this.props.dateFormat)}
                </th>
              </tr>
            </thead>
          ) : null}
          <tbody>
            <tr>
              <td>
                <div className="rdtCounters">
                  {this.state.counters.map((type, index) => (
                    <CounterComponent
                      key={type}
                      showPrefixSeparator={index > 0}
                      onIncrease={this.onStartClicking("increase", type)}
                      onDecrease={this.onStartClicking("decrease", type)}
                    >
                      {this.state[type]}
                    </CounterComponent>
                  ))}
                  {!!this.state.daypart && (
                    <CounterComponent
                      key="dayPart"
                      onIncrease={this.toggleDayPart}
                      onDecrease={this.toggleDayPart}
                    >
                      {this.state.daypart}
                    </CounterComponent>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default TimeView;
