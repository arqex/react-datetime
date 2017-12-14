var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
	React.createElement(DateTime, {
		viewMode: 'days',
		dateFormat: 'MM/DD/YY',
		showTodayButton: true
	}),
	document.getElementById('datetime')
);
