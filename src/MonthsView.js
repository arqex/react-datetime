'use strict';

var React = require('react'),
	HeaderControls = require('./HeaderControls')
;

var DOM = React.DOM;
var DateTimePickerMonths = React.createClass({
	render: function() {
		return DOM.div({ className: 'rdtMonths' }, [
			DOM.table({ key: 'a'}, DOM.thead({},
				React.createElement( HeaderControls, {
					key: 'ctrl',
					onPrevClick: this.props.subtractTime(1, 'years'),
					onNextClick: this.props.addTime(1, 'years'),
					onSwitchClick: this.props.showView('years'),
					switchColspan: 2,
					switchValue: this.props.viewDate.year(),
					switchLabel: this.props.viewDate.year()
				}))),
			DOM.table({ key: 'months'}, DOM.tbody({ key: 'b'}, this.renderMonths()))
		]);
	},

	renderMonths: function() {
		var date = this.props.selectedDate,
			month = this.props.viewDate.month(),
			year = this.props.viewDate.year(),
			rows = [],
			i = 0,
			months = [],
			renderer = this.props.renderMonth || this.renderMonth,
			classes, props
		;

		while (i < 12) {
			classes = 'rdtMonth';
			if ( date && i === month && year === date.year() )
				classes += ' rdtActive';

			props = {
				key: i,
				'data-value': i,
				className: classes,
				onClick: this.props.updateOn === 'months'? this.updateSelectedMonth : this.props.setDate('month')
			};

			months.push( renderer( props, i, year, date && date.clone() ));

			if ( months.length === this.props.monthColumns ){
				rows.push( DOM.tr({ key: month + '_' + rows.length }, months) );
				months = [];
			}

			i++;
		}

		return rows;
	},

	updateSelectedMonth: function( event ) {
		this.props.updateSelectedDate(event, true);
	},

	renderMonth: function( props, month ) {
		var months = this.props.viewDate.localeData()._months;
		return DOM.td( props, months.standalone
			? capitalize( months.standalone[ month ] )
			: months[ month ]
		);
	}
});

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = DateTimePickerMonths;
