var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  React.createElement(DateTime, {
    viewMode: 'days',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
    defaultValue: new Date(),
    boundaryStart: new Date('2017-02-12T11:21:34+02:00'),
    boundaryEnd: new Date('2017-02-20T11:50:51+02:00')
  }),
  document.getElementById('datetime')
);

