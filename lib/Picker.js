Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Picker = (0, _createReactClass2.default)({
  displayName: 'Picker',

  handleClickOutside: function handleClickOutside() {
    if (this.props.onClickOutside) this.props.onClickOutside();
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'rdtPicker' },
      this.props.children
    );
  }
});

exports.default = (0, _reactOnclickoutside2.default)(Picker);
module.exports = exports['default'];