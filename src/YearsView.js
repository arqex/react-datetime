'use strict';

var React = require('react'),
	HeaderControls = require('./HeaderControls')
;

var DOM = React.DOM;
var DateTimePickerYears = React.createClass({
	_getStartingYear: function( year, range ) {
		return parseInt((year - 1) / range, 10) * range + 1;
	},

	_getRange: function() {
		return this.props.yearColumns * this.props.yearRows;
	},

	render: function() {
		var year = this._getStartingYear(this.props.viewDate.year(), this._getRange());

		return DOM.div({ className: 'rdtYears' }, [
			DOM.table({ key: 'a'}, DOM.thead({},
				React.createElement( HeaderControls, {
					key: 'ctrl',
					onPrevClick: this.props.subtractTime(this._getRange(), 'years'),
					onNextClick: this.props.addTime(this._getRange(), 'years'),
					onSwitchClick: this.props.showView('years'),
					switchColspan: 2,
					switchLabel: year + ' - ' + (year + this._getRange() - 1)
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
			classes, props
		;

		while (i < this._getRange() - 1) {
			classes = 'rdtYear';
			if ( selectedDate && selectedDate.year() === year )
				classes += ' rdtActive';

			props = {
				key: year,
				'data-value': year,
				className: classes,
				onClick: this.props.updateOn === 'years' ? this.updateSelectedYear : this.props.setDate('year')
			};

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

	updateSelectedYear: function( event ) {
		this.props.updateSelectedDate(event, true);
	},

	renderYear: function( props, year ){
		return DOM.td( props, year );
	}
});

module.exports = DateTimePickerYears;
