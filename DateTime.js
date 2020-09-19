'use strict';

var assign = require('object-assign'),
	PropTypes = require('prop-types'),
	moment = require('moment'),
	React = require('react'),
	CalendarContainer = require('./src/CalendarContainer'),
	onClickOutside = require('react-onclickoutside').default
	;

var viewModes = Object.freeze({
	YEARS: 'years',
	MONTHS: 'months',
	DAYS: 'days',
	TIME: 'time',
});

var TYPES = PropTypes;

class Datetime extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'DateTime';
		this.parseDate = this.parseDate.bind(this);
		this.getStateFromProps = this.getStateFromProps.bind(this);
		this.getUpdateOn = this.getUpdateOn.bind(this);
		this.getFormats = this.getFormats.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onInputKey = this.onInputKey.bind(this);
		this.showView = this.showView.bind(this);
		this.setDate = this.setDate.bind(this);
		this.subtractTime = this.subtractTime.bind(this);
		this.addTime = this.addTime.bind(this);
		this.updateTime = this.updateTime.bind(this);
		this.allowedSetTime = ['hours', 'minutes', 'seconds', 'milliseconds'];
		this.setTime = this.setTime.bind(this);
		this.updateSelectedDate = this.updateSelectedDate.bind(this);
		this.openCalendar = this.openCalendar.bind(this);
		this.closeCalendar = this.closeCalendar.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.localMoment = this.localMoment.bind(this);
		this.checkTZ = this.checkTZ.bind(this);
		this.componentProps = {
			fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear', 'timeConstraints'],
			fromState: ['viewDate', 'selectedDate', 'updateOn'],
			fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'updateSelectedDate', 'localMoment', 'handleClickOutside']
		};
		this.getComponentProps = this.getComponentProps.bind(this);
		this.overrideEvent = this.overrideEvent.bind(this);

		this.checkTZ( this.props );
		
		this.state = this.getStateFromProps( this.props );

		if ( this.state.open === undefined )
			this.state.open = !this.props.input;

		this.state.currentView = this.props.dateFormat ?
			(this.props.viewMode || this.state.updateOn || viewModes.DAYS) : viewModes.TIME;
	}

	parseDate(date, formats) {
		var parsedDate;

		if (date && typeof date === 'string')
			parsedDate = this.localMoment(date, formats.datetime);
		else if (date)
			parsedDate = this.localMoment(date);

		if (parsedDate && !parsedDate.isValid())
			parsedDate = null;

		return parsedDate;
	}

	getStateFromProps( props ) {
		var formats = this.getFormats( props ),
			date = props.value || props.defaultValue,
			selectedDate, viewDate, updateOn, inputValue
			;

		selectedDate = this.parseDate(date, formats);

		viewDate = this.parseDate(props.viewDate, formats);

		viewDate = selectedDate ?
			selectedDate.clone().startOf('month') :
			viewDate ? viewDate.clone().startOf('month') : this.localMoment().startOf('month');

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
	}

	getUpdateOn( formats ) {
		if ( formats.date.match(/[lLD]/) ) {
			return viewModes.DAYS;
		} else if ( formats.date.indexOf('M') !== -1 ) {
			return viewModes.MONTHS;
		} else if ( formats.date.indexOf('Y') !== -1 ) {
			return viewModes.YEARS;
		}

		return viewModes.DAYS;
	}

	getFormats( props ) {
		var formats = {
				date: props.dateFormat || '',
				time: props.timeFormat || ''
			},
			locale = this.localMoment( props.date, null, props ).localeData()
			;

		if ( formats.date === true ) {
			formats.date = locale.longDateFormat('L');
		}
		else if ( this.getUpdateOn(formats) !== viewModes.DAYS ) {
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
	}

	componentWillReceiveProps( nextProps ) {
		var formats = this.getFormats( nextProps ),
			updatedState = {}
		;

		if ( nextProps.value !== this.props.value ||
			formats.datetime !== this.getFormats( this.props ).datetime ) {
			updatedState = this.getStateFromProps( nextProps );
		}

		if ( updatedState.open === undefined ) {
			if ( typeof nextProps.open !== 'undefined' ) {
				updatedState.open = nextProps.open;
			} else if ( this.props.closeOnSelect && this.state.currentView !== viewModes.TIME ) {
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

		if ( nextProps.utc !== this.props.utc || nextProps.displayTimeZone !== this.props.displayTimeZone ) {
			if ( nextProps.utc ) {
				if ( this.state.viewDate )
					updatedState.viewDate = this.state.viewDate.clone().utc();
				if ( this.state.selectedDate ) {
					updatedState.selectedDate = this.state.selectedDate.clone().utc();
					updatedState.inputValue = updatedState.selectedDate.format( formats.datetime );
				}
			} else if ( nextProps.displayTimeZone ) {
				if ( this.state.viewDate )
					updatedState.viewDate = this.state.viewDate.clone().tz(nextProps.displayTimeZone);
				if ( this.state.selectedDate ) {
					updatedState.selectedDate = this.state.selectedDate.clone().tz(nextProps.displayTimeZone);
					updatedState.inputValue = updatedState.selectedDate.tz(nextProps.displayTimeZone).format( formats.datetime );
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

		if ( nextProps.viewDate !== this.props.viewDate ) {
			updatedState.viewDate = moment(nextProps.viewDate);
		}

		this.checkTZ( nextProps );

		this.setState( updatedState );
	}

	onInputChange( e ) {
		var value = e.target === null ? e : e.target.value,
			localMoment = this.localMoment( value, this.state.inputFormat ),
			update = { inputValue: value }
			;

		if ( localMoment.isValid() && !this.props.value ) {
			update.selectedDate = localMoment;
			update.viewDate = localMoment.clone().startOf('month');
		} else {
			update.selectedDate = null;
		}

		return this.setState( update, function() {
			return this.props.onChange( localMoment.isValid() ? localMoment : this.state.inputValue );
		});
	}

	onInputKey( e ) {
		if ( e.which === 9 && this.props.closeOnTab ) {
			this.closeCalendar();
		}
	}

	showView( view ) {
		var me = this;
		return function() {
			me.state.currentView !== view && me.props.onViewModeChange( view );
			me.setState({ currentView: view });
		};
	}

	setDate( type ) {
		var me = this,
			nextViews = {
				month: viewModes.DAYS,
				year: viewModes.MONTHS,
			}
		;
		return function( e ) {
			me.setState({
				viewDate: me.state.viewDate.clone()[ type ]( parseInt(e.target.getAttribute('data-value'), 10) ).startOf( type ),
				currentView: nextViews[ type ]
			});
			me.props.onViewModeChange( nextViews[ type ] );
		};
	}

	subtractTime( amount, type, toSelected ) {
		var me = this;
		return function() {
			me.props.onNavigateBack( amount, type );
			me.updateTime( 'subtract', amount, type, toSelected );
		};
	}

	addTime( amount, type, toSelected ) {
		var me = this;
		return function() {
			me.props.onNavigateForward( amount, type );
			me.updateTime( 'add', amount, type, toSelected );
		};
	}

	updateTime( op, amount, type, toSelected ) {
		var update = {},
			date = toSelected ? 'selectedDate' : 'viewDate';

		update[ date ] = this.state[ date ].clone()[ op ]( amount, type );

		this.setState( update );
	}

	setTime( type, value ) {
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
	}

	updateSelectedDate( e, close ) {
		var target = e.currentTarget,
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

		date.hours( currentDate.hours() )
			.minutes( currentDate.minutes() )
			.seconds( currentDate.seconds() )
			.milliseconds( currentDate.milliseconds() );

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
	}

	openCalendar( e ) {
		if ( !this.state.open ) {
			this.setState({ open: true }, function() {
				this.props.onFocus( e );
			});
		}
	}

	closeCalendar() {
		this.setState({ open: false }, function () {
			this.props.onBlur( this.state.selectedDate || this.state.inputValue );
		});
	}

	handleClickOutside() {
		if ( this.props.input && this.state.open && this.props.open === undefined && !this.props.disableCloseOnClickOutside ) {
			this.setState({ open: false }, function() {
				this.props.onBlur( this.state.selectedDate || this.state.inputValue );
			});
		}
	}

	localMoment( date, format, props ) {
		props = props || this.props;
		var m = null;

		if (props.utc) {
			m = moment.utc(date, format, props.strictParsing);
		} else if (props.displayTimeZone) {
			m = moment.tz(date, format, props.displayTimeZone);
		} else {
			m = moment(date, format, props.strictParsing);
		}

		if ( props.locale )
			m.locale( props.locale );
		return m;
	}

	checkTZ( props ) {
		var con = console;

		if ( props.displayTimeZone && !this.tzWarning && !moment.tz ) {
			this.tzWarning = true;
			con && con.error('react-datetime: displayTimeZone prop with value "' + props.displayTimeZone +  '" is used but moment.js timezone is not loaded.');
		}
	}

	getComponentProps() {
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
	}

	overrideEvent( handler, action ) {
		if ( !this.overridenEvents ) {
			this.overridenEvents = {};
		}

		if ( !this.overridenEvents[handler] ) {
			var me = this;
			this.overridenEvents[handler] = function( e ) {
				var result;
				if ( me.props.inputProps && me.props.inputProps[handler] ) {
					result = me.props.inputProps[handler]( e );
				}
				if ( result !== false ) {
					action( e );
				}
			};
		}

		return this.overridenEvents[handler];
	}

	render() {
		// TODO: Make a function or clean up this code,
		// logic right now is really hard to follow
		var className = 'rdt' + (this.props.className ?
									( Array.isArray( this.props.className ) ?
									' ' + this.props.className.join( ' ' ) : ' ' + this.props.className) : ''),
			children = [];

		if ( this.props.input ) {
			var finalInputProps = assign(
				{ type: 'text', className: 'form-control', value: this.state.inputValue },
				this.props.inputProps,
				{
					onClick: this.overrideEvent( 'onClick', this.openCalendar ),
					onFocus: this.overrideEvent( 'onFocus', this.openCalendar ),
					onChange: this.overrideEvent( 'onChange', this.onInputChange ),
					onKeyDown: this.overrideEvent( 'onKeyDown', this.onInputKey ),
				}
			);

			if ( this.props.renderInput ) {
				children = [ React.createElement('div', { key: 'i' }, this.props.renderInput( finalInputProps, this.openCalendar, this.closeCalendar )) ];
			} else {
				children = [ React.createElement('input', assign({ key: 'i' }, finalInputProps ))];
			}
		} else {
			className += ' rdtStatic';
		}

		if ( this.props.open || (this.props.open === undefined && this.state.open ) )
			className += ' rdtOpen';

		return React.createElement( ClickableWrapper, {className: className, onClickOut: this.handleClickOutside}, children.concat(
			React.createElement( 'div',
				{ key: 'dt', className: 'rdtPicker' },
				React.createElement( CalendarContainer, { view: this.state.currentView, viewProps: this.getComponentProps() })
			)
		));
	}
}
Datetime.propTypes = {
	// value: TYPES.object | TYPES.string,
	// defaultValue: TYPES.object | TYPES.string,
	// viewDate: TYPES.object | TYPES.string,
	onFocus: TYPES.func,
	onBlur: TYPES.func,
	onChange: TYPES.func,
	onViewModeChange: TYPES.func,
	onNavigateBack: TYPES.func,
	onNavigateForward: TYPES.func,
	locale: TYPES.string,
	utc: TYPES.bool,
	displayTimeZone: TYPES.string,
	input: TYPES.bool,
	// dateFormat: TYPES.string | TYPES.bool,
	// timeFormat: TYPES.string | TYPES.bool,
	inputProps: TYPES.object,
	timeConstraints: TYPES.object,
	viewMode: TYPES.oneOf([viewModes.YEARS, viewModes.MONTHS, viewModes.DAYS, viewModes.TIME]),
	isValidDate: TYPES.func,
	open: TYPES.bool,
	strictParsing: TYPES.bool,
	closeOnSelect: TYPES.bool,
	closeOnTab: TYPES.bool
};

var ClickableWrapper = onClickOutside(class extends React.Component {
	constructor(props) {
		super(props);
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}
	render() {
		return React.createElement( 'div', { className: this.props.className }, this.props.children );
	}
	handleClickOutside( e ) {
		this.props.onClickOut( e );
	}
});

Datetime.defaultProps = {
	className: '',
	defaultValue: '',
	inputProps: {},
	input: true,
	onFocus: function() {},
	onBlur: function() {},
	onChange: function() {},
	onViewModeChange: function() {},
	onNavigateBack: function() {},
	onNavigateForward: function() {},
	timeFormat: true,
	timeConstraints: {},
	dateFormat: true,
	strictParsing: true,
	closeOnSelect: false,
	closeOnTab: true,
	utc: false
};

// Make moment accessible through the Datetime class
Datetime.moment = moment;

module.exports = Datetime;
