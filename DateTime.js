'use strict';

var assign = require('object-assign'),
	moment = require('moment'),
	React = require('react'),
	DaysView = require('./src/DaysView'),
	MonthsView = require('./src/MonthsView'),
	YearsView = require('./src/YearsView'),
	TimeView = require('./src/TimeView')
;

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
		utc: TYPES.bool,
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
		closeOnTab: TYPES.bool

		// boundaryStart: TYPES.object | TYPES.string,
		// boundaryEnd: TYPES.object | TYPES.string,
	},

	allowedSetTime: ['hours', 'minutes', 'seconds', 'milliseconds'],

	timeConstraints: {
		hours: {
			min: 0,
			max: 23,
			step: 1
		},
		minutes: {
			min: 0,
			max: 59,
			step: 1
		},
		seconds: {
			min: 0,
			max: 59,
			step: 1
		},
		milliseconds: {
			min: 0,
			max: 999,
			step: 1
		}
	},

	componentProps: {
		fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear'],
		fromState: ['viewDate', 'selectedDate', 'updateOn', 'boundaryStart', 'boundaryEnd'],
		fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'updateSelectedDate', 'localMoment', 'isValidTime', 'getNextValidTime', 'timeConstraints', 'pad']
	},

	getDefaultProps: function() {
		var nof = function() {};
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
			utc: false,

			boundaryStart: undefined,
			boundaryEnd: undefined
		};
	},

	getInitialState: function() {
		var state = this.getStateFromProps( this.props );

		if ( state.open === undefined )
			state.open = !this.props.input;

		state.currentView = this.props.dateFormat ? (this.props.viewMode || state.updateOn || 'days') : 'time';

		return state;
	},

	getStateFromProps: function( props ) {
		var formats = this.getFormats( props ),
			date = props.value || props.defaultValue,
			selectedDate, viewDate, updateOn, inputValue,
			boundaryStart = moment(props.boundaryStart).isValid 
				? moment(props.boundaryStart)
				: this.getDefaultProps().boundaryStart,
			boundaryEnd = moment(props.boundaryEnd).isValid
				? moment(props.boundaryEnd)
				: this.getDefaultProps().boundaryEnd
		;

		if ( date && typeof date === 'string' )
			selectedDate = this.localMoment( date, formats.datetime );
		else if ( date )
			selectedDate = this.localMoment( date );

		if ( selectedDate && !selectedDate.isValid() )
			selectedDate = null;

		viewDate = selectedDate ?
			selectedDate.clone().startOf('month') :
			this.localMoment().startOf('month')
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
			open: props.open,

			boundaryStart: boundaryStart,
			boundaryEnd: boundaryEnd
		};
	},

	getUpdateOn: function( formats ) {
		if ( formats.date.match(/[lLD]/) ) {
			return 'days';
		}
		else if ( formats.date.indexOf('M') !== -1 ) {
			return 'months';
		}
		else if ( formats.date.indexOf('Y') !== -1 ) {
			return 'years';
		}

		return 'days';
	},

	getFormats: function( props ) {
		var formats = {
				date: props.dateFormat || '',
				time: props.timeFormat || ''
			},
			locale = this.localMoment( props.date, null, props ).localeData()
		;

		if ( formats.date === true ) {
			formats.date = locale.longDateFormat('L');
		}
		else if ( this.getUpdateOn(formats) !== 'days' ) {
			formats.time = '';
		}

		if ( formats.time === true ) {
			formats.time = locale.longDateFormat('LT');
		}

		formats.datetime = formats.date && formats.time ?
			formats.date + ' ' + formats.time :
			formats.date || formats.time
		;

		return formats;
	},

	componentWillMount: function () {
		this.calcTimeConstraints();
	},

	componentWillReceiveProps: function( nextProps ) {
		var formats = this.getFormats( nextProps ),
			updatedState = {}
		;

		this.calcTimeConstraints();

		if ( nextProps.value !== this.props.value ||
			formats.datetime !== this.getFormats( this.props ).datetime ) {
			updatedState = this.getStateFromProps( nextProps );
		}

		if ( updatedState.open === undefined ) {
			if ( this.props.closeOnSelect && this.state.currentView !== 'time' ) {
				updatedState.open = false;
			} else {
				updatedState.open = this.state.open;
			}
		}

		if ( nextProps.viewMode !== this.props.viewMode ) {
			updatedState.currentView = nextProps.viewMode;
		}

		if ( nextProps.locale !== this.props.locale ) {
			if ( this.state.viewDate ) {
				var updatedViewDate = this.state.viewDate.clone().locale( nextProps.locale );
				updatedState.viewDate = updatedViewDate;
			}
			if ( this.state.selectedDate ) {
				var updatedSelectedDate = this.state.selectedDate.clone().locale( nextProps.locale );
				updatedState.selectedDate = updatedSelectedDate;
				updatedState.inputValue = updatedSelectedDate.format( formats.datetime );
			}
		}

		if ( nextProps.utc !== this.props.utc ) {
			if ( nextProps.utc ) {
				if ( this.state.viewDate )
					updatedState.viewDate = this.state.viewDate.clone().utc();
				if ( this.state.selectedDate ) {
					updatedState.selectedDate = this.state.selectedDate.clone().utc();
					updatedState.inputValue = updatedState.selectedDate.format( formats.datetime );
				}
			} else {
				if ( this.state.viewDate )
					updatedState.viewDate = this.state.viewDate.clone().local();
				if ( this.state.selectedDate ) {
					updatedState.selectedDate = this.state.selectedDate.clone().local();
					updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
				}
			}
		}

		this.setState( updatedState );
	},

	calcTimeConstraints: function () {
		var me = this;
		this.allowedSetTime.forEach( function( type ) {
			assign(me.timeConstraints[ type ], me.props.timeConstraints[ type ]);
		});
	},

	onInputChange: function( e ) {
		var value = e.target === null ? e : e.target.value,
			localMoment = this.localMoment( value, this.state.inputFormat ),
			update = { inputValue: value }
		;

		if ( localMoment.isValid() && !this.props.value ) {
			update.selectedDate = localMoment;
			update.viewDate = localMoment.clone().startOf('month');
		}
		else {
			update.selectedDate = null;
		}

		return this.setState( update, function() {
			return this.props.onChange( localMoment.isValid() ? localMoment : this.state.inputValue );
		});
	},

	onInputBlur: function() {
		var selectedDate = (this.state.selectedDate || this.state.viewDate).clone();

		if ( !this.state.open && !this.isValidTime( selectedDate, this.state.boundaryStart, this.state.boundaryEnd )) {
			selectedDate = this.getNextValidDate( selectedDate, this.state.boundaryStart, this.state.boundaryEnd );
			selectedDate = this.getNextValidTime( selectedDate, this.state.boundaryStart, this.state.boundaryEnd );

			this.setState({
				selectedDate: selectedDate,
				inputValue: selectedDate.format( this.state.inputFormat )
			});
		}

		this.props.onChange( selectedDate );
	},

	onInputKey: function( e ) {
		if ( e.which === 9 && this.props.closeOnTab ) {
			this.closeCalendar();
		}
	},

	showView: function( view ) {
		var me = this;
		return function() {
			me.setState({ currentView: view });
		};
	},

	setDate: function( type ) {
		var me = this,
			nextViews = {
				month: 'days',
				year: 'months'
			}
		;
		return function( e ) {
			me.setState({
				viewDate: me.state.viewDate.clone()[ type ]( parseInt(e.target.getAttribute('data-value'), 10) ).startOf( type ),
				currentView: nextViews[ type ]
			});
		};
	},

	addTime: function( amount, type, toSelected ) {
		return this.updateTime( 'add', amount, type, toSelected );
	},

	subtractTime: function( amount, type, toSelected ) {
		return this.updateTime( 'subtract', amount, type, toSelected );
	},

	updateTime: function( op, amount, type, toSelected ) {
		var me = this;

		return function() {
			var update = {},
				date = toSelected ? 'selectedDate' : 'viewDate'
			;

			update[ date ] = me.state[ date ].clone()[ op ]( amount, type );

			me.setState( update );
		};
	},

	setTime: function( type, value ) {
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

		if ( !this.props.value ) {
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
			date
    ;

		if (target.className.indexOf('rdtDay') !== -1) {
			if (target.className.indexOf('rdtNew') !== -1)
				modifier = 1;
			else if (target.className.indexOf('rdtOld') !== -1)
				modifier = -1;

			date = viewDate.clone()
				.month( viewDate.month() + modifier )
				.date( parseInt( target.getAttribute('data-value'), 10 ) );
		} else if (target.className.indexOf('rdtMonth') !== -1) {
			date = viewDate.clone()
				.month( parseInt( target.getAttribute('data-value'), 10 ) )
				.date( currentDate.date() );
		} else if (target.className.indexOf('rdtYear') !== -1) {
			date = viewDate.clone()
				.month( currentDate.month() )
				.date( currentDate.date() )
				.year( parseInt( target.getAttribute('data-value'), 10 ) );
		}

		this.updateTimeOfSelectedDate( date, currentDate );

		if ( !this.props.value ) {
			var open = !( this.props.closeOnSelect && close );
			if ( !open ) {
				this.props.onBlur( date );
			}

			this.setState({
				selectedDate: date,
				viewDate: date.clone().startOf('month'),
				inputValue: date.format( this.state.inputFormat ),
				open: open
			});
		} else {
			if ( this.props.closeOnSelect && close ) {
				this.closeCalendar();
			}
		}

		this.props.onChange( date );
	},

	updateTimeOfSelectedDate: function ( date, currentDate ) {
		var validDateTime = date.clone()
			.hours( currentDate.hours() )
			.minutes( currentDate.minutes() )
			.seconds( currentDate.seconds() )
			.milliseconds( currentDate.milliseconds() )
			;

		if ( !this.isValidTime( validDateTime, this.state.boundaryStart, this.state.boundaryEnd ) ) {
			validDateTime = this.getNextValidTime( validDateTime, this.state.boundaryStart, this.state.boundaryEnd );
		}

		date.hours( validDateTime.hours() )
			.minutes( validDateTime.minutes() )
			.seconds( validDateTime.seconds() )
			.milliseconds( validDateTime.milliseconds() )
			;
	},

	isValidTime: function ( updateDateTime, minDateTime, maxDateTime ) {
		var isValid = true;

		if ( typeof minDateTime === 'undefined' && typeof maxDateTime === 'undefined' ) {
			return isValid;
		}

		if ( typeof minDateTime !== 'undefined' ) {
			isValid = updateDateTime.isSameOrAfter( minDateTime );
		} 
		
		if ( typeof minDateTime !== 'undefined' ) {
			isValid = isValid && updateDateTime.isSameOrBefore( maxDateTime );
		}

		return isValid;
	},

	getNextValidDate: function ( updateDateTime, minDateTime, maxDateTime ) {
		if ( typeof minDateTime === 'undefined' && typeof maxDateTime === 'undefined' ) {
			return updateDateTime;
		} else if ( typeof minDateTime !== 'undefined' && updateDateTime.isBefore( minDateTime, 'days' )) {
			return updateDateTime
				.year( minDateTime.year() )
				.month( minDateTime.month() )
				.date( minDateTime.date() )
				;
		} else if ( typeof minDateTime !== 'undefined' && updateDateTime.isAfter( maxDateTime, 'days' )) {
			return updateDateTime
				.year( maxDateTime.year() )
				.month( maxDateTime.month() )
				.date( maxDateTime.date() )
				;
		} else {
			return updateDateTime;
		}
	},

	getNextValidTime: function ( updateDateTime, minDateTime, maxDateTime ) {
		var isConstrained = false;

		if ( typeof minDateTime !== 'undefined' && minDateTime.isSame( updateDateTime, 'days' )) {
			// hours
			if ( updateDateTime.hours() < minDateTime.hours() ) {
				if ( updateDateTime.hours() + this.timeConstraints.hours.step === minDateTime.hours() ) {
					updateDateTime.hours( this.timeConstraints.hours.max );
					isConstrained = false;
				} else {
					updateDateTime.hours( minDateTime.hours() );
					isConstrained = true;
				}
			} else {
				isConstrained = updateDateTime.hours() === minDateTime.hours();
			}

			// minutes
			if ( isConstrained && updateDateTime.minutes() < minDateTime.minutes() ) {
				if ( updateDateTime.minutes() + this.timeConstraints.minutes.step === minDateTime.minutes() ) {
					updateDateTime.minutes( this.timeConstraints.minutes.max );
					isConstrained = false;
				} else {
					updateDateTime.minutes( minDateTime.minutes() );
					isConstrained = true;
				}
			} else {
				isConstrained = isConstrained && updateDateTime.minutes() === minDateTime.minutes();
			}

			// seconds
			if (isConstrained && updateDateTime.seconds() < minDateTime.seconds() ) {
				if ( updateDateTime.seconds() + this.timeConstraints.seconds.step === minDateTime.seconds() ) {
					updateDateTime.seconds( this.timeConstraints.seconds.max );
					isConstrained = false;
				} else {
					updateDateTime.seconds( minDateTime.seconds() );
					isConstrained = true;
				}
			} else {
				isConstrained = isConstrained && updateDateTime.seconds() === minDateTime.seconds();
			}

			// milliseconds
			if (isConstrained && updateDateTime.milliseconds() < minDateTime.milliseconds() ) {
				if ( updateDateTime.milliseconds() + this.timeConstraints.seconds.step === minDateTime.milliseconds() ) {
					updateDateTime.milliseconds( this.timeConstraints.milliseconds.max );
				} else {
					updateDateTime.milliseconds( minDateTime.milliseconds() );
				}
			}
		}

		if (typeof maxDateTime !== 'undefined' && maxDateTime.isSame( updateDateTime, 'days' )) {
			isConstrained = false;

			// hours
			if ( updateDateTime.hours() > maxDateTime.hours() ) {
				if ( updateDateTime.hours() - this.timeConstraints.hours.step === maxDateTime.hours() ) {
					updateDateTime.hours( this.timeConstraints.hours.min );
					isConstrained = false;
				} else {
					updateDateTime.hours( maxDateTime.hours() );
					isConstrained = true;
				}
			} else {
				isConstrained = updateDateTime.hours() === maxDateTime.hours();
			}

			// minutes
			if ( isConstrained && updateDateTime.minutes() > maxDateTime.minutes() ) {
				if ( updateDateTime.minutes() - this.timeConstraints.minutes.step === maxDateTime.minutes() ) {
					updateDateTime.minutes( this.timeConstraints.minutes.min );
					isConstrained = false;
				} else {
					updateDateTime.minutes( maxDateTime.minutes() );
					isConstrained = true;
				}
			} else {
				isConstrained = isConstrained && updateDateTime.minutes() === maxDateTime.minutes();
			}

			// seconds
			if ( isConstrained && updateDateTime.seconds() > maxDateTime.seconds() ) {
				if ( updateDateTime.seconds() - this.timeConstraints.seconds.step === maxDateTime.seconds() ) {
					updateDateTime.seconds( this.timeConstraints.seconds.min );
					isConstrained = false;
				} else {
					updateDateTime.seconds( maxDateTime.seconds() );
					isConstrained = true;
				}
			} else {
				isConstrained = isConstrained && updateDateTime.seconds() === maxDateTime.seconds();
			}

			// milliseconds
			if ( isConstrained && updateDateTime.milliseconds() > maxDateTime.milliseconds() ) {
				if ( updateDateTime.milliseconds() - this.timeConstraints.seconds.step === maxDateTime.milliseconds() ) {
					updateDateTime.milliseconds( this.timeConstraints.milliseconds.min );
				} else {
					updateDateTime.milliseconds( maxDateTime.milliseconds() );
				}
			}
		}

		return updateDateTime;
	},

	openCalendar: function() {
		if (!this.state.open) {
			this.setState({ open: true }, function() {
				this.props.onFocus();
			});
		}
	},

	closeCalendar: function() {
		this.setState({ open: false }, function () {
			this.props.onBlur( this.state.selectedDate || this.state.inputValue );
		});
	},

	handleClickOutside: function() {
		if ( this.props.input && this.state.open && !this.props.open ) {
			this.setState({ open: false }, function() {
				this.props.onBlur( this.state.selectedDate || this.state.inputValue );
			});
		}
	},

	localMoment: function( date, format, props ) {
		props = props || this.props;
		var momentFn = props.utc ? moment.utc : moment;
		var m = momentFn( date, format, props.strictParsing );
		if ( props.locale )
			m.locale( props.locale );
		return m;
	},

	getComponentProps: function() {
		var me = this,
			formats = this.getFormats( this.props ),
			props = {dateFormat: formats.date, timeFormat: formats.time}
		;

		this.componentProps.fromProps.forEach( function( name ) {
			props[ name ] = me.props[ name ];
		});
		this.componentProps.fromState.forEach( function( name ) {
			props[ name ] = me.state[ name ];
		});
		this.componentProps.fromThis.forEach( function( name ) {
			props[ name ] = me[ name ];
		});

		return props;
	},

	render: function() {
		var Component = this.viewComponents[ this.state.currentView ],
			DOM = React.DOM,
			className = 'rdt' + (this.props.className ?
                  ( Array.isArray( this.props.className ) ?
                  ' ' + this.props.className.join( ' ' ) : ' ' + this.props.className) : ''),
			children = []
		;

		if ( this.props.input ) {
			children = [ DOM.input( assign({
				key: 'i',
				type: 'text',
				className: 'form-control',
				onFocus: this.openCalendar,
				onBlur: this.onInputBlur,
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
				{ key: 'dt', className: 'rdtPicker' },
				React.createElement( Component, this.getComponentProps())
			)
		));
	}
});

// Make moment accessible through the Datetime class
Datetime.moment = moment;

module.exports = Datetime;
