var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');

var boundaryStart = '2017-02-12T11:21:34';
var boundaryEnd = '2017-02-20T12:23:27';

ReactDOM.render(
  React.createElement(DateTime, {
    viewMode: 'days',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
    defaultValue: new Date(),
    boundaryStart: boundaryStart,
    boundaryEnd: boundaryEnd,
    isValidDate: function(currentDate) {
      return currentDate.isSameOrAfter(boundaryStart, 'day') 
      && currentDate.isSameOrBefore(boundaryEnd, 'day');
    }
  }),
  document.getElementById('datetime')
);

