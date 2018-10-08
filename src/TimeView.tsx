import * as React from "react";
import format from "date-fns/format";
import getHours from "date-fns/get_hours";
import { TimeConstraint, SetTimeFunc, TimeConstraints } from "./";
import noop from "./noop";
import disableContextMenu from "./disableContextMenu";
import addHours from "date-fns/add_hours";
import addMinutes from "date-fns/add_minutes";
import addSeconds from "date-fns/add_seconds";
import addMilliseconds from "date-fns/add_milliseconds";
import setHours from "date-fns/set_hours";

const allCounters: ("hours" | "minutes" | "seconds" | "milliseconds")[] = [
  "hours",
  "minutes",
  "seconds",
  "milliseconds"
];

const defaultTimeConstraints: AlwaysTimeConstraints = {
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

const TimePart = props => {
  const { showPrefix, onUp, onDown, value } = props;

  return value !== null && value !== undefined ? (
    <React.Fragment>
      {showPrefix && <div className="rdtCounterSeparator">:</div>}
      <div className="rdtCounter">
        <span
          className="rdtBtn"
          onMouseDown={onUp}
          onContextMenu={disableContextMenu}
        >
          ▲
        </span>
        <div className="rdtCount">{value}</div>
        <span
          className="rdtBtn"
          onMouseDown={onDown}
          onContextMenu={disableContextMenu}
        >
          ▼
        </span>
      </div>
    </React.Fragment>
  ) : null;
};

interface AlwaysTimeConstraints {
  hours: TimeConstraint;
  minutes: TimeConstraint;
  seconds: TimeConstraint;
  milliseconds: TimeConstraint;
}

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

  formatOptions?: any;
}

interface TimeViewState {
  timestamp: Date;
}

function calculateState(props): TimeViewState {
  return {
    timestamp: props.selectedDate || props.viewDate
  };
}

class TimeView extends React.Component<TimeViewProps, TimeViewState> {
  static defaultProps = {
    viewDate: new Date(),
    readonly: false,
    setTime: noop
  };

  timer: any;
  increaseTimer: any;
  mouseUpListener: any;

  constructor(props) {
    super(props);

    this.state = calculateState(props);

    // Bind functions
    this.getStepSize = this.getStepSize.bind(this);
    this.onStartClicking = this.onStartClicking.bind(this);
    this.toggleDayPart = this.toggleDayPart.bind(this);
    this.change = this.change.bind(this);
    this.getFormatted = this.getFormatted.bind(this);
  }

  getStepSize(type: "hours" | "minutes" | "seconds" | "milliseconds") {
    let step = defaultTimeConstraints[type].step;
    const config = this.props.timeConstraints
      ? this.props.timeConstraints[type]
      : undefined;
    if (config && config.step) {
      step = config.step;
    }

    return step;
  }

  getFormatted(
    type: "hours" | "minutes" | "seconds" | "milliseconds" | "daypart"
  ) {
    const { timeFormat, formatOptions } = this.props;
    const { timestamp } = this.state;
    const fmt = typeof timeFormat === "string" ? timeFormat : "";

    const hasHours = fmt.toLowerCase().indexOf("h") !== -1;
    const hasMinutes = fmt.indexOf("m") !== -1;
    const hasSeconds = fmt.indexOf("s") !== -1;
    const hasMilliseconds = fmt.indexOf("S") !== -1;

    const hasUpperDayPart = fmt.indexOf("A") !== -1;
    const hasLowerDayPart = fmt.indexOf("a") !== -1;
    const hasDayPart = hasUpperDayPart || hasLowerDayPart;

    const typeFormat =
      type === "hours" && hasHours
        ? hasDayPart
          ? "h"
          : "H"
        : type === "minutes" && hasMinutes
          ? "mm"
          : type === "seconds" && hasSeconds
            ? "ss"
            : type === "milliseconds" && hasMilliseconds
              ? "SSS"
              : type === "daypart" && hasLowerDayPart
                ? "a"
                : type === "daypart" && hasUpperDayPart
                  ? "A"
                  : undefined;

    if (typeFormat) {
      return format(timestamp, typeFormat, formatOptions);
    }

    return undefined;
  }

  componentDidMount() {
    this.setState(calculateState(this.props));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(calculateState(nextProps));
  }

  onStartClicking(action, type) {
    return () => {
      const { readonly } = this.props;

      if (!readonly) {
        this.setState({
          timestamp: this.change(action, type)
        });

        this.timer = setTimeout(() => {
          this.increaseTimer = setInterval(() => {
            this.setState({
              timestamp: this.change(action, type)
            });
          }, 70);
        }, 500);

        this.mouseUpListener = () => {
          clearTimeout(this.timer);
          clearInterval(this.increaseTimer);
          this.props.setTime(this.state.timestamp);
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

    this.props.setTime(setHours(this.state.timestamp, newHours));
  }

  change(
    action: "up" | "down",
    type: "hours" | "minutes" | "seconds" | "milliseconds"
  ) {
    const { timestamp } = this.state;
    const mult = action === "up" ? 1 : -1;

    const step = this.getStepSize(type) * mult;
    if (type === "hours") {
      return addHours(timestamp, step);
    } else if (type === "minutes") {
      return addMinutes(timestamp, step);
    } else if (type === "seconds") {
      return addSeconds(timestamp, step);
    } else {
      return addMilliseconds(timestamp, step);
    }
  }

  render() {
    let numCounters = 0;

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
                  {allCounters.map(type => {
                    const val = this.getFormatted(type);
                    if (val) {
                      numCounters++;
                    }

                    return (
                      <TimePart
                        key={type}
                        showPrefix={numCounters > 1}
                        onUp={this.onStartClicking("up", type)}
                        onDown={this.onStartClicking("down", type)}
                        value={val}
                      />
                    );
                  })}
                  <TimePart
                    onUp={this.toggleDayPart}
                    onDown={this.toggleDayPart}
                    value={this.getFormatted("daypart")}
                  />
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
