Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _Picker = require('./Picker');

var _Picker2 = _interopRequireDefault(_Picker);

var _views = require('./views');

var _views2 = _interopRequireDefault(_views);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setDateNextViews = { month: 'days', year: 'months' };

var componentProps = {
  fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear', 'timeConstraints'],
  fromState: ['viewDate', 'selectedDate', 'updateOn'],
  fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'updateSelectedDate', 'localMoment']
};

var DateTime = (0, _createReactClass2.default)({
  displayName: 'DateTime',

  propTypes: {
    className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]),
    value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string, _propTypes2.default.object]),
    defaultValue: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string, _propTypes2.default.object]),
    onFocus: _propTypes2.default.func,
    onBlur: _propTypes2.default.func,
    onChange: _propTypes2.default.func,
    onViewModeChange: _propTypes2.default.func,
    locale: _propTypes2.default.string,
    utc: _propTypes2.default.bool,
    input: _propTypes2.default.bool,
    dateFormat: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool]),
    timeFormat: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool]),
    inputProps: _propTypes2.default.object,
    timeConstraints: _propTypes2.default.object,
    viewMode: _propTypes2.default.oneOf(['years', 'months', 'days', 'time']),
    isValidDate: _propTypes2.default.func,
    open: _propTypes2.default.bool,
    strictParsing: _propTypes2.default.bool,
    closeOnSelect: _propTypes2.default.bool,
    closeOnTab: _propTypes2.default.bool
  },

  getDefaultProps: function getDefaultProps() {
    var nof = function nof() {};

    return {
      className: '',
      defaultValue: '',
      inputProps: {},
      input: true,
      onFocus: nof,
      onBlur: nof,
      onChange: nof,
      onViewModeChange: nof,
      timeFormat: true,
      timeConstraints: {},
      dateFormat: true,
      strictParsing: true,
      closeOnSelect: false,
      closeOnTab: true,
      utc: false
    };
  },
  getInitialState: function getInitialState() {
    var props = this.props;
    var state = this.getStateFromProps(props);
    state.open = state.open !== undefined ? state.open : !props.input;
    state.currentView = props.dateFormat ? props.viewMode || state.updateOn || 'days' : 'time';

    return state;
  },


  // TODO
  getStateFromProps: function getStateFromProps(props) {
    var formats = this.getFormats(props),
        date = props.value || props.defaultValue,
        selectedDate,
        viewDate,
        updateOn,
        inputValue;

    if (date && typeof date === 'string') selectedDate = this.localMoment(date, formats.datetime);else if (date) selectedDate = this.localMoment(date);

    if (selectedDate && !selectedDate.isValid()) selectedDate = null;

    viewDate = selectedDate ? selectedDate.clone().startOf('month') : this.localMoment().startOf('month');

    updateOn = this.getUpdateOn(formats);

    if (selectedDate) inputValue = selectedDate.format(formats.datetime);else if (date.isValid && !date.isValid()) inputValue = '';else inputValue = date || '';

    return {
      updateOn: updateOn,
      viewDate: viewDate,
      selectedDate: selectedDate,
      inputValue: inputValue,
      inputFormat: formats.datetime,
      open: props.open
    };
  },


  // TODO
  getUpdateOn: function getUpdateOn(formats) {
    if (formats.date.match(/[lLD]/)) {
      return 'days';
    } else if (formats.date.indexOf('M') !== -1) {
      return 'months';
    } else if (formats.date.indexOf('Y') !== -1) {
      return 'years';
    }

    return 'days';
  },


  // TODO
  getFormats: function getFormats(props) {
    var formats = {
      date: props.dateFormat || '',
      time: props.timeFormat || ''
    },
        locale = this.localMoment(props.date, null, props).localeData();

    if (formats.date === true) {
      formats.date = locale.longDateFormat('L');
    } else if (this.getUpdateOn(formats) !== 'days') {
      formats.time = '';
    }

    if (formats.time === true) {
      formats.time = locale.longDateFormat('LT');
    }

    formats.datetime = formats.date && formats.time ? formats.date + ' ' + formats.time : formats.date || formats.time;

    return formats;
  },


  // TODO
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var formats = this.getFormats(nextProps),
        updatedState = {};

    if (nextProps.value !== this.props.value || formats.datetime !== this.getFormats(this.props).datetime) {
      updatedState = this.getStateFromProps(nextProps);
    }

    if (updatedState.open === undefined) {
      if (this.props.closeOnSelect && this.state.currentView !== 'time') {
        updatedState.open = false;
      } else {
        updatedState.open = this.state.open;
      }
    }

    if (nextProps.viewMode !== this.props.viewMode) {
      updatedState.currentView = nextProps.viewMode;
    }

    if (nextProps.locale !== this.props.locale) {
      if (this.state.viewDate) {
        var updatedViewDate = this.state.viewDate.clone().locale(nextProps.locale);
        updatedState.viewDate = updatedViewDate;
      }
      if (this.state.selectedDate) {
        var updatedSelectedDate = this.state.selectedDate.clone().locale(nextProps.locale);
        updatedState.selectedDate = updatedSelectedDate;
        updatedState.inputValue = updatedSelectedDate.format(formats.datetime);
      }
    }

    if (nextProps.utc !== this.props.utc) {
      if (nextProps.utc) {
        if (this.state.viewDate) updatedState.viewDate = this.state.viewDate.clone().utc();
        if (this.state.selectedDate) {
          updatedState.selectedDate = this.state.selectedDate.clone().utc();
          updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
        }
      } else {
        if (this.state.viewDate) updatedState.viewDate = this.state.viewDate.clone().local();
        if (this.state.selectedDate) {
          updatedState.selectedDate = this.state.selectedDate.clone().local();
          updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
        }
      }
    }
    this.setState(updatedState);
  },


  // TODO
  onInputChange: function onInputChange(e) {
    var value = e.target === null ? e : e.target.value,
        localMoment = this.localMoment(value, this.state.inputFormat),
        update = { inputValue: value };

    if (localMoment.isValid() && !this.props.value) {
      update.selectedDate = localMoment;
      update.viewDate = localMoment.clone().startOf('month');
    } else {
      update.selectedDate = null;
    }

    return this.setState(update, function () {
      return this.props.onChange(localMoment.isValid() ? localMoment : this.state.inputValue);
    });
  },
  onInputKey: function onInputKey(e) {
    if (e.key === 'Tab' && this.props.closeOnTab) {
      this.closeCalendar();
    }
  },
  showView: function showView(view) {
    if (this.state.currentView !== view) {
      this.setState({ currentView: view });

      this.props.onViewModeChange(view);
    }
  },
  setDate: function setDate(type, value) {
    var _state = this.state,
        viewDate = _state.viewDate,
        currentView = _state.currentView;

    var date = viewDate.clone()[type](value).startOf(type);
    var view = setDateNextViews[type] || currentView;

    this.setState({ viewDate: date, currentView: view });

    if (currentView !== view) {
      this.props.onViewModeChange(view);
    }
  },
  addTime: function addTime(amount, type) {
    var viewDate = this.state.viewDate.clone().add(amount, type);

    this.setState({ viewDate: viewDate });
  },
  setTime: function setTime(type, value) {
    var _state2 = this.state,
        selectedDate = _state2.selectedDate,
        viewDate = _state2.viewDate,
        inputFormat = _state2.inputFormat;

    var date = (selectedDate || viewDate).clone()[type](value);

    // TODO !?! It is needed to set all the time properties to not to reset the time
    // switch (type) {
    //   case 'hours': date.minutes(date.minutes()) // falls through
    //   case 'minutes': date.seconds(date.seconds()) // falls through
    //   case 'seconds': date.milliseconds(date.milliseconds())
    // }

    if (!this.props.value) {
      this.setState({
        selectedDate: date,
        inputValue: date.format(inputFormat)
      });
    }

    this.props.onChange(date);
  },
  updateSelectedDate: function updateSelectedDate(values) {
    var _this = this;

    var _props = this.props,
        value = _props.value,
        closeOnSelect = _props.closeOnSelect,
        onChange = _props.onChange;
    var _state3 = this.state,
        selectedDate = _state3.selectedDate,
        viewDate = _state3.viewDate,
        inputFormat = _state3.inputFormat;

    var close = closeOnSelect && 'date' in values;
    var date = (selectedDate || viewDate).clone().set(values);

    if (!value) {
      this.setState({
        open: !close,
        selectedDate: date,
        viewDate: date.clone().startOf('month'),
        inputValue: date.format(inputFormat)
      }, function () {
        return close && _this.onBlur();
      });
    } else if (close) {
      this.closeCalendar();
    }

    onChange(date);
  },
  openCalendar: function openCalendar() {
    var _this2 = this;

    if (!this.state.open) {
      this.setState({ open: true }, function () {
        return _this2.props.onFocus();
      });
    }
  },
  closeCalendar: function closeCalendar() {
    if (this.state.open) {
      this.setState({ open: false }, this.onBlur);
    }
  },
  handleClickOutside: function handleClickOutside() {
    if (this.props.input && this.state.open && !this.props.open) {
      this.setState({ open: false }, this.onBlur);
    }
  },


  // TODO
  localMoment: function localMoment(date, format, props) {
    props = props || this.props;
    var momentFn = props.utc ? _moment2.default.utc : _moment2.default;
    var m = momentFn(date, format, props.strictParsing);
    if (props.locale) m.locale(props.locale);
    return m;
  },


  // TODO
  getComponentProps: function getComponentProps() {
    var _this3 = this;

    var formats = this.getFormats(this.props);
    var props = { dateFormat: formats.date, timeFormat: formats.time };

    componentProps.fromProps.forEach(function (name) {
      props[name] = _this3.props[name];
    });
    componentProps.fromState.forEach(function (name) {
      props[name] = _this3.state[name];
    });
    componentProps.fromThis.forEach(function (name) {
      props[name] = _this3[name];
    });

    return props;
  },
  onBlur: function onBlur() {
    var _state4 = this.state,
        selectedDate = _state4.selectedDate,
        inputValue = _state4.inputValue;


    this.props.onBlur(selectedDate, inputValue);
  },
  renderInput: function renderInput() {
    return _react2.default.createElement('input', _extends({ type: 'text',
      className: 'form-control',
      onFocus: this.openCalendar,
      onChange: this.onInputChange,
      onKeyDown: this.onInputKey,
      value: this.state.inputValue
    }, this.props.inputProps));
  },
  renderPicker: function renderPicker() {
    var View = _views2.default[this.state.currentView];
    var viewProps = this.getComponentProps();

    return _react2.default.createElement(
      _Picker2.default,
      { onClickOutside: this.handleClickOutside },
      _react2.default.createElement(View, viewProps)
    );
  },
  render: function render() {
    var _props2 = this.props,
        input = _props2.input,
        className = _props2.className;
    var open = this.state.open;


    var classes = (0, _classnames2.default)('rdt', className, {
      rdtStatic: !input,
      rdtOpen: open
    });

    return _react2.default.createElement(
      'div',
      { className: classes },
      input && this.renderInput(),
      open && this.renderPicker()
    );
  }
});

// Make moment accessible through the DateTime class
DateTime.moment = _moment2.default;

exports.default = DateTime;
module.exports = exports['default'];