var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');
window.Perf = require('react-addons-perf');

ReactDOM.render(
  React.createElement(DateTime, { timeFormat: true }),
  document.getElementById('datetime')
);
