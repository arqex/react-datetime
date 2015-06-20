'use strict';

var assign = require('object-assign'),
	React = require('react'),
	DaysView = require('./src/DaysView'),
	MonthsView = require('./src/MonthsView'),
	YearsView = require('./src/YearsView'),
	TimeView = require('./src/TimeView'),
	moment = require('moment')
;

var Constants = {
    MODE_DATE: 'date',
    MODE_DATETIME: 'datetime',
    MODE_TIME: 'time'
};

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
		date: React.PropTypes.string,
		onChange: React.PropTypes.func,
		dateFormat: React.PropTypes.string,
		timeFormat: React.PropTypes.string,
		inputProps: React.PropTypes.object,
		defaultText: React.PropTypes.string,
		viewMode: React.PropTypes.oneOf(['years', 'months', 'days', 'time']),
		minDate: React.PropTypes.object,
		maxDate: React.PropTypes.object
	},
	getDefaultProps: function() {

		return {
			date: false,
			viewMode: 'days',
			inputProps: {},
			onChange: function (x) {
				console.log(x);
			}
		};
	},
	getInitialState: function() {
		var formats = this.getFormats( this.props ),
			date = this.props.date || new Date()
		;
		return {
			currentView: this.props.viewMode,
			inputFormat: formats.datetime,
			widgetStyle: {
				display: 'block',
				position: 'absolute',
				left: -9999,
				zIndex: '9999 !important'
			},
			viewDate: moment(date).startOf("month"),
			selectedDate: moment(date),
			inputValue: typeof this.props.defaultText != 'undefined' ?  this.props.defaultText : moment(date).format( formats.datetime )
		};
	},

	getFormats: function( props ){
		var formats = {
			date: '',
			time: '',
			datetime: ''
		};

		if( props.dateFormat ){
			formats.date = props.dateFormat;
		}
		if( props.timeFormat ){
			formats.time = props.timeFormat;
		}

		if( !formats.date && !formats.time ){
			formats.date = 'MM/DD/YY';
			formats.time = 'H:mm';
			formats.datetime = 'MM/DD/YY H:mm';
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
		var value = event.target == null ? event : event.target.value;
		if (moment(value).isValid()) {
			this.setState({
				selectedDate: moment(value),
				viewDate: moment(value).startOf("month")
			});
		}

		return this.setState({
			inputValue: value
		}, function() {
			return this.props.onChange(moment(this.state.inputValue, this.state.inputFormat, true).format( this.state.inputFormat ));
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
		var styles = {
			display: 'block',
			position: 'absolute'
		}
		;

		this.setState({
			widgetStyle: styles,
			widgetClasses: 'dropdown-menu bottom',
			showPicker: true
		});
	},

	handleClickOutside: function(){
		this.setState({
			showPicker: false,
			widgetStyle: { display: 'none' }
		});
	},

	componentProps: {
		fromProps: ['viewMode', 'minDate', 'maxDate'],
		fromState: ['viewDate', 'selectedDate' ],
		fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'updateDate']
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
			inputProps = assign({
				type:'text',
				className:'form-control',
				onFocus: this.openCalendar,
				onChange: this.onChange,
				value: this.state.inputValue
			}, this.props.inputProps ),
			DOM = React.DOM
		;

		return DOM.div({className: 'datetimePicker'}, [
			DOM.input( inputProps ),
			DOM.div( {className: this.state.widgetClasses, style: this.state.widgetStyle },
				React.createElement( Component, this.getComponentProps() )
			)
		]);
	}
});

module.exports = Datetime;
