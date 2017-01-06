var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');
var DatepickerContainer = require('./DatepickerContainer');

ReactDOM.render(
  React.createElement(DatepickerContainer, {
    viewMode: 'months',
    dateFormat: 'MMMM',
    closeOnSelect: true,
    isValidDate: function(current){
      return current.isBefore(DateTime.moment().startOf('month'));
    }
  }),
  document.getElementById('datetime')
);
