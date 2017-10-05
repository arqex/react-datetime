Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var separator = _react2.default.createElement(
  'div',
  { className: 'rdtCounterSeparator' },
  ':'
);
var pad2 = function pad2(value) {
  return ('00' + (value || '')).slice(-2);
};
var capitalise = function capitalise(str) {
  return str[0].toUpperCase() + str.slice(1);
};

var format12Hours = function format12Hours(hours) {
  return (hours + 12 - 1) % 12 + 1;
};
var format24Hours = function format24Hours(hours) {
  return hours;
};
var formatHours = function formatHours(meridiem) {
  return meridiem ? format12Hours : format24Hours;
};

var defaultTimeConstraints = {
  hours: { min: 0, max: 23, step: 1 },
  minutes: { min: 0, max: 59, step: 1 },
  seconds: { min: 0, max: 59, step: 1 }
};

var TimeView = (0, _createReactClass2.default)({
  displayName: 'TimeView',

  getInitialState: function getInitialState() {
    var _props = this.props,
        selectedDate = _props.selectedDate,
        viewDate = _props.viewDate,
        timeFormat = _props.timeFormat;

    var date = selectedDate || viewDate;

    return {
      date: date,
      ms: date.milliseconds(),
      parts: this.calculateParts(timeFormat)
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(_ref) {
    var selectedDate = _ref.selectedDate,
        viewDate = _ref.viewDate,
        timeFormat = _ref.timeFormat;

    var state = {};

    var date = selectedDate || viewDate;
    if (date !== this.state.date) {
      state.date = date;
      state.ms = date.milliseconds();
    }

    if (timeFormat !== this.props.timeFormat) {
      state.parts = this.calculateParts({ timeFormat: timeFormat });
    }

    this.setState(state);
  },
  componentWillUnmount: function componentWillUnmount() {
    this.clearTimers();
  },
  calculateParts: function calculateParts(format) {
    var hours = format.toLowerCase().indexOf('h') !== -1;
    var minutes = hours && format.indexOf('m') !== -1;
    var seconds = minutes && format.indexOf('s') !== -1;
    var milliseconds = seconds && format.indexOf('S') !== -1;
    var meridiem = format[format.toLowerCase().indexOf('a')];

    return { hours: hours, minutes: minutes, seconds: seconds, milliseconds: milliseconds, meridiem: meridiem };
  },
  toggleMeridiem: function toggleMeridiem() {
    var _defaultTimeConstrain = defaultTimeConstraints.hours,
        min = _defaultTimeConstrain.min,
        max = _defaultTimeConstrain.max; // this.timeConstraints.hours TODO

    var hours = Math.min(max, Math.max(min, (this.state.date.hours() + 12) % 24));

    this.props.setTime('hours', hours);
  },
  updateMilliseconds: function updateMilliseconds(e) {
    var value = e.target.value;

    var ms = parseInt(value, 10);

    if (ms.toString() === value && ms >= 0 && ms < 1000) {
      this.props.setTime('milliseconds', ms);
    } else {
      this.setState({ ms: value });
    }
  },
  increase: function increase(type) {
    var _defaultTimeConstrain2 = defaultTimeConstraints[type],
        min = _defaultTimeConstrain2.min,
        max = _defaultTimeConstrain2.max,
        step = _defaultTimeConstrain2.step; // this.props TODO

    var value = this.state.date[type]() + step;
    value = value > max ? min + (value - (max + 1)) : value;

    this.setState({ date: this.state.date.clone()[type](value) });
  },
  decrease: function decrease(type) {
    var _defaultTimeConstrain3 = defaultTimeConstraints[type],
        min = _defaultTimeConstrain3.min,
        max = _defaultTimeConstrain3.max,
        step = _defaultTimeConstrain3.step; // this.props TODO

    var value = this.state.date[type]() - step;
    value = value < min ? max + 1 - (min - value) : value;

    this.setState({ date: this.state.date.clone()[type](value) });
  },
  clearTimers: function clearTimers() {
    clearTimeout(this._repeatTimer);
    clearInterval(this._increaseTimer);

    if (this._mouseUpHandler) {
      document.body.removeEventListener('mouseup', this._mouseUpHandler);
      this._mouseUpHandler = null;
    }
  },
  onStartClicking: function onStartClicking(action, type) {
    var _this = this;

    this[action](type);

    this.clearTimers();

    this._repeatTimer = setTimeout(function () {
      _this._increaseTimer = setInterval(function () {
        return _this[action](type);
      }, 70);
    }, 500);

    this._mouseUpHandler = function () {
      _this.clearTimers();
      _this.props.setTime(type, _this.state.date[type]());
    };

    document.body.addEventListener('mouseup', this._mouseUpHandler);
  },
  renderCounter: function renderCounter(type) {
    var _this2 = this;

    var value = this.state.date[type]();
    var formatter = type === 'hours' ? formatHours(this.state.parts.meridiem) : pad2;

    return _react2.default.createElement(
      'div',
      { className: 'rdtCounter rdt' + capitalise(type) },
      _react2.default.createElement(
        'button',
        { onMouseDown: function onMouseDown() {
            return _this2.onStartClicking('increase', type);
          } },
        '\u25B2'
      ),
      _react2.default.createElement(
        'div',
        { className: 'rdtCount' },
        formatter(value)
      ),
      _react2.default.createElement(
        'button',
        { onMouseDown: function onMouseDown() {
            return _this2.onStartClicking('decrease', type);
          } },
        '\u25BC'
      )
    );
  },
  renderMeridiem: function renderMeridiem() {
    var _state = this.state,
        date = _state.date,
        meridiem = _state.parts.meridiem;


    return _react2.default.createElement(
      'div',
      { className: 'rdtCounter rdtMeridiem' },
      _react2.default.createElement(
        'button',
        { onMouseDown: this.toggleMeridiem },
        '\u25B2'
      ),
      _react2.default.createElement(
        'div',
        { className: 'rdtCount' },
        date.format(meridiem)
      ),
      _react2.default.createElement(
        'button',
        { onMouseDown: this.toggleMeridiem },
        '\u25BC'
      )
    );
  },
  renderMilliseconds: function renderMilliseconds() {
    return _react2.default.createElement(
      'div',
      { className: 'rdtCounter rdtMilli' },
      _react2.default.createElement('input', { type: 'text', value: this.state.ms, onChange: this.updateMilliseconds })
    );
  },
  renderCounters: function renderCounters() {
    var _state$parts = this.state.parts,
        hours = _state$parts.hours,
        minutes = _state$parts.minutes,
        seconds = _state$parts.seconds,
        meridiem = _state$parts.meridiem,
        milliseconds = _state$parts.milliseconds;


    return _react2.default.createElement(
      'div',
      { className: 'rdtCounters' },
      hours && this.renderCounter('hours'),
      minutes && separator,
      minutes && this.renderCounter('minutes'),
      seconds && separator,
      seconds && this.renderCounter('seconds'),
      meridiem && this.renderMeridiem(),
      milliseconds && !meridiem && separator,
      milliseconds && this.renderMilliseconds()
    );
  },
  renderHeader: function renderHeader() {
    var _this3 = this;

    var dateFormat = this.props.dateFormat;


    return !dateFormat ? null : _react2.default.createElement(
      'table',
      null,
      _react2.default.createElement(
        'thead',
        null,
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement(
            'th',
            { className: 'rdtSwitch', onClick: function onClick() {
                return _this3.props.showView('days');
              } },
            this.state.date.format(dateFormat)
          )
        )
      )
    );
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'rdtTime' },
      this.renderHeader(),
      this.renderCounters()
    );
  }
});

exports.default = TimeView;
module.exports = exports['default'];