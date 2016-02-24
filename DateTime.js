'use strict';

var assign = require('object-assign'),
	React = require('react'),
	DaysView = require('./src/DaysView'),
	MonthsView = require('./src/MonthsView'),
	YearsView = require('./src/YearsView'),
	TimeView = require('./src/TimeView'),
	moment = require('moment')
;
var views = ['years', 'months', 'days', 'time'];
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
		closeOnSelect: TYPES.bool,
		onFocus: TYPES.func,
		onBlur: TYPES.func,
		onChange: TYPES.func,
		locale: TYPES.string,
		input: TYPES.bool,
		disabled: TYPES.bool,
		// dateFormat: TYPES.string | TYPES.bool,
		// timeFormat: TYPES.string | TYPES.bool,
		inputProps: TYPES.object,
		viewMode: TYPES.oneOf(views),
		minView: TYPES.oneOf(views),
		isValidDate: TYPES.func,
		isValidMonth: TYPES.func,
		isValidYear: TYPES.func,
		open: TYPES.bool,
		strictParsing: TYPES.bool
	},

	getDefaultProps: function() {
		var nof = function(){};
		return {
			className: '',
			defaultValue: '',
			viewMode: 'days',
			minView: 'time',
			inputProps: {},
			input: true,
			onBlur: nof,
      onFocus: nof,
			onChange: nof,
			timeFormat: true,
			dateFormat: true,
			strictParsing: true,
			disabled: false
		};
	},

	getInitialState: function() {
		var state = this.getStateFromProps( this.props );

		if( state.open == undefined )
			state.open = !this.props.input;
		var minix = views.indexOf(this.props.minView);
		state.currentView = this.props.dateFormat ? (views.indexOf(this.props.viewMode) > minix ? this.props.minView : this.props.viewMode) : 'time';

		return state;
	},

	getStateFromProps: function( props ){
		var formats = this.getFormats( props ),
			date = props.value || props.defaultValue,
			selectedDate, viewDate
		;

		if( date && typeof date == 'string' )
			selectedDate = this.localMoment( date, formats.datetime );
		else if( date )
			selectedDate = this.localMoment( date );

		if( selectedDate && !selectedDate.isValid() )
			selectedDate = null;

		viewDate = selectedDate ?
			selectedDate.clone().startOf("month") :
			this.localMoment().startOf("month")
		;

		return {
			inputFormat: formats.datetime,
			viewDate: viewDate,
			selectedDate: selectedDate,
			inputValue: selectedDate ? selectedDate.format( formats.datetime ) : (date || ''),
			open: props.open != undefined ? props.open : this.state && this.state.open
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

		if( nextProps.value != this.props.value ){
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
		else {
			update.selectedDate = null;
		}

		return this.setState( update, function() {
			return this.props.onChange( localMoment.isValid() ? localMoment : this.state.inputValue );
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

		if( !this.props.value ){
			this.setState({
				selectedDate: date,
				inputValue: date.format( state.inputFormat )
			});
		}
		this.props.onChange( date );
	},
	updateSelectedDate: function( e, close ) {

		var target = e.target,
			modifier = 0,
			viewDate = this.state.viewDate,
			currentDate = this.state.selectedDate || viewDate,
			date,
			className = e.target.className
		;

		var isMonth = className.indexOf('rdtMonth') != -1;
		var isYear = className.indexOf('rdtYear') != -1;
		if(isYear||isMonth) {
			if (!this.props.minView||(isYear&&this.props.minView=='months')) {
				return;
			}
			date = viewDate.clone()
				.year(isYear ? parseInt( target.getAttribute('data-value') ) : viewDate.year())
				.month(isMonth ? parseInt( target.getAttribute('data-value') ): viewDate.month())
				.date(1)
				.hours( currentDate.hours() )
				.minutes( currentDate.minutes() )
				.seconds( currentDate.seconds() )
				.milliseconds( currentDate.milliseconds() );
		}
		else {

			if(className.indexOf("rdtNew") != -1)
				modifier = 1;
			else if(className.indexOf("rdtOld") != -1)
				modifier = -1;

			date = viewDate.clone()
				.month( viewDate.month() + modifier )
				.date( parseInt( target.getAttribute('data-value') ) )
				.hours( currentDate.hours() )
				.minutes( currentDate.minutes() )
				.seconds( currentDate.seconds() )
				.milliseconds( currentDate.milliseconds() );
		}

		this.setState({
			selectedDate: date,
			viewDate: date.clone().startOf('month'),
			inputValue: date.format( this.state.inputFormat )
		}, function () {
			if (this.props.closeOnSelect && close) {
				this.closeCalendar();
			}
		});

		this.props.onChange( date );
	},

	openCalendar: function(e) {
		if(this.props.disabled) {
			return;
		}
		this.setState({ open: true }, function() {
      this.props.onFocus(e);
    });
	},

	closeCalendar: function() {
		this.setState({ open: false });
	},

	handleClickOutside: function(e){
		if( this.props.input && this.state.open && !this.props.open ){
			this.setState({ open: false }, function() {
        this.props.onBlur(this.state.selectedDate || this.state.inputValue , e)
      });
		}
	},
	handleOnBlur: function(e,inputid) {
		if(!e||!inputid) {
			return;
		}
		var ctrl_index = inputid.substr(0,inputid.lastIndexOf('.'));
		if(!e.relatedTarget) {
			return;
		}
		var target_id = e.relatedTarget.dataset['reactid'];
		if(target_id.startsWith(ctrl_index)){
			return
		}
		this.handleClickOutside(e);
	},
	localMoment: function( date, format ){
		var m = moment( date, format, this.props.strictParsing );
		if( this.props.locale )
			m.locale( this.props.locale );
		return m;
	},

	componentProps: {
		fromProps: ['value', 'isValidDate', 'isValidMonth', 'isValidYear', 'renderDay', 'renderMonth', 'renderYear', 'minView'],
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
			className = 'rdt ' + this.props.className,
			children = []
		;

		if( this.props.input ){
			children = [ DOM.input( assign({
				key: 'i',
				type:'text',
				className: 'form-control',
				onFocus: this.openCalendar,
				onChange: this.onInputChange,
        onBlur: this.handleOnBlur,
				value: this.state.inputValue,
				disabled: this.props.disabled
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
