import * as React from "react";

import format from "date-fns/format";
import getHours from "date-fns/getHours";
import addHours from "date-fns/addHours";
import addMinutes from "date-fns/addMinutes";
import addSeconds from "date-fns/addSeconds";
import addMilliseconds from "date-fns/addMilliseconds";
import setHours from "date-fns/setHours";

import { TimeConstraints, FormatOptions, ViewMode, FORMATS } from "./index";

const allCounters: Array<"hours" | "minutes" | "seconds" | "milliseconds"> = [
  "hours",
  "minutes",
  "seconds",
  "milliseconds",
];

const defaultTimeConstraints = {
  hours: {
    step: 1,
  },
  minutes: {
    step: 1,
  },
  seconds: {
    step: 1,
  },
  milliseconds: {
    step: 1,
  },
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

function getStepSize(
  type: "hours" | "minutes" | "seconds" | "milliseconds",
  timeConstraints: TimeConstraints | undefined
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
  timeConstraints: TimeConstraints | undefined
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
  timeFormat: string,
  formatOptions?: any
) {
  const fmt = timeFormat;

  function has(f: string, val: string) {
    return f.indexOf(val) !== -1;
  }

  const hasHours = has(fmt.toLowerCase(), FORMATS.SHORT_HOUR);
  const hasMinutes = has(fmt, FORMATS.SHORT_MINUTE);
  const hasSeconds = has(fmt, FORMATS.SHORT_SECOND);
  const hasMilliseconds = has(fmt, FORMATS.SHORT_MILLISECOND);

  const hasDayPart = has(fmt, FORMATS.AM_PM);

  const typeFormat =
    type === "hours" && hasHours
      ? hasDayPart
        ? FORMATS.HOUR
        : FORMATS.MILITARY_HOUR
      : type === "minutes" && hasMinutes
      ? FORMATS.MINUTE
      : type === "seconds" && hasSeconds
      ? FORMATS.SECOND
      : type === "milliseconds" && hasMilliseconds
      ? FORMATS.MILLISECOND
      : type === "daypart" && hasDayPart
      ? FORMATS.AM_PM
      : undefined;

  if (typeFormat) {
    return format(timestamp, typeFormat, formatOptions);
  }

  return undefined;
}

function toggleDayPart(
  timestamp: Date,
  setSelectedDate: (newDate: Date, tryClose?: boolean) => void
) {
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
  props: TimeViewProps
) {
  return () => {
    const {
      readonly,
      viewTimestamp: origViewTimestamp,
      timeConstraints,
      setViewTimestamp,
      setSelectedDate,
    } = props;
    if (!readonly) {
      let viewTimestamp = change(op, type, origViewTimestamp, timeConstraints);
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
  dateFormat: string;
  setViewMode: (newViewMode: ViewMode) => void;
  timeFormat: string;
  formatOptions: FormatOptions;
  setSelectedDate: (newDate: Date, tryClose?: boolean) => void;
  setViewTimestamp: (newViewTimestamp: Date | undefined) => void;
  readonly?: boolean;
  timeConstraints?: TimeConstraints;
}

function TimeView(props: TimeViewProps): JSX.Element {
  const {
    viewTimestamp,
    dateFormat,
    setViewMode,
    timeFormat,
    formatOptions,
    setSelectedDate,
  } = props;

  let numCounters = 0;

  return (
    <div className="rdtTime" data-testid="time-picker">
      <table>
        {dateFormat ? (
          <thead>
            <tr>
              <th
                className="rdtSwitch"
                data-testid="time-mode-switcher"
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
                {allCounters.map((type) => {
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
