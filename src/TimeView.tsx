import React from "react";
import format from "date-fns/format";
import getHours from "date-fns/get_hours";
import { TimeConstraints } from "./";

const padValues = {
  hours: 1,
  minutes: 2,
  seconds: 2,
  milliseconds: 3
};

class TimeView extends React.Component<any, any> {
  static defaultProps = {};

  timeConstraints: TimeConstraints;
  timer: any;
  increaseTimer: any;
  mouseUpListener: any;

  constructor(props) {
    super(props);

    this.state = this.calculateState(props);

    // Bind functions
    this.onStartClicking = this.onStartClicking.bind(this);
    this.disableContextMenu = this.disableContextMenu.bind(this);
    this.toggleDayPart = this.toggleDayPart.bind(this);
    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
    this.pad = this.pad.bind(this);
    this.calculateState = this.calculateState.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderCounter = this.renderCounter.bind(this);
    this.renderDayPart = this.renderDayPart.bind(this);
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
        if (this.props.timeConstraints[type]) {
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
    };
  }

  disableContextMenu(event) {
    event.preventDefault();
    return false;
  }

  toggleDayPart() {
    const hours = this.state.hours;
    const newHours =
      hours >= 12 ? this.state.hours - 12 : this.state.hours + 12;

    this.props.setTime("hours", this.pad("hours", newHours));
  }

  increase(type) {
    const constraints = this.timeConstraints[type];

    let value = parseInt(this.state[type], 10) + constraints.step;
    if (value > constraints.max) {
      value = constraints.min + (value - (constraints.max + 1));
    }

    return this.pad(type, value);
  }

  decrease(type) {
    const constraints = this.timeConstraints[type];

    let value = parseInt(this.state[type], 10) - constraints.step;
    if (value < constraints.min) {
      value = constraints.max + 1 - (constraints.min - value);
    }

    return this.pad(type, value);
  }

  pad(type, value) {
    let str = value + "";
    while (str.length < padValues[type]) str = "0" + str;
    return str;
  }

  calculateState(props) {
    const date = props.selectedDate || props.viewDate;
    const timeFormat =
      typeof props.timeFormat === "string" ? props.timeFormat : "";
    const counters: string[] = [];

    if (timeFormat.toLowerCase().indexOf("h") !== -1) {
      counters.push("hours");
      if (timeFormat.indexOf("m") !== -1) {
        counters.push("minutes");
        if (timeFormat.indexOf("s") !== -1) {
          counters.push("seconds");
          if (timeFormat.indexOf("S") !== -1) {
            counters.push("milliseconds");
          }
        }
      }
    }

    const hours = getHours(date);

    let daypart: string | undefined = undefined;
    if (timeFormat.indexOf(" a") !== -1) {
      daypart = hours >= 12 ? "pm" : "am";
    } else if (timeFormat.indexOf(" A") !== -1) {
      daypart = hours >= 12 ? "PM" : "AM";
    }

    return {
      hours: hours,
      minutes: format(date, "mm", this.getFormatOptions()),
      seconds: format(date, "ss", this.getFormatOptions()),
      milliseconds: format(date, "SSS", this.getFormatOptions()),
      daypart: daypart,
      counters: counters
    };
  }

  renderHeader() {
    if (!this.props.dateFormat) {
      return null;
    }

    const date = this.props.selectedDate || this.props.viewDate;
    return (
      <thead>
        <tr>
          <th
            className="rdtSwitch"
            colSpan={4}
            onClick={this.props.showView("days")}
          >
            {format(date, this.props.dateFormat)}
          </th>
        </tr>
      </thead>
    );
  }

  renderCounter(type) {
    const timeFormat = this.props.timeFormat.toLowerCase();
    let value = this.state[type];
    if (type === "hours" && timeFormat.indexOf(" a") !== -1) {
      value = ((value - 1) % 12) + 1;

      if (value === 0) {
        value = 12;
      }
    }

    return (
      <div key={type} className="rdtCounter">
        <span
          className="rdtBtn"
          onMouseDown={this.onStartClicking("increase", type)}
          onContextMenu={this.disableContextMenu}
        >
          ▲
        </span>
        <div className="rdtCount">{value}</div>
        <span
          className="rdtBtn"
          onMouseDown={this.onStartClicking("decrease", type)}
          onContextMenu={this.disableContextMenu}
        >
          ▼
        </span>
      </div>
    );
  }

  renderDayPart() {
    return (
      <div key="dayPart" className="rdtCounter">
        <span
          className="rdtBtn"
          onMouseDown={this.toggleDayPart}
          onContextMenu={this.disableContextMenu}
        >
          ▲
        </span>
        <div className="rdtCount">{this.state.daypart}</div>
        <span
          className="rdtBtn"
          onMouseDown={this.toggleDayPart}
          onContextMenu={this.disableContextMenu}
        >
          ▼
        </span>
      </div>
    );
  }

  render() {
    const counters: JSX.Element[] = [];

    this.state.counters.forEach(c => {
      if (counters.length) {
        counters.push(
          <div key={`sep${counters.length}`} className="rdtCounterSeparator">
            :
          </div>
        );
      }

      counters.push(this.renderCounter(c));
    });

    if (this.state.daypart) {
      counters.push(this.renderDayPart());
    }

    return (
      <div className="rdtTime">
        <table>
          {this.renderHeader()}
          <tbody>
            <tr>
              <td>
                <div className="rdtCounters">{counters}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default TimeView;
