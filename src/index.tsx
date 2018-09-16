import React from "react";
import CalendarContainer from "./CalendarContainer";
import startOfMonth from "date-fns/start_of_month";
import isDate from "date-fns/is_date";
import isValidDate from "date-fns/is_valid";
import parse from "date-fns/parse";
import setDate from "date-fns/set_date";
import startOfDay from "date-fns/start_of_day";
import setMonth from "date-fns/set_month";
import startOfYear from "date-fns/start_of_year";
import setYear from "date-fns/set_year";
import addDays from "date-fns/add_days";
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

import toUtc from "./toUtc";
import fromUtc from "./fromUtc";

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

export type UpdateSelectedDateFunc = (e: any, close: boolean) => void;

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
  updateOn: string;
  inputFormat: string;
  viewDate?: Date;
  selectedDate?: Date;
  inputValue: string;
  open: boolean;
}

const viewModes = Object.freeze({
  YEARS: "years",
  MONTHS: "months",
  DAYS: "days",
  TIME: "time"
});

const allowedSetTime = Object.freeze({
  HOURS: "hours",
  MINUTES: "minutes",
  SECONDS: "seconds",
  MILLISECONDS: "milliseconds"
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
    onFocus: function() {},
    onBlur: function() {},
    onChange: function() {},
    onViewModeChange: function() {},
    onNavigateBack: function() {},
    onNavigateForward: function() {},
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
      if (isDate(parsedDate) && isValidDate(parsedDate)) {
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
      ? format(selectedDate, formats.datetime, this.getFormatOptions())
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
    let updatedState: any = {};

    if (
      nextProps.value !== this.props.value ||
      formats.datetime !== this.getFormats(this.props).datetime
    ) {
      updatedState = this.getStateFromProps(nextProps);
    }

    if (updatedState.open === undefined) {
      if (typeof nextProps.open !== "undefined") {
        updatedState.open = nextProps.open;
      } else if (
        this.props.closeOnSelect &&
        this.state.currentView !== viewModes.TIME
      ) {
        updatedState.open = false;
      } else {
        updatedState.open = this.state.open;
      }
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
          this.getFormatOptions()
        );
      }
    }

    if (nextProps.utc !== this.props.utc) {
      // Enabling UTC
      if (nextProps.utc) {
        if (this.state.viewDate) {
          updatedState.viewDate = toUtc(this.state.viewDate);
        }

        if (this.state.selectedDate) {
          updatedState.selectedDate = toUtc(this.state.selectedDate);
          updatedState.inputValue = format(
            updatedState.selectedDate,
            formats.datetime,
            this.getFormatOptions()
          );
        }
      }
      // Disabling UTC
      else {
        if (this.state.viewDate) {
          updatedState.viewDate = fromUtc(this.state.viewDate);
        }

        if (this.state.selectedDate) {
          updatedState.selectedDate = fromUtc(this.state.selectedDate);
          updatedState.inputValue = format(
            updatedState.selectedDate,
            formats.datetime,
            this.getFormatOptions()
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

    if (isDate(date) && isValidDate(date) && !this.props.value) {
      update.selectedDate = date;
      update.viewDate = startOfMonth(date);
    } else {
      update.selectedDate = null;
    }

    return this.setState(update, () => {
      if (this.props.onChange) {
        this.props.onChange(
          isDate(date) && isValidDate(date) ? date : this.state.inputValue
        );
      }
    });
  }

  onInputKey(e) {
    if (e.which === 9 && this.props.closeOnTab) {
      this.closeCalendar();
    }
  }

  showView(view) {
    return () => {
      if (this.state.currentView !== view) {
        if (this.props.onViewModeChange) {
          this.props.onViewModeChange(view);
        }
      }

      this.setState({ currentView: view });
    };
  }

  setDate(type) {
    const nextViews = {
      month: viewModes.DAYS,
      year: viewModes.MONTHS
    };

    return e => {
      const value = parseInt(e.target.getAttribute("data-value"), 10);
      const newDate = this.state.viewDate
        ? type === viewModes.DAYS
          ? startOfDay(setDate(this.state.viewDate, value))
          : type === "month"
            ? startOfMonth(setMonth(this.state.viewDate, value))
            : type === "year"
              ? startOfYear(setYear(this.state.viewDate, value))
              : undefined
        : undefined;

      this.setState({
        viewDate: newDate,
        currentView: nextViews[type]
      });

      if (this.props.onViewModeChange) {
        this.props.onViewModeChange(nextViews[type]);
      }
    };
  }

  subtractTime(amount, type, toSelected) {
    return () => {
      if (this.props.onNavigateBack) {
        this.props.onNavigateBack(amount, type);
      }

      this.updateTime("subtract", amount, type, toSelected);
    };
  }

  addTime(amount, type, toSelected) {
    return () => {
      if (this.props.onNavigateForward) {
        this.props.onNavigateForward(amount, type);
      }

      this.updateTime("add", amount, type, toSelected);
    };
  }

  updateTime(op, amount, type, toSelected) {
    const update = {};
    const date = toSelected ? "selectedDate" : "viewDate";

    const multiplier = op === "subtract" ? -1 : 1;

    const workingDate = this.state[date];

    update[date] = workingDate
      ? type === viewModes.DAYS
        ? addDays(workingDate, amount * multiplier)
        : type === viewModes.MONTHS
          ? addMonths(workingDate, amount * multiplier)
          : type === viewModes.YEARS
            ? addYears(workingDate, amount * multiplier)
            : undefined
      : undefined;

    this.setState(update);
  }

  setTime(type, value) {
    let date = this.state.selectedDate
      ? this.state.selectedDate
      : this.state.viewDate
        ? this.state.viewDate
        : undefined;

    // It is needed to set all the time properties to not to reset the time
    if (date) {
      if (type === allowedSetTime.HOURS) {
        date = setHours(date, value);
      } else if (type === allowedSetTime.MINUTES) {
        date = setMinutes(date, value);
      } else if (type === allowedSetTime.SECONDS) {
        date = setSeconds(date, value);
      } else if (type === allowedSetTime.MILLISECONDS) {
        date = setMilliseconds(date, value);
      }

      if (!this.props.value) {
        this.setState({
          selectedDate: date,
          inputValue: format(
            date,
            this.state.inputFormat,
            this.getFormatOptions()
          )
        });
      }
    }

    if (this.props.onChange) {
      this.props.onChange(date);
    }
  }

  updateSelectedDate: UpdateSelectedDateFunc = (e, close) => {
    const target = e.target;
    let modifier = 0;
    const viewDate = this.state.viewDate;
    const currentDate = this.state.selectedDate || viewDate;
    let date;

    const value = parseInt(target.getAttribute("data-value"), 10);

    if (viewDate && currentDate) {
      if (target.className.indexOf("rdtDay") !== -1) {
        if (target.className.indexOf("rdtNew") !== -1) modifier = 1;
        else if (target.className.indexOf("rdtOld") !== -1) modifier = -1;

        date = setDate(
          setMonth(viewDate, getMonth(viewDate) + modifier),
          value
        );
      } else if (target.className.indexOf("rdtMonth") !== -1) {
        date = setDate(setMonth(viewDate, value), getDate(currentDate));
      } else if (target.className.indexOf("rdtYear") !== -1) {
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
    }

    if (!this.props.value) {
      const open = !(this.props.closeOnSelect && close);
      if (!open && this.props.onBlur) {
        this.props.onBlur(date);
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
    } else {
      if (this.props.closeOnSelect && close) {
        this.closeCalendar();
      }
    }

    if (this.props.onChange) {
      this.props.onChange(date);
    }
  };

  openCalendar(e) {
    if (!this.state.open) {
      this.setState({ open: true }, () => {
        if (this.props.onFocus) {
          this.props.onFocus(e);
        }
      });
    }
  }

  closeCalendar() {
    this.setState({ open: false }, () => {
      if (this.props.onBlur) {
        this.props.onBlur(this.state.selectedDate || this.state.inputValue);
      }
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
        if (this.props.onBlur) {
          this.props.onBlur(this.state.selectedDate || this.state.inputValue);
        }
      });
    }
  }

  getFormatOptions() {
    return { locale: this.props.locale };
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
