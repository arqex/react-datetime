import React from "react";
import CalendarContainer from "./CalendarContainer";
import startOfMonth from "date-fns/start_of_month";
import isDate from "date-fns/is_date";
import isDateValid from "date-fns/is_valid";
import parse from "date-fns/parse";
import setDate from "date-fns/set_date";
import setMonth from "date-fns/set_month";
import startOfYear from "date-fns/start_of_year";
import setYear from "date-fns/set_year";
import addMonths from "date-fns/add_months";
import addYears from "date-fns/add_years";
import setHours from "date-fns/set_hours";
import setMinutes from "date-fns/set_minutes";
import setSeconds from "date-fns/set_seconds";
import setMilliseconds from "date-fns/set_milliseconds";
import format from "date-fns/format";
import getMonth from "date-fns/get_month";
import getDate from "date-fns/get_date";
import getHours from "date-fns/get_hours";
import getMinutes from "date-fns/get_minutes";
import getSeconds from "date-fns/get_seconds";
import getMilliseconds from "date-fns/get_milliseconds";
import isEqual from "date-fns/is_equal";

import toUtc from "./toUtc";
import fromUtc from "./fromUtc";
import noop from "./noop";

/*
The view mode can be any of the following strings.
*/
export type DateViewMode = "years" | "months" | "days";
export type ViewMode = DateViewMode | "time";

export type AllowedSetTime = "hours" | "minutes" | "seconds" | "milliseconds";

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

export type IsValidDateFunc = (
  currentDate: any,
  selectedDate?: Date
) => boolean;

export type SetDateFunc = (type: "months" | "years") => void;
export type SetTimeFunc = (date: Date) => void;

export type UpdateSelectedDateFunc = (e: any, close?: boolean) => void;

interface DateTimeProps {
  /*
  Represents the selected date by the component, in order to use it as a controlled component.
  This prop is parsed by date-fns, so it is possible to use a date string or a date-fns date.
  */
  value?: Date | string;

  /*
  Represents the selected date for the component to use it as a uncontrolled component.
  This prop is parsed by date-fns, so it is possible to use a date string or a date-fns date.
  */
  defaultValue?: Date | string;

  /*
  Represents the month which is viewed on opening the calendar when there is no selected date.
  This prop is parsed by date-fns, so it is possible to use a date `string` or a `Date` object.
  */
  viewDate?: Date | string;

  /*
  Defines the format for the date. It accepts any date-fns date format.
  If true the date will be displayed using the defaults for the current locale.
  If false the datepicker is disabled and the component can be used as timepicker.
  */
  dateFormat?: boolean | string;

  /*
  Defines the format for the time. It accepts any date-fns time format.
  If true the time will be displayed using the defaults for the current locale.
  If false the timepicker is disabled and the component can be used as datepicker.
  */
  timeFormat?: boolean | string;

  /*
  Whether to show an input field to edit the date manually.
  */
  input?: boolean;

  /*
  Whether to open or close the picker. If not set react-datetime will open the
  datepicker on input focus and close it on click outside.
  */
  open?: boolean;

  /*
  Manually set the locale for the react-datetime instance.
  date-fns locale needs to be loaded to be used, see i18n docs.
  */
  locale?: any;

  /*
  Whether to interpret input times as UTC or the user's local timezone.
  */
  utc?: boolean;

  /*
  Callback trigger when the date changes. The callback receives the selected `Date` object as
  only parameter, if the date in the input is valid. If the date in the input is not valid, the
  callback receives the value of the input (a string).
  */
  onChange?: (value?: Date | string) => void;

  /*
  Callback trigger for when the user opens the datepicker.
  */
  onFocus?: (value?: Date | string) => void;

  /*
  Callback trigger for when the user clicks outside of the input, simulating a regular onBlur.
  The callback receives the selected `Date` object as only parameter, if the date in the input
  is valid. If the date in the input is not valid, the callback receives the value of the
  input (a string).
  */
  onBlur?: (value?: Date | string) => void;

