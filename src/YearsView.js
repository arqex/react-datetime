'use strict';

var React = require('react'),
	HeaderControls = require('./HeaderControls'),
	utils = require('./utils')
;

var DOM = React.DOM;
var DateTimePickerYears = React.createClass({
	getStartingYear: function() {
		var range = this.getRange();
		return parseInt((this.props.viewDate.year() - 1) / range, 10) * range + 1;
	},

	getRange: function() {
		return this.props.yearColumns * this.props.yearRows;
	},

	render: function() {
		var year = this.getStartingYear();

		return DOM.div(this.props.tabify({ className: 'rdtYears' }), [
			DOM.table({ key: 'a'}, DOM.thead({},
				React.createElement( HeaderControls, {
					key: 'ctrl',
					onPrevClick: this.props.subtractTime(this.getRange(), 'years'),
					onNextClick: this.props.addTime(this.getRange(), 'years'),
					onSwitchClick: this.props.showView('years'),
					switchLabel: year + ' - ' + (year + this.getRange() - 1),
					tabify: this.props.tabify
				}))),
			DOM.table({ key: 'years'}, DOM.tbody({}, this.renderYears( year )))
		]);
	},

	renderYears: function( year ) {
		var years = [],
			i = -1,
			rows = [],
			renderer = this.props.renderYear || this.renderYear,
			selectedDate = this.props.selectedDate,
			viewYear = this.props.viewDate.year(),
			classes, props
		;

		while (i < this.getRange() - 1) {
			var action = { type: 'year', year: year };
			props = this.props.tabify({
				key: year,
				onClick: this.props.updateOn === 'years' ? this.updateSelectedYear.bind(this, action) : this.props.setDate('year', year)
			});

			classes = 'rdtYear';
			if ( viewYear === year ) {
				classes += ' rdtActive';
				if (this.props.open) {
					props.ref = utils.focusInput;
				}
			}

			if ( selectedDate && selectedDate.year() === year )
				classes += ' rdtSelected';

			props.className = classes;

			years.push( renderer( props, year, selectedDate && selectedDate.clone() ));

			if ( years.length === this.props.yearColumns ){
				rows.push( DOM.tr({ key: i }, years ) );
				years = [];
			}

			year++;
			i++;
		}

		return rows;
	},

	updateSelectedYear: function( action, event ) {
		this.props.updateSelectedDate(event, action, true);
	},

	renderYear: function( props, year ){
		return DOM.td( props, year );
	},

	handleKeyDown: function( key ) {
		// TODO: Curry/make nicer
		switch (key) {
			case 'select':
				if (this.props.updateOn === 'years')
					this.updateSelectedYear({ type: 'year', year: this.props.viewDate.year() });
				else
					this.props.setDate('year', this.props.viewDate.year())();
				break;
			case 'prevView':
				this.props.showView('months')();
				break;
			case 'left':
				this.props.subtractTime(1, 'years')();
				break;
			case 'up':
				this.props.subtractTime(this.props.yearColumns, 'years')();
				break;
			case 'right':
				this.props.addTime(1, 'years')();
				break;
			case 'down':
				this.props.addTime(this.props.yearColumns, 'years')();
				break;
			case 'pageup':
				this.props.subtractTime(this.getRange(), 'years')();
				break;
			case 'pagedown':
				this.props.addTime(this.getRange(), 'years')();
				break;
			case 'home':
				this.props.setYear(this.getStartingYear())();
				break;
			case 'end':
				this.props.setYear(this.getStartingYear() + this.getRange() - 1)();
				break;
		}
	}
});

module.exports = DateTimePickerYears;
