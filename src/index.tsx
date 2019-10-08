import * as React from "react";
import cc from "classcat";
import Popover from "@reach/popover";
import useOnClickOutside from "use-onclickoutside";

import format from "date-fns/format";
import rawParse from "date-fns/parse";
import isEqual from "date-fns/isEqual";
import toDate from "date-fns/toDate";
import isDateValid from "date-fns/isValid";
import startOfDay from "date-fns/startOfDay";

import CalendarContainer from "./CalendarContainer";

const { useRef, useState, useEffect } = React;

function getTime(date: any) {
  const asDate = toDate(date);
  if (asDate && isDateValid(asDate)) {
    return asDate.getTime();
  }

  return undefined;
}

function parse(
  date: Date | string | number | undefined,
  fullFormat: string,
  formatOptions: any
): Date | undefined {
  if (typeof date === "string") {
    const asDate = rawParse(date, fullFormat, new Date(), formatOptions);
    if (isDateValid(asDate)) {
      const formatted = format(asDate, fullFormat, formatOptions);
      if (date === formatted) {
        return asDate;
      }
    }
  } else if (date) {
    const asDate = toDate(date);
    if (isDateValid(asDate)) {
      return asDate;
    }
  }

  return undefined;
}

export interface TimeConstraint {
  min: number;
  max: number;
  step: number;
}

export interface TimeConstraints {
  hours?: TimeConstraint;
  minutes?: TimeConstraint;
  seconds?: TimeConstraint;
  milliseconds?: TimeConstraint;
}

export type ViewMode = "days" | "months" | "years" | "time";

interface NextViewModes {
  days: ViewMode;
  months: ViewMode;
  years: ViewMode;
}

const nextViewModes: NextViewModes = {
  days: "days",
  months: "days",
  years: "months"
};

function getInitialViewMode(
  dateFormat: string | false,
  timeFormat: string | false
): ViewMode | undefined {
  if (typeof dateFormat === "string" && dateFormat) {
    if (dateFormat.match(/[d]/)) {
      return "days";
    } else if (dateFormat.indexOf("L") !== -1) {
      return "months";
    } else if (dateFormat.indexOf("y") !== -1) {
      return "years";
    }
  }

  if (typeof timeFormat === "string" && timeFormat) {
    return "time";
  }

  return undefined;
}

export type DateTypeMode = "utc-ms-timestamp" | "input-format" | "Date";

interface DateTimeProps {
  className?: string;
  style?: any;
  placeholder?: string;
  isValidDate?: (date: Date) => boolean;

  dateTypeMode?: DateTypeMode;
  value?: string | number | Date;
  onChange?: (newValue: undefined | string | number | Date) => void;

  dateFormat?: string | boolean;
  timeFormat?: string | boolean;

  locale?: any;
}