  /*
  Callback trigger when the view mode changes. The callback receives the selected view mode
  string ('years', 'months', 'days', 'time') as only parameter.
  */
  onViewModeChange?: (viewMode: string) => void;

  /*
  Callback trigger when the user navigates to the previous month, year or decade.
  The callback receives the amount and type ('month', 'year') as parameters.
  */
  onNavigateBack?: (amount: number, type: string) => void;

  /*
  Callback trigger when the user navigates to the next month, year or decade.
  The callback receives the amount and type ('month', 'year') as parameters.
  */
  onNavigateForward?: (amount: number, type: string) => void;

  /*
  The default view to display when the picker is shown. ('years', 'months', 'days', 'time')
  */
  viewMode?: ViewMode | number;

  /*
  Extra class names for the component markup.
  */
  className?: string;

  /*
  Defines additional attributes for the input element of the component.
  */
  inputProps?: React.HTMLProps<HTMLInputElement>;

  /*
  Define the dates that can be selected. The function receives (currentDate, selectedDate)
  and should return a true or false whether the currentDate is valid or not. See selectable dates.
  */
  isValidDate?: IsValidDateFunc;

  /*
  Customize the way the input is shown.
  */
  renderInput?: (
    props: any,
    openCalendar: any,
    closeCalendar: any
  ) => JSX.Element;

  /*
  Customize the way that the days are shown in the day picker. The accepted function has
  the selectedDate, the current date and the default calculated props for the cell,
  and must return a React component. See appearance customization
  */
  renderDay?: (
    props: any,
    currentDate: any,
    selectedDate?: Date
  ) => JSX.Element;

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

  /*
  Customize the way that the years are shown in the year picker.
  The accepted function has the selectedDate, the current date and the default calculated
  props for the cell, the year to be shown, and must return a React component.
  See appearance customization
  */
  renderYear?: (props: any, year: number, selectedDate?: Date) => JSX.Element;

  /*
  When true, once the day has been selected, the react-datetime will be automatically closed.
  */
  closeOnSelect?: boolean;

  /*
  When true, once a "tab" key is triggered, the react-datetime will be automatically closed.
  */
  closeOnTab?: boolean;

  /*
  Allow to add some constraints to the time selector. It accepts an object with the format
  {hours:{ min: 9, max: 15, step:2}} so the hours can't be lower than 9 or higher than 15, and
  it will change adding or subtracting 2 hours everytime the buttons are clicked. The constraints
  can be added to the hours, minutes, seconds and milliseconds.
  */
  timeConstraints?: TimeConstraints;

  /*
  When true, keep the picker open when click event is triggered outside of component. When false,
  close it.
  */
  disableOnClickOutside?: boolean;
}

interface DateTimeState {
  currentView: ViewMode;
  updateOn: ViewMode;
  inputFormat: string;
  viewDate: Date;
  selectedDate?: Date;
  inputValue: string;
  open: boolean;
}

const YEARS: "years" = "years";
const MONTHS: "months" = "months";
const DAYS: "days" = "days";
const TIME: "time" = "time";
export const viewModes = Object.freeze({
  YEARS: YEARS,
  MONTHS: MONTHS,
  DAYS: DAYS,
  TIME: TIME
});

const HOURS: "hours" = "hours";
const MINUTES: "minutes" = "minutes";
const SECONDS: "seconds" = "seconds";
const MILLISECONDS: "milliseconds" = "milliseconds";
export const allowedSetTime = Object.freeze({
  HOURS: HOURS,
  MINUTES: MINUTES,
  SECONDS: SECONDS,
  MILLISECONDS: MILLISECONDS
});

const componentProps = {
  fromProps: [
    "value",
    "isValidDate",
    "renderDay",
    "renderMonth",
    "renderYear",
    "timeConstraints",
    "locale"
  ],
  fromState: ["viewDate", "selectedDate", "updateOn"],
  fromThis: [
    "setDate",
    "setTime",
    "showView",
    "addTime",
    "subtractTime",
    "updateSelectedDate"
  ]
};

