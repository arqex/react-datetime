var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  React.createElement(DateTime, { timeFormat: true }),
  document.getElementById('datetime')
);
ReactDOM.render(
  React.createElement(DateTime, { timeFormat: true, direction: 'up' }),
  document.getElementById('datetime--footer')
);
