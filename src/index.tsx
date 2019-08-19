import * as React from "react";
import cc from "classcat";
import Popover from "@reach/popover";
import useOnClickOutside from "use-onclickoutside";

import format from "date-fns/format";
import rawParse from "date-fns/parse";
import isDate from "date-fns/is_date";
import isDateValid from "date-fns/is_valid";
import startOfDay from "date-fns/start_of_day";

import CalendarContainer from "./CalendarContainer";
import returnTrue from "./returnTrue";
import toUtc from "./toUtc";
import fromUtc from "./fromUtc";

const { useRef, useState, useEffect } = React;

function parse(date: Date | string): any {
  if (date) {
    const parsedDate = rawParse(date);
    if (isDate(parsedDate) && isDateValid(parsedDate)) {
      return parsedDate;
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

interface NextViewModes {
  days: "days";
  months: "days";
  years: "months";
}

const nextViewModes: NextViewModes = {
  days: "days",
  months: "days",
  years: "months"
};

function getInitialViewMode(
  dateFormat: string | false,
  timeFormat: string | false
): "time" | "days" | "months" | "years" | undefined {
  if (typeof dateFormat === "string") {
    if (dateFormat.match(/[lLD]/)) {
      return "days";
    } else if (dateFormat.indexOf("M") !== -1) {
      return "months";
    } else if (dateFormat.indexOf("Y") !== -1) {
      return "years";
    }
  }

  if (typeof timeFormat === "string") {
    return "time";
  }

  return undefined;
}

function DateTime(props) {
  const {
    className,
    style,
    placeholder,
    isValidDate = returnTrue,
    value,
    defaultValue,
    viewDate: propViewDate,
    dateFormat: rawDateFormat = true,
    timeFormat: rawTimeFormat = true,
    input: isInput = true,
    open: controlledIsOpen,
    locale,
    utc = false,
    onChange,
    viewMode: propViewMode,
    defaultOpen = false,
    ...rest
  } = props;

  const isControlled = value !== undefined;
  const dateFormat = rawDateFormat === true ? "MM/DD/YYYY" : rawDateFormat;
  const timeFormat = rawTimeFormat === true ? "h:mm A" : rawTimeFormat;
  const fullFormat =
    dateFormat && timeFormat
      ? `${dateFormat} ${timeFormat}`
      : dateFormat || timeFormat || "";

  const formatOptions = {
    locale
  };

  const defaultViewMode = getInitialViewMode(dateFormat, timeFormat);

  const [hasInitialized, setHasInitialized] = useState(false);
  const [internalIsOpen, setIsOpen] = useState(defaultOpen);
  const isOpen =
    typeof controlledIsOpen === "boolean" ? controlledIsOpen : internalIsOpen;
  const [viewMode, setViewMode] = useState(propViewMode || defaultViewMode);
  const [rawSelectedDate, rawSetSelectedDate] = useState(
    parse(value) || parse(defaultValue)
  );

  const selectedDate = isControlled
    ? value
    : rawSelectedDate !== undefined
    ? rawSelectedDate
    : undefined;

  const [viewDate, setViewDate] = useState(
    selectedDate || startOfDay(new Date())
  );

  useEffect(() => {
    setHasInitialized(true);
  }, []);

  useEffect(() => {
    if (propViewDate) {
      setViewDate(propViewDate);
    }
  }, [propViewDate]);

  useEffect(() => {
    if (propViewMode) {
      setViewMode(propViewMode);
    }
  }, [propViewMode]);

  useEffect(() => {
    if (hasInitialized) {
      const func = utc ? toUtc : fromUtc;

      setViewDate(func(viewDate));
      if (selectedDate) {
        const newSelectedDate = func(selectedDate);
        setSelectedDate(newSelectedDate);
        setInputValue(format(newSelectedDate, fullFormat, formatOptions));
      }
    }
  }, [utc]);

  const [viewTimestamp, setViewTimestamp] = useState();

  useEffect(() => {
    setViewTimestamp(selectedDate || viewDate);
  }, [selectedDate, viewDate]);

  const defaultInputValue = isControlled
    ? value
    : selectedDate
    ? format(selectedDate, fullFormat, formatOptions)
    : "";
  const [inputValue, setInputValue] = useState(defaultInputValue);

  function setSelectedDate(newDate, tryClose = true) {
    setViewDate(newDate);
    setViewTimestamp(newDate);

    const theSetSelectedDate = isControlled
      ? newSelectedDate => {
          if (typeof onChange === "function") {
            onChange(newSelectedDate);
          }
        }
      : rawSetSelectedDate;

    if (newDate) {
      setInputValue(format(newDate, fullFormat, formatOptions));

      if (viewMode === "time") {
        theSetSelectedDate(newDate);
      } else if (viewMode === defaultViewMode) {
        theSetSelectedDate(newDate);

        if (tryClose) {
          setIsOpen(false);
        }
      } else {
        const newViewMode = viewMode ? nextViewModes[viewMode] : undefined;
        setViewMode(newViewMode);
      }
    } else {
      theSetSelectedDate(newDate);
    }
  }

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function onInputChange(e: React.FormEvent<HTMLInputElement>) {
    const { value: newValue } = e.target as HTMLInputElement;
    const date = parse(newValue);

    const fullFormatted = format(date, fullFormat, formatOptions);
    const dateFormatted = format(date, dateFormat, formatOptions);
    if (newValue === fullFormatted || newValue === dateFormatted) {
      setSelectedDate(date, false);

      if (typeof onChange === "function") {
        onChange(date);
      }
    } else {
      if (typeof onChange === "function") {
        onChange(newValue);
      }
    }

    setInputValue(newValue);
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Enter key
    if (isOpen && e.which === 13) {
      close();
    }

    // Escape key
    if (isOpen && e.which === 27) {
      close();
    }

    // Tab key
    if (isOpen && e.which === 9) {
      close();
    }

    // Down arrow
    if (!isOpen && e.which === 40) {
      open();
    }
  }

  const inputRef = useRef(null);
  const contentRef = useRef(null);

  useOnClickOutside(contentRef, close);

  const valueAsDate = value && parse(value);

  const finalInputProps = {
    type: "text",
    className,
    style,
    onClick: open,
    onFocus: open,
    onChange: onInputChange,
    onKeyDown: onInputKeyDown,
    placeholder,
    value: isControlled
      ? isDate(valueAsDate) && isDateValid(valueAsDate)
        ? format(valueAsDate, fullFormat, formatOptions)
        : value
      : inputValue
      ? inputValue
      : "",
    ...rest
  };

  const contentProps = {
    dateFormat,
    timeFormat,
    viewDate,
    setViewDate,
    selectedDate: isControlled && value ? value : selectedDate,
    setSelectedDate,
    viewTimestamp,
    setViewTimestamp,
    formatOptions,
    viewMode,
    setViewMode,
    isValidDate
  };

  return isInput ? (
    <div className={cc(["rdt", { rdtOpen: isOpen }])}>
      <input ref={inputRef} key="i" {...finalInputProps} />
      {isOpen && viewMode && (
        <Popover targetRef={inputRef}>
          <div ref={contentRef} className="rdtPicker">
            <CalendarContainer {...contentProps} />
          </div>
        </Popover>
      )}
    </div>
  ) : (
    <div className="rdt rdtStatic rdtOpen">
      <div className="rdtPicker">
        <CalendarContainer {...contentProps} />
      </div>
    </div>
  );
}

export default DateTime;