class DateTime extends React.Component<DateTimeProps, DateTimeState> {
  static defaultProps = {
    className: "",
    defaultValue: "",
    inputProps: {},
    input: true,
    onFocus: noop,
    onBlur: noop,
    onChange: noop,
    onViewModeChange: noop,
    onNavigateBack: noop,
    onNavigateForward: noop,
    timeFormat: true,
    timeConstraints: {},
    dateFormat: true,
    closeOnSelect: false,
    closeOnTab: true,
    utc: false
  };

  constructor(props) {
    super(props);

    this.state = this.getInitialState(props);

    // Bind functions
    this.getInitialState = this.getInitialState.bind(this);
    this.parseDate = this.parseDate.bind(this);
    this.getStateFromProps = this.getStateFromProps.bind(this);
    this.getUpdateOn = this.getUpdateOn.bind(this);
    this.getFormats = this.getFormats.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputKey = this.onInputKey.bind(this);
    this.showView = this.showView.bind(this);
    this.setDate = this.setDate.bind(this);
    this.subtractTime = this.subtractTime.bind(this);
    this.addTime = this.addTime.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.setTime = this.setTime.bind(this);
    this.updateSelectedDate = this.updateSelectedDate.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
    this.closeCalendar = this.closeCalendar.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.getComponentProps = this.getComponentProps.bind(this);
    this.getFormatOptions = this.getFormatOptions.bind(this);
  }

  componentDidUpdate(prevProps: DateTimeProps, prevState: DateTimeState) {
    const prevVal = prevState.selectedDate || prevState.inputValue;
    const val = this.state.selectedDate || this.state.inputValue;
    if (
      prevVal instanceof Date &&
      val instanceof Date &&
      !isEqual(prevVal, val)
    ) {
      this.props.onChange!(val);
    } else if (prevVal !== val) {
      this.props.onChange!(val);
    }
  }

  getInitialState(props): any {
    const state = this.getStateFromProps(props);

    if (state.open === undefined) {
      state.open = !props.input;
    }

    state.currentView = props.dateFormat
      ? props.viewMode || state.updateOn
      : viewModes.TIME;

    return state;
  }

  parseDate(date): any {
    if (date) {
      const parsedDate = parse(date);
      if (isDate(parsedDate) && isDateValid(parsedDate)) {
        return parsedDate;
      }
    }

    return undefined;
  }

  getStateFromProps(props): any {
    const formats = this.getFormats(props);
    const selectedDate =
      this.parseDate(props.value) || this.parseDate(props.defaultValue);
    const viewDate = startOfMonth(
      selectedDate || this.parseDate(props.viewDate) || new Date()
    );

    const updateOn = this.getUpdateOn(formats);

    const inputValue = selectedDate
      ? format(selectedDate, formats.datetime, this.getFormatOptions(props))
      : props.defaultValue || "";

    return {
      updateOn: updateOn,
      inputFormat: formats.datetime,
      viewDate: viewDate,
      selectedDate:
        selectedDate && isDateValid(selectedDate) ? selectedDate : undefined,
      inputValue: inputValue,
      open: props.open
    };
  }

  getUpdateOn(formats): string {
    if (formats.date.match(/[lLD]/)) {
      return viewModes.DAYS;
    } else if (formats.date.indexOf("M") !== -1) {
      return viewModes.MONTHS;
    } else if (formats.date.indexOf("Y") !== -1) {
      return viewModes.YEARS;
    }

    return viewModes.DAYS;
  }

