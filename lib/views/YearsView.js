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

var defaultRenderYear = function defaultRenderYear(_ref) {
  var year = _ref.year,
      className = _ref.className,
      onClick = _ref.onClick;
  return _react2.default.createElement(
    'td',
    { className: className, onClick: onClick },
    year
  );
};

var YearsView = (0, _createReactClass2.default)({
  displayName: 'YearsView',

  isValidYear: function isValidYear(year) {
    var _props = this.props,
        isValidDate = _props.isValidDate,
        viewDate = _props.viewDate;

    if (!isValidDate) return true;

    var date = viewDate.clone().year(year).startOf('year');
    for (; date.year() === year; date.add(1, 'day')) {
      if (isValidDate(date.clone())) return true;
    }return false;
  },
  selectYear: function selectYear(year) {
    var _props2 = this.props,
        updateOn = _props2.updateOn,
        updateSelectedDate = _props2.updateSelectedDate,
        setDate = _props2.setDate;


    return updateOn === 'years' ? updateSelectedDate({ year: year }) : setDate('year', year);
  },
  renderHeading: function renderHeading(startYear) {
    var addTime = this.props.addTime;


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
                return addTime(-10, 'years');
              } },
            '\u25C0'
          ),
          _react2.default.createElement(
            'th',
            { className: 'rdtSwitch', colSpan: 2 },
            startYear,
            '-',
            startYear + 9
          ),
          _react2.default.createElement(
            'th',
            { className: 'rdtNext', onClick: function onClick() {
                return addTime(10, 'years');
              } },
            '\u25B6'
          )
        )
      )
    );
  },
  renderYears: function renderYears(startYear) {
    var _this = this;

    var _props3 = this.props,
        selectedDate = _props3.selectedDate,
        renderYear = _props3.renderYear;

    var Year = renderYear || defaultRenderYear;

    var rows = [0, 1, 2].map(function (row) {
      var cols = [0, 1, 2, 3].map(function (col) {
        var index = row * 4 + col;
        var year = startYear + index - 1;
        var isActive = selectedDate && selectedDate.year() === year;
        var isDisabled = !_this.isValidYear(year);

        var classes = (0, _classnames2.default)('rdtYear', {
          rdtActive: isActive,
          rdtDisabled: isDisabled,
          rdtOld: year < startYear,
          rdtNew: year > startYear + 9
        });

        var props = {
          year: year,
          selectedDate: selectedDate && selectedDate.clone(),
          className: classes,
          onClick: isDisabled ? null : function () {
            return _this.selectYear(year);
          }
        };

        return _react2.default.createElement(Year, _extends({ key: col }, props));
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
    var startYear = Math.floor(this.props.viewDate.year() / 10) * 10;

    return _react2.default.createElement(
      'div',
      { className: 'rdtYears' },
      this.renderHeading(startYear),
      this.renderYears(startYear)
    );
  }
});

exports.default = YearsView;
module.exports = exports['default'];