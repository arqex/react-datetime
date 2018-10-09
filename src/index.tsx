import * as React from "react";
import CalendarContainer from "./CalendarContainer";
import startOfMonth from "date-fns/start_of_month";
import isDate from "date-fns/is_date";
import isDateValid from "date-fns/is_valid";
import rawParse from "date-fns/parse";
import addMonths from "date-fns/add_months";
import addYears from "date-fns/add_years";
import format from "date-fns/format";
import isEqual from "date-fns/is_equal";
import cc from "classcat";

import toUtc from "./toUtc";
import fromUtc from "./fromUtc";
import noop from "./noop";

/*
The view mode can be any of the following strings.
*/
export type ViewMode = "years" | "months" | "days" | "time";

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

export type SetTimeFunc = (date: Date) => void;

export type ShiftFunc = (
  op: "sub" | "add",
  amount: number,
  type: "months" | "years"
) => (event: any) => void;

export type ShowFunc = (
  view: "days" | "months" | "years" | "time"
) => (event: any) => void;

export type SetDateFunc = (
  type: "days" | "months" | "years",
  newDate: Date,
  close?: boolean
) => (event: any) => void;

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
  defaultValue: Date | string;

  /*
  Represents the month which is viewed on opening the calendar when there is no selected date.
  This prop is parsed by date-fns, so it is possible to use a date `string` or a `Date` object.
  */
  viewDate: Date | string;

  /*
  Defines the format for the date. It accepts any date-fns date format.
  If true the date will be displayed using the defaults for the current locale.
  If false the datepicker is disabled and the component can be used as timepicker.
  */
  dateFormat: boolean | string;

  /*
  Defines the format for the time. It accepts any date-fns time format.
  If true the time will be displayed using the defaults for the current locale.
  If false the timepicker is disabled and the component can be used as datepicker.
  */
  timeFormat: boolean | string;

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
  onViewModeChange?: (viewMode: ViewMode) => void;

  /*
  Callback trigger when the user navigates to the previous month, year or decade.
  The callback receives the amount and type ('month', 'year') as parameters.
  */
  onNavigateBack?: (amount: number, type: ViewMode) => void;

  /*
  Callback trigger when the user navigates to the next month, year or decade.
  The callback receives the amount and type ('month', 'year') as parameters.
  */
  onNavigateForward?: (amount: number, type: ViewMode) => void;

  /*
  The default view to display when the picker is shown. ('years', 'months', 'days', 'time')
  */
  viewMode?: ViewMode;

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
  fromState: ["viewDate", "selectedDate"],
  fromThis: ["setDate", "setTime", "show", "shift"]
};

interface NextViews {
  days: "days";
  months: "days";
  years: "months";
}

const nextViews: NextViews = {
  days: "days",
  months: "days",
  years: "months"
};

function getInitialState(props): any {
  const state = getStateFromProps(props);

  if (state.open === undefined) {
    state.open = !props.input;
  }

  state.currentView = props.dateFormat
    ? props.viewMode || state.updateOn
    : "time";

  return state;
}

function parse(date: Date | string): any {
  if (date) {
    const parsedDate = rawParse(date);
    if (isDate(parsedDate) && isDateValid(parsedDate)) {
      return parsedDate;
    }
  }

  return undefined;
}

function getStateFromProps(props): any {
  const formats = getFormats(props);
  const selectedDate = parse(props.value) || parse(props.defaultValue);
  const viewDate = startOfMonth(
    selectedDate || parse(props.viewDate) || new Date()
  );

  const updateOn = getUpdateOn(formats);

  const inputValue = selectedDate
    ? format(selectedDate, formats.datetime, getFormatOptions(props))
    : props.defaultValue || "";

  return {
    updateOn: updateOn,
    inputFormat: formats.datetime,
    viewDate: viewDate,
    selectedDate: selectedDate,
    inputValue: inputValue,
    open: props.open
  };
}

function getUpdateOn(formats): "days" | "months" | "years" {
  if (formats.date.match(/[lLD]/)) {
    return "days";
  } else if (formats.date.indexOf("M") !== -1) {
    return "months";
  } else if (formats.date.indexOf("Y") !== -1) {
    return "years";
  }

  return "days";
}

