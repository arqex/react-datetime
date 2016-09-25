var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');

var now =  moment([2015,1,14,15,25,50,125]);
var timeC = {
	minTime: now
}

ReactDOM.render(
  React.createElement(DateTime, { timeFormat: true, value:now, timeConstraints: timeC }),
  document.getElementById('datetime')
);
