var React = require('react'),
	moment = require('moment')
;

var DOM = React.DOM;
var DateTimePickerDays = React.createClass({

	render: function() {
		var footer = this.renderFooter(),
			date = this.props.viewDate,
			tableChildren
		;

		tableChildren = [
		DOM.thead({}, [
			DOM.tr({},[
				DOM.th({ className: 'prev', onClick: this.props.subtractTime(1, 'months') }, '‹'),
				DOM.th({ className: 'switch', onClick: this.props.showView('months'), colSpan: 5 }, moment.months()[date.month()] + ' ' + date.year() ),
				DOM.th({ className: 'next', onClick: this.props.addTime(1, 'months')}, '›' )
			]),
			DOM.tr({}, moment.weekdaysMin().map( function( day ){ return DOM.th({className: 'dow'}, day) }) )
		]),
		DOM.tbody({}, this.renderDays())
		];

		if( footer )
			tableChildren.push( footer );

		return DOM.div({ className: 'datepicker-days' },
			DOM.table({}, tableChildren )
		);
	},

	renderDays: function() {
		var date = this.props.viewDate,
			selected = this.props.selectedDate,
			prevMonth = date.clone().subtract( 1, 'months' ),
			currentYear = date.year(),
			currentMonth = date.month(),
			selectedDate = {y: selected.year(), M: selected.months(), d: selected.date()},
			minDate = this.props.minDate,
			maxDate = this.props.maxDate,
			weeks = [],
			days = [],
			classes, disabled, dayProps
		;

		// Go to the last week of the previous month
		prevMonth.date( prevMonth.daysInMonth() ).startOf('week');
		var lastDay = prevMonth.clone().add(42, 'd');

		while( prevMonth.isBefore( lastDay ) ){
			classes = 'day';

			if( prevMonth.year() < currentYear || prevMonth.month() < currentMonth )
				classes += ' old';
			else if( prevMonth.year() > currentYear || prevMonth.month() > currentMonth )
				classes += ' new';

			if( prevMonth.isSame( selectedDate ) )
				classes += ' active';

			if (prevMonth.isSame(moment(), 'day') )
				classes += ' today';

			disabled = minDate && prevMonth.isBefore(minDate) || maxDate && prevMonth.isAfter(maxDate);
			if( disabled )
				classes += ' disabled';

			dayProps = { key: prevMonth.format('M_D'), className: classes };
			if( !disabled )
				dayProps.onClick = this.props.updateDate;

			days.push( DOM.td( dayProps, prevMonth.date() ));
			if( days.length == 7 ){
				weeks.push( DOM.tr( {key: prevMonth.format('M_D')}, days ) );
				days = [];
			}

			prevMonth.add( 1, 'd' );
		}

		return weeks;
	},

	renderFooter: function(){
		if( !this.props.timeFormat )
			return '';

		return DOM.tfoot({},
			DOM.tr({},
				DOM.td({ onClick: this.props.showView('time'), colSpan: 7, className: 'timeToggle'}, this.props.selectedDate.format( this.props.timeFormat ))
			)
		);
	}
});

module.exports = DateTimePickerDays;
