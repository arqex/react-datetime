'use strict';

var assign = require('object-assign'),
	React = require('react'),
	DaysView = require('./src/DaysView'),
	MonthsView = require('./src/MonthsView'),
	YearsView = require('./src/YearsView'),
	TimeView = require('./src/TimeView'),
	moment = require('moment')
;

var KEYS = { 13: 'enter', 27: 'esc', 32: 'space', 33: 'pageup', 34: 'pagedown', 35: 'end', 36: 'home', 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

var TYPES = React.PropTypes;
var Datetime = React.createClass({
	mixins: [
		require('./src/onClickOutside')
	],
	viewComponents: {
		days: DaysView,
		months: MonthsView,
		years: YearsView,
		time: TimeView
	},
	propTypes: {
		// value: TYPES.object | TYPES.string,
		// defaultValue: TYPES.object | TYPES.string,
		onFocus: TYPES.func,
		onBlur: TYPES.func,
		onChange: TYPES.func,
		locale: TYPES.string,
		input: TYPES.bool,
		// dateFormat: TYPES.string | TYPES.bool,
		// timeFormat: TYPES.string | TYPES.bool,
		inputProps: TYPES.object,
		timeConstraints: TYPES.object,
		viewMode: TYPES.oneOf(['years', 'months', 'days', 'time']),
		isValidDate: TYPES.func,
		open: TYPES.bool,
		strictParsing: TYPES.bool,
		closeOnSelect: TYPES.bool,
		closeOnTab: TYPES.bool,
		startingDay: TYPES.number,
		monthColumns: TYPES.number,
		yearColumns: TYPES.number,
		yearRows: TYPES.number
	},

	getDefaultProps: function() {
		var nof = function(){};
		return {
			className: '',
			defaultValue: '',
			inputProps: {},
			input: true,
			onFocus: nof,
			onBlur: nof,
			onChange: nof,
			timeFormat: true,
			timeConstraints: {},
			dateFormat: true,
			strictParsing: true,
			closeOnSelect: false,
			closeOnTab: true,
			monthColumns: 4,
			yearColumns: 4,
			yearRows: 3
		};
	},

	getInitialState: function() {
		var state = this.getStateFromProps( this.props );

		if ( state.open === undefined )
			state.open = !this.props.input;

		state.currentView = this.props.dateFormat ? (this.props.viewMode || state.updateOn || 'days') : 'time';

		return state;
	},

	getStateFromProps: function( props ){
		var formats = this.getFormats( props ),
			date = props.value || props.defaultValue,
			selectedDate, viewDate, updateOn, inputValue
		;

		if ( date && typeof date === 'string' )
			selectedDate = this.localMoment( date, formats.datetime );
		else if ( date )
			selectedDate = this.localMoment( date );

		if ( selectedDate && !selectedDate.isValid() )
			selectedDate = null;

		viewDate = selectedDate ?
			selectedDate.clone().startOf('day') :
			this.localMoment().startOf('day')
		;

		updateOn = this.getUpdateOn(formats);

		if ( selectedDate )
			inputValue = selectedDate.format(formats.datetime);
		else if ( date.isValid && !date.isValid() )
			inputValue = '';
		else
			inputValue = date || '';

		return {
			updateOn: updateOn,
			inputFormat: formats.datetime,
			viewDate: viewDate,
			selectedDate: selectedDate,
			inputValue: inputValue,
			open: props.open
		};
	},

	getUpdateOn: function(formats){
		if ( formats.date.match(/[lLD]/) ){
			return 'days';
		}
		else if ( formats.date.indexOf('M') !== -1 ){
			return 'months';
		}
		else if ( formats.date.indexOf('Y') !== -1 ){
			return 'years';
		}

		return 'days';
	},

	getFormats: function( props ){
		var formats = {
				date: props.dateFormat || '',
				time: props.timeFormat || ''
			},
			locale = this.localMoment( props.date ).localeData()
		;

		if ( formats.date === true ){
			formats.date = locale.longDateFormat('L');
		}
		else if ( this.getUpdateOn(formats) !== 'days' ){
			formats.time = '';
		}

		if ( formats.time === true ){
			formats.time = locale.longDateFormat('LT');
		}

		formats.datetime = formats.date && formats.time ?
			formats.date + ' ' + formats.time :
			formats.date || formats.time
		;

		return formats;
	},

	componentWillReceiveProps: function(nextProps) {
		var formats = this.getFormats( nextProps ),
			update = {}
		;

		if ( nextProps.value !== this.props.value ){
			update = this.getStateFromProps( nextProps );
		}
		if ( formats.datetime !== this.getFormats( this.props ).datetime ) {
			update.inputFormat = formats.datetime;
		}

		if ( update.open === undefined ){
			if ( this.props.closeOnSelect && this.state.currentView !== 'time' ){
				update.open = false;
			}
			else {
				update.open = this.state.open;
			}
		}

		this.setState( update );
	},

	onInputChange: function( e ) {
		var value = e.target === null ? e : e.target.value,
			localMoment = this.localMoment( value, this.state.inputFormat ),
			update = { inputValue: value }
		;

		if ( localMoment.isValid() && !this.props.value ) {
			update.selectedDate = localMoment;
			update.viewDate = localMoment.clone().startOf('day');
		}
		else {
			update.selectedDate = null;
		}

		return this.setState( update, function() {
			return this.props.onChange( localMoment.isValid() ? localMoment : this.state.inputValue );
		});
	},

	onInputKey: function( e ){
		if ( e.which === 9 && this.props.closeOnTab ){
			this.closeCalendar();
		}
	},

	showView: function( view ){
		var me = this;
		return function(){
			me.setState({ currentView: view });
		};
	},

	setDate: function( type, value ){
		var me = this,
			nextViews = {
				month: 'days',
				year: 'months'
			}
		;
		return function(){
			me.setState({
				viewDate: me.state.viewDate.clone()[ type ]( value ),
				currentView: nextViews[ type ]
			});
		};
	},

	addTime: function( amount, type, toSelected ){
		return this.updateTime( 'add', [ amount, type ], toSelected );
	},

	subtractTime: function( amount, type, toSelected ){
		return this.updateTime( 'subtract', [ amount, type ], toSelected );
	},

	startOf: function( type ){
		return this.updateTime( 'startOf', [ type ] );
	},

	endOf: function( type ){
		return this.updateTime( 'endOf', [ type ] );
	},

	setYear: function( year ){
		return this.updateTime( 'year', [ year ] );
	},

	updateTime: function( op, args, toSelected ){
		var me = this;

		return function(){
			var update = {},
				date = toSelected ? 'selectedDate' : 'viewDate',
				newTime = me.state[ date ].clone()
			;

			update[ date ] = newTime[ op ].apply(newTime, args);

			me.setState( update );
		};
	},

	allowedSetTime: ['hours', 'minutes', 'seconds', 'milliseconds'],
	setTime: function( type, value ){
		var index = this.allowedSetTime.indexOf( type ) + 1,
			state = this.state,
			date = (state.selectedDate || state.viewDate).clone(),
			nextType
		;

		// It is needed to set all the time properties
		// to not to reset the time
		date[ type ]( value );
		for (; index < this.allowedSetTime.length; index++) {
			nextType = this.allowedSetTime[index];
			date[ nextType ]( date[nextType]() );
		}

		if ( !this.props.value ){
			this.setState({
				selectedDate: date,
				inputValue: date.format( state.inputFormat )
			});
		}
		this.props.onChange( date );
	},

	updateSelectedDate: function( e, action, close ) {
		var modifier = 0,
			viewDate = this.state.viewDate,
			currentDate = this.state.selectedDate || viewDate,
			date
		;

		if (action.type === 'day'){
			if (action.new)
				modifier = 1;
			else if (action.old)
				modifier = -1;

			date = viewDate.clone()
				.month( viewDate.month() + modifier )
				.date( action.date );
		} else if (action.type === 'month'){
			date = viewDate.clone()
				.month( action.month )
				.date( currentDate.date() );
		} else if (action.type === 'year'){
			date = viewDate.clone()
				.month( currentDate.month() )
				.date( currentDate.date() )
				.year( action.year );
		}

		date.hours( currentDate.hours() )
			.minutes( currentDate.minutes() )
			.seconds( currentDate.seconds() )
			.milliseconds( currentDate.milliseconds() );

		if ( !this.props.value ){
			this.setState({
				selectedDate: date,
				viewDate: date.clone().startOf('day'),
				inputValue: date.format( this.state.inputFormat ),
				open: !(this.props.closeOnSelect && close )
			});
		} else {
			if (this.props.closeOnSelect && close) {
				this.closeCalendar();
			}
		}

		this.props.onChange( date );
	},

	openCalendar: function() {
		if (!this.state.open) {
			this.props.onFocus();
			this.setState({ open: true });
		}
	},

	closeCalendar: function() {
		this.setState({ open: false });
		this.props.onBlur( this.state.selectedDate || this.state.inputValue );
		if (!(this.props.inputProps && this.props.inputProps.readOnly))
			this.inputInstance.focus();
	},

	handleClickOutside: function(){
		if ( this.props.input && this.state.open && !this.props.open ){
			this.setState({ open: false });
			this.props.onBlur( this.state.selectedDate || this.state.inputValue );
		}
	},

	localMoment: function( date, format ){
		var m = moment( date, format, this.props.strictParsing );
		if ( this.props.locale )
			m.locale( this.props.locale );
		return m;
	},

	componentProps: {
		fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear', 'timeConstraints', 'startingDay', 'monthColumns', 'yearColumns', 'yearRows'],
		fromState: ['viewDate', 'selectedDate', 'updateOn', 'open'],
		fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'startOf', 'endOf', 'setYear', 'updateSelectedDate', 'localMoment']
	},

	getComponentProps: function(){
		var me = this,
			formats = this.getFormats( this.props ),
			props = {dateFormat: formats.date, timeFormat: formats.time, ref: this.refView}
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

	refView: function( viewInstance ){
		this.viewInstance = viewInstance;
	},

	refInput: function( inputInstance ){
		this.inputInstance = inputInstance;
	},

	onPickerKey: function( e ){
		var key = KEYS[e.which];

		// TODO: Disabled?
		if (!key || e.shiftKey || e.altKey) { //|| $scope.disabled) {
			return;
		}

		e.preventDefault();
		// TODO: shortcutPropagation option?
		//if (!self.shortcutPropagation)
		e.stopPropagation();

		if (key === 'esc') {
			this.closeCalendar();
			return;
		}

		if (key === 'enter' || key === 'space') {
			key = 'select';
		}
		else if (e.ctrlKey && key === 'up') {
			key = 'nextView';
		}
		else if (e.ctrlKey && key === 'down') {
			key = 'prevView';
		}

		this.viewInstance.handleKeyDown(key, e);
	},

	render: function() {
		var Component = this.viewComponents[ this.state.currentView ],
			DOM = React.DOM,
			className = 'rdt' + (this.props.className ?
									( Array.isArray( this.props.className ) ?
									' ' + this.props.className.join( ' ' ) : ' ' + this.props.className) : ''),
			children = []
		;

		if ( this.props.input ){
			children = [ DOM.input( assign({
				key: 'i',
				ref: this.refInput,
				type:'text',
				className: 'form-control',
				onFocus: this.openCalendar,
				onChange: this.onInputChange,
				onKeyDown: this.onInputKey,
				value: this.state.inputValue
			}, this.props.inputProps ))];
		} else {
			className += ' rdtStatic';
		}

		if ( this.state.open )
			className += ' rdtOpen';

		return DOM.div({className: className}, children.concat(
			DOM.div(
				{ key: 'dt', className: 'rdtPicker', onKeyDown: this.onPickerKey },
				React.createElement( Component, this.getComponentProps())
			)
		));
	}
});

// Make moment accessible through the Datetime class
Datetime.moment = moment;

module.exports = Datetime;
