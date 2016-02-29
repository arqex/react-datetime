var DateTime = require('../DateTime.js');
var React = require('react');

React.render(
  React.createElement(DateTime, { timeFormat: true }),
  document.getElementById('datetime')
);
