'use strict';

var React = require('react'),
moment = require('moment')
;

var DOM = React.DOM;
var DateTimePickerMonths = React.createClass({
	render: function() {
		return DOM.div({ className: 'rdtMonths' },[
			DOM.table({ key: 'a'}, DOM.thead({}, DOM.tr({},[
				DOM.th({ key: 'prev', className: 'rdtPrev' }, DOM.button({onClick: this.props.subtractTime(1, 'years'), tabIndex: -1, type: 'button' }, '‹')),
				DOM.th({ key: 'year', className: 'rdtSwitch', onClick: this.props.showView('years'), colSpan: 2, 'data-value': this.props.viewDate.year()}, this.props.viewDate.year() ),
				DOM.th({ key: 'next', className: 'rdtNext' }, DOM.button({onClick: this.props.addTime(1, 'years'), tabIndex: -1, type: 'button' }, '›'))
			]))),
			DOM.table({ key: 'months'}, DOM.tbody({ key: 'b'}, this.renderMonths()))
		]);
	},

	renderMonths: function() {
		var month = this.props.viewDate.month(),
			year = this.props.viewDate.year(),
			rows = [],
			i = 0,
			months = [],
			renderer = this.props.renderMonth || this.renderMonth,
			isValid = this.props.isValidMonth || this.isValidMonth,
			selected = this.props.selectedDate && this.props.selectedDate.clone(),
			isMinView = this.props.minView === 'months',
			classes, props, disabled
		;

		while (i < 12) {
			classes = "rdtMonth";
			if (selected && i === month && year === selected.year())
				classes += " rdtActive";

			disabled = !isValid(i, year, selected);
				if (disabled)
					classes += ' rdtDisabled';

			props = {
				key: i,
				'data-value': i,
				className: classes
			};

			if (isMinView) {

				if (!disabled)
					props.onClick = this.updateSelectedDate;
			}
			else {
				props.onClick = this.props.setDate('month');
			}

			months.push( renderer( props, i, year, selected ));

			if( months.length == 4 ){
				rows.push( DOM.tr({ key: month + '_' + rows.length }, months) );
				months = [];
			}

			i++;
		}

		return rows;
	},

	updateSelectedDate: function( event ) {
		this.props.updateSelectedDate(event, true);
	},

	renderMonth: function( props, month, year, selectedDate ) {
		return DOM.td( props, this.props.viewDate.localeData()._monthsShort[ month ] );
	},
	isValidMonth: function(){ return 1; }
});

module.exports = DateTimePickerMonths;
