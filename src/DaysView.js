'use strict';

var React = require('react'),
	moment = require('moment'),
	HeaderControls = require('./HeaderControls'),
	utils = require('./utils')
;

var DOM = React.DOM;
var DateTimePickerDays = React.createClass({
	render: function() {
		var footer = this.renderFooter(),
			date = this.props.viewDate,
			locale = date.localeData(),
			renderer = this.props.renderDayHeader || this.renderDayHeader,
			tableChildren
		;

		tableChildren = [
			DOM.thead({ key: 'th'}, [
				React.createElement( HeaderControls, {
					key: 'ctrl',
					onPrevClick: this.props.subtractTime(1, 'months'),
					onNextClick: this.props.addTime(1, 'months'),
					onSwitchClick: this.props.showView('months'),
					switchColspan: 5,
					switchValue: this.props.viewDate.month(),
					switchLabel: locale.months( date ) + ' ' + date.year(),
					tabify: this.props.tabify
				}),
				DOM.tr({ key: 'd'}, this.getDaysOfWeek( locale ).map( function( day, index ){ return renderer({ key: day + index, className: 'dow'}, day ); }) )
			]),
			DOM.tbody({key: 'tb'}, this.renderDays())
		];

		if ( footer )
			tableChildren.push( footer );

		return DOM.div(this.props.tabify({ className: 'rdtDays' }),
			DOM.table({}, tableChildren )
		);
	},

	/**
	 * Get a list of the days of the week
	 * depending on the current locale
	 * @return {array} A list with the shortname of the days
	 */
	getDaysOfWeek: function( locale ){
		var days = locale._weekdaysMin,
			first = this.firstDayOfWeek(),
			dow = [],
			i = 0
		;

		days.forEach( function( day ){
			dow[ (7 + (i++) - first) % 7 ] = day;
		});

		return dow;
	},

	firstDayOfWeek: function(){
		return this.props.startingDay == null
			? this.props.viewDate.localeData().firstDayOfWeek()
			: this.props.startingDay;
	},

	setToLastWeekInMonth: function(date){
		var firstDayOfWeek = this.firstDayOfWeek(),
			lastDay = date.endOf('month'),
			sub
		;
		if (lastDay.day() >= firstDayOfWeek)
			sub = lastDay.day() - firstDayOfWeek;
		else
			sub = lastDay.day() + (7 - firstDayOfWeek);
		lastDay.subtract(sub, 'days');
	},

	renderDayHeader: function(props, day) {
		return DOM.th( props, day );
	},

	renderDays: function() {
		var date = this.props.viewDate,
			selected = this.props.selectedDate && this.props.selectedDate.clone(),
			prevMonth = date.clone().subtract( 1, 'months' ),
			currentYear = date.year(),
			currentMonth = date.month(),
			weeks = [],
			days = [],
			renderer = this.props.renderDay || this.renderDay,
			isValid = this.props.isValidDate || this.isValidDate,
			classes, disabled, dayProps, currentDate
		;

		this.setToLastWeekInMonth(prevMonth);
		var lastDay = prevMonth.clone().add(42, 'd');

		while ( prevMonth.isBefore( lastDay ) ){
			var action = { type: 'day', date: prevMonth.date() };
			dayProps = this.props.tabify({ key: prevMonth.format('M_D') });
			classes = 'rdtDay';
			currentDate = prevMonth.clone();

			if ( ( prevMonth.year() === currentYear && prevMonth.month() < currentMonth ) || ( prevMonth.year() < currentYear ) ) {
				classes += ' rdtOld';
				action.old = true;
			}
			else if ( ( prevMonth.year() === currentYear && prevMonth.month() > currentMonth ) || ( prevMonth.year() > currentYear ) ) {
				classes += ' rdtNew';
				action.new = true;
			}

			if ( prevMonth.isSame(date, 'day') ) {
				classes += ' rdtActive';
				if (this.props.open) {
					dayProps.ref = utils.focusInput;
				}
			}

			if ( selected && prevMonth.isSame(selected, 'day') )
				classes += ' rdtSelected';

			if (prevMonth.isSame(moment(), 'day') )
				classes += ' rdtToday';

			disabled = !isValid( currentDate, selected );
			if ( disabled )
				classes += ' rdtDisabled';

			dayProps.className = classes;

			// TODO: Button component with action as prop instead of bound click handler?
			if ( !disabled )
				dayProps.onClick = this.updateSelectedDate.bind(this, action);

			days.push( renderer( dayProps, currentDate, selected ) );

			if ( days.length === 7 ){
				weeks.push( DOM.tr( {key: prevMonth.format('M_D')}, days ) );
				days = [];
			}

			prevMonth.add( 1, 'd' );
		}

		return weeks;
	},

	updateSelectedDate: function( action, event ) {
		this.props.updateSelectedDate(event, action, true);
	},

	renderDay: function( props, currentDate ){
		return DOM.td( props, currentDate.format('DD') );
	},

	renderFooter: function(){
		if ( !this.props.timeFormat )
			return '';

		var date = this.props.selectedDate || this.props.viewDate;

		return DOM.tfoot({ key: 'tf'},
			DOM.tr({},
				DOM.td(this.props.tabify({ colSpan: 7, onClick: this.props.showView('time'), className: 'rdtTimeToggle'}), date.format( this.props.timeFormat ))
			)
		);
	},

	handleKeyDown: function( key ){
		// TODO: Curry/make nicer
		switch (key) {
			case 'select':
				this.updateSelectedDate({ type: 'day', date: this.props.viewDate.date() });
				break;
			case 'nextView':
				this.props.showView('months')();
				break;
			case 'left':
				this.props.subtractTime(1, 'days')();
				break;
			case 'up':
				this.props.subtractTime(1, 'weeks')();
				break;
			case 'right':
				this.props.addTime(1, 'days')();
				break;
			case 'down':
				this.props.addTime(1, 'weeks')();
				break;
			case 'pageup':
				this.props.subtractTime(1, 'months')();
				break;
			case 'pagedown':
				this.props.addTime(1, 'months')();
				break;
			case 'home':
				this.props.startOf('month')();
				break;
			case 'end':
				this.props.endOf('month')();
				break;
		}
	},

	isValidDate: function(){ return 1; }
});

module.exports = DateTimePickerDays;
