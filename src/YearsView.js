'use strict';

var React = require('react');

var DOM = React.DOM;
var DateTimePickerYears = React.createClass({
	renderYears: function( year ) {
		var years = [],
			i = -1,
			rows = [],
			classes
		;

		year--;
		while (i < 11) {
			classes = 'year';
			if( i === -1 | i === 10 )
				classes += ' old';
			if( this.props.selectedDate.year() === year )
				classes += ' active';

			years.push( DOM.td({ key: year, className: classes, onClick: this.props.setDate('year') }, year ));
			// years.push(<td key={year} className={ classes } onClick={this.props.setDate('year')}>{year}</td>);
			if( years.length == 4 ){
				rows.push( DOM.tr({ key: i }, years ) );
				years = [];
			}

			year++;
			i++;
		}
		return rows;
	},
	render: function() {
		var year = parseInt(this.props.viewDate.year() / 10, 10) * 10;

		return DOM.div({ className: 'rdtYears' },[
			DOM.table({ key: 'a'}, DOM.thead({}, DOM.tr({},[
				DOM.th({ key: 'prev', className: 'prev', onClick: this.props.subtractTime(10, 'years') }, '‹'),
				DOM.th({ key: 'year', className: 'switch', onClick: this.props.showView('years'), colSpan: 5 }, year + '-' + (year + 9) ),
				DOM.th({ key: 'next', className: 'next', onClick: this.props.addTime(10, 'years')}, '›' )
				]))),
			DOM.table({ key: 'years'}, DOM.tbody({}, this.renderYears( year )))
		]);
	}
});

module.exports = DateTimePickerYears;
