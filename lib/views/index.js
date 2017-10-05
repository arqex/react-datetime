Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DaysView = require('./DaysView');

var _DaysView2 = _interopRequireDefault(_DaysView);

var _MonthsView = require('./MonthsView');

var _MonthsView2 = _interopRequireDefault(_MonthsView);

var _YearsView = require('./YearsView');

var _YearsView2 = _interopRequireDefault(_YearsView);

var _TimeView = require('./TimeView');

var _TimeView2 = _interopRequireDefault(_TimeView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  days: _DaysView2.default,
  months: _MonthsView2.default,
  years: _YearsView2.default,
  time: _TimeView2.default
};
module.exports = exports['default'];