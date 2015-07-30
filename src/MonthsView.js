'use strict';

var React = require('react'),
moment = require('moment')
;

var DOM = React.DOM;
var DateTimePickerMonths = React.createClass({
	render: function() {
		return DOM.div({ className: 'rdtMonths' },[
			DOM.table({ key: 'a'}, DOM.thead({}, DOM.tr({},[
				DOM.th({ key: 'prev', className: 'prev' }, DOM.button({onClick: this.props.subtractTime(1, 'years'), type: 'button' }, '‹')),
				DOM.th({ key: 'year', className: 'switch', onClick: this.props.showView('years'), colSpan: 2, 'data-value': this.props.viewDate.year()}, this.props.viewDate.year() ),
				DOM.th({ key: 'next', className: 'next' }, DOM.button({onClick: this.props.addTime(1, 'years'), type: 'button' }, '›'))
			]))),
			DOM.table({ key: 'months'}, DOM.tbody({ key: 'b'}, this.renderMonths()))
		]);
	},

	renderMonths: function() {
		var date = this.props.selectedDate,
			month = date.month(),
			year = this.props.viewDate.year(),
			rows = [],
			i = 0,
			months = [],
			renderer = this.props.renderMonth || this.renderMonth,
			classes, props
		;

		while (i < 12) {
			classes = "month";
			if( i === month && year === date.year() )
				classes += " active";

			props = {
				key: i,
				'data-value': i,
				className: classes,
				onClick: this.props.setDate('month')
			};

			months.push( renderer( props, i, year, date.clone() ));

			if( months.length == 4 ){
				rows.push( DOM.tr({ key: month + '_' + rows.length }, months) );
				months = [];
			}

			i++;
		}

		return rows;
	},

	renderMonth: function( props, month, year, selectedDate ) {
		return DOM.td( props, selectedDate.localeData()._monthsShort[ month ] );
	}
});

module.exports = DateTimePickerMonths;
