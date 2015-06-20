'use strict';

var React = require('react'),
moment = require('moment')
;

var DOM = React.DOM;
var DateTimePickerMonths = React.createClass({
	renderMonths: function() {
		var month = this.props.selectedDate.month(),
			monthsShort = moment.monthsShort(),
			rows = [],
			i = 0,
			months = [],
			classes
		;

		while (i < 12) {
			classes = "month";
			if( i === month && this.props.viewDate.year() === this.props.selectedDate.year() )
				classes += " active";

			months.push( DOM.td( {key: i, className: classes, onClick: this.props.setDate('month') }, monthsShort[ i ] ));
			if( months.length == 4 ){
				rows.push( DOM.tr({}, months) );
				months = [];
			}

			i++;
		}

		return rows;
	},

	render: function() {
		return DOM.div({ className: 'datepicker-months' },[
			DOM.table({ key: 'a'}, DOM.thead({}, DOM.tr({},[
				DOM.th({ key: 'prev', className: 'prev', onClick: this.props.subtractTime(1, 'years') }, '‹'),
				DOM.th({ key: 'year', className: 'switch', onClick: this.props.showView('years'), colSpan: 5 }, this.props.viewDate.year() ),
				DOM.th({ key: 'next', className: 'next', onClick: this.props.addTime(1, 'years')}, '›' )
			]))),
			DOM.table({ key: 'months'}, DOM.tbody({}, this.renderMonths()))
		]);
	}
});

module.exports = DateTimePickerMonths;
