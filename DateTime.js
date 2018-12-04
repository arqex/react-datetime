'use strict';

var assign = require('object-assign'),
	PropTypes = require('prop-types'),
	createClass = require('create-react-class'),
	moment = require('moment'),
	React = require('react'),
	DaysView = require('./src/DaysView'),
	MonthsView = require('./src/MonthsView'),
	YearsView = require('./src/YearsView'),
	TimeView = require('./src/TimeView'),
	onClickOutside = require('react-onclickoutside').default
	;

var viewModes = {
	YEARS: 'years',
	MONTHS: 'months',
	DAYS: 'days',
	TIME: 'time',
};

var TYPES = PropTypes;
var nofn = function(){};
var Datetime = createClass({
	displayName: 'DateTime',
	propTypes: {
		// value: TYPES.object | TYPES.string,
		// defaultValue: TYPES.object | TYPES.string,
		onOpen: TYPES.func,
		onClose: TYPES.func,
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
		// initialViewDate: TYPES.object | TYPES.string,
		initialViewMode: TYPES.oneOf([viewModes.YEARS, viewModes.MONTHS, viewModes.DAYS, viewModes.TIME]),
		isValidDate: TYPES.func,
		open: TYPES.bool,
		strictParsing: TYPES.bool,
		closeOnSelect: TYPES.bool,
		closeOnTab: TYPES.bool
	},

	getDefaultProps: function(){
		return {
			onOpen: nofn,
			onClose: nofn,
			onCalendarOpen: nofn,
			onCalendarClose: nofn,
			onChange: nofn,
			onViewModeChange: nofn,
			onNavigateBack: nofn,
			onNavigateForward: nofn,
			dateFormat: true,
			timeFormat: true,
			utc: false,
			initialViewMode: viewModes.DAYS,
			className: '',
			input: true,
			inputProps: {},
			timeConstraints: {},
			isValidDate: function(){ return true },
			strictParsing: true,
			closeOnSelect: false,
			closeOnTab: true,
			closeOnClickOutside: true
		}
	},

	getInitialState: function() {
		var props = this.props;
		var inputFormat = this.getFormat('datetime');
		var selectedDate = this.parseDate( props.value || props.initialValue, inputFormat );

		this.checkTZ( props );

		return {
			open: !props.input,
			currentView: props.dateFormat ? props.initialViewMode : viewModes.TIME,
			viewDate: props.initialViewDate ? this.parseDate( props.initialViewDate, inputFormat  ) : (selectedDate && selectedDate.isValid() ? selectedDate.clone() : this.getInitialDate() ),
			selectedDate: selectedDate && selectedDate.isValid() ? selectedDate : undefined,
			inputValue: props.inputProps.value || 
				selectedDate && selectedDate.isValid() && selectedDate.format( inputFormat ) ||
				props.value && typeof props.value === 'string' && props.value ||
				props.initialValue && typeof props.initialValue === 'string' && props.initialValue ||
				''
		}
	},

	getInitialDate: function() {
		var m = this.localMoment();
		m.hour(0).minute(0).second(0).millisecond(0);
		return m;
	},

	parseDate: function (date, dateFormat) {
		var parsedDate;

		if (date && typeof date === 'string')
			parsedDate = this.localMoment(date, dateFormat);
		else if (date)
			parsedDate = this.localMoment(date);

		if (parsedDate && !parsedDate.isValid())
			parsedDate = null;

		return parsedDate;
	},

	isOpen: function(){
		return !this.props.input || (this.props.open === undefined ? this.state.open : this.props.open);
	},

	getUpdateOn: function( dateFormat ) {
		if ( dateFormat.match(/[lLD]/) ) {
			return viewModes.DAYS;
		} else if ( dateFormat.indexOf('M') !== -1 ) {
			return viewModes.MONTHS;
		} else if ( dateFormat.indexOf('Y') !== -1 ) {
			return viewModes.YEARS;
		}

		return viewModes.DAYS;
	},

	getLocaleData: function( props ){
		var p = props || this.props;
		return this.localMoment( p.date ).localeData();
	},

	getDateFormat: function( locale ){
		var format = this.props.dateFormat;
		if( format === true ) return locale.longDateFormat('L');
		if( format ) return format;
		return ''
	},

	getTimeFormat: function( locale ){
		var format = this.props.timeFormat;
		if( format === true ) return locale.longDateFormat('LT');
		if( format ) return format;
		return '';
	},

	getFormat: function( type ){
		if( type === 'date' ){
			return this.getDateFormat( this.getLocaleData() )
		}
		else if( type === 'time' ){
			return this.getTimeFormat( this.getLocaleData() )
		}
		else if( type === 'datetime' ){
			var locale = this.getLocaleData();
			var dateFormat = this.getDateFormat( locale )
			var timeFormat = this.getTimeFormat( locale )
			return dateFormat && timeFormat ? dateFormat + ' ' + timeFormat : (dateFormat || timeFormat );
		}
	},

	onInputChange: function( e ) {
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
	},

	onInputKey: function( e ) {
		if ( e.which === 9 && this.props.closeOnTab ) {
			this.closeCalendar();
		}
	},

	showView: function( view ) {
		var me = this;
		
		// this is a function bound to a click so we need a closure
		return function( e ){
			if( me.state.currentView !== view ){
				me.props.onViewModeChange( view )
				me.setState({ currentView: view })
			}
		}
	},

	updateTime: function( op, amount, type, toSelected ) {
		var update = {},
			date = toSelected ? 'selectedDate' : 'viewDate';

		update[ date ] = this.state[ date ].clone()[ op ]( amount, type );

		this.setState( update );
	},

	viewToMethod: {days: 'date', months: 'month', years: 'year'},
	nextView: { days: 'time', months: 'days', years: 'months'},
	updateDate: function( e ){
		var state = this.state;
		var currentView = state.currentView;
		var updateOnView = this.getUpdateOn( this.getFormat('date') );
		var viewDate = this.state.viewDate.clone();

		// Set the value into day/month/year
		var value = parseInt( e.target.getAttribute('data-value'), 10 )
		viewDate[ this.viewToMethod[currentView] ]( value )

		var update = {viewDate: viewDate};
		if( currentView === updateOnView ){
			update.selectedDate = viewDate.clone();
			update.inputValue = viewDate.format( this.getFormat('datetime') );

			if( this.props.open === undefined && this.props.input && this.props.closeOnSelect ){
				this.closeCalendar();
			}

			this.props.onChange( viewDate.clone() );
		}
		else {
			update.currentView = this.nextView[ currentView ];
		}

		this.setState( update );
	},

	navigate: function( modifier, unit ){
		var me  = this;

		// this is a function bound to a click so we need a closure
		return function( e ){
			var viewDate = me.state.viewDate.clone();
			var update = {
				viewDate: viewDate
			}
	
			// Subtracting is just adding negative time
			viewDate.add( modifier, unit );
			if( modifier > 0 ){
				me.props.onNavigateForward( modifier, unit );
			}
			else {
				me.props.onNavigateBack( -(modifier), unit );
			}
	
			me.setState( update );
		}
	},

	allowedSetTime: ['hours', 'minutes', 'seconds', 'milliseconds'],
	setTime: function( type, value ) {
		var state = this.state,
			date = (state.selectedDate || state.viewDate).clone()
		;
		
		date[ type ]( value );

		if ( !this.props.value ) {
			this.setState({
				selectedDate: date,
				viewDate: date.clone(),
				inputValue: date.format( this.getFormat('datetime') )
			});
		}
		this.props.onChange( date.clone() );
	},

	openCalendar: function( e ) {
		if ( !this.isOpen() ) {
			this.setState({ open: true }, function() {
				this.props.onOpen( e );
			});
		}
	},

	closeCalendar: function() {
		this.setState({ open: false }, function () {
			this.props.onClose( this.state.selectedDate || this.state.inputValue );
		});
	},

	handleClickOutside: function() {
		var props = this.props;

		if ( props.input && this.state.open && props.open === undefined && props.closeOnClickOutside ) {
			this.closeCalendar();
		}
	},

	localMoment: function( date, format, props ) {
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
	},

	checkTZ: function( props ) {
		var con = console;

		if ( props.displayTimeZone && !this.tzWarning && !moment.tz ) {
			this.tzWarning = true;
			con && con.error('react-datetime: displayTimeZone prop with value "' + props.displayTimeZone +  '" is used but moment.js timezone is not loaded.');
		}
	},

	overrideEvent: function( handler, action ) {
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
	},

	getClassName: function(){
		var cn = 'rdt';
		var props = this.props;
		var propCn = props.className;

		if( Array.isArray( propCn ) ){
			cn += ' ' + propCn.join(' ')
		}
		else if( propCn ){
			cn += ' ' + propCn
		}

		if( !props.input ){
			cn += ' rdtStatic'
		}
		if( this.isOpen() ){
			cn += ' rdtOpen'
		}

		return cn;
	},

	componentDidUpdate: function( prevProps ){
		if( prevProps === this.props ) return;

		var needsUpdate = false;
		var thisProps = this.props;
		['locale', 'utc', 'displayZone'].forEach( function(p){
			prevProps[p] !== thisProps[p] && (needsUpdate = true);
		})

		if( needsUpdate ){
			this.regenerateDates( this.props );
		}

		this.checkTZ();
	},

	regenerateDates: function(props){
		var viewDate = this.state.viewDate.clone();
		var selectedDate = this.state.selectedDate && this.state.selectedDate.clone();

		if( props.utc ){
			viewDate.utc();
			selectedDate &&	selectedDate.utc();
		}
		else if( props.displayTimeZone ){
			viewDate.tz( props.displayTimeZone );
			selectedDate &&	selectedDate.tz( props.displayTimeZone );
		}
		else {
			viewDate.local();
			selectedDate &&	selectedDate.local();
		}

		var update = { viewDate: viewDate, selectedDate: selectedDate};
		if( selectedDate && selectedDate.isValid() ){
			update.inputValue = selectedDate.format( this.getFormat('datetime') );
		}
		
		this.setState( update );
	},

	getSelectedDate: function(){
		if( this.props.value === undefined ) return this.state.selectedDate;
		var selectedDate = this.parseDate( this.props.value, this.getFormat('datetime') );
		return selectedDate && selectedDate.isValid() ? selectedDate : false;
	},

	getInputValue: function(){
		var selectedDate = this.getSelectedDate();
		return selectedDate ? selectedDate.format( this.getFormat('datetime') ) : this.state.inputValue;
	},

	render: function() {
		var cn = this.getClassName();
		var children = [];

		if ( this.props.input ) {
			var finalInputProps = assign(
				{ type: 'text', className: 'form-control', value: this.getInputValue() },
				this.props.inputProps,
				{
					onFocus: this.overrideEvent( 'onOpen', this.openCalendar ),
					onChange: this.overrideEvent( 'onChange', this.onInputChange ),
					onKeyDown: this.overrideEvent( 'onKeyDown', this.onInputKey ),
				}
			);

			if ( this.props.renderInput ) {
				children = [ React.createElement('div', { key: 'i' }, this.props.renderInput( finalInputProps, this.openCalendar, this.closeCalendar )) ];
			} else {
				children = [ React.createElement('input', assign({ key: 'i' }, finalInputProps ))];
			}
		}

		return React.createElement( ClickableWrapper, {className: cn, onClickOut: this.handleClickOutside}, children.concat(
			React.createElement( 'div',
				{ key: 'dt', className: 'rdtPicker' },
				this.renderCalendar( this.state.currentView )
			)
		));
	},

	renderCalendar: function( currentView ){
		var p = this.props;
		var state = this.state;

		var props = {
			viewDate: state.viewDate,
			selectedDate: this.getSelectedDate(),
			isValidDate: p.isValidDate,
			updateDate: this.updateDate,
			navigate: this.navigate,
			showView: this.showView
		}

		// I think updateOn, updateSelectedDate and setDate can be merged in the same method
		// that would update viewDate or selectedDate depending on the view and the dateFormat
		if( currentView === viewModes.YEARS ){
			// Used props
			// { viewDate, selectedDate, renderYear, isValidDate, navigate, showView, updateDate }
			props.renderYear = p.renderYear
			return React.createElement( YearsView, props )
		}
		else if( currentView === viewModes.MONTHS ){
			// { viewDate, selectedDate, renderMonth, isValidDate, navigate, showView, updateDate }
			props.renderMonth = p.renderMonth
			return React.createElement( MonthsView, props )
		}
		else if( currentView === viewModes.DAYS ){
			// { viewDate, selectedDate, renderDay, isValidDate, navigate, showView, updateDate, timeFormat }
			props.renderDay = p.renderDay;
			props.timeFormat = this.getFormat('time');
			return React.createElement( DaysView, props );
		}
		else if( currentView === viewModes.TIME ){
			// { viewDate, selectedDate, timeFormat, dateFormat, timeConstraints, setTime, showView }
			props.dateFormat = this.getFormat('date');
			props.timeFormat = this.getFormat('time');
			props.timeConstraints = p.timeConstraints;
			props.setTime = this.setTime;
			return React.createElement( TimeView, props )
		}
	}
});

var ClickableWrapper = onClickOutside( createClass({
	render: function() {
		return React.createElement( 'div', { className: this.props.className }, this.props.children );
	},
	handleClickOutside: function( e ) {
		this.props.onClickOut( e );
	}
}));

// Make moment accessible through the Datetime class
Datetime.moment = moment;

module.exports = Datetime;
