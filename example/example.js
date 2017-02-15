var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');

var boundaryStart = '2017-02-12T11:21:34';
var boundaryEnd = '2017-02-20T11:21:34';

ReactDOM.render(
  React.createElement(DateTime, {
    viewMode: 'days',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
    value: new Date(),
    boundaryStart: boundaryStart,
    boundaryEnd: boundaryEnd,
    isValidDate: function(currentDate) {
      return currentDate.isSameOrAfter(boundaryStart, 'day') 
      && currentDate.isSameOrBefore(boundaryEnd, 'day');
    }
  }),
  document.getElementById('datetime')
);

