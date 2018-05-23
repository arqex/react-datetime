var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  React.createElement(DateTime, {
    viewDate: DateTime.moment(Date.now()),
    isValidDate: function(current) {
      return current.isBefore(DateTime.moment().startOf('month'));
    }
  }),
  document.getElementById('datetime')
);
