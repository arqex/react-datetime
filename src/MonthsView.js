'use strict';

var React = require('react');

var DOM = React.DOM;
var DateTimePickerMonths = React.createClass({
	render: function() {
		return DOM.div({ className: 'rdtMonths' }, [
			DOM.table({ key: 'a'}, DOM.thead({}, DOM.tr({}, [
				DOM.th({ key: 'prev', className: 'rdtPrev' }, DOM.span({onClick: this.props.subtractTime(1, 'years')}, '‹')),
				DOM.th({ key: 'year', className: 'rdtSwitch', onClick: this.props.showView('years'), colSpan: 2, 'data-value': this.props.viewDate.year()}, this.props.viewDate.year() ),
				DOM.th({ key: 'next', className: 'rdtNext' }, DOM.span({onClick: this.props.addTime(1, 'years')}, '›'))
			]))),
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
			isValid = this.props.isValidDate || this.isValidDate,
			classes, props
		;

		while (i < 12) {
			classes = 'rdtMonth';
			var currentMonth = this.props.viewDate.clone().set({ year: year, month: i, date: 1 });
			var days = Array.from({ length: currentMonth.endOf('month').format('D') }, function(e, i) {
				return i + 1;
			});
			var validDay = days.find(function(d) {
				var day = currentMonth.clone().set('date', d);
				return isValid(day);
			});
			var disabled = validDay === undefined;

			if ( disabled )
				classes += ' rdtDisabled';

			if ( date && i === month && year === date.year() )
				classes += ' rdtActive';

			props = {
				key: i,
				'data-value': i,
				className: classes
			};

			if ( !disabled )
				props.onClick = this.props.updateOn === 'months'? this.updateSelectedMonth : this.props.setDate('month');

			months.push( renderer( props, i, year, date && date.clone() ));

			if ( months.length === 4 ){
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
		var monthsShort = this.props.viewDate.localeData()._monthsShort;
		return DOM.td( props, monthsShort.standalone
			? capitalize( monthsShort.standalone[ month ] )
			: monthsShort[ month ]
		);
	},
	isValidDate: function(){
		return 1;
	}
});

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = DateTimePickerMonths;
