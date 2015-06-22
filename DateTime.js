'use strict';

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
		date: TYPES.object,
		onChange: TYPES.func,
		locale: TYPES.string,
		input: TYPES.bool,
		dateFormat: TYPES.string,
		timeFormat: TYPES.string,
		inputProps: TYPES.object,
		viewMode: TYPES.oneOf(['years', 'months', 'days', 'time']),
		minDate: TYPES.object,
		maxDate: TYPES.object
	},
	getDefaultProps: function() {

		return {
			date: new Date(),
			viewMode: 'days',
			inputProps: {},
			input: true,
			onChange: function (x) {
				console.log(x);
			}
		};
	},
	getInitialState: function() {
		var formats = this.getFormats( this.props ),
			date = this.props.date
		;
		return {
			currentView: this.props.viewMode,
			open: !this.props.input,
			inputFormat: formats.datetime,
			viewDate: this.localMoment(date).startOf("month"),
			selectedDate: this.localMoment(date),
			inputValue: this.localMoment(date).format( formats.datetime )
		};
	},

	getFormats: function( props ){
		var formats = {
				date: '',
				time: '',
				datetime: ''
			},
			locale = this.localMoment( props.date ).localeData()
		;

		if( props.dateFormat ){
			formats.date = props.dateFormat;
		}
		if( props.timeFormat ){
			formats.time = props.timeFormat;
		}

		if( !formats.date && !formats.time ){
			formats.date = locale.longDateFormat('L');
			formats.time = locale.longDateFormat('LT');
			formats.datetime = formats.date + ' ' + formats.time;
		}
		else {
			if( props.dateFormat ){
				formats.date = props.dateFormat;
				formats.datetime = formats.date;
			}
			if( props.timeFormat ){
				if( formats.date )
					formats.datetime += ' ';
				formats.time = props.timeFormat;
				formats.datetime += formats.time;
			}
		}

		return formats;
	},

	componentWillReceiveProps: function(nextProps) {
		var formats = this.getFormats( nextProps );
		if ( formats.datetime !== this.getFormats(this.props).datetime ) {
			return this.setState({
				inputFormat: nextProps.inputFormat
			});
		}
	},

	onChange: function(event) {
		var value = event.target == null ? event : event.target.value,
			localMoment = this.localMoment( date )
		;

		if (localMoment.isValid()) {
			this.setState({
				selectedDate: localMoment,
				viewDate: localMoment.clone().startOf("month")
			});
		}

		return this.setState({
			inputValue: value
		}, function() {
			return this.props.onChange( localMoment.toDate() );
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
				viewDate: me.state.viewDate.clone()[ type ]( e.target.innerHTML ).startOf( type ),
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

		this.setState({
			selectedDate: date,
			inputValue: date.format( this.state.inputFormat )
		}, this.callOnChange );
	},

	callOnChange: function(){
		this.props.onChange(this.state.selectedDate.format( this.state.inputFormat ));
	},

	updateDate: function( e ) {
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
			.date( parseInt( target.innerHTML ) )
			.hours( currentDate.hours() )
			.minutes( currentDate.minutes() )
			.seconds( currentDate.seconds() )
			.milliseconds( currentDate.milliseconds() )
		;

		this.setState({
			selectedDate: date,
			viewDate: date.clone().startOf('month'),
			inputValue: date.format( this.state.inputFormat )
		});
	},

	openCalendar: function() {
		this.setState({ open: true });
	},

	handleClickOutside: function(){
		if( this.props.input && this.state.open )
			this.setState({ open: false });
	},

	localMoment: function( date ){
		var m = moment( date );
		if( this.props.locale )
			m.locale( this.props.locale );
		return m;
	},

	componentProps: {
		fromProps: ['viewMode', 'minDate', 'maxDate'],
		fromState: ['viewDate', 'selectedDate' ],
		fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'updateDate', 'localMoment']
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
				className:'form-control',
				onFocus: this.openCalendar,
				onChange: this.onChange,
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

module.exports = Datetime;
