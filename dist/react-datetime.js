/*
react-datetime v2.6.0
https://github.com/arqex/react-datetime
MIT: https://github.com/arqex/react-datetime/raw/master/LICENSE
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("moment"), require("ReactDOM"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "moment", "ReactDOM"], factory);
	else if(typeof exports === 'object')
		exports["Datetime"] = factory(require("React"), require("moment"), require("ReactDOM"));
	else
		root["Datetime"] = factory(root["React"], root["moment"], root["ReactDOM"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_9__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign = __webpack_require__(1),
		React = __webpack_require__(2),
		DaysView = __webpack_require__(3),
		MonthsView = __webpack_require__(5),
		YearsView = __webpack_require__(6),
		TimeView = __webpack_require__(7),
		moment = __webpack_require__(4)
	;

	var TYPES = React.PropTypes;
	var Datetime = React.createClass({
		mixins: [
			__webpack_require__(8)
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
			blockInputEdit: TYPES.bool,
			closeOnSelect: TYPES.bool,
			closeOnTab: TYPES.bool
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
				blockInputEdit: false,
				closeOnTab: true
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
				update.viewDate = localMoment.clone().startOf('month');
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

		onKeyPress: function( e ) {
			if (this.props.blockInputEdit) {
				e.preventDefault();
			}
		},

		showView: function( view ){
			var me = this;
			return function(){
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
					viewDate: me.state.viewDate.clone()[ type ]( parseInt(e.target.getAttribute('data-value'), 10) ).startOf( type ),
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

		updateSelectedDate: function( e, close ) {
			var target = e.target,
				modifier = 0,
				viewDate = this.state.viewDate,
				currentDate = this.state.selectedDate || viewDate,
				date
	    ;

			if (target.className.indexOf('rdtDay') !== -1){
				if (target.className.indexOf('rdtNew') !== -1)
					modifier = 1;
				else if (target.className.indexOf('rdtOld') !== -1)
					modifier = -1;

				date = viewDate.clone()
					.month( viewDate.month() + modifier )
					.date( parseInt( target.getAttribute('data-value'), 10 ) );
			} else if (target.className.indexOf('rdtMonth') !== -1){
				date = viewDate.clone()
					.month( parseInt( target.getAttribute('data-value'), 10 ) )
					.date( currentDate.date() );
			} else if (target.className.indexOf('rdtYear') !== -1){
				date = viewDate.clone()
					.month( currentDate.month() )
					.date( currentDate.date() )
					.year( parseInt( target.getAttribute('data-value'), 10 ) );
			}

			date.hours( currentDate.hours() )
				.minutes( currentDate.minutes() )
				.seconds( currentDate.seconds() )
				.milliseconds( currentDate.milliseconds() );

			if ( !this.props.value ){
				this.setState({
					selectedDate: date,
					viewDate: date.clone().startOf('month'),
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
			fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear', 'timeConstraints'],
			fromState: ['viewDate', 'selectedDate', 'updateOn'],
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
				className = 'rdt' + (this.props.className ?
	                  ( Array.isArray( this.props.className ) ?
	                  ' ' + this.props.className.join( ' ' ) : ' ' + this.props.className) : ''),
				children = []
			;

			if ( this.props.input ){
				children = [ DOM.input( assign({
					key: 'i',
					type:'text',
					className: 'form-control',
					onFocus: this.openCalendar,
					onChange: this.onInputChange,
					onKeyDown: this.onInputKey,
					onKeyPress: this.inKeyPress,
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function ownEnumerableKeys(obj) {
		var keys = Object.getOwnPropertyNames(obj);

		if (Object.getOwnPropertySymbols) {
			keys = keys.concat(Object.getOwnPropertySymbols(obj));
		}

		return keys.filter(function (key) {
			return propIsEnumerable.call(obj, key);
		});
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = ownEnumerableKeys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2),
		moment = __webpack_require__(4)
	;

	var DOM = React.DOM;
	var DateTimePickerDays = React.createClass({

		render: function() {
			var footer = this.renderFooter(),
				date = this.props.viewDate,
				locale = date.localeData(),
				tableChildren
			;

			tableChildren = [
				DOM.thead({ key: 'th'}, [
					DOM.tr({ key: 'h'}, [
						DOM.th({ key: 'p', className: 'rdtPrev' }, DOM.span({onClick: this.props.subtractTime(1, 'months')}, '‹')),
						DOM.th({ key: 's', className: 'rdtSwitch', onClick: this.props.showView('months'), colSpan: 5, 'data-value': this.props.viewDate.month() }, locale.months( date ) + ' ' + date.year() ),
						DOM.th({ key: 'n', className: 'rdtNext' }, DOM.span({onClick: this.props.addTime(1, 'months')}, '›'))
					]),
					DOM.tr({ key: 'd'}, this.getDaysOfWeek( locale ).map( function( day, index ){ return DOM.th({ key: day + index, className: 'dow'}, day ); }) )
				]),
				DOM.tbody({key: 'tb'}, this.renderDays())
			];

			if ( footer )
				tableChildren.push( footer );

			return DOM.div({ className: 'rdtDays' },
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
				first = locale.firstDayOfWeek(),
				dow = [],
				i = 0
			;

			days.forEach( function( day ){
				dow[ (7 + (i++) - first) % 7 ] = day;
			});

			return dow;
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

			// Go to the last week of the previous month
			prevMonth.date( prevMonth.daysInMonth() ).startOf('week');
			var lastDay = prevMonth.clone().add(42, 'd');

			while ( prevMonth.isBefore( lastDay ) ){
				classes = 'rdtDay';
				currentDate = prevMonth.clone();

				if ( ( prevMonth.year() === currentYear && prevMonth.month() < currentMonth ) || ( prevMonth.year() < currentYear ) )
					classes += ' rdtOld';
				else if ( ( prevMonth.year() === currentYear && prevMonth.month() > currentMonth ) || ( prevMonth.year() > currentYear ) )
					classes += ' rdtNew';

				if ( selected && prevMonth.isSame(selected, 'day') )
					classes += ' rdtActive';

				if (prevMonth.isSame(moment(), 'day') )
					classes += ' rdtToday';

				disabled = !isValid( currentDate, selected );
				if ( disabled )
					classes += ' rdtDisabled';

				dayProps = {
					key: prevMonth.format('M_D'),
					'data-value': prevMonth.date(),
					className: classes
				};
				if ( !disabled )
					dayProps.onClick = this.updateSelectedDate;

				days.push( renderer( dayProps, currentDate, selected ) );

				if ( days.length === 7 ){
					weeks.push( DOM.tr( {key: prevMonth.format('M_D')}, days ) );
					days = [];
				}

				prevMonth.add( 1, 'd' );
			}

			return weeks;
		},

		updateSelectedDate: function( event ) {
			this.props.updateSelectedDate(event, true);
		},

		renderDay: function( props, currentDate ){
			return DOM.td( props, currentDate.date() );
		},

		renderFooter: function(){
			if ( !this.props.timeFormat )
				return '';

			var date = this.props.selectedDate || this.props.viewDate;

			return DOM.tfoot({ key: 'tf'},
				DOM.tr({},
					DOM.td({ onClick: this.props.showView('time'), colSpan: 7, className: 'rdtTimeToggle'}, date.format( this.props.timeFormat ))
				)
			);
		},
		isValidDate: function(){ return 1; }
	});

	module.exports = DateTimePickerDays;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);

	var DOM = React.DOM;
	var DateTimePickerMonths = React.createClass({
		render: function() {
			return DOM.div({ className: 'rdtMonths' }, [
				DOM.table({ key: 'a'}, DOM.thead({}, DOM.tr({}, [
					DOM.th({ key: 'prev', className: 'rdtPrev' }, DOM.span({onClick: this.props.subtractTime(1, 'years')}, '‹')),
					DOM.th({ key: 'year', className: 'rdtSwitch', onClick: this.props.showView('years'), colSpan: 2, 'data-value': this.props.viewDate.year()}, this.props.viewDate.year() ),
					DOM.th({ key: 'next', className: 'rdtNext' }, DOM.span({onClick: this.props.addTime(1, 'years')}, '›'))
				]))),
				DOM.table({ key: 'months'}, DOM.tbody({ key: 'b'}, this.renderMonths()))
			]);
		},

		renderMonths: function() {
			var date = this.props.selectedDate,
				month = this.props.viewDate.month(),
				year = this.props.viewDate.year(),
				rows = [],
				i = 0,
				months = [],
				renderer = this.props.renderMonth || this.renderMonth,
				classes, props
			;

			while (i < 12) {
				classes = 'rdtMonth';
				if ( date && i === month && year === date.year() )
					classes += ' rdtActive';

				props = {
					key: i,
					'data-value': i,
					className: classes,
					onClick: this.props.updateOn === 'months'? this.updateSelectedMonth : this.props.setDate('month')
				};

				months.push( renderer( props, i, year, date && date.clone() ));

				if ( months.length === 4 ){
					rows.push( DOM.tr({ key: month + '_' + rows.length }, months) );
					months = [];
				}

				i++;
			}

			return rows;
		},

		updateSelectedMonth: function( event ) {
			this.props.updateSelectedDate(event, true);
		},

		renderMonth: function( props, month ) {
			var monthsShort = this.props.viewDate.localeData()._monthsShort;
			return DOM.td( props, monthsShort.standalone
				? capitalize( monthsShort.standalone[ month ] )
				: monthsShort[ month ]
			);
		}
	});

	function capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	module.exports = DateTimePickerMonths;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);

	var DOM = React.DOM;
	var DateTimePickerYears = React.createClass({
		render: function() {
			var year = parseInt(this.props.viewDate.year() / 10, 10) * 10;

			return DOM.div({ className: 'rdtYears' }, [
				DOM.table({ key: 'a'}, DOM.thead({}, DOM.tr({}, [
					DOM.th({ key: 'prev', className: 'rdtPrev' }, DOM.span({onClick: this.props.subtractTime(10, 'years')}, '‹')),
					DOM.th({ key: 'year', className: 'rdtSwitch', onClick: this.props.showView('years'), colSpan: 2 }, year + '-' + (year + 9) ),
					DOM.th({ key: 'next', className: 'rdtNext'}, DOM.span({onClick: this.props.addTime(10, 'years')}, '›'))
					]))),
				DOM.table({ key: 'years'}, DOM.tbody({}, this.renderYears( year )))
			]);
		},

		renderYears: function( year ) {
			var years = [],
				i = -1,
				rows = [],
				renderer = this.props.renderYear || this.renderYear,
				selectedDate = this.props.selectedDate,
				classes, props
			;

			year--;
			while (i < 11) {
				classes = 'rdtYear';
				if ( i === -1 | i === 10 )
					classes += ' rdtOld';
				if ( selectedDate && selectedDate.year() === year )
					classes += ' rdtActive';

				props = {
					key: year,
					'data-value': year,
					className: classes,
					onClick: this.props.updateOn === 'years' ? this.updateSelectedYear : this.props.setDate('year')
				};

				years.push( renderer( props, year, selectedDate && selectedDate.clone() ));

				if ( years.length === 4 ){
					rows.push( DOM.tr({ key: i }, years ) );
					years = [];
				}

				year++;
				i++;
			}

			return rows;
		},

		updateSelectedYear: function( event ) {
			this.props.updateSelectedDate(event, true);
		},

		renderYear: function( props, year ){
			return DOM.td( props, year );
		}
	});

	module.exports = DateTimePickerYears;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2),
		assign = __webpack_require__(1);

	var DOM = React.DOM;
	var DateTimePickerTime = React.createClass({
		getInitialState: function(){
			return this.calculateState( this.props );
		},
		calculateState: function( props ){
			var date = props.selectedDate || props.viewDate,
				format = props.timeFormat,
				counters = []
			;

			if ( format.indexOf('H') !== -1 || format.indexOf('h') !== -1 ){
				counters.push('hours');
				if ( format.indexOf('m') !== -1 ){
					counters.push('minutes');
					if ( format.indexOf('s') !== -1 ){
						counters.push('seconds');
					}
				}
			}

			var daypart = false;
			if ( this.props.timeFormat.indexOf(' A') !== -1  && this.state !== null ){
				daypart = ( this.state.hours >= 12 ) ? 'PM' : 'AM';
			}

			return {
				hours: date.format('H'),
				minutes: date.format('mm'),
				seconds: date.format('ss'),
				milliseconds: date.format('SSS'),
				daypart: daypart,
				counters: counters
			};
		},
		renderCounter: function( type ){
			if (type !== 'daypart') {
				var value = this.state[ type ];
				if (type === 'hours' && this.props.timeFormat.indexOf(' A') !== -1) {
					value = (value - 1) % 12 + 1;

					if (value === 0) {
						value = 12;
					}
				}
				return DOM.div({ key: type, className: 'rdtCounter'}, [
					DOM.span({ key:'up', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'increase', type ) }, '▲' ),
					DOM.div({ key:'c', className: 'rdtCount' }, value ),
					DOM.span({ key:'do', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'decrease', type ) }, '▼' )
				]);
			}
			return '';
		},
		renderDayPart: function() {
			return DOM.div({ className: 'rdtCounter', key: 'dayPart'}, [
				DOM.span({ key:'up', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'toggleDayPart', 'hours') }, '▲' ),
				DOM.div({ key: this.state.daypart, className: 'rdtCount'}, this.state.daypart ),
				DOM.span({ key:'do', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'toggleDayPart', 'hours') }, '▼' )
			]);
		},
		render: function() {
			var me = this,
				counters = []
			;

			this.state.counters.forEach( function(c){
				if ( counters.length )
					counters.push( DOM.div( {key: 'sep' + counters.length, className: 'rdtCounterSeparator' }, ':' ));
				counters.push( me.renderCounter( c ) );
			});

			if (this.state.daypart !== false) {
				counters.push( me.renderDayPart() );
			}

			if ( this.state.counters.length === 3 && this.props.timeFormat.indexOf('S') !== -1 ){
				counters.push( DOM.div( {className: 'rdtCounterSeparator', key: 'sep5' }, ':' ));
				counters.push(
					DOM.div( {className: 'rdtCounter rdtMilli', key:'m'},
						DOM.input({ value: this.state.milliseconds, type: 'text', onChange: this.updateMilli })
						)
					);
			}

			return DOM.div( {className: 'rdtTime'},
				DOM.table( {}, [
					this.renderHeader(),
					DOM.tbody({key: 'b'}, DOM.tr({}, DOM.td({},
						DOM.div({ className: 'rdtCounters' }, counters )
					)))
				])
			);
		},
		componentWillMount: function() {
			var me = this;
			me.timeConstraints = {
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
					step: 1,
				},
				milliseconds: {
					min: 0,
					max: 999,
					step: 1
				}
			};
			['hours', 'minutes', 'seconds', 'milliseconds'].forEach(function(type) {
				assign(me.timeConstraints[type], me.props.timeConstraints[type]);
			});
			this.setState( this.calculateState( this.props ) );
		},
		componentWillReceiveProps: function( nextProps ){
			this.setState( this.calculateState( nextProps ) );
		},
		updateMilli: function( e ){
			var milli = parseInt( e.target.value, 10 );
			if ( milli === e.target.value && milli >= 0 && milli < 1000 ){
				this.props.setTime( 'milliseconds', milli );
				this.setState({ milliseconds: milli });
			}
		},
		renderHeader: function(){
			if ( !this.props.dateFormat )
				return null;

			var date = this.props.selectedDate || this.props.viewDate;
			return DOM.thead({ key: 'h'}, DOM.tr({},
				DOM.th( {className: 'rdtSwitch', colSpan: 4, onClick: this.props.showView('days')}, date.format( this.props.dateFormat ) )
			));
		},
		onStartClicking: function( action, type ){
			var me = this;

			return function(){
				var update = {};
				update[ type ] = me[ action ]( type );
				me.setState( update );

				me.timer = setTimeout( function(){
					me.increaseTimer = setInterval( function(){
						update[ type ] = me[ action ]( type );
						me.setState( update );
					}, 70);
				}, 500);

				me.mouseUpListener = function(){
					clearTimeout( me.timer );
					clearInterval( me.increaseTimer );
					me.props.setTime( type, me.state[ type ] );
					document.body.removeEventListener('mouseup', me.mouseUpListener);
				};

				document.body.addEventListener('mouseup', me.mouseUpListener);
			};
		},
		padValues: {
			hours: 1,
			minutes: 2,
			seconds: 2,
			milliseconds: 3
		},
		toggleDayPart: function( type ){ // type is always 'hours'
			var value = parseInt(this.state[ type ], 10) + 12;
			if ( value > this.timeConstraints[ type ].max )
				value = this.timeConstraints[ type ].min + (value - (this.timeConstraints[ type ].max + 1));
			return this.pad( type, value );
		},
		increase: function( type ){
			var value = parseInt(this.state[ type ], 10) + this.timeConstraints[ type ].step;
			if ( value > this.timeConstraints[ type ].max )
				value = this.timeConstraints[ type ].min + ( value - ( this.timeConstraints[ type ].max  + 1) );
			return this.pad( type, value );
		},
		decrease: function( type ){
			var value = parseInt(this.state[ type ], 10) - this.timeConstraints[ type ].step;
			if ( value < this.timeConstraints[ type ].min )
				value = this.timeConstraints[ type ].max + 1 - ( this.timeConstraints[ type ].min - value );
			return this.pad( type, value );
		},
		pad: function( type, value ){
			var str = value + '';
			while ( str.length < this.padValues[ type ] )
				str = '0' + str;
			return str;
		}
	});

	module.exports = DateTimePickerTime;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// This is extracted from https://github.com/Pomax/react-onclickoutside
	// And modified to support react 0.13 and react 0.14

	var React = __webpack_require__(2),
		version = React.version && React.version.split('.')
	;

	if ( version && ( version[0] > 0 || version[1] > 13 ) )
		React = __webpack_require__(9);

	// Use a parallel array because we can't use
	// objects as keys, they get toString-coerced
	var registeredComponents = [];
	var handlers = [];

	var IGNORE_CLASS = 'ignore-react-onclickoutside';

	var isSourceFound = function(source, localNode) {
	 if (source === localNode) {
	   return true;
	 }
	 // SVG <use/> elements do not technically reside in the rendered DOM, so
	 // they do not have classList directly, but they offer a link to their
	 // corresponding element, which can have classList. This extra check is for
	 // that case.
	 // See: http://www.w3.org/TR/SVG11/struct.html#InterfaceSVGUseElement
	 // Discussion: https://github.com/Pomax/react-onclickoutside/pull/17
	 if (source.correspondingElement) {
	   return source.correspondingElement.classList.contains(IGNORE_CLASS);
	 }
	 return source.classList.contains(IGNORE_CLASS);
	};

	module.exports = {
	 componentDidMount: function() {
	   if (typeof this.handleClickOutside !== 'function')
	     throw new Error('Component lacks a handleClickOutside(event) function for processing outside click events.');

	   var fn = this.__outsideClickHandler = (function(localNode, eventHandler) {
	     return function(evt) {
	       evt.stopPropagation();
	       var source = evt.target;
	       var found = false;
	       // If source=local then this event came from "somewhere"
	       // inside and should be ignored. We could handle this with
	       // a layered approach, too, but that requires going back to
	       // thinking in terms of Dom node nesting, running counter
	       // to React's "you shouldn't care about the DOM" philosophy.
	       while (source.parentNode) {
	         found = isSourceFound(source, localNode);
	         if (found) return;
	         source = source.parentNode;
	       }
	       eventHandler(evt);
	     };
	   }(React.findDOMNode(this), this.handleClickOutside));

	   var pos = registeredComponents.length;
	   registeredComponents.push(this);
	   handlers[pos] = fn;

	   // If there is a truthy disableOnClickOutside property for this
	   // component, don't immediately start listening for outside events.
	   if (!this.props.disableOnClickOutside) {
	     this.enableOnClickOutside();
	   }
	 },

	 componentWillUnmount: function() {
	   this.disableOnClickOutside();
	   this.__outsideClickHandler = false;
	   var pos = registeredComponents.indexOf(this);
	   if ( pos>-1) {
	     if (handlers[pos]) {
	       // clean up so we don't leak memory
	       handlers.splice(pos, 1);
	       registeredComponents.splice(pos, 1);
	     }
	   }
	 },

	 /**
	  * Can be called to explicitly enable event listening
	  * for clicks and touches outside of this element.
	  */
	 enableOnClickOutside: function() {
	   var fn = this.__outsideClickHandler;
	   document.addEventListener('mousedown', fn);
	   document.addEventListener('touchstart', fn);
	 },

	 /**
	  * Can be called to explicitly disable event listening
	  * for clicks and touches outside of this element.
	  */
	 disableOnClickOutside: function() {
	   var fn = this.__outsideClickHandler;
	   document.removeEventListener('mousedown', fn);
	   document.removeEventListener('touchstart', fn);
	 }
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-datetime.js.map
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWFjdC1kYXRldGltZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJSZWFjdFwiKSwgcmVxdWlyZShcIm1vbWVudFwiKSwgcmVxdWlyZShcIlJlYWN0RE9NXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcIlJlYWN0XCIsIFwibW9tZW50XCIsIFwiUmVhY3RET01cIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXRpbWVcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJSZWFjdFwiKSwgcmVxdWlyZShcIm1vbWVudFwiKSwgcmVxdWlyZShcIlJlYWN0RE9NXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJEYXRldGltZVwiXSA9IGZhY3Rvcnkocm9vdFtcIlJlYWN0XCJdLCByb290W1wibW9tZW50XCJdLCByb290W1wiUmVhY3RET01cIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8yX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNF9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzlfXykge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG5cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG5cblxuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdHZhciBhc3NpZ24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpLFxyXG5cdFx0UmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpLFxyXG5cdFx0RGF5c1ZpZXcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpLFxyXG5cdFx0TW9udGhzVmlldyA9IF9fd2VicGFja19yZXF1aXJlX18oNSksXHJcblx0XHRZZWFyc1ZpZXcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpLFxyXG5cdFx0VGltZVZpZXcgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDcpLFxyXG5cdFx0bW9tZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0KVxyXG5cdDtcclxuXHJcblx0dmFyIFRZUEVTID0gUmVhY3QuUHJvcFR5cGVzO1xyXG5cdHZhciBEYXRldGltZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRcdG1peGluczogW1xyXG5cdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKDgpXHJcblx0XHRdLFxyXG5cdFx0dmlld0NvbXBvbmVudHM6IHtcclxuXHRcdFx0ZGF5czogRGF5c1ZpZXcsXHJcblx0XHRcdG1vbnRoczogTW9udGhzVmlldyxcclxuXHRcdFx0eWVhcnM6IFllYXJzVmlldyxcclxuXHRcdFx0dGltZTogVGltZVZpZXdcclxuXHRcdH0sXHJcblx0XHRwcm9wVHlwZXM6IHtcclxuXHRcdFx0Ly8gdmFsdWU6IFRZUEVTLm9iamVjdCB8IFRZUEVTLnN0cmluZyxcclxuXHRcdFx0Ly8gZGVmYXVsdFZhbHVlOiBUWVBFUy5vYmplY3QgfCBUWVBFUy5zdHJpbmcsXHJcblx0XHRcdG9uRm9jdXM6IFRZUEVTLmZ1bmMsXHJcblx0XHRcdG9uQmx1cjogVFlQRVMuZnVuYyxcclxuXHRcdFx0b25DaGFuZ2U6IFRZUEVTLmZ1bmMsXHJcblx0XHRcdGxvY2FsZTogVFlQRVMuc3RyaW5nLFxyXG5cdFx0XHRpbnB1dDogVFlQRVMuYm9vbCxcclxuXHRcdFx0Ly8gZGF0ZUZvcm1hdDogVFlQRVMuc3RyaW5nIHwgVFlQRVMuYm9vbCxcclxuXHRcdFx0Ly8gdGltZUZvcm1hdDogVFlQRVMuc3RyaW5nIHwgVFlQRVMuYm9vbCxcclxuXHRcdFx0aW5wdXRQcm9wczogVFlQRVMub2JqZWN0LFxyXG5cdFx0XHR0aW1lQ29uc3RyYWludHM6IFRZUEVTLm9iamVjdCxcclxuXHRcdFx0dmlld01vZGU6IFRZUEVTLm9uZU9mKFsneWVhcnMnLCAnbW9udGhzJywgJ2RheXMnLCAndGltZSddKSxcclxuXHRcdFx0aXNWYWxpZERhdGU6IFRZUEVTLmZ1bmMsXHJcblx0XHRcdG9wZW46IFRZUEVTLmJvb2wsXHJcblx0XHRcdHN0cmljdFBhcnNpbmc6IFRZUEVTLmJvb2wsXHJcblx0XHRcdGJsb2NrSW5wdXRFZGl0OiBUWVBFUy5ib29sLFxyXG5cdFx0XHRjbG9zZU9uU2VsZWN0OiBUWVBFUy5ib29sLFxyXG5cdFx0XHRjbG9zZU9uVGFiOiBUWVBFUy5ib29sXHJcblx0XHR9LFxyXG5cclxuXHRcdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBub2YgPSBmdW5jdGlvbigpe307XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0Y2xhc3NOYW1lOiAnJyxcclxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6ICcnLFxyXG5cdFx0XHRcdGlucHV0UHJvcHM6IHt9LFxyXG5cdFx0XHRcdGlucHV0OiB0cnVlLFxyXG5cdFx0XHRcdG9uRm9jdXM6IG5vZixcclxuXHRcdFx0XHRvbkJsdXI6IG5vZixcclxuXHRcdFx0XHRvbkNoYW5nZTogbm9mLFxyXG5cdFx0XHRcdHRpbWVGb3JtYXQ6IHRydWUsXHJcblx0XHRcdFx0dGltZUNvbnN0cmFpbnRzOiB7fSxcclxuXHRcdFx0XHRkYXRlRm9ybWF0OiB0cnVlLFxyXG5cdFx0XHRcdHN0cmljdFBhcnNpbmc6IHRydWUsXHJcblx0XHRcdFx0Y2xvc2VPblNlbGVjdDogZmFsc2UsXHJcblx0XHRcdFx0YmxvY2tJbnB1dEVkaXQ6IGZhbHNlLFxyXG5cdFx0XHRcdGNsb3NlT25UYWI6IHRydWVcclxuXHRcdFx0fTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21Qcm9wcyggdGhpcy5wcm9wcyApO1xyXG5cclxuXHRcdFx0aWYgKCBzdGF0ZS5vcGVuID09PSB1bmRlZmluZWQgKVxyXG5cdFx0XHRcdHN0YXRlLm9wZW4gPSAhdGhpcy5wcm9wcy5pbnB1dDtcclxuXHJcblx0XHRcdHN0YXRlLmN1cnJlbnRWaWV3ID0gdGhpcy5wcm9wcy5kYXRlRm9ybWF0ID8gKHRoaXMucHJvcHMudmlld01vZGUgfHwgc3RhdGUudXBkYXRlT24gfHwgJ2RheXMnKSA6ICd0aW1lJztcclxuXHJcblx0XHRcdHJldHVybiBzdGF0ZTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Z2V0U3RhdGVGcm9tUHJvcHM6IGZ1bmN0aW9uKCBwcm9wcyApe1xyXG5cdFx0XHR2YXIgZm9ybWF0cyA9IHRoaXMuZ2V0Rm9ybWF0cyggcHJvcHMgKSxcclxuXHRcdFx0XHRkYXRlID0gcHJvcHMudmFsdWUgfHwgcHJvcHMuZGVmYXVsdFZhbHVlLFxyXG5cdFx0XHRcdHNlbGVjdGVkRGF0ZSwgdmlld0RhdGUsIHVwZGF0ZU9uLCBpbnB1dFZhbHVlXHJcblx0XHRcdDtcclxuXHJcblx0XHRcdGlmICggZGF0ZSAmJiB0eXBlb2YgZGF0ZSA9PT0gJ3N0cmluZycgKVxyXG5cdFx0XHRcdHNlbGVjdGVkRGF0ZSA9IHRoaXMubG9jYWxNb21lbnQoIGRhdGUsIGZvcm1hdHMuZGF0ZXRpbWUgKTtcclxuXHRcdFx0ZWxzZSBpZiAoIGRhdGUgKVxyXG5cdFx0XHRcdHNlbGVjdGVkRGF0ZSA9IHRoaXMubG9jYWxNb21lbnQoIGRhdGUgKTtcclxuXHJcblx0XHRcdGlmICggc2VsZWN0ZWREYXRlICYmICFzZWxlY3RlZERhdGUuaXNWYWxpZCgpIClcclxuXHRcdFx0XHRzZWxlY3RlZERhdGUgPSBudWxsO1xyXG5cclxuXHRcdFx0dmlld0RhdGUgPSBzZWxlY3RlZERhdGUgP1xyXG5cdFx0XHRcdHNlbGVjdGVkRGF0ZS5jbG9uZSgpLnN0YXJ0T2YoJ21vbnRoJykgOlxyXG5cdFx0XHRcdHRoaXMubG9jYWxNb21lbnQoKS5zdGFydE9mKCdtb250aCcpXHJcblx0XHRcdDtcclxuXHJcblx0XHRcdHVwZGF0ZU9uID0gdGhpcy5nZXRVcGRhdGVPbihmb3JtYXRzKTtcclxuXHJcblx0XHRcdGlmICggc2VsZWN0ZWREYXRlIClcclxuXHRcdFx0XHRpbnB1dFZhbHVlID0gc2VsZWN0ZWREYXRlLmZvcm1hdChmb3JtYXRzLmRhdGV0aW1lKTtcclxuXHRcdFx0ZWxzZSBpZiAoIGRhdGUuaXNWYWxpZCAmJiAhZGF0ZS5pc1ZhbGlkKCkgKVxyXG5cdFx0XHRcdGlucHV0VmFsdWUgPSAnJztcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlucHV0VmFsdWUgPSBkYXRlIHx8ICcnO1xyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHR1cGRhdGVPbjogdXBkYXRlT24sXHJcblx0XHRcdFx0aW5wdXRGb3JtYXQ6IGZvcm1hdHMuZGF0ZXRpbWUsXHJcblx0XHRcdFx0dmlld0RhdGU6IHZpZXdEYXRlLFxyXG5cdFx0XHRcdHNlbGVjdGVkRGF0ZTogc2VsZWN0ZWREYXRlLFxyXG5cdFx0XHRcdGlucHV0VmFsdWU6IGlucHV0VmFsdWUsXHJcblx0XHRcdFx0b3BlbjogcHJvcHMub3BlblxyXG5cdFx0XHR9O1xyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRVcGRhdGVPbjogZnVuY3Rpb24oZm9ybWF0cyl7XHJcblx0XHRcdGlmICggZm9ybWF0cy5kYXRlLm1hdGNoKC9bbExEXS8pICl7XHJcblx0XHRcdFx0cmV0dXJuICdkYXlzJztcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICggZm9ybWF0cy5kYXRlLmluZGV4T2YoJ00nKSAhPT0gLTEgKXtcclxuXHRcdFx0XHRyZXR1cm4gJ21vbnRocyc7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoIGZvcm1hdHMuZGF0ZS5pbmRleE9mKCdZJykgIT09IC0xICl7XHJcblx0XHRcdFx0cmV0dXJuICd5ZWFycyc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiAnZGF5cyc7XHJcblx0XHR9LFxyXG5cclxuXHRcdGdldEZvcm1hdHM6IGZ1bmN0aW9uKCBwcm9wcyApe1xyXG5cdFx0XHR2YXIgZm9ybWF0cyA9IHtcclxuXHRcdFx0XHRcdGRhdGU6IHByb3BzLmRhdGVGb3JtYXQgfHwgJycsXHJcblx0XHRcdFx0XHR0aW1lOiBwcm9wcy50aW1lRm9ybWF0IHx8ICcnXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRsb2NhbGUgPSB0aGlzLmxvY2FsTW9tZW50KCBwcm9wcy5kYXRlICkubG9jYWxlRGF0YSgpXHJcblx0XHRcdDtcclxuXHJcblx0XHRcdGlmICggZm9ybWF0cy5kYXRlID09PSB0cnVlICl7XHJcblx0XHRcdFx0Zm9ybWF0cy5kYXRlID0gbG9jYWxlLmxvbmdEYXRlRm9ybWF0KCdMJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoIHRoaXMuZ2V0VXBkYXRlT24oZm9ybWF0cykgIT09ICdkYXlzJyApe1xyXG5cdFx0XHRcdGZvcm1hdHMudGltZSA9ICcnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIGZvcm1hdHMudGltZSA9PT0gdHJ1ZSApe1xyXG5cdFx0XHRcdGZvcm1hdHMudGltZSA9IGxvY2FsZS5sb25nRGF0ZUZvcm1hdCgnTFQnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9ybWF0cy5kYXRldGltZSA9IGZvcm1hdHMuZGF0ZSAmJiBmb3JtYXRzLnRpbWUgP1xyXG5cdFx0XHRcdGZvcm1hdHMuZGF0ZSArICcgJyArIGZvcm1hdHMudGltZSA6XHJcblx0XHRcdFx0Zm9ybWF0cy5kYXRlIHx8IGZvcm1hdHMudGltZVxyXG5cdFx0XHQ7XHJcblxyXG5cdFx0XHRyZXR1cm4gZm9ybWF0cztcclxuXHRcdH0sXHJcblxyXG5cdFx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XHJcblx0XHRcdHZhciBmb3JtYXRzID0gdGhpcy5nZXRGb3JtYXRzKCBuZXh0UHJvcHMgKSxcclxuXHRcdFx0XHR1cGRhdGUgPSB7fVxyXG5cdFx0XHQ7XHJcblxyXG5cdFx0XHRpZiAoIG5leHRQcm9wcy52YWx1ZSAhPT0gdGhpcy5wcm9wcy52YWx1ZSApe1xyXG5cdFx0XHRcdHVwZGF0ZSA9IHRoaXMuZ2V0U3RhdGVGcm9tUHJvcHMoIG5leHRQcm9wcyApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICggZm9ybWF0cy5kYXRldGltZSAhPT0gdGhpcy5nZXRGb3JtYXRzKCB0aGlzLnByb3BzICkuZGF0ZXRpbWUgKSB7XHJcblx0XHRcdFx0dXBkYXRlLmlucHV0Rm9ybWF0ID0gZm9ybWF0cy5kYXRldGltZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCB1cGRhdGUub3BlbiA9PT0gdW5kZWZpbmVkICl7XHJcblx0XHRcdFx0aWYgKCB0aGlzLnByb3BzLmNsb3NlT25TZWxlY3QgJiYgdGhpcy5zdGF0ZS5jdXJyZW50VmlldyAhPT0gJ3RpbWUnICl7XHJcblx0XHRcdFx0XHR1cGRhdGUub3BlbiA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHVwZGF0ZS5vcGVuID0gdGhpcy5zdGF0ZS5vcGVuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSggdXBkYXRlICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdG9uSW5wdXRDaGFuZ2U6IGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0XHR2YXIgdmFsdWUgPSBlLnRhcmdldCA9PT0gbnVsbCA/IGUgOiBlLnRhcmdldC52YWx1ZSxcclxuXHRcdFx0XHRsb2NhbE1vbWVudCA9IHRoaXMubG9jYWxNb21lbnQoIHZhbHVlLCB0aGlzLnN0YXRlLmlucHV0Rm9ybWF0ICksXHJcblx0XHRcdFx0dXBkYXRlID0geyBpbnB1dFZhbHVlOiB2YWx1ZSB9XHJcblx0XHRcdDtcclxuXHJcblx0XHRcdGlmICggbG9jYWxNb21lbnQuaXNWYWxpZCgpICYmICF0aGlzLnByb3BzLnZhbHVlICkge1xyXG5cdFx0XHRcdHVwZGF0ZS5zZWxlY3RlZERhdGUgPSBsb2NhbE1vbWVudDtcclxuXHRcdFx0XHR1cGRhdGUudmlld0RhdGUgPSBsb2NhbE1vbWVudC5jbG9uZSgpLnN0YXJ0T2YoJ21vbnRoJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dXBkYXRlLnNlbGVjdGVkRGF0ZSA9IG51bGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzLnNldFN0YXRlKCB1cGRhdGUsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnByb3BzLm9uQ2hhbmdlKCBsb2NhbE1vbWVudC5pc1ZhbGlkKCkgPyBsb2NhbE1vbWVudCA6IHRoaXMuc3RhdGUuaW5wdXRWYWx1ZSApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblxyXG5cdFx0b25JbnB1dEtleTogZnVuY3Rpb24oIGUgKXtcclxuXHRcdFx0aWYgKCBlLndoaWNoID09PSA5ICYmIHRoaXMucHJvcHMuY2xvc2VPblRhYiApe1xyXG5cdFx0XHRcdHRoaXMuY2xvc2VDYWxlbmRhcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdG9uS2V5UHJlc3M6IGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0XHRpZiAodGhpcy5wcm9wcy5ibG9ja0lucHV0RWRpdCkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRzaG93VmlldzogZnVuY3Rpb24oIHZpZXcgKXtcclxuXHRcdFx0dmFyIG1lID0gdGhpcztcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0bWUuc2V0U3RhdGUoeyBjdXJyZW50VmlldzogdmlldyB9KTtcclxuXHRcdFx0fTtcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0RGF0ZTogZnVuY3Rpb24oIHR5cGUgKXtcclxuXHRcdFx0dmFyIG1lID0gdGhpcyxcclxuXHRcdFx0XHRuZXh0Vmlld3MgPSB7XHJcblx0XHRcdFx0XHRtb250aDogJ2RheXMnLFxyXG5cdFx0XHRcdFx0eWVhcjogJ21vbnRocydcclxuXHRcdFx0XHR9XHJcblx0XHRcdDtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlICl7XHJcblx0XHRcdFx0bWUuc2V0U3RhdGUoe1xyXG5cdFx0XHRcdFx0dmlld0RhdGU6IG1lLnN0YXRlLnZpZXdEYXRlLmNsb25lKClbIHR5cGUgXSggcGFyc2VJbnQoZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJyksIDEwKSApLnN0YXJ0T2YoIHR5cGUgKSxcclxuXHRcdFx0XHRcdGN1cnJlbnRWaWV3OiBuZXh0Vmlld3NbIHR5cGUgXVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9O1xyXG5cdFx0fSxcclxuXHJcblx0XHRhZGRUaW1lOiBmdW5jdGlvbiggYW1vdW50LCB0eXBlLCB0b1NlbGVjdGVkICl7XHJcblx0XHRcdHJldHVybiB0aGlzLnVwZGF0ZVRpbWUoICdhZGQnLCBhbW91bnQsIHR5cGUsIHRvU2VsZWN0ZWQgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0c3VidHJhY3RUaW1lOiBmdW5jdGlvbiggYW1vdW50LCB0eXBlLCB0b1NlbGVjdGVkICl7XHJcblx0XHRcdHJldHVybiB0aGlzLnVwZGF0ZVRpbWUoICdzdWJ0cmFjdCcsIGFtb3VudCwgdHlwZSwgdG9TZWxlY3RlZCApO1xyXG5cdFx0fSxcclxuXHJcblx0XHR1cGRhdGVUaW1lOiBmdW5jdGlvbiggb3AsIGFtb3VudCwgdHlwZSwgdG9TZWxlY3RlZCApe1xyXG5cdFx0XHR2YXIgbWUgPSB0aGlzO1xyXG5cclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIHVwZGF0ZSA9IHt9LFxyXG5cdFx0XHRcdFx0ZGF0ZSA9IHRvU2VsZWN0ZWQgPyAnc2VsZWN0ZWREYXRlJyA6ICd2aWV3RGF0ZSdcclxuXHRcdFx0XHQ7XHJcblxyXG5cdFx0XHRcdHVwZGF0ZVsgZGF0ZSBdID0gbWUuc3RhdGVbIGRhdGUgXS5jbG9uZSgpWyBvcCBdKCBhbW91bnQsIHR5cGUgKTtcclxuXHJcblx0XHRcdFx0bWUuc2V0U3RhdGUoIHVwZGF0ZSApO1xyXG5cdFx0XHR9O1xyXG5cdFx0fSxcclxuXHJcblx0XHRhbGxvd2VkU2V0VGltZTogWydob3VycycsICdtaW51dGVzJywgJ3NlY29uZHMnLCAnbWlsbGlzZWNvbmRzJ10sXHJcblx0XHRzZXRUaW1lOiBmdW5jdGlvbiggdHlwZSwgdmFsdWUgKXtcclxuXHRcdFx0dmFyIGluZGV4ID0gdGhpcy5hbGxvd2VkU2V0VGltZS5pbmRleE9mKCB0eXBlICkgKyAxLFxyXG5cdFx0XHRcdHN0YXRlID0gdGhpcy5zdGF0ZSxcclxuXHRcdFx0XHRkYXRlID0gKHN0YXRlLnNlbGVjdGVkRGF0ZSB8fCBzdGF0ZS52aWV3RGF0ZSkuY2xvbmUoKSxcclxuXHRcdFx0XHRuZXh0VHlwZVxyXG5cdFx0XHQ7XHJcblxyXG5cdFx0XHQvLyBJdCBpcyBuZWVkZWQgdG8gc2V0IGFsbCB0aGUgdGltZSBwcm9wZXJ0aWVzXHJcblx0XHRcdC8vIHRvIG5vdCB0byByZXNldCB0aGUgdGltZVxyXG5cdFx0XHRkYXRlWyB0eXBlIF0oIHZhbHVlICk7XHJcblx0XHRcdGZvciAoOyBpbmRleCA8IHRoaXMuYWxsb3dlZFNldFRpbWUubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdFx0bmV4dFR5cGUgPSB0aGlzLmFsbG93ZWRTZXRUaW1lW2luZGV4XTtcclxuXHRcdFx0XHRkYXRlWyBuZXh0VHlwZSBdKCBkYXRlW25leHRUeXBlXSgpICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggIXRoaXMucHJvcHMudmFsdWUgKXtcclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRcdHNlbGVjdGVkRGF0ZTogZGF0ZSxcclxuXHRcdFx0XHRcdGlucHV0VmFsdWU6IGRhdGUuZm9ybWF0KCBzdGF0ZS5pbnB1dEZvcm1hdCApXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5wcm9wcy5vbkNoYW5nZSggZGF0ZSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHR1cGRhdGVTZWxlY3RlZERhdGU6IGZ1bmN0aW9uKCBlLCBjbG9zZSApIHtcclxuXHRcdFx0dmFyIHRhcmdldCA9IGUudGFyZ2V0LFxyXG5cdFx0XHRcdG1vZGlmaWVyID0gMCxcclxuXHRcdFx0XHR2aWV3RGF0ZSA9IHRoaXMuc3RhdGUudmlld0RhdGUsXHJcblx0XHRcdFx0Y3VycmVudERhdGUgPSB0aGlzLnN0YXRlLnNlbGVjdGVkRGF0ZSB8fCB2aWV3RGF0ZSxcclxuXHRcdFx0XHRkYXRlXHJcblx0ICAgIDtcclxuXHJcblx0XHRcdGlmICh0YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3JkdERheScpICE9PSAtMSl7XHJcblx0XHRcdFx0aWYgKHRhcmdldC5jbGFzc05hbWUuaW5kZXhPZigncmR0TmV3JykgIT09IC0xKVxyXG5cdFx0XHRcdFx0bW9kaWZpZXIgPSAxO1xyXG5cdFx0XHRcdGVsc2UgaWYgKHRhcmdldC5jbGFzc05hbWUuaW5kZXhPZigncmR0T2xkJykgIT09IC0xKVxyXG5cdFx0XHRcdFx0bW9kaWZpZXIgPSAtMTtcclxuXHJcblx0XHRcdFx0ZGF0ZSA9IHZpZXdEYXRlLmNsb25lKClcclxuXHRcdFx0XHRcdC5tb250aCggdmlld0RhdGUubW9udGgoKSArIG1vZGlmaWVyIClcclxuXHRcdFx0XHRcdC5kYXRlKCBwYXJzZUludCggdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpLCAxMCApICk7XHJcblx0XHRcdH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCdyZHRNb250aCcpICE9PSAtMSl7XHJcblx0XHRcdFx0ZGF0ZSA9IHZpZXdEYXRlLmNsb25lKClcclxuXHRcdFx0XHRcdC5tb250aCggcGFyc2VJbnQoIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKSwgMTAgKSApXHJcblx0XHRcdFx0XHQuZGF0ZSggY3VycmVudERhdGUuZGF0ZSgpICk7XHJcblx0XHRcdH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCdyZHRZZWFyJykgIT09IC0xKXtcclxuXHRcdFx0XHRkYXRlID0gdmlld0RhdGUuY2xvbmUoKVxyXG5cdFx0XHRcdFx0Lm1vbnRoKCBjdXJyZW50RGF0ZS5tb250aCgpIClcclxuXHRcdFx0XHRcdC5kYXRlKCBjdXJyZW50RGF0ZS5kYXRlKCkgKVxyXG5cdFx0XHRcdFx0LnllYXIoIHBhcnNlSW50KCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJyksIDEwICkgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZGF0ZS5ob3VycyggY3VycmVudERhdGUuaG91cnMoKSApXHJcblx0XHRcdFx0Lm1pbnV0ZXMoIGN1cnJlbnREYXRlLm1pbnV0ZXMoKSApXHJcblx0XHRcdFx0LnNlY29uZHMoIGN1cnJlbnREYXRlLnNlY29uZHMoKSApXHJcblx0XHRcdFx0Lm1pbGxpc2Vjb25kcyggY3VycmVudERhdGUubWlsbGlzZWNvbmRzKCkgKTtcclxuXHJcblx0XHRcdGlmICggIXRoaXMucHJvcHMudmFsdWUgKXtcclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcclxuXHRcdFx0XHRcdHNlbGVjdGVkRGF0ZTogZGF0ZSxcclxuXHRcdFx0XHRcdHZpZXdEYXRlOiBkYXRlLmNsb25lKCkuc3RhcnRPZignbW9udGgnKSxcclxuXHRcdFx0XHRcdGlucHV0VmFsdWU6IGRhdGUuZm9ybWF0KCB0aGlzLnN0YXRlLmlucHV0Rm9ybWF0ICksXHJcblx0XHRcdFx0XHRvcGVuOiAhKHRoaXMucHJvcHMuY2xvc2VPblNlbGVjdCAmJiBjbG9zZSApXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKHRoaXMucHJvcHMuY2xvc2VPblNlbGVjdCAmJiBjbG9zZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5jbG9zZUNhbGVuZGFyKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnByb3BzLm9uQ2hhbmdlKCBkYXRlICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdG9wZW5DYWxlbmRhcjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICghdGhpcy5zdGF0ZS5vcGVuKSB7XHJcblx0XHRcdFx0dGhpcy5wcm9wcy5vbkZvY3VzKCk7XHJcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IG9wZW46IHRydWUgfSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Y2xvc2VDYWxlbmRhcjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuc2V0U3RhdGUoeyBvcGVuOiBmYWxzZSB9KTtcclxuXHRcdFx0dGhpcy5wcm9wcy5vbkJsdXIoIHRoaXMuc3RhdGUuc2VsZWN0ZWREYXRlIHx8IHRoaXMuc3RhdGUuaW5wdXRWYWx1ZSApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRoYW5kbGVDbGlja091dHNpZGU6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmICggdGhpcy5wcm9wcy5pbnB1dCAmJiB0aGlzLnN0YXRlLm9wZW4gJiYgIXRoaXMucHJvcHMub3BlbiApe1xyXG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyBvcGVuOiBmYWxzZSB9KTtcclxuXHRcdFx0XHR0aGlzLnByb3BzLm9uQmx1ciggdGhpcy5zdGF0ZS5zZWxlY3RlZERhdGUgfHwgdGhpcy5zdGF0ZS5pbnB1dFZhbHVlICk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0bG9jYWxNb21lbnQ6IGZ1bmN0aW9uKCBkYXRlLCBmb3JtYXQgKXtcclxuXHRcdFx0dmFyIG0gPSBtb21lbnQoIGRhdGUsIGZvcm1hdCwgdGhpcy5wcm9wcy5zdHJpY3RQYXJzaW5nICk7XHJcblx0XHRcdGlmICggdGhpcy5wcm9wcy5sb2NhbGUgKVxyXG5cdFx0XHRcdG0ubG9jYWxlKCB0aGlzLnByb3BzLmxvY2FsZSApO1xyXG5cdFx0XHRyZXR1cm4gbTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Y29tcG9uZW50UHJvcHM6IHtcclxuXHRcdFx0ZnJvbVByb3BzOiBbJ3ZhbHVlJywgJ2lzVmFsaWREYXRlJywgJ3JlbmRlckRheScsICdyZW5kZXJNb250aCcsICdyZW5kZXJZZWFyJywgJ3RpbWVDb25zdHJhaW50cyddLFxyXG5cdFx0XHRmcm9tU3RhdGU6IFsndmlld0RhdGUnLCAnc2VsZWN0ZWREYXRlJywgJ3VwZGF0ZU9uJ10sXHJcblx0XHRcdGZyb21UaGlzOiBbJ3NldERhdGUnLCAnc2V0VGltZScsICdzaG93VmlldycsICdhZGRUaW1lJywgJ3N1YnRyYWN0VGltZScsICd1cGRhdGVTZWxlY3RlZERhdGUnLCAnbG9jYWxNb21lbnQnXVxyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRDb21wb25lbnRQcm9wczogZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIG1lID0gdGhpcyxcclxuXHRcdFx0XHRmb3JtYXRzID0gdGhpcy5nZXRGb3JtYXRzKCB0aGlzLnByb3BzICksXHJcblx0XHRcdFx0cHJvcHMgPSB7ZGF0ZUZvcm1hdDogZm9ybWF0cy5kYXRlLCB0aW1lRm9ybWF0OiBmb3JtYXRzLnRpbWV9XHJcblx0XHRcdDtcclxuXHJcblx0XHRcdHRoaXMuY29tcG9uZW50UHJvcHMuZnJvbVByb3BzLmZvckVhY2goIGZ1bmN0aW9uKCBuYW1lICl7XHJcblx0XHRcdFx0cHJvcHNbIG5hbWUgXSA9IG1lLnByb3BzWyBuYW1lIF07XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmNvbXBvbmVudFByb3BzLmZyb21TdGF0ZS5mb3JFYWNoKCBmdW5jdGlvbiggbmFtZSApe1xyXG5cdFx0XHRcdHByb3BzWyBuYW1lIF0gPSBtZS5zdGF0ZVsgbmFtZSBdO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5jb21wb25lbnRQcm9wcy5mcm9tVGhpcy5mb3JFYWNoKCBmdW5jdGlvbiggbmFtZSApe1xyXG5cdFx0XHRcdHByb3BzWyBuYW1lIF0gPSBtZVsgbmFtZSBdO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiBwcm9wcztcclxuXHRcdH0sXHJcblxyXG5cdFx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIENvbXBvbmVudCA9IHRoaXMudmlld0NvbXBvbmVudHNbIHRoaXMuc3RhdGUuY3VycmVudFZpZXcgXSxcclxuXHRcdFx0XHRET00gPSBSZWFjdC5ET00sXHJcblx0XHRcdFx0Y2xhc3NOYW1lID0gJ3JkdCcgKyAodGhpcy5wcm9wcy5jbGFzc05hbWUgP1xyXG5cdCAgICAgICAgICAgICAgICAgICggQXJyYXkuaXNBcnJheSggdGhpcy5wcm9wcy5jbGFzc05hbWUgKSA/XHJcblx0ICAgICAgICAgICAgICAgICAgJyAnICsgdGhpcy5wcm9wcy5jbGFzc05hbWUuam9pbiggJyAnICkgOiAnICcgKyB0aGlzLnByb3BzLmNsYXNzTmFtZSkgOiAnJyksXHJcblx0XHRcdFx0Y2hpbGRyZW4gPSBbXVxyXG5cdFx0XHQ7XHJcblxyXG5cdFx0XHRpZiAoIHRoaXMucHJvcHMuaW5wdXQgKXtcclxuXHRcdFx0XHRjaGlsZHJlbiA9IFsgRE9NLmlucHV0KCBhc3NpZ24oe1xyXG5cdFx0XHRcdFx0a2V5OiAnaScsXHJcblx0XHRcdFx0XHR0eXBlOid0ZXh0JyxcclxuXHRcdFx0XHRcdGNsYXNzTmFtZTogJ2Zvcm0tY29udHJvbCcsXHJcblx0XHRcdFx0XHRvbkZvY3VzOiB0aGlzLm9wZW5DYWxlbmRhcixcclxuXHRcdFx0XHRcdG9uQ2hhbmdlOiB0aGlzLm9uSW5wdXRDaGFuZ2UsXHJcblx0XHRcdFx0XHRvbktleURvd246IHRoaXMub25JbnB1dEtleSxcclxuXHRcdFx0XHRcdG9uS2V5UHJlc3M6IHRoaXMuaW5LZXlQcmVzcyxcclxuXHRcdFx0XHRcdHZhbHVlOiB0aGlzLnN0YXRlLmlucHV0VmFsdWVcclxuXHRcdFx0XHR9LCB0aGlzLnByb3BzLmlucHV0UHJvcHMgKSldO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNsYXNzTmFtZSArPSAnIHJkdFN0YXRpYyc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggdGhpcy5zdGF0ZS5vcGVuIClcclxuXHRcdFx0XHRjbGFzc05hbWUgKz0gJyByZHRPcGVuJztcclxuXHJcblx0XHRcdHJldHVybiBET00uZGl2KHtjbGFzc05hbWU6IGNsYXNzTmFtZX0sIGNoaWxkcmVuLmNvbmNhdChcclxuXHRcdFx0XHRET00uZGl2KFxyXG5cdFx0XHRcdFx0eyBrZXk6ICdkdCcsIGNsYXNzTmFtZTogJ3JkdFBpY2tlcicgfSxcclxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoIENvbXBvbmVudCwgdGhpcy5nZXRDb21wb25lbnRQcm9wcygpKVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdC8vIE1ha2UgbW9tZW50IGFjY2Vzc2libGUgdGhyb3VnaCB0aGUgRGF0ZXRpbWUgY2xhc3NcclxuXHREYXRldGltZS5tb21lbnQgPSBtb21lbnQ7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gRGF0ZXRpbWU7XHJcblxuXG4vKioqLyB9LFxuLyogMSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cblx0ZnVuY3Rpb24gVG9PYmplY3QodmFsKSB7XG5cdFx0aWYgKHZhbCA9PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHRcdH1cblxuXHRcdHJldHVybiBPYmplY3QodmFsKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG93bkVudW1lcmFibGVLZXlzKG9iaikge1xuXHRcdHZhciBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKTtcblxuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRrZXlzID0ga2V5cy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmopKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ga2V5cy5maWx0ZXIoZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cmV0dXJuIHByb3BJc0VudW1lcmFibGUuY2FsbChvYmosIGtleSk7XG5cdFx0fSk7XG5cdH1cblxuXHRtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdFx0dmFyIGZyb207XG5cdFx0dmFyIGtleXM7XG5cdFx0dmFyIHRvID0gVG9PYmplY3QodGFyZ2V0KTtcblxuXHRcdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0XHRmcm9tID0gYXJndW1lbnRzW3NdO1xuXHRcdFx0a2V5cyA9IG93bkVudW1lcmFibGVLZXlzKE9iamVjdChmcm9tKSk7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR0b1trZXlzW2ldXSA9IGZyb21ba2V5c1tpXV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRvO1xuXHR9O1xuXG5cbi8qKiovIH0sXG4vKiAyICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMl9fO1xuXG4vKioqLyB9LFxuLyogMyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHR2YXIgUmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpLFxyXG5cdFx0bW9tZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0KVxyXG5cdDtcclxuXHJcblx0dmFyIERPTSA9IFJlYWN0LkRPTTtcclxuXHR2YXIgRGF0ZVRpbWVQaWNrZXJEYXlzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuXHRcdHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBmb290ZXIgPSB0aGlzLnJlbmRlckZvb3RlcigpLFxyXG5cdFx0XHRcdGRhdGUgPSB0aGlzLnByb3BzLnZpZXdEYXRlLFxyXG5cdFx0XHRcdGxvY2FsZSA9IGRhdGUubG9jYWxlRGF0YSgpLFxyXG5cdFx0XHRcdHRhYmxlQ2hpbGRyZW5cclxuXHRcdFx0O1xyXG5cclxuXHRcdFx0dGFibGVDaGlsZHJlbiA9IFtcclxuXHRcdFx0XHRET00udGhlYWQoeyBrZXk6ICd0aCd9LCBbXHJcblx0XHRcdFx0XHRET00udHIoeyBrZXk6ICdoJ30sIFtcclxuXHRcdFx0XHRcdFx0RE9NLnRoKHsga2V5OiAncCcsIGNsYXNzTmFtZTogJ3JkdFByZXYnIH0sIERPTS5zcGFuKHtvbkNsaWNrOiB0aGlzLnByb3BzLnN1YnRyYWN0VGltZSgxLCAnbW9udGhzJyl9LCAn4oC5JykpLFxyXG5cdFx0XHRcdFx0XHRET00udGgoeyBrZXk6ICdzJywgY2xhc3NOYW1lOiAncmR0U3dpdGNoJywgb25DbGljazogdGhpcy5wcm9wcy5zaG93VmlldygnbW9udGhzJyksIGNvbFNwYW46IDUsICdkYXRhLXZhbHVlJzogdGhpcy5wcm9wcy52aWV3RGF0ZS5tb250aCgpIH0sIGxvY2FsZS5tb250aHMoIGRhdGUgKSArICcgJyArIGRhdGUueWVhcigpICksXHJcblx0XHRcdFx0XHRcdERPTS50aCh7IGtleTogJ24nLCBjbGFzc05hbWU6ICdyZHROZXh0JyB9LCBET00uc3Bhbih7b25DbGljazogdGhpcy5wcm9wcy5hZGRUaW1lKDEsICdtb250aHMnKX0sICfigLonKSlcclxuXHRcdFx0XHRcdF0pLFxyXG5cdFx0XHRcdFx0RE9NLnRyKHsga2V5OiAnZCd9LCB0aGlzLmdldERheXNPZldlZWsoIGxvY2FsZSApLm1hcCggZnVuY3Rpb24oIGRheSwgaW5kZXggKXsgcmV0dXJuIERPTS50aCh7IGtleTogZGF5ICsgaW5kZXgsIGNsYXNzTmFtZTogJ2Rvdyd9LCBkYXkgKTsgfSkgKVxyXG5cdFx0XHRcdF0pLFxyXG5cdFx0XHRcdERPTS50Ym9keSh7a2V5OiAndGInfSwgdGhpcy5yZW5kZXJEYXlzKCkpXHJcblx0XHRcdF07XHJcblxyXG5cdFx0XHRpZiAoIGZvb3RlciApXHJcblx0XHRcdFx0dGFibGVDaGlsZHJlbi5wdXNoKCBmb290ZXIgKTtcclxuXHJcblx0XHRcdHJldHVybiBET00uZGl2KHsgY2xhc3NOYW1lOiAncmR0RGF5cycgfSxcclxuXHRcdFx0XHRET00udGFibGUoe30sIHRhYmxlQ2hpbGRyZW4gKVxyXG5cdFx0XHQpO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEdldCBhIGxpc3Qgb2YgdGhlIGRheXMgb2YgdGhlIHdlZWtcclxuXHRcdCAqIGRlcGVuZGluZyBvbiB0aGUgY3VycmVudCBsb2NhbGVcclxuXHRcdCAqIEByZXR1cm4ge2FycmF5fSBBIGxpc3Qgd2l0aCB0aGUgc2hvcnRuYW1lIG9mIHRoZSBkYXlzXHJcblx0XHQgKi9cclxuXHRcdGdldERheXNPZldlZWs6IGZ1bmN0aW9uKCBsb2NhbGUgKXtcclxuXHRcdFx0dmFyIGRheXMgPSBsb2NhbGUuX3dlZWtkYXlzTWluLFxyXG5cdFx0XHRcdGZpcnN0ID0gbG9jYWxlLmZpcnN0RGF5T2ZXZWVrKCksXHJcblx0XHRcdFx0ZG93ID0gW10sXHJcblx0XHRcdFx0aSA9IDBcclxuXHRcdFx0O1xyXG5cclxuXHRcdFx0ZGF5cy5mb3JFYWNoKCBmdW5jdGlvbiggZGF5ICl7XHJcblx0XHRcdFx0ZG93WyAoNyArIChpKyspIC0gZmlyc3QpICUgNyBdID0gZGF5O1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiBkb3c7XHJcblx0XHR9LFxyXG5cclxuXHRcdHJlbmRlckRheXM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgZGF0ZSA9IHRoaXMucHJvcHMudmlld0RhdGUsXHJcblx0XHRcdFx0c2VsZWN0ZWQgPSB0aGlzLnByb3BzLnNlbGVjdGVkRGF0ZSAmJiB0aGlzLnByb3BzLnNlbGVjdGVkRGF0ZS5jbG9uZSgpLFxyXG5cdFx0XHRcdHByZXZNb250aCA9IGRhdGUuY2xvbmUoKS5zdWJ0cmFjdCggMSwgJ21vbnRocycgKSxcclxuXHRcdFx0XHRjdXJyZW50WWVhciA9IGRhdGUueWVhcigpLFxyXG5cdFx0XHRcdGN1cnJlbnRNb250aCA9IGRhdGUubW9udGgoKSxcclxuXHRcdFx0XHR3ZWVrcyA9IFtdLFxyXG5cdFx0XHRcdGRheXMgPSBbXSxcclxuXHRcdFx0XHRyZW5kZXJlciA9IHRoaXMucHJvcHMucmVuZGVyRGF5IHx8IHRoaXMucmVuZGVyRGF5LFxyXG5cdFx0XHRcdGlzVmFsaWQgPSB0aGlzLnByb3BzLmlzVmFsaWREYXRlIHx8IHRoaXMuaXNWYWxpZERhdGUsXHJcblx0XHRcdFx0Y2xhc3NlcywgZGlzYWJsZWQsIGRheVByb3BzLCBjdXJyZW50RGF0ZVxyXG5cdFx0XHQ7XHJcblxyXG5cdFx0XHQvLyBHbyB0byB0aGUgbGFzdCB3ZWVrIG9mIHRoZSBwcmV2aW91cyBtb250aFxyXG5cdFx0XHRwcmV2TW9udGguZGF0ZSggcHJldk1vbnRoLmRheXNJbk1vbnRoKCkgKS5zdGFydE9mKCd3ZWVrJyk7XHJcblx0XHRcdHZhciBsYXN0RGF5ID0gcHJldk1vbnRoLmNsb25lKCkuYWRkKDQyLCAnZCcpO1xyXG5cclxuXHRcdFx0d2hpbGUgKCBwcmV2TW9udGguaXNCZWZvcmUoIGxhc3REYXkgKSApe1xyXG5cdFx0XHRcdGNsYXNzZXMgPSAncmR0RGF5JztcclxuXHRcdFx0XHRjdXJyZW50RGF0ZSA9IHByZXZNb250aC5jbG9uZSgpO1xyXG5cclxuXHRcdFx0XHRpZiAoICggcHJldk1vbnRoLnllYXIoKSA9PT0gY3VycmVudFllYXIgJiYgcHJldk1vbnRoLm1vbnRoKCkgPCBjdXJyZW50TW9udGggKSB8fCAoIHByZXZNb250aC55ZWFyKCkgPCBjdXJyZW50WWVhciApIClcclxuXHRcdFx0XHRcdGNsYXNzZXMgKz0gJyByZHRPbGQnO1xyXG5cdFx0XHRcdGVsc2UgaWYgKCAoIHByZXZNb250aC55ZWFyKCkgPT09IGN1cnJlbnRZZWFyICYmIHByZXZNb250aC5tb250aCgpID4gY3VycmVudE1vbnRoICkgfHwgKCBwcmV2TW9udGgueWVhcigpID4gY3VycmVudFllYXIgKSApXHJcblx0XHRcdFx0XHRjbGFzc2VzICs9ICcgcmR0TmV3JztcclxuXHJcblx0XHRcdFx0aWYgKCBzZWxlY3RlZCAmJiBwcmV2TW9udGguaXNTYW1lKHNlbGVjdGVkLCAnZGF5JykgKVxyXG5cdFx0XHRcdFx0Y2xhc3NlcyArPSAnIHJkdEFjdGl2ZSc7XHJcblxyXG5cdFx0XHRcdGlmIChwcmV2TW9udGguaXNTYW1lKG1vbWVudCgpLCAnZGF5JykgKVxyXG5cdFx0XHRcdFx0Y2xhc3NlcyArPSAnIHJkdFRvZGF5JztcclxuXHJcblx0XHRcdFx0ZGlzYWJsZWQgPSAhaXNWYWxpZCggY3VycmVudERhdGUsIHNlbGVjdGVkICk7XHJcblx0XHRcdFx0aWYgKCBkaXNhYmxlZCApXHJcblx0XHRcdFx0XHRjbGFzc2VzICs9ICcgcmR0RGlzYWJsZWQnO1xyXG5cclxuXHRcdFx0XHRkYXlQcm9wcyA9IHtcclxuXHRcdFx0XHRcdGtleTogcHJldk1vbnRoLmZvcm1hdCgnTV9EJyksXHJcblx0XHRcdFx0XHQnZGF0YS12YWx1ZSc6IHByZXZNb250aC5kYXRlKCksXHJcblx0XHRcdFx0XHRjbGFzc05hbWU6IGNsYXNzZXNcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmICggIWRpc2FibGVkIClcclxuXHRcdFx0XHRcdGRheVByb3BzLm9uQ2xpY2sgPSB0aGlzLnVwZGF0ZVNlbGVjdGVkRGF0ZTtcclxuXHJcblx0XHRcdFx0ZGF5cy5wdXNoKCByZW5kZXJlciggZGF5UHJvcHMsIGN1cnJlbnREYXRlLCBzZWxlY3RlZCApICk7XHJcblxyXG5cdFx0XHRcdGlmICggZGF5cy5sZW5ndGggPT09IDcgKXtcclxuXHRcdFx0XHRcdHdlZWtzLnB1c2goIERPTS50cigge2tleTogcHJldk1vbnRoLmZvcm1hdCgnTV9EJyl9LCBkYXlzICkgKTtcclxuXHRcdFx0XHRcdGRheXMgPSBbXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHByZXZNb250aC5hZGQoIDEsICdkJyApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gd2Vla3M7XHJcblx0XHR9LFxyXG5cclxuXHRcdHVwZGF0ZVNlbGVjdGVkRGF0ZTogZnVuY3Rpb24oIGV2ZW50ICkge1xyXG5cdFx0XHR0aGlzLnByb3BzLnVwZGF0ZVNlbGVjdGVkRGF0ZShldmVudCwgdHJ1ZSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHJlbmRlckRheTogZnVuY3Rpb24oIHByb3BzLCBjdXJyZW50RGF0ZSApe1xyXG5cdFx0XHRyZXR1cm4gRE9NLnRkKCBwcm9wcywgY3VycmVudERhdGUuZGF0ZSgpICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHJlbmRlckZvb3RlcjogZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKCAhdGhpcy5wcm9wcy50aW1lRm9ybWF0IClcclxuXHRcdFx0XHRyZXR1cm4gJyc7XHJcblxyXG5cdFx0XHR2YXIgZGF0ZSA9IHRoaXMucHJvcHMuc2VsZWN0ZWREYXRlIHx8IHRoaXMucHJvcHMudmlld0RhdGU7XHJcblxyXG5cdFx0XHRyZXR1cm4gRE9NLnRmb290KHsga2V5OiAndGYnfSxcclxuXHRcdFx0XHRET00udHIoe30sXHJcblx0XHRcdFx0XHRET00udGQoeyBvbkNsaWNrOiB0aGlzLnByb3BzLnNob3dWaWV3KCd0aW1lJyksIGNvbFNwYW46IDcsIGNsYXNzTmFtZTogJ3JkdFRpbWVUb2dnbGUnfSwgZGF0ZS5mb3JtYXQoIHRoaXMucHJvcHMudGltZUZvcm1hdCApKVxyXG5cdFx0XHRcdClcclxuXHRcdFx0KTtcclxuXHRcdH0sXHJcblx0XHRpc1ZhbGlkRGF0ZTogZnVuY3Rpb24oKXsgcmV0dXJuIDE7IH1cclxuXHR9KTtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBEYXRlVGltZVBpY2tlckRheXM7XHJcblxuXG4vKioqLyB9LFxuLyogNCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzRfXztcblxuLyoqKi8gfSxcbi8qIDUgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyIFJlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKTtcclxuXHJcblx0dmFyIERPTSA9IFJlYWN0LkRPTTtcclxuXHR2YXIgRGF0ZVRpbWVQaWNrZXJNb250aHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0XHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gRE9NLmRpdih7IGNsYXNzTmFtZTogJ3JkdE1vbnRocycgfSwgW1xyXG5cdFx0XHRcdERPTS50YWJsZSh7IGtleTogJ2EnfSwgRE9NLnRoZWFkKHt9LCBET00udHIoe30sIFtcclxuXHRcdFx0XHRcdERPTS50aCh7IGtleTogJ3ByZXYnLCBjbGFzc05hbWU6ICdyZHRQcmV2JyB9LCBET00uc3Bhbih7b25DbGljazogdGhpcy5wcm9wcy5zdWJ0cmFjdFRpbWUoMSwgJ3llYXJzJyl9LCAn4oC5JykpLFxyXG5cdFx0XHRcdFx0RE9NLnRoKHsga2V5OiAneWVhcicsIGNsYXNzTmFtZTogJ3JkdFN3aXRjaCcsIG9uQ2xpY2s6IHRoaXMucHJvcHMuc2hvd1ZpZXcoJ3llYXJzJyksIGNvbFNwYW46IDIsICdkYXRhLXZhbHVlJzogdGhpcy5wcm9wcy52aWV3RGF0ZS55ZWFyKCl9LCB0aGlzLnByb3BzLnZpZXdEYXRlLnllYXIoKSApLFxyXG5cdFx0XHRcdFx0RE9NLnRoKHsga2V5OiAnbmV4dCcsIGNsYXNzTmFtZTogJ3JkdE5leHQnIH0sIERPTS5zcGFuKHtvbkNsaWNrOiB0aGlzLnByb3BzLmFkZFRpbWUoMSwgJ3llYXJzJyl9LCAn4oC6JykpXHJcblx0XHRcdFx0XSkpKSxcclxuXHRcdFx0XHRET00udGFibGUoeyBrZXk6ICdtb250aHMnfSwgRE9NLnRib2R5KHsga2V5OiAnYid9LCB0aGlzLnJlbmRlck1vbnRocygpKSlcclxuXHRcdFx0XSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHJlbmRlck1vbnRoczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBkYXRlID0gdGhpcy5wcm9wcy5zZWxlY3RlZERhdGUsXHJcblx0XHRcdFx0bW9udGggPSB0aGlzLnByb3BzLnZpZXdEYXRlLm1vbnRoKCksXHJcblx0XHRcdFx0eWVhciA9IHRoaXMucHJvcHMudmlld0RhdGUueWVhcigpLFxyXG5cdFx0XHRcdHJvd3MgPSBbXSxcclxuXHRcdFx0XHRpID0gMCxcclxuXHRcdFx0XHRtb250aHMgPSBbXSxcclxuXHRcdFx0XHRyZW5kZXJlciA9IHRoaXMucHJvcHMucmVuZGVyTW9udGggfHwgdGhpcy5yZW5kZXJNb250aCxcclxuXHRcdFx0XHRjbGFzc2VzLCBwcm9wc1xyXG5cdFx0XHQ7XHJcblxyXG5cdFx0XHR3aGlsZSAoaSA8IDEyKSB7XHJcblx0XHRcdFx0Y2xhc3NlcyA9ICdyZHRNb250aCc7XHJcblx0XHRcdFx0aWYgKCBkYXRlICYmIGkgPT09IG1vbnRoICYmIHllYXIgPT09IGRhdGUueWVhcigpIClcclxuXHRcdFx0XHRcdGNsYXNzZXMgKz0gJyByZHRBY3RpdmUnO1xyXG5cclxuXHRcdFx0XHRwcm9wcyA9IHtcclxuXHRcdFx0XHRcdGtleTogaSxcclxuXHRcdFx0XHRcdCdkYXRhLXZhbHVlJzogaSxcclxuXHRcdFx0XHRcdGNsYXNzTmFtZTogY2xhc3NlcyxcclxuXHRcdFx0XHRcdG9uQ2xpY2s6IHRoaXMucHJvcHMudXBkYXRlT24gPT09ICdtb250aHMnPyB0aGlzLnVwZGF0ZVNlbGVjdGVkTW9udGggOiB0aGlzLnByb3BzLnNldERhdGUoJ21vbnRoJylcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRtb250aHMucHVzaCggcmVuZGVyZXIoIHByb3BzLCBpLCB5ZWFyLCBkYXRlICYmIGRhdGUuY2xvbmUoKSApKTtcclxuXHJcblx0XHRcdFx0aWYgKCBtb250aHMubGVuZ3RoID09PSA0ICl7XHJcblx0XHRcdFx0XHRyb3dzLnB1c2goIERPTS50cih7IGtleTogbW9udGggKyAnXycgKyByb3dzLmxlbmd0aCB9LCBtb250aHMpICk7XHJcblx0XHRcdFx0XHRtb250aHMgPSBbXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGkrKztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHJvd3M7XHJcblx0XHR9LFxyXG5cclxuXHRcdHVwZGF0ZVNlbGVjdGVkTW9udGg6IGZ1bmN0aW9uKCBldmVudCApIHtcclxuXHRcdFx0dGhpcy5wcm9wcy51cGRhdGVTZWxlY3RlZERhdGUoZXZlbnQsIHRydWUpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRyZW5kZXJNb250aDogZnVuY3Rpb24oIHByb3BzLCBtb250aCApIHtcclxuXHRcdFx0dmFyIG1vbnRoc1Nob3J0ID0gdGhpcy5wcm9wcy52aWV3RGF0ZS5sb2NhbGVEYXRhKCkuX21vbnRoc1Nob3J0O1xyXG5cdFx0XHRyZXR1cm4gRE9NLnRkKCBwcm9wcywgbW9udGhzU2hvcnQuc3RhbmRhbG9uZVxyXG5cdFx0XHRcdD8gY2FwaXRhbGl6ZSggbW9udGhzU2hvcnQuc3RhbmRhbG9uZVsgbW9udGggXSApXHJcblx0XHRcdFx0OiBtb250aHNTaG9ydFsgbW9udGggXVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRmdW5jdGlvbiBjYXBpdGFsaXplKHN0cikge1xyXG5cdFx0cmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcclxuXHR9XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gRGF0ZVRpbWVQaWNrZXJNb250aHM7XHJcblxuXG4vKioqLyB9LFxuLyogNiAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHR2YXIgUmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpO1xyXG5cclxuXHR2YXIgRE9NID0gUmVhY3QuRE9NO1xyXG5cdHZhciBEYXRlVGltZVBpY2tlclllYXJzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdFx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHllYXIgPSBwYXJzZUludCh0aGlzLnByb3BzLnZpZXdEYXRlLnllYXIoKSAvIDEwLCAxMCkgKiAxMDtcclxuXHJcblx0XHRcdHJldHVybiBET00uZGl2KHsgY2xhc3NOYW1lOiAncmR0WWVhcnMnIH0sIFtcclxuXHRcdFx0XHRET00udGFibGUoeyBrZXk6ICdhJ30sIERPTS50aGVhZCh7fSwgRE9NLnRyKHt9LCBbXHJcblx0XHRcdFx0XHRET00udGgoeyBrZXk6ICdwcmV2JywgY2xhc3NOYW1lOiAncmR0UHJldicgfSwgRE9NLnNwYW4oe29uQ2xpY2s6IHRoaXMucHJvcHMuc3VidHJhY3RUaW1lKDEwLCAneWVhcnMnKX0sICfigLknKSksXHJcblx0XHRcdFx0XHRET00udGgoeyBrZXk6ICd5ZWFyJywgY2xhc3NOYW1lOiAncmR0U3dpdGNoJywgb25DbGljazogdGhpcy5wcm9wcy5zaG93VmlldygneWVhcnMnKSwgY29sU3BhbjogMiB9LCB5ZWFyICsgJy0nICsgKHllYXIgKyA5KSApLFxyXG5cdFx0XHRcdFx0RE9NLnRoKHsga2V5OiAnbmV4dCcsIGNsYXNzTmFtZTogJ3JkdE5leHQnfSwgRE9NLnNwYW4oe29uQ2xpY2s6IHRoaXMucHJvcHMuYWRkVGltZSgxMCwgJ3llYXJzJyl9LCAn4oC6JykpXHJcblx0XHRcdFx0XHRdKSkpLFxyXG5cdFx0XHRcdERPTS50YWJsZSh7IGtleTogJ3llYXJzJ30sIERPTS50Ym9keSh7fSwgdGhpcy5yZW5kZXJZZWFycyggeWVhciApKSlcclxuXHRcdFx0XSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHJlbmRlclllYXJzOiBmdW5jdGlvbiggeWVhciApIHtcclxuXHRcdFx0dmFyIHllYXJzID0gW10sXHJcblx0XHRcdFx0aSA9IC0xLFxyXG5cdFx0XHRcdHJvd3MgPSBbXSxcclxuXHRcdFx0XHRyZW5kZXJlciA9IHRoaXMucHJvcHMucmVuZGVyWWVhciB8fCB0aGlzLnJlbmRlclllYXIsXHJcblx0XHRcdFx0c2VsZWN0ZWREYXRlID0gdGhpcy5wcm9wcy5zZWxlY3RlZERhdGUsXHJcblx0XHRcdFx0Y2xhc3NlcywgcHJvcHNcclxuXHRcdFx0O1xyXG5cclxuXHRcdFx0eWVhci0tO1xyXG5cdFx0XHR3aGlsZSAoaSA8IDExKSB7XHJcblx0XHRcdFx0Y2xhc3NlcyA9ICdyZHRZZWFyJztcclxuXHRcdFx0XHRpZiAoIGkgPT09IC0xIHwgaSA9PT0gMTAgKVxyXG5cdFx0XHRcdFx0Y2xhc3NlcyArPSAnIHJkdE9sZCc7XHJcblx0XHRcdFx0aWYgKCBzZWxlY3RlZERhdGUgJiYgc2VsZWN0ZWREYXRlLnllYXIoKSA9PT0geWVhciApXHJcblx0XHRcdFx0XHRjbGFzc2VzICs9ICcgcmR0QWN0aXZlJztcclxuXHJcblx0XHRcdFx0cHJvcHMgPSB7XHJcblx0XHRcdFx0XHRrZXk6IHllYXIsXHJcblx0XHRcdFx0XHQnZGF0YS12YWx1ZSc6IHllYXIsXHJcblx0XHRcdFx0XHRjbGFzc05hbWU6IGNsYXNzZXMsXHJcblx0XHRcdFx0XHRvbkNsaWNrOiB0aGlzLnByb3BzLnVwZGF0ZU9uID09PSAneWVhcnMnID8gdGhpcy51cGRhdGVTZWxlY3RlZFllYXIgOiB0aGlzLnByb3BzLnNldERhdGUoJ3llYXInKVxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdHllYXJzLnB1c2goIHJlbmRlcmVyKCBwcm9wcywgeWVhciwgc2VsZWN0ZWREYXRlICYmIHNlbGVjdGVkRGF0ZS5jbG9uZSgpICkpO1xyXG5cclxuXHRcdFx0XHRpZiAoIHllYXJzLmxlbmd0aCA9PT0gNCApe1xyXG5cdFx0XHRcdFx0cm93cy5wdXNoKCBET00udHIoeyBrZXk6IGkgfSwgeWVhcnMgKSApO1xyXG5cdFx0XHRcdFx0eWVhcnMgPSBbXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHllYXIrKztcclxuXHRcdFx0XHRpKys7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiByb3dzO1xyXG5cdFx0fSxcclxuXHJcblx0XHR1cGRhdGVTZWxlY3RlZFllYXI6IGZ1bmN0aW9uKCBldmVudCApIHtcclxuXHRcdFx0dGhpcy5wcm9wcy51cGRhdGVTZWxlY3RlZERhdGUoZXZlbnQsIHRydWUpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRyZW5kZXJZZWFyOiBmdW5jdGlvbiggcHJvcHMsIHllYXIgKXtcclxuXHRcdFx0cmV0dXJuIERPTS50ZCggcHJvcHMsIHllYXIgKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBEYXRlVGltZVBpY2tlclllYXJzO1xyXG5cblxuLyoqKi8gfSxcbi8qIDcgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyIFJlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKSxcclxuXHRcdGFzc2lnbiA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XHJcblxyXG5cdHZhciBET00gPSBSZWFjdC5ET007XHJcblx0dmFyIERhdGVUaW1lUGlja2VyVGltZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRcdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKXtcclxuXHRcdFx0cmV0dXJuIHRoaXMuY2FsY3VsYXRlU3RhdGUoIHRoaXMucHJvcHMgKTtcclxuXHRcdH0sXHJcblx0XHRjYWxjdWxhdGVTdGF0ZTogZnVuY3Rpb24oIHByb3BzICl7XHJcblx0XHRcdHZhciBkYXRlID0gcHJvcHMuc2VsZWN0ZWREYXRlIHx8IHByb3BzLnZpZXdEYXRlLFxyXG5cdFx0XHRcdGZvcm1hdCA9IHByb3BzLnRpbWVGb3JtYXQsXHJcblx0XHRcdFx0Y291bnRlcnMgPSBbXVxyXG5cdFx0XHQ7XHJcblxyXG5cdFx0XHRpZiAoIGZvcm1hdC5pbmRleE9mKCdIJykgIT09IC0xIHx8IGZvcm1hdC5pbmRleE9mKCdoJykgIT09IC0xICl7XHJcblx0XHRcdFx0Y291bnRlcnMucHVzaCgnaG91cnMnKTtcclxuXHRcdFx0XHRpZiAoIGZvcm1hdC5pbmRleE9mKCdtJykgIT09IC0xICl7XHJcblx0XHRcdFx0XHRjb3VudGVycy5wdXNoKCdtaW51dGVzJyk7XHJcblx0XHRcdFx0XHRpZiAoIGZvcm1hdC5pbmRleE9mKCdzJykgIT09IC0xICl7XHJcblx0XHRcdFx0XHRcdGNvdW50ZXJzLnB1c2goJ3NlY29uZHMnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBkYXlwYXJ0ID0gZmFsc2U7XHJcblx0XHRcdGlmICggdGhpcy5wcm9wcy50aW1lRm9ybWF0LmluZGV4T2YoJyBBJykgIT09IC0xICAmJiB0aGlzLnN0YXRlICE9PSBudWxsICl7XHJcblx0XHRcdFx0ZGF5cGFydCA9ICggdGhpcy5zdGF0ZS5ob3VycyA+PSAxMiApID8gJ1BNJyA6ICdBTSc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0aG91cnM6IGRhdGUuZm9ybWF0KCdIJyksXHJcblx0XHRcdFx0bWludXRlczogZGF0ZS5mb3JtYXQoJ21tJyksXHJcblx0XHRcdFx0c2Vjb25kczogZGF0ZS5mb3JtYXQoJ3NzJyksXHJcblx0XHRcdFx0bWlsbGlzZWNvbmRzOiBkYXRlLmZvcm1hdCgnU1NTJyksXHJcblx0XHRcdFx0ZGF5cGFydDogZGF5cGFydCxcclxuXHRcdFx0XHRjb3VudGVyczogY291bnRlcnNcclxuXHRcdFx0fTtcclxuXHRcdH0sXHJcblx0XHRyZW5kZXJDb3VudGVyOiBmdW5jdGlvbiggdHlwZSApe1xyXG5cdFx0XHRpZiAodHlwZSAhPT0gJ2RheXBhcnQnKSB7XHJcblx0XHRcdFx0dmFyIHZhbHVlID0gdGhpcy5zdGF0ZVsgdHlwZSBdO1xyXG5cdFx0XHRcdGlmICh0eXBlID09PSAnaG91cnMnICYmIHRoaXMucHJvcHMudGltZUZvcm1hdC5pbmRleE9mKCcgQScpICE9PSAtMSkge1xyXG5cdFx0XHRcdFx0dmFsdWUgPSAodmFsdWUgLSAxKSAlIDEyICsgMTtcclxuXHJcblx0XHRcdFx0XHRpZiAodmFsdWUgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0dmFsdWUgPSAxMjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIERPTS5kaXYoeyBrZXk6IHR5cGUsIGNsYXNzTmFtZTogJ3JkdENvdW50ZXInfSwgW1xyXG5cdFx0XHRcdFx0RE9NLnNwYW4oeyBrZXk6J3VwJywgY2xhc3NOYW1lOiAncmR0QnRuJywgb25Nb3VzZURvd246IHRoaXMub25TdGFydENsaWNraW5nKCAnaW5jcmVhc2UnLCB0eXBlICkgfSwgJ+KWsicgKSxcclxuXHRcdFx0XHRcdERPTS5kaXYoeyBrZXk6J2MnLCBjbGFzc05hbWU6ICdyZHRDb3VudCcgfSwgdmFsdWUgKSxcclxuXHRcdFx0XHRcdERPTS5zcGFuKHsga2V5OidkbycsIGNsYXNzTmFtZTogJ3JkdEJ0bicsIG9uTW91c2VEb3duOiB0aGlzLm9uU3RhcnRDbGlja2luZyggJ2RlY3JlYXNlJywgdHlwZSApIH0sICfilrwnIClcclxuXHRcdFx0XHRdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gJyc7XHJcblx0XHR9LFxyXG5cdFx0cmVuZGVyRGF5UGFydDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBET00uZGl2KHsgY2xhc3NOYW1lOiAncmR0Q291bnRlcicsIGtleTogJ2RheVBhcnQnfSwgW1xyXG5cdFx0XHRcdERPTS5zcGFuKHsga2V5Oid1cCcsIGNsYXNzTmFtZTogJ3JkdEJ0bicsIG9uTW91c2VEb3duOiB0aGlzLm9uU3RhcnRDbGlja2luZyggJ3RvZ2dsZURheVBhcnQnLCAnaG91cnMnKSB9LCAn4payJyApLFxyXG5cdFx0XHRcdERPTS5kaXYoeyBrZXk6IHRoaXMuc3RhdGUuZGF5cGFydCwgY2xhc3NOYW1lOiAncmR0Q291bnQnfSwgdGhpcy5zdGF0ZS5kYXlwYXJ0ICksXHJcblx0XHRcdFx0RE9NLnNwYW4oeyBrZXk6J2RvJywgY2xhc3NOYW1lOiAncmR0QnRuJywgb25Nb3VzZURvd246IHRoaXMub25TdGFydENsaWNraW5nKCAndG9nZ2xlRGF5UGFydCcsICdob3VycycpIH0sICfilrwnIClcclxuXHRcdFx0XSk7XHJcblx0XHR9LFxyXG5cdFx0cmVuZGVyOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIG1lID0gdGhpcyxcclxuXHRcdFx0XHRjb3VudGVycyA9IFtdXHJcblx0XHRcdDtcclxuXHJcblx0XHRcdHRoaXMuc3RhdGUuY291bnRlcnMuZm9yRWFjaCggZnVuY3Rpb24oYyl7XHJcblx0XHRcdFx0aWYgKCBjb3VudGVycy5sZW5ndGggKVxyXG5cdFx0XHRcdFx0Y291bnRlcnMucHVzaCggRE9NLmRpdigge2tleTogJ3NlcCcgKyBjb3VudGVycy5sZW5ndGgsIGNsYXNzTmFtZTogJ3JkdENvdW50ZXJTZXBhcmF0b3InIH0sICc6JyApKTtcclxuXHRcdFx0XHRjb3VudGVycy5wdXNoKCBtZS5yZW5kZXJDb3VudGVyKCBjICkgKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5zdGF0ZS5kYXlwYXJ0ICE9PSBmYWxzZSkge1xyXG5cdFx0XHRcdGNvdW50ZXJzLnB1c2goIG1lLnJlbmRlckRheVBhcnQoKSApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIHRoaXMuc3RhdGUuY291bnRlcnMubGVuZ3RoID09PSAzICYmIHRoaXMucHJvcHMudGltZUZvcm1hdC5pbmRleE9mKCdTJykgIT09IC0xICl7XHJcblx0XHRcdFx0Y291bnRlcnMucHVzaCggRE9NLmRpdigge2NsYXNzTmFtZTogJ3JkdENvdW50ZXJTZXBhcmF0b3InLCBrZXk6ICdzZXA1JyB9LCAnOicgKSk7XHJcblx0XHRcdFx0Y291bnRlcnMucHVzaChcclxuXHRcdFx0XHRcdERPTS5kaXYoIHtjbGFzc05hbWU6ICdyZHRDb3VudGVyIHJkdE1pbGxpJywga2V5OidtJ30sXHJcblx0XHRcdFx0XHRcdERPTS5pbnB1dCh7IHZhbHVlOiB0aGlzLnN0YXRlLm1pbGxpc2Vjb25kcywgdHlwZTogJ3RleHQnLCBvbkNoYW5nZTogdGhpcy51cGRhdGVNaWxsaSB9KVxyXG5cdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gRE9NLmRpdigge2NsYXNzTmFtZTogJ3JkdFRpbWUnfSxcclxuXHRcdFx0XHRET00udGFibGUoIHt9LCBbXHJcblx0XHRcdFx0XHR0aGlzLnJlbmRlckhlYWRlcigpLFxyXG5cdFx0XHRcdFx0RE9NLnRib2R5KHtrZXk6ICdiJ30sIERPTS50cih7fSwgRE9NLnRkKHt9LFxyXG5cdFx0XHRcdFx0XHRET00uZGl2KHsgY2xhc3NOYW1lOiAncmR0Q291bnRlcnMnIH0sIGNvdW50ZXJzIClcclxuXHRcdFx0XHRcdCkpKVxyXG5cdFx0XHRcdF0pXHJcblx0XHRcdCk7XHJcblx0XHR9LFxyXG5cdFx0Y29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIG1lID0gdGhpcztcclxuXHRcdFx0bWUudGltZUNvbnN0cmFpbnRzID0ge1xyXG5cdFx0XHRcdGhvdXJzOiB7XHJcblx0XHRcdFx0XHRtaW46IDAsXHJcblx0XHRcdFx0XHRtYXg6IDIzLFxyXG5cdFx0XHRcdFx0c3RlcDogMVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0bWludXRlczoge1xyXG5cdFx0XHRcdFx0bWluOiAwLFxyXG5cdFx0XHRcdFx0bWF4OiA1OSxcclxuXHRcdFx0XHRcdHN0ZXA6IDFcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHNlY29uZHM6IHtcclxuXHRcdFx0XHRcdG1pbjogMCxcclxuXHRcdFx0XHRcdG1heDogNTksXHJcblx0XHRcdFx0XHRzdGVwOiAxLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0bWlsbGlzZWNvbmRzOiB7XHJcblx0XHRcdFx0XHRtaW46IDAsXHJcblx0XHRcdFx0XHRtYXg6IDk5OSxcclxuXHRcdFx0XHRcdHN0ZXA6IDFcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdFsnaG91cnMnLCAnbWludXRlcycsICdzZWNvbmRzJywgJ21pbGxpc2Vjb25kcyddLmZvckVhY2goZnVuY3Rpb24odHlwZSkge1xyXG5cdFx0XHRcdGFzc2lnbihtZS50aW1lQ29uc3RyYWludHNbdHlwZV0sIG1lLnByb3BzLnRpbWVDb25zdHJhaW50c1t0eXBlXSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKCB0aGlzLmNhbGN1bGF0ZVN0YXRlKCB0aGlzLnByb3BzICkgKTtcclxuXHRcdH0sXHJcblx0XHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiggbmV4dFByb3BzICl7XHJcblx0XHRcdHRoaXMuc2V0U3RhdGUoIHRoaXMuY2FsY3VsYXRlU3RhdGUoIG5leHRQcm9wcyApICk7XHJcblx0XHR9LFxyXG5cdFx0dXBkYXRlTWlsbGk6IGZ1bmN0aW9uKCBlICl7XHJcblx0XHRcdHZhciBtaWxsaSA9IHBhcnNlSW50KCBlLnRhcmdldC52YWx1ZSwgMTAgKTtcclxuXHRcdFx0aWYgKCBtaWxsaSA9PT0gZS50YXJnZXQudmFsdWUgJiYgbWlsbGkgPj0gMCAmJiBtaWxsaSA8IDEwMDAgKXtcclxuXHRcdFx0XHR0aGlzLnByb3BzLnNldFRpbWUoICdtaWxsaXNlY29uZHMnLCBtaWxsaSApO1xyXG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoeyBtaWxsaXNlY29uZHM6IG1pbGxpIH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0cmVuZGVySGVhZGVyOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZiAoICF0aGlzLnByb3BzLmRhdGVGb3JtYXQgKVxyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cclxuXHRcdFx0dmFyIGRhdGUgPSB0aGlzLnByb3BzLnNlbGVjdGVkRGF0ZSB8fCB0aGlzLnByb3BzLnZpZXdEYXRlO1xyXG5cdFx0XHRyZXR1cm4gRE9NLnRoZWFkKHsga2V5OiAnaCd9LCBET00udHIoe30sXHJcblx0XHRcdFx0RE9NLnRoKCB7Y2xhc3NOYW1lOiAncmR0U3dpdGNoJywgY29sU3BhbjogNCwgb25DbGljazogdGhpcy5wcm9wcy5zaG93VmlldygnZGF5cycpfSwgZGF0ZS5mb3JtYXQoIHRoaXMucHJvcHMuZGF0ZUZvcm1hdCApIClcclxuXHRcdFx0KSk7XHJcblx0XHR9LFxyXG5cdFx0b25TdGFydENsaWNraW5nOiBmdW5jdGlvbiggYWN0aW9uLCB0eXBlICl7XHJcblx0XHRcdHZhciBtZSA9IHRoaXM7XHJcblxyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgdXBkYXRlID0ge307XHJcblx0XHRcdFx0dXBkYXRlWyB0eXBlIF0gPSBtZVsgYWN0aW9uIF0oIHR5cGUgKTtcclxuXHRcdFx0XHRtZS5zZXRTdGF0ZSggdXBkYXRlICk7XHJcblxyXG5cdFx0XHRcdG1lLnRpbWVyID0gc2V0VGltZW91dCggZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdG1lLmluY3JlYXNlVGltZXIgPSBzZXRJbnRlcnZhbCggZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdFx0dXBkYXRlWyB0eXBlIF0gPSBtZVsgYWN0aW9uIF0oIHR5cGUgKTtcclxuXHRcdFx0XHRcdFx0bWUuc2V0U3RhdGUoIHVwZGF0ZSApO1xyXG5cdFx0XHRcdFx0fSwgNzApO1xyXG5cdFx0XHRcdH0sIDUwMCk7XHJcblxyXG5cdFx0XHRcdG1lLm1vdXNlVXBMaXN0ZW5lciA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoIG1lLnRpbWVyICk7XHJcblx0XHRcdFx0XHRjbGVhckludGVydmFsKCBtZS5pbmNyZWFzZVRpbWVyICk7XHJcblx0XHRcdFx0XHRtZS5wcm9wcy5zZXRUaW1lKCB0eXBlLCBtZS5zdGF0ZVsgdHlwZSBdICk7XHJcblx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtZS5tb3VzZVVwTGlzdGVuZXIpO1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1lLm1vdXNlVXBMaXN0ZW5lcik7XHJcblx0XHRcdH07XHJcblx0XHR9LFxyXG5cdFx0cGFkVmFsdWVzOiB7XHJcblx0XHRcdGhvdXJzOiAxLFxyXG5cdFx0XHRtaW51dGVzOiAyLFxyXG5cdFx0XHRzZWNvbmRzOiAyLFxyXG5cdFx0XHRtaWxsaXNlY29uZHM6IDNcclxuXHRcdH0sXHJcblx0XHR0b2dnbGVEYXlQYXJ0OiBmdW5jdGlvbiggdHlwZSApeyAvLyB0eXBlIGlzIGFsd2F5cyAnaG91cnMnXHJcblx0XHRcdHZhciB2YWx1ZSA9IHBhcnNlSW50KHRoaXMuc3RhdGVbIHR5cGUgXSwgMTApICsgMTI7XHJcblx0XHRcdGlmICggdmFsdWUgPiB0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLm1heCApXHJcblx0XHRcdFx0dmFsdWUgPSB0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLm1pbiArICh2YWx1ZSAtICh0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLm1heCArIDEpKTtcclxuXHRcdFx0cmV0dXJuIHRoaXMucGFkKCB0eXBlLCB2YWx1ZSApO1xyXG5cdFx0fSxcclxuXHRcdGluY3JlYXNlOiBmdW5jdGlvbiggdHlwZSApe1xyXG5cdFx0XHR2YXIgdmFsdWUgPSBwYXJzZUludCh0aGlzLnN0YXRlWyB0eXBlIF0sIDEwKSArIHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0uc3RlcDtcclxuXHRcdFx0aWYgKCB2YWx1ZSA+IHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0ubWF4IClcclxuXHRcdFx0XHR2YWx1ZSA9IHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0ubWluICsgKCB2YWx1ZSAtICggdGhpcy50aW1lQ29uc3RyYWludHNbIHR5cGUgXS5tYXggICsgMSkgKTtcclxuXHRcdFx0cmV0dXJuIHRoaXMucGFkKCB0eXBlLCB2YWx1ZSApO1xyXG5cdFx0fSxcclxuXHRcdGRlY3JlYXNlOiBmdW5jdGlvbiggdHlwZSApe1xyXG5cdFx0XHR2YXIgdmFsdWUgPSBwYXJzZUludCh0aGlzLnN0YXRlWyB0eXBlIF0sIDEwKSAtIHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0uc3RlcDtcclxuXHRcdFx0aWYgKCB2YWx1ZSA8IHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0ubWluIClcclxuXHRcdFx0XHR2YWx1ZSA9IHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0ubWF4ICsgMSAtICggdGhpcy50aW1lQ29uc3RyYWludHNbIHR5cGUgXS5taW4gLSB2YWx1ZSApO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wYWQoIHR5cGUsIHZhbHVlICk7XHJcblx0XHR9LFxyXG5cdFx0cGFkOiBmdW5jdGlvbiggdHlwZSwgdmFsdWUgKXtcclxuXHRcdFx0dmFyIHN0ciA9IHZhbHVlICsgJyc7XHJcblx0XHRcdHdoaWxlICggc3RyLmxlbmd0aCA8IHRoaXMucGFkVmFsdWVzWyB0eXBlIF0gKVxyXG5cdFx0XHRcdHN0ciA9ICcwJyArIHN0cjtcclxuXHRcdFx0cmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBEYXRlVGltZVBpY2tlclRpbWU7XHJcblxuXG4vKioqLyB9LFxuLyogOCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvLyBUaGlzIGlzIGV4dHJhY3RlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9Qb21heC9yZWFjdC1vbmNsaWNrb3V0c2lkZVxyXG5cdC8vIEFuZCBtb2RpZmllZCB0byBzdXBwb3J0IHJlYWN0IDAuMTMgYW5kIHJlYWN0IDAuMTRcclxuXHJcblx0dmFyIFJlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKSxcclxuXHRcdHZlcnNpb24gPSBSZWFjdC52ZXJzaW9uICYmIFJlYWN0LnZlcnNpb24uc3BsaXQoJy4nKVxyXG5cdDtcclxuXHJcblx0aWYgKCB2ZXJzaW9uICYmICggdmVyc2lvblswXSA+IDAgfHwgdmVyc2lvblsxXSA+IDEzICkgKVxyXG5cdFx0UmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDkpO1xyXG5cclxuXHQvLyBVc2UgYSBwYXJhbGxlbCBhcnJheSBiZWNhdXNlIHdlIGNhbid0IHVzZVxyXG5cdC8vIG9iamVjdHMgYXMga2V5cywgdGhleSBnZXQgdG9TdHJpbmctY29lcmNlZFxyXG5cdHZhciByZWdpc3RlcmVkQ29tcG9uZW50cyA9IFtdO1xyXG5cdHZhciBoYW5kbGVycyA9IFtdO1xyXG5cclxuXHR2YXIgSUdOT1JFX0NMQVNTID0gJ2lnbm9yZS1yZWFjdC1vbmNsaWNrb3V0c2lkZSc7XHJcblxyXG5cdHZhciBpc1NvdXJjZUZvdW5kID0gZnVuY3Rpb24oc291cmNlLCBsb2NhbE5vZGUpIHtcclxuXHQgaWYgKHNvdXJjZSA9PT0gbG9jYWxOb2RlKSB7XHJcblx0ICAgcmV0dXJuIHRydWU7XHJcblx0IH1cclxuXHQgLy8gU1ZHIDx1c2UvPiBlbGVtZW50cyBkbyBub3QgdGVjaG5pY2FsbHkgcmVzaWRlIGluIHRoZSByZW5kZXJlZCBET00sIHNvXHJcblx0IC8vIHRoZXkgZG8gbm90IGhhdmUgY2xhc3NMaXN0IGRpcmVjdGx5LCBidXQgdGhleSBvZmZlciBhIGxpbmsgdG8gdGhlaXJcclxuXHQgLy8gY29ycmVzcG9uZGluZyBlbGVtZW50LCB3aGljaCBjYW4gaGF2ZSBjbGFzc0xpc3QuIFRoaXMgZXh0cmEgY2hlY2sgaXMgZm9yXHJcblx0IC8vIHRoYXQgY2FzZS5cclxuXHQgLy8gU2VlOiBodHRwOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9zdHJ1Y3QuaHRtbCNJbnRlcmZhY2VTVkdVc2VFbGVtZW50XHJcblx0IC8vIERpc2N1c3Npb246IGh0dHBzOi8vZ2l0aHViLmNvbS9Qb21heC9yZWFjdC1vbmNsaWNrb3V0c2lkZS9wdWxsLzE3XHJcblx0IGlmIChzb3VyY2UuY29ycmVzcG9uZGluZ0VsZW1lbnQpIHtcclxuXHQgICByZXR1cm4gc291cmNlLmNvcnJlc3BvbmRpbmdFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhJR05PUkVfQ0xBU1MpO1xyXG5cdCB9XHJcblx0IHJldHVybiBzb3VyY2UuY2xhc3NMaXN0LmNvbnRhaW5zKElHTk9SRV9DTEFTUyk7XHJcblx0fTtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0IGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuXHQgICBpZiAodHlwZW9mIHRoaXMuaGFuZGxlQ2xpY2tPdXRzaWRlICE9PSAnZnVuY3Rpb24nKVxyXG5cdCAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgbGFja3MgYSBoYW5kbGVDbGlja091dHNpZGUoZXZlbnQpIGZ1bmN0aW9uIGZvciBwcm9jZXNzaW5nIG91dHNpZGUgY2xpY2sgZXZlbnRzLicpO1xyXG5cclxuXHQgICB2YXIgZm4gPSB0aGlzLl9fb3V0c2lkZUNsaWNrSGFuZGxlciA9IChmdW5jdGlvbihsb2NhbE5vZGUsIGV2ZW50SGFuZGxlcikge1xyXG5cdCAgICAgcmV0dXJuIGZ1bmN0aW9uKGV2dCkge1xyXG5cdCAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0ICAgICAgIHZhciBzb3VyY2UgPSBldnQudGFyZ2V0O1xyXG5cdCAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcclxuXHQgICAgICAgLy8gSWYgc291cmNlPWxvY2FsIHRoZW4gdGhpcyBldmVudCBjYW1lIGZyb20gXCJzb21ld2hlcmVcIlxyXG5cdCAgICAgICAvLyBpbnNpZGUgYW5kIHNob3VsZCBiZSBpZ25vcmVkLiBXZSBjb3VsZCBoYW5kbGUgdGhpcyB3aXRoXHJcblx0ICAgICAgIC8vIGEgbGF5ZXJlZCBhcHByb2FjaCwgdG9vLCBidXQgdGhhdCByZXF1aXJlcyBnb2luZyBiYWNrIHRvXHJcblx0ICAgICAgIC8vIHRoaW5raW5nIGluIHRlcm1zIG9mIERvbSBub2RlIG5lc3RpbmcsIHJ1bm5pbmcgY291bnRlclxyXG5cdCAgICAgICAvLyB0byBSZWFjdCdzIFwieW91IHNob3VsZG4ndCBjYXJlIGFib3V0IHRoZSBET01cIiBwaGlsb3NvcGh5LlxyXG5cdCAgICAgICB3aGlsZSAoc291cmNlLnBhcmVudE5vZGUpIHtcclxuXHQgICAgICAgICBmb3VuZCA9IGlzU291cmNlRm91bmQoc291cmNlLCBsb2NhbE5vZGUpO1xyXG5cdCAgICAgICAgIGlmIChmb3VuZCkgcmV0dXJuO1xyXG5cdCAgICAgICAgIHNvdXJjZSA9IHNvdXJjZS5wYXJlbnROb2RlO1xyXG5cdCAgICAgICB9XHJcblx0ICAgICAgIGV2ZW50SGFuZGxlcihldnQpO1xyXG5cdCAgICAgfTtcclxuXHQgICB9KFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpLCB0aGlzLmhhbmRsZUNsaWNrT3V0c2lkZSkpO1xyXG5cclxuXHQgICB2YXIgcG9zID0gcmVnaXN0ZXJlZENvbXBvbmVudHMubGVuZ3RoO1xyXG5cdCAgIHJlZ2lzdGVyZWRDb21wb25lbnRzLnB1c2godGhpcyk7XHJcblx0ICAgaGFuZGxlcnNbcG9zXSA9IGZuO1xyXG5cclxuXHQgICAvLyBJZiB0aGVyZSBpcyBhIHRydXRoeSBkaXNhYmxlT25DbGlja091dHNpZGUgcHJvcGVydHkgZm9yIHRoaXNcclxuXHQgICAvLyBjb21wb25lbnQsIGRvbid0IGltbWVkaWF0ZWx5IHN0YXJ0IGxpc3RlbmluZyBmb3Igb3V0c2lkZSBldmVudHMuXHJcblx0ICAgaWYgKCF0aGlzLnByb3BzLmRpc2FibGVPbkNsaWNrT3V0c2lkZSkge1xyXG5cdCAgICAgdGhpcy5lbmFibGVPbkNsaWNrT3V0c2lkZSgpO1xyXG5cdCAgIH1cclxuXHQgfSxcclxuXHJcblx0IGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcclxuXHQgICB0aGlzLmRpc2FibGVPbkNsaWNrT3V0c2lkZSgpO1xyXG5cdCAgIHRoaXMuX19vdXRzaWRlQ2xpY2tIYW5kbGVyID0gZmFsc2U7XHJcblx0ICAgdmFyIHBvcyA9IHJlZ2lzdGVyZWRDb21wb25lbnRzLmluZGV4T2YodGhpcyk7XHJcblx0ICAgaWYgKCBwb3M+LTEpIHtcclxuXHQgICAgIGlmIChoYW5kbGVyc1twb3NdKSB7XHJcblx0ICAgICAgIC8vIGNsZWFuIHVwIHNvIHdlIGRvbid0IGxlYWsgbWVtb3J5XHJcblx0ICAgICAgIGhhbmRsZXJzLnNwbGljZShwb3MsIDEpO1xyXG5cdCAgICAgICByZWdpc3RlcmVkQ29tcG9uZW50cy5zcGxpY2UocG9zLCAxKTtcclxuXHQgICAgIH1cclxuXHQgICB9XHJcblx0IH0sXHJcblxyXG5cdCAvKipcclxuXHQgICogQ2FuIGJlIGNhbGxlZCB0byBleHBsaWNpdGx5IGVuYWJsZSBldmVudCBsaXN0ZW5pbmdcclxuXHQgICogZm9yIGNsaWNrcyBhbmQgdG91Y2hlcyBvdXRzaWRlIG9mIHRoaXMgZWxlbWVudC5cclxuXHQgICovXHJcblx0IGVuYWJsZU9uQ2xpY2tPdXRzaWRlOiBmdW5jdGlvbigpIHtcclxuXHQgICB2YXIgZm4gPSB0aGlzLl9fb3V0c2lkZUNsaWNrSGFuZGxlcjtcclxuXHQgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmbik7XHJcblx0ICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZuKTtcclxuXHQgfSxcclxuXHJcblx0IC8qKlxyXG5cdCAgKiBDYW4gYmUgY2FsbGVkIHRvIGV4cGxpY2l0bHkgZGlzYWJsZSBldmVudCBsaXN0ZW5pbmdcclxuXHQgICogZm9yIGNsaWNrcyBhbmQgdG91Y2hlcyBvdXRzaWRlIG9mIHRoaXMgZWxlbWVudC5cclxuXHQgICovXHJcblx0IGRpc2FibGVPbkNsaWNrT3V0c2lkZTogZnVuY3Rpb24oKSB7XHJcblx0ICAgdmFyIGZuID0gdGhpcy5fX291dHNpZGVDbGlja0hhbmRsZXI7XHJcblx0ICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZm4pO1xyXG5cdCAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmbik7XHJcblx0IH1cclxuXHR9O1xyXG5cblxuLyoqKi8gfSxcbi8qIDkgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV85X187XG5cbi8qKiovIH1cbi8qKioqKiovIF0pXG59KTtcbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlYWN0LWRhdGV0aW1lLmpzLm1hcCJdLCJmaWxlIjoicmVhY3QtZGF0ZXRpbWUuanMifQ==
