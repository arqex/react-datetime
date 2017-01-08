var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');

var Wrapper = React.createClass({
	getInitialState: function() {
		return {
			viewMode: 'time'
		};
	},

	updateView: function(format) {
		console.log('changing viewMode to days');
		this.setState({
			viewMode: 'days'
		});
	},

	componentDidMount: function() {
		setTimeout(this.updateView, 3000);
	},

	render: function() {
		console.log('Current viewmode: ' + this.state.viewMode);
		return React.createElement(DateTime,
            { viewMode: this.state.viewMode, defaultValue: moment() });
	}
});

ReactDOM.render(
  React.createElement(Wrapper),
  document.getElementById('datetime')
);