function DateTime(
  props: DateTimeProps &
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
) {
  const {
    className,
    style,
    placeholder,
    isValidDate,
    dateTypeMode: rawDateTypeMode,
    value,
    onChange: rawOnChange,
    dateFormat: rawDateFormat = true,
    timeFormat: rawTimeFormat = true,
    locale,
    ...rest
  } = props;

  //
  // Formats
  //
  const dateFormat = rawDateFormat === true ? "LL/dd/yyyy" : rawDateFormat;
  const timeFormat = rawTimeFormat === true ? "h:mm a" : rawTimeFormat;
  const fullFormat =
    dateFormat && timeFormat
      ? `${dateFormat} ${timeFormat}`
      : dateFormat || timeFormat || "";

  const formatOptions = {
    locale
  };

  const valueAsDate = parse(value, fullFormat, formatOptions);
  const dateTypeMode: DateTypeMode =
    typeof rawDateTypeMode === "string"
      ? rawDateTypeMode.toLowerCase() === "utc-ms-timestamp"
        ? "utc-ms-timestamp"
        : rawDateTypeMode.toLowerCase() === "input-format"
        ? "input-format"
        : "Date"
      : value && typeof value === "number"
      ? "utc-ms-timestamp"
      : "Date";

  //
  // On Change
  // string -> string
  // falsy -> raw onChange
  // Date -> if numeric, number (ms)
  // Date -> if not numeric, Date
  //
  function onChange(newValue: string | Date | undefined) {
    if (typeof rawOnChange !== "function") {
      return undefined;
    }

    if (typeof newValue === "string") {
      return rawOnChange(newValue);
    }

    if (!newValue) {
      return rawOnChange(newValue);
    }

    switch (dateTypeMode) {
      case "utc-ms-timestamp":
        return rawOnChange(newValue.getTime());

      case "input-format":
        return rawOnChange(format(newValue, fullFormat, formatOptions));

      default:
        return rawOnChange(newValue);
    }
  }

  //
  // ViewDate
  //
  const [viewDate, setViewDate] = useState<Date>(
    valueAsDate || startOfDay(new Date())
  );
  useEffect(() => {
    const newViewDate = valueAsDate || startOfDay(new Date());
    if (!isEqual(newViewDate, viewDate)) {
      setViewDate(newViewDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTime(valueAsDate)]);

  //
  // ViewMode
  //
  const defaultViewMode = getInitialViewMode(dateFormat, timeFormat);
  const [viewMode, setViewMode] = useState(defaultViewMode);
  useEffect(() => {
    if (viewMode !== defaultViewMode) {
      setViewMode(defaultViewMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultViewMode]);

  //
  // ViewTimestamp
  //
  const [viewTimestamp, setViewTimestamp] = useState<Date>(
    valueAsDate || viewDate
  );
  useEffect(() => {
    const newViewTimestamp = valueAsDate || viewDate;
    if (!isEqual(newViewTimestamp, viewTimestamp)) {
      setViewTimestamp(newViewTimestamp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTime(valueAsDate), getTime(viewDate)]);

  //
  // IsOpen
  //
  const [isOpen, setIsOpen] = useState(false);

  //
  // SetSelectedDate
  //
  function setSelectedDate(newDate: Date, tryClose = true) {
    const asDate = toDate(newDate);
    setViewDate(asDate);
    setViewTimestamp(asDate);

    // Time switches value but stays open
    if (viewMode === "time") {
      onChange(newDate);
    }
    // When view mode is the default, switch and try to close
    else if (viewMode === defaultViewMode) {
      onChange(newDate);

      if (tryClose) {
        setIsOpen(false);
      }
    }
    // When view mode is not the default, switch to the next view mode
    else {
      const newViewMode: ViewMode | undefined = viewMode
        ? nextViewModes[viewMode]
        : undefined;
      setViewMode(newViewMode);
    }
  }

  //
  // Trigger change when important props change
  //
  useEffect(() => {
    if (valueAsDate) {
      setSelectedDate(valueAsDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateTypeMode, fullFormat]);

  function open() {
    if (viewMode) {
      setIsOpen(true);
    }
  }

  function close() {
    setIsOpen(false);
  }

  function onInputChange(e: React.FormEvent<HTMLInputElement>) {
    const { value: newValue } = e.target as HTMLInputElement;

    const newValueAsDate = parse(newValue, fullFormat, formatOptions);
    if (newValueAsDate) {
      setSelectedDate(newValueAsDate, false);
    } else {
      onChange(newValue);
    }
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (isOpen) {
      switch (e.which) {
        // Enter key
        case 13:
        // Escape key
        case 27:
        // Tab key
        case 9:
          close();
          break;
      }
    } else {
      switch (e.which) {
        // Down arrow
        case 40:
          open();
          break;
      }
    }
  }

  const inputRef = useRef(null);
  const contentRef = useRef(null);

  useOnClickOutside(contentRef, close);

  const valueStr: string =
    valueAsDate && fullFormat
      ? format(valueAsDate, fullFormat, formatOptions)
      : typeof value === "string"
      ? value
      : "";

  //
  // Input Props
  //
  const finalInputProps = {
    type: "text",
    className,
    style,
    onClick: open,
    onFocus: open,
    onChange: onInputChange,
    onKeyDown: onInputKeyDown,
    placeholder,
    value: valueStr,
    ...rest
  };

  //
  // Calendar props
  //
  const calendarProps = {
    dateFormat,
    timeFormat,
    viewDate,
    setViewDate,
    selectedDate: valueAsDate,
    setSelectedDate,
    viewTimestamp,
    setViewTimestamp,
    formatOptions,
    viewMode,
    setViewMode,
    isValidDate
  };

  return (
    <div className={cc(["rdt", { rdtOpen: isOpen }])}>
      <input ref={inputRef} key="i" {...finalInputProps} type="text" />
      {isOpen && (
        <Popover targetRef={inputRef}>
          <div ref={contentRef} className="rdtPicker">
            <CalendarContainer {...calendarProps} />
          </div>
        </Popover>
      )}
    </div>
  );
}

export default DateTime;
