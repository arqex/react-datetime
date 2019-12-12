import * as React from "react";
import Popover from "@reach/popover";
import useOnClickOutside from "use-onclickoutside";

import format from "date-fns/format";
import rawParse from "date-fns/parse";
import isEqual from "date-fns/isEqual";
import toDate from "date-fns/toDate";
import isDateValid from "date-fns/isValid";
import startOfDay from "date-fns/startOfDay";

import CalendarContainer from "./CalendarContainer";

const { useRef, useState, useEffect, useCallback } = React;

function tryGetAsTime(date: any) {
  const asDate = toDate(date);
  if (asDate && isDateValid(asDate)) {
    return asDate.getTime();
  }

  return date;
}

function useDefaultStateWithOverride<Type>(
  defaultValue: Type,
  maybeDate = true
) {
  const [override, setOverride] = useState<Type | undefined>(undefined);
  const value = override || defaultValue;

  // Clear the override if the default changes
  const changeVal = maybeDate ? tryGetAsTime(defaultValue) : defaultValue;
  useEffect(() => {
    setOverride(undefined);
  }, [changeVal]);

  return [value, setOverride] as const;
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

function getViewMode(
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

function getDateTypeMode(
  rawDateTypeMode: DateTypeMode | undefined,
  value: string | number | Date | undefined
): DateTypeMode {
  if (typeof rawDateTypeMode === "string") {
    const lowerRawDateTypeMode = rawDateTypeMode.toLowerCase();
    switch (lowerRawDateTypeMode) {
      case "utc-ms-timestamp":
      case "input-format":
        return lowerRawDateTypeMode;
    }
  } else if (typeof value === "number") {
    return "utc-ms-timestamp";
  }

  if (rawDateTypeMode) {
    return rawDateTypeMode;
  }

  return "Date";
}

export type DateTypeMode = "utc-ms-timestamp" | "input-format" | "Date";

interface DateTimeProps {
  isValidDate?: (date: Date) => boolean;

  dateTypeMode?: DateTypeMode;
  value?: string | number | Date;
  onChange?: (newValue: undefined | string | number | Date) => void;
  onFocus?: () => void;
  onBlur?: (newValue: undefined | string | number | Date) => void;

  dateFormat?: string | boolean;
  timeFormat?: string | boolean;

  locale?: any;

  shouldHideInput?: boolean;
}

function DateTime(
  props: DateTimeProps &
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
) {
  const {
    isValidDate,
    dateTypeMode: rawDateTypeMode,
    value,
    onChange: rawOnChange,
    onBlur,
    onFocus,
    dateFormat: rawDateFormat = true,
    timeFormat: rawTimeFormat = true,
    locale,
    shouldHideInput = false,
    ...rest
  } = props as DateTimeProps;

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
  const dateTypeMode = getDateTypeMode(rawDateTypeMode, value);

  const getChangedValue = useCallback(
    (newValue: undefined | string | Date) => {
      if (typeof newValue === "string") {
        return newValue;
      }

      if (!newValue) {
        return newValue;
      }

      switch (dateTypeMode) {
        case "utc-ms-timestamp":
          return newValue.getTime();

        case "input-format":
          return format(newValue, fullFormat, formatOptions);
      }

      return newValue;
    },
    [dateTypeMode, formatOptions, fullFormat]
  );

  //
  // On Change
  // string -> string
  // falsy -> raw onChange
  // Date -> if numeric, number (ms)
  // Date -> if not numeric, Date
  //
  const onChange = useCallback(
    (newValue: string | Date | undefined): void => {
      if (typeof rawOnChange !== "function") {
        return;
      }

      const changedValue = getChangedValue(newValue);

      //
      // Suppress change event when the value didn't change!
      //
      if (
        value instanceof Date &&
        changedValue instanceof Date &&
        isEqual(value, changedValue)
      ) {
        return;
      }

      if (value === changedValue) {
        return;
      }

      rawOnChange(changedValue);
    },
    [getChangedValue, rawOnChange, value]
  );

  //
  // ViewDate
  //
  const [viewDate, setViewDate] = useDefaultStateWithOverride(
    valueAsDate || startOfDay(new Date())
  );

  //
  // ViewMode
  //
  const defaultViewMode = getViewMode(dateFormat, timeFormat);
  const [viewMode, setViewMode] = useDefaultStateWithOverride(
    defaultViewMode,
    false
  );

  //
  // ViewTimestamp
  //
  const [viewTimestamp, setViewTimestamp] = useDefaultStateWithOverride(
    valueAsDate || viewDate
  );

  //
  // IsOpen
  //
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    if (viewMode) {
      setIsOpen(true);

      if (typeof onFocus === "function") {
        onFocus();
      }
    }
  }

  function closeWith(newValue: undefined | string | Date) {
    setIsOpen(false);

    if (typeof onBlur === "function") {
      const changedValue = getChangedValue(newValue);
      onBlur(changedValue);
    }
  }

  function close() {
    return closeWith(valueAsDate);
  }

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
        closeWith(newDate);
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

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value: newValue } = e.target;

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
    ...rest,
    ref: inputRef,
    type: "text",
    onClick: open,
    onFocus: open,
    //onBlur: close,
    onChange: onInputChange,
    onKeyDown: onInputKeyDown,
    value: valueStr
  };

  //
  // Calendar props
  //
  const calendarProps = {
    ref: contentRef,
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
    isValidDate,
    isStatic: shouldHideInput
  };

  return !shouldHideInput ? (
    <>
      <input {...finalInputProps} />
      {isOpen && (
        <Popover targetRef={inputRef}>
          <CalendarContainer {...calendarProps} />
        </Popover>
      )}
    </>
  ) : (
    <CalendarContainer {...calendarProps} />
  );
}

export default DateTime;