  getFormats(props): any {
    const formats: any = {
      date: props.dateFormat || "",
      time: props.timeFormat || ""
    };

    if (formats.date === true) {
      formats.date = "MM/DD/YYYY";
    } else if (this.getUpdateOn(formats) !== viewModes.DAYS) {
      formats.time = "";
    }

    if (formats.time === true) {
      formats.time = "h:mm A";
    }

    formats.datetime =
      formats.date && formats.time
        ? `${formats.date} ${formats.time}`
        : formats.date || formats.time;

    return formats;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const formats = this.getFormats(nextProps);
    const updatedState = this.getStateFromProps(nextProps);

    // If it's not a controlled component
    // Any change will close the picker
    if (updatedState.open === undefined && this.props.closeOnSelect) {
      updatedState.open = false;
    }

    if (nextProps.viewMode !== this.props.viewMode) {
      updatedState.currentView = nextProps.viewMode;
    }

    if (nextProps.locale !== this.props.locale) {
      updatedState.locale = nextProps.locale;

      if (this.state.selectedDate) {
        updatedState.inputValue = format(
          this.state.selectedDate,
          formats.datetime,
          this.getFormatOptions(nextProps)
        );
      }
    }

    if (nextProps.utc !== this.props.utc) {
      // Enabling UTC
      if (nextProps.utc) {
        updatedState.viewDate = toUtc(this.state.viewDate);

        if (this.state.selectedDate) {
          updatedState.selectedDate = toUtc(this.state.selectedDate);
          updatedState.inputValue = format(
            updatedState.selectedDate,
            formats.datetime,
            this.getFormatOptions(nextProps)
          );
        }
      }
      // Disabling UTC
      else {
        updatedState.viewDate = fromUtc(this.state.viewDate);

        if (this.state.selectedDate) {
          updatedState.selectedDate = fromUtc(this.state.selectedDate);
          updatedState.inputValue = format(
            updatedState.selectedDate,
            formats.datetime,
            this.getFormatOptions(nextProps)
          );
        }
      }
    }

    if (nextProps.viewDate !== this.props.viewDate) {
      updatedState.viewDate = parse(nextProps.viewDate);
    }

    this.setState(updatedState);
  }

  onInputChange(e) {
    const value = e.target.value;
    const date = parse(value);
    const update: any = { inputValue: value };

    if (isDate(date) && isDateValid(date) && !this.props.value) {
      update.selectedDate = date;
      update.viewDate = startOfMonth(date);
    } else {
      update.selectedDate = null;
    }

    return this.setState(update);
  }

  onInputKey(e) {
    if (e.which === 9 && this.props.closeOnTab) {
      this.closeCalendar();
    }
  }

  showView(view) {
    return () => {
      if (this.state.currentView !== view) {
        this.props.onViewModeChange!(view);
      }

      this.setState({ currentView: view });
    };
  }

  setDate: SetDateFunc = type => {
    const nextViews = {
      months: viewModes.DAYS,
      years: viewModes.MONTHS
    };

    return e => {
      const value = parseInt(e.target.getAttribute("data-value"), 10);
      const newDate =
        type === viewModes.MONTHS
          ? startOfMonth(setMonth(this.state.viewDate, value))
          : startOfYear(setYear(this.state.viewDate, value));

      this.setState({
        viewDate: newDate,
        currentView: nextViews[type]
      });

      this.props.onViewModeChange!(nextViews[type]);
    };
  };

  subtractTime(amount: number, type: "months" | "years") {
    return () => {
      this.props.onNavigateBack!(amount, type);

      this.updateTime("subtract", amount, type);
    };
  }

  addTime(amount: number, type: "months" | "years") {
    return () => {
      this.props.onNavigateForward!(amount, type);

      this.updateTime("add", amount, type);
    };
  }

  updateTime(op: "subtract" | "add", amount: number, type: "months" | "years") {
    const multiplier = op === "subtract" ? -1 : 1;
    const workingDate = this.state.viewDate;

    this.setState({
      viewDate:
        type === viewModes.MONTHS
          ? addMonths(workingDate, amount * multiplier)
          : addYears(workingDate, amount * multiplier)
    });
  }

  setTime: SetTimeFunc = date => {
    this.setState({
      selectedDate: date,
      inputValue: format(date, this.state.inputFormat, this.getFormatOptions())
    });
  };