function getFormats(props): any {
  const formats: any = {
    date: props.dateFormat || "",
    time: props.timeFormat || ""
  };

  if (formats.date === true) {
    formats.date = "MM/DD/YYYY";
  } else if (getUpdateOn(formats) !== "days") {
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

function getFormatOptions(props) {
  return { locale: props.locale };
}

class DateTime extends React.Component<DateTimeProps, DateTimeState> {
  static defaultProps = {
    className: "",
    defaultValue: "",
    viewDate: undefined,
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

    this.state = getInitialState(props);

    // Bind functions
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputKey = this.onInputKey.bind(this);
    this.show = this.show.bind(this);
    this.setDate = this.setDate.bind(this);
    this.shift = this.shift.bind(this);
    this.setTime = this.setTime.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
    this.closeCalendar = this.closeCalendar.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.getComponentProps = this.getComponentProps.bind(this);
  }

  componentDidUpdate(prevProps: DateTimeProps, prevState: DateTimeState) {
    const prevVal = prevState.selectedDate || prevState.inputValue;
    const val = this.state.selectedDate || this.state.inputValue;
    if (
      (prevVal instanceof Date &&
        val instanceof Date &&
        !isEqual(prevVal, val)) ||
      prevVal !== val
    ) {
      this.props.onChange!(val);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const formats = getFormats(nextProps);
    const updatedState = getStateFromProps(nextProps);
    const formatOptions = getFormatOptions(nextProps);

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
          formatOptions
        );
      }
    }

    if (nextProps.utc !== this.props.utc) {
      const func = nextProps.utc ? toUtc : fromUtc;

      updatedState.viewDate = func(this.state.viewDate);
      if (this.state.selectedDate) {
        updatedState.selectedDate = func(this.state.selectedDate);
        updatedState.inputValue = format(
          updatedState.selectedDate,
          formats.datetime,
          formatOptions
        );
      }
    }

    if (nextProps.viewDate !== this.props.viewDate) {
      updatedState.viewDate = parse(nextProps.viewDate);
    }

    this.setState(updatedState);
  }

  onInputChange(e) {
    const { value } = e.target;
    const date = parse(value);
    const update: any = { inputValue: value };

    if (date && !this.props.value) {
      update.selectedDate = date;
      update.viewDate = date;
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

  show: ShowFunc = view => {
    return () => {
      if (this.state.currentView !== view) {
        this.props.onViewModeChange!(view);
      }

      this.setState({ currentView: view });
    };
  };

  shift: ShiftFunc = (op, amount, type) => {
    return () => {
      const mult = op === "sub" ? -1 : 1;
      const workingDate = this.state.viewDate;

      if (op === "sub") {
        this.props.onNavigateBack!(amount, type);
      } else {
        this.props.onNavigateForward!(amount, type);
      }

      this.setState({
        viewDate:
          type === "months"
            ? addMonths(workingDate, amount * mult)
            : addYears(workingDate, amount * mult)
      });
    };
  };

  setTime: SetTimeFunc = date => {
    this.setState({
      selectedDate: date,
      inputValue: format(
        date,
        this.state.inputFormat,
        getFormatOptions(this.props)
      )
    });
  };

  setDate: SetDateFunc = (type, newDate, tryClose = false) => {
    return () => {
      if (this.state.updateOn === type) {
        const close = tryClose && this.props.closeOnSelect;

        const { selectedDate, viewDate } = this.state;
        const currentDate = selectedDate || viewDate;
        const date = parse(
          format(newDate, "YYYY-MM-DD") +
            " " +
            format(currentDate, "HH:mm:ss.SSSZ")
        );

        const readonly = this.props.value;
        if (!readonly) {
          const open = !close;
          if (!open) {
            this.props.onBlur!(date);
          }

          this.setState({
            selectedDate: date,
            viewDate: date,
            inputValue: format(
              date,
              this.state.inputFormat,
              getFormatOptions(this.props)
            ),
            open: open
          });
        } else if (close) {
          this.closeCalendar();
        }
      } else {
        const newViewMode = nextViews[type];

        this.setState({
          viewDate: newDate,
          currentView: newViewMode
        });

        this.props.onViewModeChange!(newViewMode);
      }
    };
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

  getComponentProps() {
    const formats = getFormats(this.props);
    const props = {
      formatOptions: getFormatOptions(this.props),
      dateFormat: formats.date,
      timeFormat: formats.time
    };

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

    return (
      <div
        className={cc([
          "rdt",
          this.props.className,
          {
            rdtStatic: !this.props.input,
            rdtOpen: this.state.open
          }
        ])}
      >
        {!!this.props.input &&
          (this.props.renderInput ? (
            <div key="i">
              {this.props.renderInput(
                finalInputProps,
                this.openCalendar,
                this.closeCalendar
              )}
            </div>
          ) : (
            <input {...finalInputProps} key="i" />
          ))}
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
