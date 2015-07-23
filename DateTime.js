'use strict';

require('classlist-polyfill');

var assign = require('object-assign'),
	React = require('react'),
	DaysView = require('./src/DaysView'),
	MonthsView = require('./src/MonthsView'),
	YearsView = require('./src/YearsView'),
	TimeView = require('./src/TimeView'),
	moment = require('moment')
;

var TYPES = React.PropTypes;
var Datetime = React.createClass({
	mixins: [
		require('react-onclickoutside')
	],
	viewComponents: {
		days: DaysView,
		months: MonthsView,
		years: YearsView,
		time: TimeView
	},
	propTypes: {
		value: TYPES.object,
		defaultValue: TYPES.object,
		onBlur: TYPES.func,
		onChange: TYPES.func,
		locale: TYPES.string,
		input: TYPES.bool,
		// dateFormat: TYPES.string | TYPES.bool,
		// timeFormat: TYPES.string | TYPES.bool,
		inputProps: TYPES.object,
		viewMode: TYPES.oneOf(['years', 'months', 'days', 'time']),
		isValidDate: TYPES.func,
		minDate: TYPES.object,
		maxDate: TYPES.object
	},
	getDefaultProps: function() {
		var nof = function(){};
		return {
			className: 'form-control',
			value: false,
			defaultValue: new Date(),
			viewMode: 'days',
			inputProps: {},
			input: true,
			onBlur: nof,
			onChange: nof,
			timeFormat: true,
			dateFormat: true
		};
	},

	getInitialState: function() {
		var state = this.getStateFromProps( this.props );

		state.open = !this.props.input;
		state.currentView = this.props.viewMode;

		return state;
	},

	getStateFromProps: function( props ){
		var formats = this.getFormats( props ),
			date = props.value || props.defaultValue,
			selectedDate
		;

		if( typeof date == 'string')
			selectedDate = this.localMoment( date, formats.datetime );
		else
			selectedDate = this.localMoment( date );

		return {
			inputFormat: formats.datetime,
			viewDate: this.localMoment(date).startOf("month"),
			selectedDate: this.localMoment(date),
			inputValue: this.localMoment(date).format( formats.datetime )
		};
	},

	getFormats: function( props ){
		var formats = {
				date: props.dateFormat || '',
				time: props.timeFormat || ''
			},
			locale = this.localMoment( props.date ).localeData()
		;

		if( formats.date === true ){
			formats.date = locale.longDateFormat('L');
		}
		if( formats.time === true ){
			formats.time = locale.longDateFormat('LT');
		}

		formats.datetime = formats.date + ' ' + formats.time;

		return formats;
	},

	componentWillReceiveProps: function(nextProps) {
		var formats = this.getFormats( nextProps ),
			update = {}
		;

		if( nextProps.value ){
			update = this.getStateFromProps( nextProps );
		}
		if ( formats.datetime !== this.getFormats( this.props ).datetime ) {
			update.inputFormat = formats.datetime;
		}

		this.setState( update );
	},

	onInputChange: function( e ) {
		var value = e.target == null ? e : e.target.value,
			localMoment = this.localMoment( value, this.state.inputFormat ),
			update = { inputValue: value }
		;

		if ( localMoment.isValid() && !this.props.value ) {
			update.selectedDate = localMoment;
			update.viewDate = localMoment.clone().startOf("month");
		}

		return this.setState( update, function() {
			if( localMoment.isValid() )
				return this.props.onChange( localMoment );
		});
	},

	showView: function( view ){
		var me = this;
		return function( e ){
			me.setState({ currentView: view });
		};
	},

	setDate: function( type ){
		var me = this,
			nextViews = {
				month: 'days',
				year: 'months'
			}
		;
		return function( e ){
			me.setState({
				viewDate: me.state.viewDate.clone()[ type ]( parseInt(e.target.getAttribute('data-value')) ).startOf( type ),
				currentView: nextViews[ type ]
			});
		};
	},

	addTime: function( amount, type, toSelected ){
		return this.updateTime( 'add', amount, type, toSelected );
	},

	subtractTime: function( amount, type, toSelected ){
		return this.updateTime( 'subtract', amount, type, toSelected );
	},

	updateTime: function( op, amount, type, toSelected ){
		var me = this;

		return function(){
			var update = {},
				date = toSelected ? 'selectedDate' : 'viewDate'
			;

			update[ date ] = me.state[ date ].clone()[ op ]( amount, type );

			me.setState( update );
		};
	},

	allowedSetTime: ['hours','minutes','seconds', 'milliseconds'],
	setTime: function( type, value ){
		var index = this.allowedSetTime.indexOf( type ) + 1,
			date = this.state.selectedDate.clone(),
			nextType
		;

		// It is needed to set all the time properties
		// to not to reset the time
		date[ type ]( value );
		for (; index < this.allowedSetTime.length; index++) {
			nextType = this.allowedSetTime[index];
			date[ nextType ]( date[nextType]() );
		}

		if( !this.props.value ){
			this.setState({
				selectedDate: date,
				inputValue: date.format( this.state.inputFormat )
			});
		}
		this.props.onChange( date );
	},

	updateSelectedDate: function( e ) {
		var target = e.target,
			modifier = 0,
			currentDate = this.state.selectedDate,
			date
		;

		if(target.className.indexOf("new") != -1)
			modifier = 1;
		else if(target.className.indexOf("old") != -1)
			modifier = -1;

		date = this.state.viewDate.clone()
			.month( this.state.viewDate.month() + modifier )
			.date( parseInt( target.getAttribute('data-value') ) )
			.hours( currentDate.hours() )
			.minutes( currentDate.minutes() )
			.seconds( currentDate.seconds() )
			.milliseconds( currentDate.milliseconds() )
		;

		if( !this.props.value ){
			this.setState({
				selectedDate: date,
				viewDate: date.clone().startOf('month'),
				inputValue: date.format( this.state.inputFormat )
			});
		}

		this.props.onChange( date );
	},

	openCalendar: function() {
		this.setState({ open: true });
	},

	handleClickOutside: function(){
		this.props.onBlur( this.state.selectedDate );
		if( this.props.input && this.state.open )
			this.setState({ open: false });
	},

	localMoment: function( date, format ){
		var m = moment( date, format );
		if( this.props.locale )
			m.locale( this.props.locale );
		return m;
	},

	componentProps: {
		fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear'],
		fromState: ['viewDate', 'selectedDate' ],
		fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'updateSelectedDate', 'localMoment']
	},

	getComponentProps: function(){
		var me = this,
			formats = this.getFormats( this.props ),
			props = {dateFormat: formats.date, timeFormat: formats.time}
		;

		this.componentProps.fromProps.forEach( function( name ){
			props[ name ] = me.props[ name ];
		});
		this.componentProps.fromState.forEach( function( name ){
			props[ name ] = me.state[ name ];
		});
		this.componentProps.fromThis.forEach( function( name ){
			props[ name ] = me[ name ];
		});

		return props;
	},

	render: function() {
		var Component = this.viewComponents[ this.state.currentView ],
			DOM = React.DOM,
			className = 'rdt',
			children = []
		;

		if( this.props.input ){
			children = [ DOM.input( assign({
				key: 'i',
				type:'text',
				className: 'form-control',
				onFocus: this.openCalendar,
				onChange: this.onInputChange,
				value: this.state.inputValue
			}, this.props.inputProps ))];
		}
		else {
			className += ' rdtStatic';
		}

		if( this.state.open )
			className += ' rdtOpen';

		return DOM.div({className: className}, children.concat(
			DOM.div(
				{ key: 'dt', className: 'rdtPicker' },
				React.createElement( Component, this.getComponentProps())
			)
		));
	}
});

// Make moment accessible through the Datetime class
Datetime.moment = moment;

module.exports = Datetime;
