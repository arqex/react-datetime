'use strict';

var React = require('react');

var DOM = React.DOM;
var DateTimePickerYears = React.createClass({
	render: function() {
		var year = parseInt(this.props.viewDate.year() / 10, 10) * 10;

		return DOM.div({ className: 'rdtYears' },[
			DOM.table({ key: 'a'}, DOM.thead({}, DOM.tr({},[
				DOM.th({ key: 'prev', className: 'prev' }, DOM.button({onClick: this.props.subtractTime(10, 'years'), type: 'button' }, '‹')),
				DOM.th({ key: 'year', className: 'switch', onClick: this.props.showView('years'), colSpan: 2 }, year + '-' + (year + 9) ),
				DOM.th({ key: 'next', className: 'next'}, DOM.button({onClick: this.props.addTime(10, 'years'), type: 'button' }, '›'))
				]))),
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

		year--;
		while (i < 11) {
			classes = 'year';
			if( i === -1 | i === 10 )
				classes += ' old';
			if( selectedDate && selectedDate.year() === year )
				classes += ' active';

			props = {
				key: year,
				'data-value': year,
				className: classes,
				onClick: this.props.setDate('year')
			};

			years.push( renderer( props, year, selectedDate && selectedDate.clone() ));

			if( years.length == 4 ){
				rows.push( DOM.tr({ key: i }, years ) );
				years = [];
			}

			year++;
			i++;
		}

		return rows;
	},

	renderYear: function( props, year, selectedDate ){
		return DOM.td( props, year );
	}
});

module.exports = DateTimePickerYears;
