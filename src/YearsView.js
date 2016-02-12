'use strict';

var React = require('react');

var DOM = React.DOM;
var DateTimePickerYears = React.createClass({
	render: function() {
		var year = parseInt(this.props.viewDate.year() / 10, 10) * 10;

		return DOM.div({ className: 'rdtYears' },[
			DOM.table({ key: 'a'}, DOM.thead({}, DOM.tr({},[
				DOM.th({ key: 'prev', className: 'rdtPrev' }, DOM.button({onClick: this.props.subtractTime(10, 'years'), type: 'button' }, '‹')),
				DOM.th({ key: 'year', className: 'rdtSwitch', onClick: this.props.showView('years'), colSpan: 2 }, year + '-' + (year + 9) ),
				DOM.th({ key: 'next', className: 'rdtNext'}, DOM.button({onClick: this.props.addTime(10, 'years'), type: 'button' }, '›'))
				]))),
			DOM.table({ key: 'years'}, DOM.tbody({}, this.renderYears( year )))
		]);
	},

	renderYears: function( year ) {
		var years = [],
			i = -1,
			rows = [],
			selected = this.props.selectedDate && this.props.selectedDate.clone(),
			renderer = this.props.renderYear || this.renderYear,
			isValid = this.props.isValidYear || this.isValidYear,
			isMinView = this.props.minView === 'years',
			classes, props, disabled
		;

		year--;
		while (i < 11) {
			classes = 'rdtYear';
			if( i === -1 | i === 10 )
				classes += ' rdtOld';
			if( selected && selected.year() === year )
				classes += ' rdtActive';

			props = {
				key: year,
				'data-value': year,
				className: classes,
				onClick: this.props.setDate('year')
			};

			if (isMinView) {

				disabled = !isValid(year, selected);
				if (disabled)
					classes += ' rdtDisabled';

				if (!disabled)
					props.onClick = this.updateSelectedDate;
			}
			else {
				props.onClick = this.props.setDate('year');
			}

			years.push( renderer( props, year, selected ));

			if( years.length == 4 ){
				rows.push( DOM.tr({ key: i }, years ) );
				years = [];
			}

			year++;
			i++;
		}

		return rows;
	},

	updateSelectedDate: function( event ) {
		this.props.updateSelectedDate(event, true);
	},

	renderYear: function( props, year, selectedDate ){
		return DOM.td( props, year );
	},
	isValidYear: function(){ return 1; }
});

module.exports = DateTimePickerYears;
