var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  React.createElement(DateTime, {
    viewMode: 'months',
    dateFormat: 'MMMM',
    isValidDate: function(current){
      var yesterday = DateTime.moment().subtract(1, 'day');
      return current.isAfter(yesterday);
    }
  }),
  document.getElementById('datetime')
);
