var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');
var createClass = require('create-react-class');
var moment = require('moment');

var Wrapper = createClass({
	getInitialState: function() {
		return {
			dateFormat: 'YYYY-MM-DD'
		};
	},

	updateFormat: function(format) {
		console.log('changing state');
		this.setState({
			dateFormat: 'DD.MM.YYYY'
		});
	},

	componentDidMount: function() {
		setTimeout(this.updateFormat, 2000);
	},

	render: function() {
		return React.createElement(DateTime,
			{ dateFormat: this.state.dateFormat, timeFormat: false, defaultValue: moment() });
	}
});

ReactDOM.render(
	React.createElement(Wrapper),
	document.getElementById('datetime')
);
