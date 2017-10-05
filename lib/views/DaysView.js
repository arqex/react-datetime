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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaultRenderDay = function defaultRenderDay(_ref) {
  var date = _ref.date,
      className = _ref.className,
      onClick = _ref.onClick;
  return _react2.default.createElement(
    'td',
    { className: className, onClick: onClick },
    date.date()
  );
};

var DaysView = (0, _createReactClass2.default)({
  displayName: 'DaysView',

  getLocale: function getLocale() {
    return this.props.viewDate.localeData();
  },
  getDaysOfWeek: function getDaysOfWeek() {
    var locale = this.getLocale();
    var dow = locale.weekdaysMin();
    var first = locale.firstDayOfWeek();

    return [].concat(_toConsumableArray(dow.slice(first)), _toConsumableArray(dow.slice(0, first)));
  },
  selectDate: function selectDate(date) {
    this.props.updateSelectedDate({ year: date.year(), month: date.month(), date: date.date() });
  },
  renderHeading: function renderHeading() {
    var _props = this.props,
        viewDate = _props.viewDate,
        addTime = _props.addTime,
        showView = _props.showView;

    var year = viewDate.year();
    var month = viewDate.month();
    var monthName = this.getLocale().months()[month];

    return _react2.default.createElement(
      'thead',
      null,
      _react2.default.createElement(
        'tr',
        null,
        _react2.default.createElement(
          'th',
          { className: 'rdtPrev', onClick: function onClick() {
              return addTime(-1, 'months');
            } },
          '\u25C0'
        ),
        _react2.default.createElement(
          'th',
          { className: 'rdtSwitch', onClick: function onClick() {
              return showView('months');
            }, colSpan: 5 },
          monthName + ' ' + year
        ),
        _react2.default.createElement(
          'th',
          { className: 'rdtNext', onClick: function onClick() {
              return addTime(1, 'months');
            } },
          '\u25B6'
        )
      ),
      _react2.default.createElement(
        'tr',
        null,
        this.getDaysOfWeek().map(function (day, index) {
          return _react2.default.createElement(
            'th',
            { key: index, className: 'rdtDoW' },
            day
          );
        })
      )
    );
  },
  renderDays: function renderDays() {
    var _this = this;

    var _props2 = this.props,
        viewDate = _props2.viewDate,
        selectedDate = _props2.selectedDate,
        renderDay = _props2.renderDay,
        isValidDate = _props2.isValidDate;

    var startDate = viewDate.clone().subtract(1, 'month').endOf('month').startOf('week');
    var Day = renderDay || defaultRenderDay;
    var today = Date.now();

    var weeks = [0, 1, 2, 3, 4, 5].map(function (week) {
      var days = [0, 1, 2, 3, 4, 5, 6].map(function (day) {
        var date = startDate.clone().add(week * 7 + day, 'days');
        var isActive = selectedDate && date.isSame(selectedDate, 'day');
        var isDisabled = isValidDate && !isValidDate(date.clone(), selectedDate && selectedDate.clone());

        var classes = (0, _classnames2.default)('rdtDay', {
          rdtActive: isActive,
          rdtDisabled: isDisabled,
          rdtToday: date.isSame(today, 'day'),
          rdtOld: date.isBefore(viewDate, 'month'),
          rdtNew: date.isAfter(viewDate, 'month')
        });

        var props = {
          date: date.clone(),
          selectedDate: selectedDate && selectedDate.clone(),
          className: classes,
          onClick: isDisabled ? null : function () {
            return _this.selectDate(date);
          }
        };

        return _react2.default.createElement(Day, _extends({ key: date.dayOfYear() }, props));
      });

      return _react2.default.createElement(
        'tr',
        { key: week },
        days
      );
    });

    return _react2.default.createElement(
      'tbody',
      null,
      weeks
    );
  },
  renderFooter: function renderFooter() {
    var _props3 = this.props,
        timeFormat = _props3.timeFormat,
        selectedDate = _props3.selectedDate,
        viewDate = _props3.viewDate,
        showView = _props3.showView;


    return !timeFormat ? null : _react2.default.createElement(
      'tfoot',
      null,
      _react2.default.createElement(
        'tr',
        null,
        _react2.default.createElement(
          'td',
          { className: 'rdtSwitch', onClick: function onClick() {
              return showView('time');
            }, colSpan: 7 },
          (selectedDate || viewDate).format(timeFormat)
        )
      )
    );
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'rdtDays' },
      _react2.default.createElement(
        'table',
        null,
        this.renderHeading(),
        this.renderDays(),
        this.renderFooter()
      )
    );
  }
});

exports.default = DaysView;
module.exports = exports['default'];