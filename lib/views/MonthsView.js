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

var defaultRenderMonth = function defaultRenderMonth(_ref) {
  var month = _ref.month,
      localeData = _ref.localeData,
      className = _ref.className,
      onClick = _ref.onClick;

  var name = localeData.monthsShort()[month].replace(/\.$/, '');
  return _react2.default.createElement(
    'td',
    { className: className, onClick: onClick },
    name
  );
};

var MonthsView = (0, _createReactClass2.default)({
  displayName: 'MonthsView',

  isValidMonth: function isValidMonth(month) {
    var _props = this.props,
        isValidDate = _props.isValidDate,
        viewDate = _props.viewDate;

    if (!isValidDate) return true;

    var date = viewDate.clone().month(month).startOf('month');
    for (; date.month() === month; date.add(1, 'day')) {
      if (isValidDate(date.clone())) return true;
    }return false;
  },
  selectMonth: function selectMonth(month, year) {
    var _props2 = this.props,
        updateOn = _props2.updateOn,
        updateSelectedDate = _props2.updateSelectedDate,
        setDate = _props2.setDate;


    return updateOn === 'months' ? updateSelectedDate({ year: year, month: month }) : setDate('month', month);
  },
  renderHeading: function renderHeading() {
    var _props3 = this.props,
        viewDate = _props3.viewDate,
        addTime = _props3.addTime,
        showView = _props3.showView;

    var year = viewDate.year();

    return _react2.default.createElement(
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
            { className: 'rdtPrev', onClick: function onClick() {
                return addTime(-1, 'years');
              } },
            '\u25C0'
          ),
          _react2.default.createElement(
            'th',
            { className: 'rdtSwitch', onClick: function onClick() {
                return showView('years');
              }, colSpan: 2 },
            year
          ),
          _react2.default.createElement(
            'th',
            { className: 'rdtNext', onClick: function onClick() {
                return addTime(1, 'years');
              } },
            '\u25B6'
          )
        )
      )
    );
  },
  renderMonths: function renderMonths() {
    var _this = this;

    var _props4 = this.props,
        viewDate = _props4.viewDate,
        selectedDate = _props4.selectedDate,
        renderMonth = _props4.renderMonth;

    var year = viewDate.year();
    var localeData = viewDate.localeData();
    var Month = renderMonth || defaultRenderMonth;

    var rows = [0, 1, 2].map(function (row) {
      var cols = [0, 1, 2, 3].map(function (col) {
        var month = row * 4 + col;
        var isActive = selectedDate && selectedDate.month() === month && selectedDate.year() === year;
        var isDisabled = !_this.isValidMonth(month);

        var classes = (0, _classnames2.default)('rdtMonth', {
          rdtActive: isActive,
          rdtDisabled: isDisabled
        });

        var props = {
          month: month,
          year: year,
          localeData: localeData,
          selectedDate: selectedDate && selectedDate.clone(),
          className: classes,
          onClick: isDisabled ? null : function () {
            return _this.selectMonth(month, year);
          }
        };

        return _react2.default.createElement(Month, _extends({ key: month }, props));
      });

      return _react2.default.createElement(
        'tr',
        { key: row },
        cols
      );
    });

    return _react2.default.createElement(
      'table',
      null,
      _react2.default.createElement(
        'tbody',
        null,
        rows
      )
    );
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'rdtMonths' },
      this.renderHeading(),
      this.renderMonths()
    );
  }
});

exports.default = MonthsView;
module.exports = exports['default'];