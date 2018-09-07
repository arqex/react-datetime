import React, { Component } from "react";
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
    "updateSelectedDate",
    "handleClickOutside"
  ]
};

class DateTime extends Component {
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

  getInitialState(props) {
    const state = this.getStateFromProps(props);

    if (state.open === undefined) state.open = !props.input;

    state.currentView = props.dateFormat
      ? props.viewMode || state.updateOn || viewModes.DAYS
      : viewModes.TIME;

    return state;
  }

  parseDate(date, formats) {
    if (date) {
      const parsedDate = parse(date);
      if (isDate(parsedDate) && isValidDate(parsedDate)) {
        return parsedDate;
      }
    }

    return undefined;
  }

  getStateFromProps(props) {
    const formats = this.getFormats(props);
    const selectedDate = this.parseDate(
      props.value || props.defaultValue,
      formats
    );
    let viewDate = this.parseDate(props.viewDate, formats);

    viewDate = selectedDate
      ? startOfMonth(selectedDate)
      : viewDate
        ? startOfMonth(viewDate)
        : startOfMonth(new Date());

    const updateOn = this.getUpdateOn(formats);

    const inputValue = selectedDate
      ? format(selectedDate, formats.datetime, this.getFormatOptions())
      : isDate(props.value) && isValidDate(props.value)
        ? format(props.value, formats.datetime, this.getFormatOptions())
        : isDate(props.defaultValue) && isValidDate(props.defaultValue)
          ? format(
              props.defaultValue,
              formats.datetime,
              this.getFormatOptions()
            )
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

  getUpdateOn(formats) {
    if (formats.date.match(/[lLD]/)) {
      return viewModes.DAYS;
    } else if (formats.date.indexOf("M") !== -1) {
      return viewModes.MONTHS;
    } else if (formats.date.indexOf("Y") !== -1) {
      return viewModes.YEARS;
    }

    return viewModes.DAYS;
  }

  getFormats(props) {
    const formats = {
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
    let updatedState = {};

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

      if (this.state.viewDate) {
        const updatedViewDate = this.state.viewDate;
        updatedState.viewDate = updatedViewDate;
      }
      if (this.state.selectedDate) {
        const updatedSelectedDate = this.state.selectedDate;
        updatedState.selectedDate = updatedSelectedDate;
        updatedState.inputValue = format(
          updatedSelectedDate,
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
    const value = e.target === null ? e : e.target.value;
    const date = parse(value);
    const update = { inputValue: value };

    if (isDate(date) && isValidDate(date) && !this.props.value) {
      update.selectedDate = date;
      update.viewDate = startOfMonth(date);
    } else {
      update.selectedDate = null;
    }

    return this.setState(update, () =>
      this.props.onChange(
        isDate(date) && isValidDate(date) ? date : this.state.inputValue
      )
    );
  }

  onInputKey(e) {
    if (e.which === 9 && this.props.closeOnTab) {
      this.closeCalendar();
    }
  }

  showView(view) {
    return () => {
      if (this.state.currentView !== view) {
        this.props.onViewModeChange(view);
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
      const newDate =
        type === viewModes.DAYS
          ? startOfDay(setDate(this.state.viewDate, value))
          : type === "month"
            ? startOfMonth(setMonth(this.state.viewDate, value))
            : type === "year"
              ? startOfYear(setYear(this.state.viewDate, value))
              : undefined;

      this.setState({
        viewDate: newDate,
        currentView: nextViews[type]
      });
      this.props.onViewModeChange(nextViews[type]);
    };
  }

  subtractTime(amount, type, toSelected) {
    return () => {
      this.props.onNavigateBack(amount, type);
      this.updateTime("subtract", amount, type, toSelected);
    };
  }

  addTime(amount, type, toSelected) {
    return () => {
      this.props.onNavigateForward(amount, type);
      this.updateTime("add", amount, type, toSelected);
    };
  }

  updateTime(op, amount, type, toSelected) {
    const update = {};
    const date = toSelected ? "selectedDate" : "viewDate";

    const multiplier = op === "subtract" ? -1 : 1;

    update[date] =
      type === viewModes.DAYS
        ? addDays(this.state[date], amount * multiplier)
        : type === viewModes.MONTHS
          ? addMonths(this.state[date], amount * multiplier)
          : type === viewModes.YEARS
            ? addYears(this.state[date], amount * multiplier)
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

    this.props.onChange(date);
  }

  updateSelectedDate(e, close) {
    const target = e.target;
    let modifier = 0;
    const viewDate = this.state.viewDate;
    const currentDate = this.state.selectedDate || viewDate;
    let date;

    const value = parseInt(target.getAttribute("data-value"), 10);

    if (target.className.indexOf("rdtDay") !== -1) {
      if (target.className.indexOf("rdtNew") !== -1) modifier = 1;
      else if (target.className.indexOf("rdtOld") !== -1) modifier = -1;

      date = setDate(setMonth(viewDate, getMonth(viewDate) + modifier), value);
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

    if (!this.props.value) {
      const open = !(this.props.closeOnSelect && close);
      if (!open) {
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

    this.props.onChange(date);
  }

  openCalendar(e) {
    if (!this.state.open) {
      this.setState({ open: true }, () => {
        this.props.onFocus(e);
      });
    }
  }

  closeCalendar() {
    this.setState({ open: false }, () => {
      this.props.onBlur(this.state.selectedDate || this.state.inputValue);
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
        this.props.onBlur(this.state.selectedDate || this.state.inputValue);
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
    const children = [];

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

DateTime.defaultProps = {
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

export default DateTime;
