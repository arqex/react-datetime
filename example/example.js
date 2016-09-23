var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');

var options = {
  timeFormat: false,
  monthColumns: 3,
  yearColumns: 5,
  yearRows: 4
};

ReactDOM.render(
  //React.createElement(DateTime, { timeFormat: true }),
  React.createElement(DateTime, options),
  document.getElementById('datetime')
);