  updateSelectedDate: UpdateSelectedDateFunc = (e, tryClose = false) => {
    const target = e.target;
    let modifier = 0;
    const viewDate = this.state.viewDate;
    const currentDate = this.state.selectedDate || viewDate;
    const close = tryClose && this.props.closeOnSelect;
    let date;

    const value = parseInt(target.getAttribute("data-value"), 10);

    if (target.className.indexOf("rdtDay") !== -1) {
      if (target.className.indexOf("rdtNew") !== -1) {
        modifier = 1;
      } else if (target.className.indexOf("rdtOld") !== -1) {
        modifier = -1;
      }

      date = setDate(setMonth(viewDate, getMonth(viewDate) + modifier), value);
    } else if (target.className.indexOf("rdtMonth") !== -1) {
      date = setDate(setMonth(viewDate, value), getDate(currentDate));
    } else {
      date = setYear(
        setDate(
          setMonth(viewDate, getMonth(currentDate)),
          getDate(currentDate)
        ),
        value
      );
    }

    date = setMilliseconds(
      setSeconds(
        setMinutes(
          setHours(date, getHours(currentDate)),
          getMinutes(currentDate)
        ),
        getSeconds(currentDate)
      ),
      getMilliseconds(currentDate)
    );

    const readonly = this.props.value;
    if (!readonly) {
      const open = !close;
      if (!open) {
        this.props.onBlur!(date);
      }

      this.setState({
        selectedDate: date,
        viewDate: startOfMonth(date),
        inputValue: format(
          date,
          this.state.inputFormat,
          this.getFormatOptions()
        ),
        open: open
      });
    } else if (close) {
      this.closeCalendar();
    }
  };

  openCalendar(e) {
    if (!this.state.open) {
      this.setState({ open: true }, () => {
        this.props.onFocus!(e);
      });
    }
  }

  closeCalendar() {
    this.setState({ open: false }, () => {
      this.props.onBlur!(this.state.selectedDate || this.state.inputValue);
    });
  }

  handleClickOutside() {
    if (
      this.props.input &&
      this.state.open &&
      !this.props.open &&
      !this.props.disableOnClickOutside
    ) {
      this.setState({ open: false }, () => {
        this.props.onBlur!(this.state.selectedDate || this.state.inputValue);
      });
    }
  }

  getFormatOptions(props = this.props) {
    return { locale: props.locale };
  }

  getComponentProps() {
    const formats = this.getFormats(this.props);
    const props = { dateFormat: formats.date, timeFormat: formats.time };

    componentProps.fromProps.forEach(name => {
      props[name] = this.props[name];
    });

    componentProps.fromState.forEach(name => {
      props[name] = this.state[name];
    });

    componentProps.fromThis.forEach(name => {
      props[name] = this[name];
    });

    return props;
  }

  render() {
    let className =
      "rdt" +
      (this.props.className
        ? Array.isArray(this.props.className)
          ? " " + this.props.className.join(" ")
          : " " + this.props.className
        : "");
    const children: any[] = [];

    if (this.props.input) {
      const finalInputProps = {
        type: "text",
        className: "form-control",
        onClick: this.openCalendar,
        onFocus: this.openCalendar,
        onChange: this.onInputChange,
        onKeyDown: this.onInputKey,
        value: this.state.inputValue,
        ...this.props.inputProps
      };

      if (this.props.renderInput) {
        children.push(
          <div key="i">
            {this.props.renderInput(
              finalInputProps,
              this.openCalendar,
              this.closeCalendar
            )}
          </div>
        );
      } else {
        children.push(<input {...finalInputProps} key="i" />);
      }
    } else {
      className += " rdtStatic";
    }

    if (this.state.open) {
      className += " rdtOpen";
    }

    return (
      <div className={className}>
        {children}
        <div className="rdtPicker">
          <CalendarContainer
            view={this.state.currentView}
            viewProps={this.getComponentProps()}
            onClickOutside={this.handleClickOutside}
          />
        </div>
      </div>
    );
  }
}

export default DateTime;
