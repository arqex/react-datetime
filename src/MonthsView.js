'use strict';

var React = require('react'),
	HeaderControls = require('./HeaderControls'),
	utils = require('./utils')
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
			var action = { type: 'month', month: i };
			props = {
				key: i,
				onClick: this.props.updateOn === 'months'? this.updateSelectedMonth.bind(this, action) : this.props.setDate('month', i)
			};

			classes = 'rdtMonth';
			if ( i === month ) {
				classes += ' rdtActive';
				if (this.props.open) {
					props.ref = utils.focusInput;
				}
			}

			if ( date && i === date.month() && year === date.year() )
				classes += ' rdtSelected';

			props.className = classes;

			months.push( renderer( props, i, year, date && date.clone() ));

			if ( months.length === this.props.monthColumns ){
				rows.push( DOM.tr({ key: month + '_' + rows.length }, months) );
				months = [];
			}

			i++;
		}

		return rows;
	},

	updateSelectedMonth: function( action, event ) {
		this.props.updateSelectedDate(event, action, true);
	},

	renderMonth: function( props, month ) {
		var months = this.props.viewDate.localeData()._months,
			buttonProps = { onClick: props.onClick, ref: props.ref }
		;
		return DOM.td({ key: props.key, className: props.className }, DOM.button( buttonProps, months.standalone
			? capitalize( months.standalone[ month ] )
			: months[ month ]
		));
	},

	handleKeyDown: function( key ) {
		// TODO: Curry/make nicer
		switch (key) {
			case 'select':
				if (this.props.updateOn === 'months')
					this.updateSelectedMonth({ type: 'month', month: this.props.viewDate.month() });
				else
					this.props.setDate('month', this.props.viewDate.month())();
				break;
			case 'nextView':
				this.props.showView('years')();
				break;
			case 'prevView':
				this.props.showView('days')();
				break;
			case 'left':
				this.props.subtractTime(1, 'months')();
				break;
			case 'up':
				this.props.subtractTime(this.props.monthColumns, 'months')();
				break;
			case 'right':
				this.props.addTime(1, 'months')();
				break;
			case 'down':
				this.props.addTime(this.props.monthColumns, 'months')();
				break;
			case 'pageup':
				this.props.subtractTime(1, 'years')();
				break;
			case 'pagedown':
				this.props.addTime(1, 'years')();
				break;
			case 'home':
				this.props.startOf('year')();
				break;
			case 'end':
				this.props.endOf('year')();
				break;
		}
	}
});

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = DateTimePickerMonths;
