'use strict';

var React = require('react'),
	DaysView = require('./DaysView'),
	MonthsView = require('./MonthsView'),
	YearsView = require('./YearsView'),
	TimeView = require('./TimeView')
	;

class CalendarContainer extends React.Component {
	constructor(props) {
		super(props);
		this.viewComponents = {
			days: DaysView,
			months: MonthsView,
			years: YearsView,
			time: TimeView
		};
	}

	render() {
		return React.createElement( this.viewComponents[ this.props.view ], this.props.viewProps );
	}
}

module.exports = CalendarContainer;
