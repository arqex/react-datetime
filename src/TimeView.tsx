import * as React from "react";

import format from "date-fns/format";
import getHours from "date-fns/get_hours";
import addHours from "date-fns/add_hours";
import addMinutes from "date-fns/add_minutes";
import addSeconds from "date-fns/add_seconds";
import addMilliseconds from "date-fns/add_milliseconds";
import setHours from "date-fns/set_hours";

import { TimeConstraint, TimeConstraints } from "./index";
import noop from "./noop";

const allCounters: Array<"hours" | "minutes" | "seconds" | "milliseconds"> = [
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

interface TimePartInterface {
  showPrefix?: boolean;
  onUp: () => void;
  onDown: () => void;
  value: string | undefined;
}

const TimePart = (props: TimePartInterface) => {
  const { showPrefix, onUp, onDown, value } = props;

  return value !== null && value !== undefined ? (
    <React.Fragment>
      {showPrefix && <div className="rdtCounterSeparator">:</div>}
      <div className="rdtCounter">
        <span className="rdtBtn" onMouseDown={onUp}>
          ▲
        </span>
        <div className="rdtCount">{value}</div>
        <span className="rdtBtn" onMouseDown={onDown}>
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

function getStepSize(
  type: "hours" | "minutes" | "seconds" | "milliseconds",
  timeConstraints?: TimeConstraints
) {
  let step = defaultTimeConstraints[type].step;
  const config = timeConstraints ? timeConstraints[type] : undefined;
  if (config && config.step) {
    step = config.step;
  }

  return step;
}

function change(
  op: "add" | "sub",
  type: "hours" | "minutes" | "seconds" | "milliseconds",
  timestamp: Date,
  timeConstraints?: TimeConstraints
) {
  const mult = op === "sub" ? -1 : 1;

  const step = getStepSize(type, timeConstraints) * mult;
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

function getFormatted(
  type: "hours" | "minutes" | "seconds" | "milliseconds" | "daypart",
  timestamp: Date,
  timeFormat?: string | false,
  formatOptions?: any
) {
  const fmt = typeof timeFormat === "string" ? timeFormat : "";

  function has(f: string, val: string) {
    return f.indexOf(val) !== -1;
  }

  const hasHours = has(fmt.toLowerCase(), "h");
  const hasMinutes = has(fmt, "m");
  const hasSeconds = has(fmt, "s");
  const hasMilliseconds = has(fmt, "S");

  const hasUpperDayPart = has(fmt, "A");
  const hasLowerDayPart = has(fmt, "a");
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

function toggleDayPart(timestamp: Date, setSelectedDate) {
  return () => {
    const hours = getHours(timestamp);
    const newHours = hours >= 12 ? hours - 12 : hours + 12;

    setSelectedDate(setHours(timestamp, newHours));
  };
}

let timer;
let increaseTimer;
let mouseUpListener: () => void;

function onStartClicking(
  op: "add" | "sub",
  type: "hours" | "minutes" | "seconds" | "milliseconds",
  props
) {
  return () => {
    const {
      readonly,
      viewTimestamp: origViewTimestamp = new Date(),
      timeConstraints,
      setViewTimestamp = noop,
      setSelectedDate = noop
    } = props;
    if (!readonly) {
      let viewTimestamp = change(op, type, origViewTimestamp!, timeConstraints);
      setViewTimestamp(viewTimestamp);

      timer = setTimeout(() => {
        increaseTimer = setInterval(() => {
          viewTimestamp = change(op, type, viewTimestamp, timeConstraints);
          setViewTimestamp(viewTimestamp);
        }, 70);
      }, 500);

      mouseUpListener = () => {
        clearTimeout(timer);
        clearInterval(increaseTimer);
        setSelectedDate(viewTimestamp);
        document.body.removeEventListener("mouseup", mouseUpListener);
        document.body.removeEventListener("touchend", mouseUpListener);
      };

      document.body.addEventListener("mouseup", mouseUpListener);
      document.body.addEventListener("touchend", mouseUpListener);
    }
  };
}

export interface TimeViewProps {
  viewTimestamp: Date;
  dateFormat: string | false;
  setViewMode: any;
  timeFormat: string | false;
  formatOptions: any;
  setSelectedDate: any;
}

function TimeView(props: TimeViewProps) {
  const {
    viewTimestamp = new Date(),
    dateFormat = false,
    setViewMode = noop,
    timeFormat,
    formatOptions,
    setSelectedDate = noop
  } = props;

  let numCounters = 0;

  return (
    <div className="rdtTime">
      <table>
        {dateFormat ? (
          <thead>
            <tr>
              <th
                className="rdtSwitch"
                colSpan={4}
                onClick={() => setViewMode("days")}
              >
                {format(viewTimestamp, dateFormat)}
              </th>
            </tr>
          </thead>
        ) : null}
        <tbody>
          <tr>
            <td>
              <div className="rdtCounters">
                {allCounters.map(type => {
                  const val = getFormatted(
                    type,
                    viewTimestamp,
                    timeFormat,
                    formatOptions
                  );
                  if (val) {
                    numCounters++;
                  }

                  return (
                    <TimePart
                      key={type}
                      showPrefix={numCounters > 1}
                      onUp={onStartClicking("add", type, props)}
                      onDown={onStartClicking("sub", type, props)}
                      value={val}
                    />
                  );
                })}
                <TimePart
                  onUp={toggleDayPart(viewTimestamp, setSelectedDate)}
                  onDown={toggleDayPart(viewTimestamp, setSelectedDate)}
                  value={getFormatted(
                    "daypart",
                    viewTimestamp,
                    timeFormat,
                    formatOptions
                  )}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TimeView;
