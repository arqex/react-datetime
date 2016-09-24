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
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_10__) {
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
		MonthsView = __webpack_require__(6),
		YearsView = __webpack_require__(7),
		TimeView = __webpack_require__(8),
		moment = __webpack_require__(4)
	;

	var TYPES = React.PropTypes;
	var Datetime = React.createClass({
		mixins: [
			__webpack_require__(9)
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
			fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear', 'timeConstraints', 'monthColumns', 'yearColumns', 'yearRows'],
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
		moment = __webpack_require__(4),
		HeaderControls = __webpack_require__(5)
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
					React.createElement( HeaderControls, {
						key: 'ctrl',
						onPrevClick: this.props.subtractTime(1, 'months'),
						onNextClick: this.props.addTime(1, 'months'),
						onSwitchClick: this.props.showView('months'),
						switchColspan: 5,
						switchValue: this.props.viewDate.month(),
						switchLabel: locale.months( date ) + ' ' + date.year()
					}),
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
				// TODO: Make the day header format flexible. This returns the day's initial.
				dow[ (7 + (i++) - first) % 7 ] = day.substring(0, 1);
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

	var React = __webpack_require__(2)
	;

	var DOM = React.DOM;
	var Header = React.createClass({

		render: function() {
			return DOM.tr({ key: 'h'}, [
				DOM.th({ key: 'prev', className: 'rdtPrev' }, DOM.span({onClick: this.props.onPrevClick}, '‹')),
				DOM.th({ key: 'switch', className: 'rdtSwitch', onClick: this.props.onSwitchClick, colSpan: this.props.switchColspan, 'data-value': this.props.switchValue }, this.props.switchLabel ),
				DOM.th({ key: 'next', className: 'rdtNext' }, DOM.span({onClick: this.props.onNextClick}, '›'))
			]);
		}
	});

	module.exports = Header;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2),
		HeaderControls = __webpack_require__(5)
	;

	var DOM = React.DOM;
	var DateTimePickerMonths = React.createClass({
		render: function() {
			return DOM.div({ className: 'rdtMonths' }, [
				DOM.table({ key: 'a'}, DOM.thead({},
					React.createElement( HeaderControls, {
						key: 'ctrl',
						onPrevClick: this.props.subtractTime(1, 'years'),
						onNextClick: this.props.addTime(1, 'years'),
						onSwitchClick: this.props.showView('years'),
						switchColspan: 2,
						switchValue: this.props.viewDate.year(),
						switchLabel: this.props.viewDate.year()
					}))),
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

				if ( months.length === this.props.monthColumns ){
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
			var months = this.props.viewDate.localeData()._months;
			return DOM.td( props, months.standalone
				? capitalize( months.standalone[ month ] )
				: months[ month ]
			);
		}
	});

	function capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	module.exports = DateTimePickerMonths;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2),
		HeaderControls = __webpack_require__(5)
	;

	var DOM = React.DOM;
	var DateTimePickerYears = React.createClass({
		_getStartingYear: function( year, range ) {
			return parseInt((year - 1) / range, 10) * range + 1;
		},

		_getRange: function() {
			return this.props.yearColumns * this.props.yearRows;
		},

		render: function() {
			var year = this._getStartingYear(this.props.viewDate.year(), this._getRange());

			return DOM.div({ className: 'rdtYears' }, [
				DOM.table({ key: 'a'}, DOM.thead({},
					React.createElement( HeaderControls, {
						key: 'ctrl',
						onPrevClick: this.props.subtractTime(this._getRange(), 'years'),
						onNextClick: this.props.addTime(this._getRange(), 'years'),
						onSwitchClick: this.props.showView('years'),
						switchColspan: 2,
						switchLabel: year + ' - ' + (year + this._getRange() - 1)
					}))),
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

			while (i < this._getRange() - 1) {
				classes = 'rdtYear';
				if ( selectedDate && selectedDate.year() === year )
					classes += ' rdtActive';

				props = {
					key: year,
					'data-value': year,
					className: classes,
					onClick: this.props.updateOn === 'years' ? this.updateSelectedYear : this.props.setDate('year')
				};

				years.push( renderer( props, year, selectedDate && selectedDate.clone() ));

				if ( years.length === this.props.yearColumns ){
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
/* 8 */
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// This is extracted from https://github.com/Pomax/react-onclickoutside
	// And modified to support react 0.13 and react 0.14

	var React = __webpack_require__(2),
		version = React.version && React.version.split('.')
	;

	if ( version && ( version[0] > 0 || version[1] > 13 ) )
		React = __webpack_require__(10);

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
/* 10 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_10__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-datetime.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWFjdC1kYXRldGltZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJSZWFjdFwiKSwgcmVxdWlyZShcIm1vbWVudFwiKSwgcmVxdWlyZShcIlJlYWN0RE9NXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcIlJlYWN0XCIsIFwibW9tZW50XCIsIFwiUmVhY3RET01cIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXRpbWVcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJSZWFjdFwiKSwgcmVxdWlyZShcIm1vbWVudFwiKSwgcmVxdWlyZShcIlJlYWN0RE9NXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJEYXRldGltZVwiXSA9IGZhY3Rvcnkocm9vdFtcIlJlYWN0XCJdLCByb290W1wibW9tZW50XCJdLCByb290W1wiUmVhY3RET01cIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8yX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNF9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzEwX18pIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuXG5cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBhc3NpZ24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpLFxuXHRcdFJlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKSxcblx0XHREYXlzVmlldyA9IF9fd2VicGFja19yZXF1aXJlX18oMyksXG5cdFx0TW9udGhzVmlldyA9IF9fd2VicGFja19yZXF1aXJlX18oNiksXG5cdFx0WWVhcnNWaWV3ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3KSxcblx0XHRUaW1lVmlldyA9IF9fd2VicGFja19yZXF1aXJlX18oOCksXG5cdFx0bW9tZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0KVxuXHQ7XG5cblx0dmFyIFRZUEVTID0gUmVhY3QuUHJvcFR5cGVzO1xuXHR2YXIgRGF0ZXRpbWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdFx0bWl4aW5zOiBbXG5cdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKDkpXG5cdFx0XSxcblx0XHR2aWV3Q29tcG9uZW50czoge1xuXHRcdFx0ZGF5czogRGF5c1ZpZXcsXG5cdFx0XHRtb250aHM6IE1vbnRoc1ZpZXcsXG5cdFx0XHR5ZWFyczogWWVhcnNWaWV3LFxuXHRcdFx0dGltZTogVGltZVZpZXdcblx0XHR9LFxuXHRcdHByb3BUeXBlczoge1xuXHRcdFx0Ly8gdmFsdWU6IFRZUEVTLm9iamVjdCB8IFRZUEVTLnN0cmluZyxcblx0XHRcdC8vIGRlZmF1bHRWYWx1ZTogVFlQRVMub2JqZWN0IHwgVFlQRVMuc3RyaW5nLFxuXHRcdFx0b25Gb2N1czogVFlQRVMuZnVuYyxcblx0XHRcdG9uQmx1cjogVFlQRVMuZnVuYyxcblx0XHRcdG9uQ2hhbmdlOiBUWVBFUy5mdW5jLFxuXHRcdFx0bG9jYWxlOiBUWVBFUy5zdHJpbmcsXG5cdFx0XHRpbnB1dDogVFlQRVMuYm9vbCxcblx0XHRcdC8vIGRhdGVGb3JtYXQ6IFRZUEVTLnN0cmluZyB8IFRZUEVTLmJvb2wsXG5cdFx0XHQvLyB0aW1lRm9ybWF0OiBUWVBFUy5zdHJpbmcgfCBUWVBFUy5ib29sLFxuXHRcdFx0aW5wdXRQcm9wczogVFlQRVMub2JqZWN0LFxuXHRcdFx0dGltZUNvbnN0cmFpbnRzOiBUWVBFUy5vYmplY3QsXG5cdFx0XHR2aWV3TW9kZTogVFlQRVMub25lT2YoWyd5ZWFycycsICdtb250aHMnLCAnZGF5cycsICd0aW1lJ10pLFxuXHRcdFx0aXNWYWxpZERhdGU6IFRZUEVTLmZ1bmMsXG5cdFx0XHRvcGVuOiBUWVBFUy5ib29sLFxuXHRcdFx0c3RyaWN0UGFyc2luZzogVFlQRVMuYm9vbCxcblx0XHRcdGNsb3NlT25TZWxlY3Q6IFRZUEVTLmJvb2wsXG5cdFx0XHRjbG9zZU9uVGFiOiBUWVBFUy5ib29sLFxuXHRcdFx0bW9udGhDb2x1bW5zOiBUWVBFUy5udW1iZXIsXG5cdFx0XHR5ZWFyQ29sdW1uczogVFlQRVMubnVtYmVyLFxuXHRcdFx0eWVhclJvd3M6IFRZUEVTLm51bWJlclxuXHRcdH0sXG5cblx0XHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5vZiA9IGZ1bmN0aW9uKCl7fTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNsYXNzTmFtZTogJycsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogJycsXG5cdFx0XHRcdGlucHV0UHJvcHM6IHt9LFxuXHRcdFx0XHRpbnB1dDogdHJ1ZSxcblx0XHRcdFx0b25Gb2N1czogbm9mLFxuXHRcdFx0XHRvbkJsdXI6IG5vZixcblx0XHRcdFx0b25DaGFuZ2U6IG5vZixcblx0XHRcdFx0dGltZUZvcm1hdDogdHJ1ZSxcblx0XHRcdFx0dGltZUNvbnN0cmFpbnRzOiB7fSxcblx0XHRcdFx0ZGF0ZUZvcm1hdDogdHJ1ZSxcblx0XHRcdFx0c3RyaWN0UGFyc2luZzogdHJ1ZSxcblx0XHRcdFx0Y2xvc2VPblNlbGVjdDogZmFsc2UsXG5cdFx0XHRcdGNsb3NlT25UYWI6IHRydWUsXG5cdFx0XHRcdG1vbnRoQ29sdW1uczogNCxcblx0XHRcdFx0eWVhckNvbHVtbnM6IDQsXG5cdFx0XHRcdHllYXJSb3dzOiAzXG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21Qcm9wcyggdGhpcy5wcm9wcyApO1xuXG5cdFx0XHRpZiAoIHN0YXRlLm9wZW4gPT09IHVuZGVmaW5lZCApXG5cdFx0XHRcdHN0YXRlLm9wZW4gPSAhdGhpcy5wcm9wcy5pbnB1dDtcblxuXHRcdFx0c3RhdGUuY3VycmVudFZpZXcgPSB0aGlzLnByb3BzLmRhdGVGb3JtYXQgPyAodGhpcy5wcm9wcy52aWV3TW9kZSB8fCBzdGF0ZS51cGRhdGVPbiB8fCAnZGF5cycpIDogJ3RpbWUnO1xuXG5cdFx0XHRyZXR1cm4gc3RhdGU7XG5cdFx0fSxcblxuXHRcdGdldFN0YXRlRnJvbVByb3BzOiBmdW5jdGlvbiggcHJvcHMgKXtcblx0XHRcdHZhciBmb3JtYXRzID0gdGhpcy5nZXRGb3JtYXRzKCBwcm9wcyApLFxuXHRcdFx0XHRkYXRlID0gcHJvcHMudmFsdWUgfHwgcHJvcHMuZGVmYXVsdFZhbHVlLFxuXHRcdFx0XHRzZWxlY3RlZERhdGUsIHZpZXdEYXRlLCB1cGRhdGVPbiwgaW5wdXRWYWx1ZVxuXHRcdFx0O1xuXG5cdFx0XHRpZiAoIGRhdGUgJiYgdHlwZW9mIGRhdGUgPT09ICdzdHJpbmcnIClcblx0XHRcdFx0c2VsZWN0ZWREYXRlID0gdGhpcy5sb2NhbE1vbWVudCggZGF0ZSwgZm9ybWF0cy5kYXRldGltZSApO1xuXHRcdFx0ZWxzZSBpZiAoIGRhdGUgKVxuXHRcdFx0XHRzZWxlY3RlZERhdGUgPSB0aGlzLmxvY2FsTW9tZW50KCBkYXRlICk7XG5cblx0XHRcdGlmICggc2VsZWN0ZWREYXRlICYmICFzZWxlY3RlZERhdGUuaXNWYWxpZCgpIClcblx0XHRcdFx0c2VsZWN0ZWREYXRlID0gbnVsbDtcblxuXHRcdFx0dmlld0RhdGUgPSBzZWxlY3RlZERhdGUgP1xuXHRcdFx0XHRzZWxlY3RlZERhdGUuY2xvbmUoKS5zdGFydE9mKCdtb250aCcpIDpcblx0XHRcdFx0dGhpcy5sb2NhbE1vbWVudCgpLnN0YXJ0T2YoJ21vbnRoJylcblx0XHRcdDtcblxuXHRcdFx0dXBkYXRlT24gPSB0aGlzLmdldFVwZGF0ZU9uKGZvcm1hdHMpO1xuXG5cdFx0XHRpZiAoIHNlbGVjdGVkRGF0ZSApXG5cdFx0XHRcdGlucHV0VmFsdWUgPSBzZWxlY3RlZERhdGUuZm9ybWF0KGZvcm1hdHMuZGF0ZXRpbWUpO1xuXHRcdFx0ZWxzZSBpZiAoIGRhdGUuaXNWYWxpZCAmJiAhZGF0ZS5pc1ZhbGlkKCkgKVxuXHRcdFx0XHRpbnB1dFZhbHVlID0gJyc7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlucHV0VmFsdWUgPSBkYXRlIHx8ICcnO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR1cGRhdGVPbjogdXBkYXRlT24sXG5cdFx0XHRcdGlucHV0Rm9ybWF0OiBmb3JtYXRzLmRhdGV0aW1lLFxuXHRcdFx0XHR2aWV3RGF0ZTogdmlld0RhdGUsXG5cdFx0XHRcdHNlbGVjdGVkRGF0ZTogc2VsZWN0ZWREYXRlLFxuXHRcdFx0XHRpbnB1dFZhbHVlOiBpbnB1dFZhbHVlLFxuXHRcdFx0XHRvcGVuOiBwcm9wcy5vcGVuXG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRnZXRVcGRhdGVPbjogZnVuY3Rpb24oZm9ybWF0cyl7XG5cdFx0XHRpZiAoIGZvcm1hdHMuZGF0ZS5tYXRjaCgvW2xMRF0vKSApe1xuXHRcdFx0XHRyZXR1cm4gJ2RheXMnO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIGZvcm1hdHMuZGF0ZS5pbmRleE9mKCdNJykgIT09IC0xICl7XG5cdFx0XHRcdHJldHVybiAnbW9udGhzJztcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBmb3JtYXRzLmRhdGUuaW5kZXhPZignWScpICE9PSAtMSApe1xuXHRcdFx0XHRyZXR1cm4gJ3llYXJzJztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuICdkYXlzJztcblx0XHR9LFxuXG5cdFx0Z2V0Rm9ybWF0czogZnVuY3Rpb24oIHByb3BzICl7XG5cdFx0XHR2YXIgZm9ybWF0cyA9IHtcblx0XHRcdFx0XHRkYXRlOiBwcm9wcy5kYXRlRm9ybWF0IHx8ICcnLFxuXHRcdFx0XHRcdHRpbWU6IHByb3BzLnRpbWVGb3JtYXQgfHwgJydcblx0XHRcdFx0fSxcblx0XHRcdFx0bG9jYWxlID0gdGhpcy5sb2NhbE1vbWVudCggcHJvcHMuZGF0ZSApLmxvY2FsZURhdGEoKVxuXHRcdFx0O1xuXG5cdFx0XHRpZiAoIGZvcm1hdHMuZGF0ZSA9PT0gdHJ1ZSApe1xuXHRcdFx0XHRmb3JtYXRzLmRhdGUgPSBsb2NhbGUubG9uZ0RhdGVGb3JtYXQoJ0wnKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCB0aGlzLmdldFVwZGF0ZU9uKGZvcm1hdHMpICE9PSAnZGF5cycgKXtcblx0XHRcdFx0Zm9ybWF0cy50aW1lID0gJyc7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggZm9ybWF0cy50aW1lID09PSB0cnVlICl7XG5cdFx0XHRcdGZvcm1hdHMudGltZSA9IGxvY2FsZS5sb25nRGF0ZUZvcm1hdCgnTFQnKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9ybWF0cy5kYXRldGltZSA9IGZvcm1hdHMuZGF0ZSAmJiBmb3JtYXRzLnRpbWUgP1xuXHRcdFx0XHRmb3JtYXRzLmRhdGUgKyAnICcgKyBmb3JtYXRzLnRpbWUgOlxuXHRcdFx0XHRmb3JtYXRzLmRhdGUgfHwgZm9ybWF0cy50aW1lXG5cdFx0XHQ7XG5cblx0XHRcdHJldHVybiBmb3JtYXRzO1xuXHRcdH0sXG5cblx0XHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcblx0XHRcdHZhciBmb3JtYXRzID0gdGhpcy5nZXRGb3JtYXRzKCBuZXh0UHJvcHMgKSxcblx0XHRcdFx0dXBkYXRlID0ge31cblx0XHRcdDtcblxuXHRcdFx0aWYgKCBuZXh0UHJvcHMudmFsdWUgIT09IHRoaXMucHJvcHMudmFsdWUgKXtcblx0XHRcdFx0dXBkYXRlID0gdGhpcy5nZXRTdGF0ZUZyb21Qcm9wcyggbmV4dFByb3BzICk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIGZvcm1hdHMuZGF0ZXRpbWUgIT09IHRoaXMuZ2V0Rm9ybWF0cyggdGhpcy5wcm9wcyApLmRhdGV0aW1lICkge1xuXHRcdFx0XHR1cGRhdGUuaW5wdXRGb3JtYXQgPSBmb3JtYXRzLmRhdGV0aW1lO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHVwZGF0ZS5vcGVuID09PSB1bmRlZmluZWQgKXtcblx0XHRcdFx0aWYgKCB0aGlzLnByb3BzLmNsb3NlT25TZWxlY3QgJiYgdGhpcy5zdGF0ZS5jdXJyZW50VmlldyAhPT0gJ3RpbWUnICl7XG5cdFx0XHRcdFx0dXBkYXRlLm9wZW4gPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR1cGRhdGUub3BlbiA9IHRoaXMuc3RhdGUub3Blbjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnNldFN0YXRlKCB1cGRhdGUgKTtcblx0XHR9LFxuXG5cdFx0b25JbnB1dENoYW5nZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHR2YXIgdmFsdWUgPSBlLnRhcmdldCA9PT0gbnVsbCA/IGUgOiBlLnRhcmdldC52YWx1ZSxcblx0XHRcdFx0bG9jYWxNb21lbnQgPSB0aGlzLmxvY2FsTW9tZW50KCB2YWx1ZSwgdGhpcy5zdGF0ZS5pbnB1dEZvcm1hdCApLFxuXHRcdFx0XHR1cGRhdGUgPSB7IGlucHV0VmFsdWU6IHZhbHVlIH1cblx0XHRcdDtcblxuXHRcdFx0aWYgKCBsb2NhbE1vbWVudC5pc1ZhbGlkKCkgJiYgIXRoaXMucHJvcHMudmFsdWUgKSB7XG5cdFx0XHRcdHVwZGF0ZS5zZWxlY3RlZERhdGUgPSBsb2NhbE1vbWVudDtcblx0XHRcdFx0dXBkYXRlLnZpZXdEYXRlID0gbG9jYWxNb21lbnQuY2xvbmUoKS5zdGFydE9mKCdtb250aCcpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHVwZGF0ZS5zZWxlY3RlZERhdGUgPSBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcy5zZXRTdGF0ZSggdXBkYXRlLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucHJvcHMub25DaGFuZ2UoIGxvY2FsTW9tZW50LmlzVmFsaWQoKSA/IGxvY2FsTW9tZW50IDogdGhpcy5zdGF0ZS5pbnB1dFZhbHVlICk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0b25JbnB1dEtleTogZnVuY3Rpb24oIGUgKXtcblx0XHRcdGlmICggZS53aGljaCA9PT0gOSAmJiB0aGlzLnByb3BzLmNsb3NlT25UYWIgKXtcblx0XHRcdFx0dGhpcy5jbG9zZUNhbGVuZGFyKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHNob3dWaWV3OiBmdW5jdGlvbiggdmlldyApe1xuXHRcdFx0dmFyIG1lID0gdGhpcztcblx0XHRcdHJldHVybiBmdW5jdGlvbigpe1xuXHRcdFx0XHRtZS5zZXRTdGF0ZSh7IGN1cnJlbnRWaWV3OiB2aWV3IH0pO1xuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0c2V0RGF0ZTogZnVuY3Rpb24oIHR5cGUgKXtcblx0XHRcdHZhciBtZSA9IHRoaXMsXG5cdFx0XHRcdG5leHRWaWV3cyA9IHtcblx0XHRcdFx0XHRtb250aDogJ2RheXMnLFxuXHRcdFx0XHRcdHllYXI6ICdtb250aHMnXG5cdFx0XHRcdH1cblx0XHRcdDtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZSApe1xuXHRcdFx0XHRtZS5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0dmlld0RhdGU6IG1lLnN0YXRlLnZpZXdEYXRlLmNsb25lKClbIHR5cGUgXSggcGFyc2VJbnQoZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJyksIDEwKSApLnN0YXJ0T2YoIHR5cGUgKSxcblx0XHRcdFx0XHRjdXJyZW50VmlldzogbmV4dFZpZXdzWyB0eXBlIF1cblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRhZGRUaW1lOiBmdW5jdGlvbiggYW1vdW50LCB0eXBlLCB0b1NlbGVjdGVkICl7XG5cdFx0XHRyZXR1cm4gdGhpcy51cGRhdGVUaW1lKCAnYWRkJywgYW1vdW50LCB0eXBlLCB0b1NlbGVjdGVkICk7XG5cdFx0fSxcblxuXHRcdHN1YnRyYWN0VGltZTogZnVuY3Rpb24oIGFtb3VudCwgdHlwZSwgdG9TZWxlY3RlZCApe1xuXHRcdFx0cmV0dXJuIHRoaXMudXBkYXRlVGltZSggJ3N1YnRyYWN0JywgYW1vdW50LCB0eXBlLCB0b1NlbGVjdGVkICk7XG5cdFx0fSxcblxuXHRcdHVwZGF0ZVRpbWU6IGZ1bmN0aW9uKCBvcCwgYW1vdW50LCB0eXBlLCB0b1NlbGVjdGVkICl7XG5cdFx0XHR2YXIgbWUgPSB0aGlzO1xuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIHVwZGF0ZSA9IHt9LFxuXHRcdFx0XHRcdGRhdGUgPSB0b1NlbGVjdGVkID8gJ3NlbGVjdGVkRGF0ZScgOiAndmlld0RhdGUnXG5cdFx0XHRcdDtcblxuXHRcdFx0XHR1cGRhdGVbIGRhdGUgXSA9IG1lLnN0YXRlWyBkYXRlIF0uY2xvbmUoKVsgb3AgXSggYW1vdW50LCB0eXBlICk7XG5cblx0XHRcdFx0bWUuc2V0U3RhdGUoIHVwZGF0ZSApO1xuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0YWxsb3dlZFNldFRpbWU6IFsnaG91cnMnLCAnbWludXRlcycsICdzZWNvbmRzJywgJ21pbGxpc2Vjb25kcyddLFxuXHRcdHNldFRpbWU6IGZ1bmN0aW9uKCB0eXBlLCB2YWx1ZSApe1xuXHRcdFx0dmFyIGluZGV4ID0gdGhpcy5hbGxvd2VkU2V0VGltZS5pbmRleE9mKCB0eXBlICkgKyAxLFxuXHRcdFx0XHRzdGF0ZSA9IHRoaXMuc3RhdGUsXG5cdFx0XHRcdGRhdGUgPSAoc3RhdGUuc2VsZWN0ZWREYXRlIHx8IHN0YXRlLnZpZXdEYXRlKS5jbG9uZSgpLFxuXHRcdFx0XHRuZXh0VHlwZVxuXHRcdFx0O1xuXG5cdFx0XHQvLyBJdCBpcyBuZWVkZWQgdG8gc2V0IGFsbCB0aGUgdGltZSBwcm9wZXJ0aWVzXG5cdFx0XHQvLyB0byBub3QgdG8gcmVzZXQgdGhlIHRpbWVcblx0XHRcdGRhdGVbIHR5cGUgXSggdmFsdWUgKTtcblx0XHRcdGZvciAoOyBpbmRleCA8IHRoaXMuYWxsb3dlZFNldFRpbWUubGVuZ3RoOyBpbmRleCsrKSB7XG5cdFx0XHRcdG5leHRUeXBlID0gdGhpcy5hbGxvd2VkU2V0VGltZVtpbmRleF07XG5cdFx0XHRcdGRhdGVbIG5leHRUeXBlIF0oIGRhdGVbbmV4dFR5cGVdKCkgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhdGhpcy5wcm9wcy52YWx1ZSApe1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRzZWxlY3RlZERhdGU6IGRhdGUsXG5cdFx0XHRcdFx0aW5wdXRWYWx1ZTogZGF0ZS5mb3JtYXQoIHN0YXRlLmlucHV0Rm9ybWF0IClcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnByb3BzLm9uQ2hhbmdlKCBkYXRlICk7XG5cdFx0fSxcblxuXHRcdHVwZGF0ZVNlbGVjdGVkRGF0ZTogZnVuY3Rpb24oIGUsIGNsb3NlICkge1xuXHRcdFx0dmFyIHRhcmdldCA9IGUudGFyZ2V0LFxuXHRcdFx0XHRtb2RpZmllciA9IDAsXG5cdFx0XHRcdHZpZXdEYXRlID0gdGhpcy5zdGF0ZS52aWV3RGF0ZSxcblx0XHRcdFx0Y3VycmVudERhdGUgPSB0aGlzLnN0YXRlLnNlbGVjdGVkRGF0ZSB8fCB2aWV3RGF0ZSxcblx0XHRcdFx0ZGF0ZVxuXHQgICAgO1xuXG5cdFx0XHRpZiAodGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCdyZHREYXknKSAhPT0gLTEpe1xuXHRcdFx0XHRpZiAodGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCdyZHROZXcnKSAhPT0gLTEpXG5cdFx0XHRcdFx0bW9kaWZpZXIgPSAxO1xuXHRcdFx0XHRlbHNlIGlmICh0YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3JkdE9sZCcpICE9PSAtMSlcblx0XHRcdFx0XHRtb2RpZmllciA9IC0xO1xuXG5cdFx0XHRcdGRhdGUgPSB2aWV3RGF0ZS5jbG9uZSgpXG5cdFx0XHRcdFx0Lm1vbnRoKCB2aWV3RGF0ZS5tb250aCgpICsgbW9kaWZpZXIgKVxuXHRcdFx0XHRcdC5kYXRlKCBwYXJzZUludCggdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpLCAxMCApICk7XG5cdFx0XHR9IGVsc2UgaWYgKHRhcmdldC5jbGFzc05hbWUuaW5kZXhPZigncmR0TW9udGgnKSAhPT0gLTEpe1xuXHRcdFx0XHRkYXRlID0gdmlld0RhdGUuY2xvbmUoKVxuXHRcdFx0XHRcdC5tb250aCggcGFyc2VJbnQoIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKSwgMTAgKSApXG5cdFx0XHRcdFx0LmRhdGUoIGN1cnJlbnREYXRlLmRhdGUoKSApO1xuXHRcdFx0fSBlbHNlIGlmICh0YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3JkdFllYXInKSAhPT0gLTEpe1xuXHRcdFx0XHRkYXRlID0gdmlld0RhdGUuY2xvbmUoKVxuXHRcdFx0XHRcdC5tb250aCggY3VycmVudERhdGUubW9udGgoKSApXG5cdFx0XHRcdFx0LmRhdGUoIGN1cnJlbnREYXRlLmRhdGUoKSApXG5cdFx0XHRcdFx0LnllYXIoIHBhcnNlSW50KCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJyksIDEwICkgKTtcblx0XHRcdH1cblxuXHRcdFx0ZGF0ZS5ob3VycyggY3VycmVudERhdGUuaG91cnMoKSApXG5cdFx0XHRcdC5taW51dGVzKCBjdXJyZW50RGF0ZS5taW51dGVzKCkgKVxuXHRcdFx0XHQuc2Vjb25kcyggY3VycmVudERhdGUuc2Vjb25kcygpIClcblx0XHRcdFx0Lm1pbGxpc2Vjb25kcyggY3VycmVudERhdGUubWlsbGlzZWNvbmRzKCkgKTtcblxuXHRcdFx0aWYgKCAhdGhpcy5wcm9wcy52YWx1ZSApe1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRzZWxlY3RlZERhdGU6IGRhdGUsXG5cdFx0XHRcdFx0dmlld0RhdGU6IGRhdGUuY2xvbmUoKS5zdGFydE9mKCdtb250aCcpLFxuXHRcdFx0XHRcdGlucHV0VmFsdWU6IGRhdGUuZm9ybWF0KCB0aGlzLnN0YXRlLmlucHV0Rm9ybWF0ICksXG5cdFx0XHRcdFx0b3BlbjogISh0aGlzLnByb3BzLmNsb3NlT25TZWxlY3QgJiYgY2xvc2UgKVxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICh0aGlzLnByb3BzLmNsb3NlT25TZWxlY3QgJiYgY2xvc2UpIHtcblx0XHRcdFx0XHR0aGlzLmNsb3NlQ2FsZW5kYXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnByb3BzLm9uQ2hhbmdlKCBkYXRlICk7XG5cdFx0fSxcblxuXHRcdG9wZW5DYWxlbmRhcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIXRoaXMuc3RhdGUub3Blbikge1xuXHRcdFx0XHR0aGlzLnByb3BzLm9uRm9jdXMoKTtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IG9wZW46IHRydWUgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGNsb3NlQ2FsZW5kYXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IG9wZW46IGZhbHNlIH0pO1xuXHRcdFx0dGhpcy5wcm9wcy5vbkJsdXIoIHRoaXMuc3RhdGUuc2VsZWN0ZWREYXRlIHx8IHRoaXMuc3RhdGUuaW5wdXRWYWx1ZSApO1xuXHRcdH0sXG5cblx0XHRoYW5kbGVDbGlja091dHNpZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAoIHRoaXMucHJvcHMuaW5wdXQgJiYgdGhpcy5zdGF0ZS5vcGVuICYmICF0aGlzLnByb3BzLm9wZW4gKXtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IG9wZW46IGZhbHNlIH0pO1xuXHRcdFx0XHR0aGlzLnByb3BzLm9uQmx1ciggdGhpcy5zdGF0ZS5zZWxlY3RlZERhdGUgfHwgdGhpcy5zdGF0ZS5pbnB1dFZhbHVlICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGxvY2FsTW9tZW50OiBmdW5jdGlvbiggZGF0ZSwgZm9ybWF0ICl7XG5cdFx0XHR2YXIgbSA9IG1vbWVudCggZGF0ZSwgZm9ybWF0LCB0aGlzLnByb3BzLnN0cmljdFBhcnNpbmcgKTtcblx0XHRcdGlmICggdGhpcy5wcm9wcy5sb2NhbGUgKVxuXHRcdFx0XHRtLmxvY2FsZSggdGhpcy5wcm9wcy5sb2NhbGUgKTtcblx0XHRcdHJldHVybiBtO1xuXHRcdH0sXG5cblx0XHRjb21wb25lbnRQcm9wczoge1xuXHRcdFx0ZnJvbVByb3BzOiBbJ3ZhbHVlJywgJ2lzVmFsaWREYXRlJywgJ3JlbmRlckRheScsICdyZW5kZXJNb250aCcsICdyZW5kZXJZZWFyJywgJ3RpbWVDb25zdHJhaW50cycsICdtb250aENvbHVtbnMnLCAneWVhckNvbHVtbnMnLCAneWVhclJvd3MnXSxcblx0XHRcdGZyb21TdGF0ZTogWyd2aWV3RGF0ZScsICdzZWxlY3RlZERhdGUnLCAndXBkYXRlT24nXSxcblx0XHRcdGZyb21UaGlzOiBbJ3NldERhdGUnLCAnc2V0VGltZScsICdzaG93VmlldycsICdhZGRUaW1lJywgJ3N1YnRyYWN0VGltZScsICd1cGRhdGVTZWxlY3RlZERhdGUnLCAnbG9jYWxNb21lbnQnXVxuXHRcdH0sXG5cblx0XHRnZXRDb21wb25lbnRQcm9wczogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBtZSA9IHRoaXMsXG5cdFx0XHRcdGZvcm1hdHMgPSB0aGlzLmdldEZvcm1hdHMoIHRoaXMucHJvcHMgKSxcblx0XHRcdFx0cHJvcHMgPSB7ZGF0ZUZvcm1hdDogZm9ybWF0cy5kYXRlLCB0aW1lRm9ybWF0OiBmb3JtYXRzLnRpbWV9XG5cdFx0XHQ7XG5cblx0XHRcdHRoaXMuY29tcG9uZW50UHJvcHMuZnJvbVByb3BzLmZvckVhY2goIGZ1bmN0aW9uKCBuYW1lICl7XG5cdFx0XHRcdHByb3BzWyBuYW1lIF0gPSBtZS5wcm9wc1sgbmFtZSBdO1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLmNvbXBvbmVudFByb3BzLmZyb21TdGF0ZS5mb3JFYWNoKCBmdW5jdGlvbiggbmFtZSApe1xuXHRcdFx0XHRwcm9wc1sgbmFtZSBdID0gbWUuc3RhdGVbIG5hbWUgXTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5jb21wb25lbnRQcm9wcy5mcm9tVGhpcy5mb3JFYWNoKCBmdW5jdGlvbiggbmFtZSApe1xuXHRcdFx0XHRwcm9wc1sgbmFtZSBdID0gbWVbIG5hbWUgXTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gcHJvcHM7XG5cdFx0fSxcblxuXHRcdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgQ29tcG9uZW50ID0gdGhpcy52aWV3Q29tcG9uZW50c1sgdGhpcy5zdGF0ZS5jdXJyZW50VmlldyBdLFxuXHRcdFx0XHRET00gPSBSZWFjdC5ET00sXG5cdFx0XHRcdGNsYXNzTmFtZSA9ICdyZHQnICsgKHRoaXMucHJvcHMuY2xhc3NOYW1lID9cblx0ICAgICAgICAgICAgICAgICAgKCBBcnJheS5pc0FycmF5KCB0aGlzLnByb3BzLmNsYXNzTmFtZSApID9cblx0ICAgICAgICAgICAgICAgICAgJyAnICsgdGhpcy5wcm9wcy5jbGFzc05hbWUuam9pbiggJyAnICkgOiAnICcgKyB0aGlzLnByb3BzLmNsYXNzTmFtZSkgOiAnJyksXG5cdFx0XHRcdGNoaWxkcmVuID0gW11cblx0XHRcdDtcblxuXHRcdFx0aWYgKCB0aGlzLnByb3BzLmlucHV0ICl7XG5cdFx0XHRcdGNoaWxkcmVuID0gWyBET00uaW5wdXQoIGFzc2lnbih7XG5cdFx0XHRcdFx0a2V5OiAnaScsXG5cdFx0XHRcdFx0dHlwZTondGV4dCcsXG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiAnZm9ybS1jb250cm9sJyxcblx0XHRcdFx0XHRvbkZvY3VzOiB0aGlzLm9wZW5DYWxlbmRhcixcblx0XHRcdFx0XHRvbkNoYW5nZTogdGhpcy5vbklucHV0Q2hhbmdlLFxuXHRcdFx0XHRcdG9uS2V5RG93bjogdGhpcy5vbklucHV0S2V5LFxuXHRcdFx0XHRcdHZhbHVlOiB0aGlzLnN0YXRlLmlucHV0VmFsdWVcblx0XHRcdFx0fSwgdGhpcy5wcm9wcy5pbnB1dFByb3BzICkpXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNsYXNzTmFtZSArPSAnIHJkdFN0YXRpYyc7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdGhpcy5zdGF0ZS5vcGVuIClcblx0XHRcdFx0Y2xhc3NOYW1lICs9ICcgcmR0T3Blbic7XG5cblx0XHRcdHJldHVybiBET00uZGl2KHtjbGFzc05hbWU6IGNsYXNzTmFtZX0sIGNoaWxkcmVuLmNvbmNhdChcblx0XHRcdFx0RE9NLmRpdihcblx0XHRcdFx0XHR7IGtleTogJ2R0JywgY2xhc3NOYW1lOiAncmR0UGlja2VyJyB9LFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoIENvbXBvbmVudCwgdGhpcy5nZXRDb21wb25lbnRQcm9wcygpKVxuXHRcdFx0XHQpXG5cdFx0XHQpKTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIE1ha2UgbW9tZW50IGFjY2Vzc2libGUgdGhyb3VnaCB0aGUgRGF0ZXRpbWUgY2xhc3Ncblx0RGF0ZXRpbWUubW9tZW50ID0gbW9tZW50O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gRGF0ZXRpbWU7XG5cblxuLyoqKi8gfSxcbi8qIDEgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5cdGZ1bmN0aW9uIFRvT2JqZWN0KHZhbCkge1xuXHRcdGlmICh2YWwgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gT2JqZWN0KHZhbCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvd25FbnVtZXJhYmxlS2V5cyhvYmopIHtcblx0XHR2YXIga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaik7XG5cblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0a2V5cyA9IGtleXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGtleXMuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBwcm9wSXNFbnVtZXJhYmxlLmNhbGwob2JqLCBrZXkpO1xuXHRcdH0pO1xuXHR9XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHRcdHZhciBmcm9tO1xuXHRcdHZhciBrZXlzO1xuXHRcdHZhciB0byA9IFRvT2JqZWN0KHRhcmdldCk7XG5cblx0XHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdFx0ZnJvbSA9IGFyZ3VtZW50c1tzXTtcblx0XHRcdGtleXMgPSBvd25FbnVtZXJhYmxlS2V5cyhPYmplY3QoZnJvbSkpO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dG9ba2V5c1tpXV0gPSBmcm9tW2tleXNbaV1dO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0bztcblx0fTtcblxuXG4vKioqLyB9LFxuLyogMiAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzJfXztcblxuLyoqKi8gfSxcbi8qIDMgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgUmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpLFxuXHRcdG1vbWVudCA9IF9fd2VicGFja19yZXF1aXJlX18oNCksXG5cdFx0SGVhZGVyQ29udHJvbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpXG5cdDtcblxuXHR2YXIgRE9NID0gUmVhY3QuRE9NO1xuXHR2YXIgRGF0ZVRpbWVQaWNrZXJEYXlzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdFx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBmb290ZXIgPSB0aGlzLnJlbmRlckZvb3RlcigpLFxuXHRcdFx0XHRkYXRlID0gdGhpcy5wcm9wcy52aWV3RGF0ZSxcblx0XHRcdFx0bG9jYWxlID0gZGF0ZS5sb2NhbGVEYXRhKCksXG5cdFx0XHRcdHRhYmxlQ2hpbGRyZW5cblx0XHRcdDtcblxuXHRcdFx0dGFibGVDaGlsZHJlbiA9IFtcblx0XHRcdFx0RE9NLnRoZWFkKHsga2V5OiAndGgnfSwgW1xuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoIEhlYWRlckNvbnRyb2xzLCB7XG5cdFx0XHRcdFx0XHRrZXk6ICdjdHJsJyxcblx0XHRcdFx0XHRcdG9uUHJldkNsaWNrOiB0aGlzLnByb3BzLnN1YnRyYWN0VGltZSgxLCAnbW9udGhzJyksXG5cdFx0XHRcdFx0XHRvbk5leHRDbGljazogdGhpcy5wcm9wcy5hZGRUaW1lKDEsICdtb250aHMnKSxcblx0XHRcdFx0XHRcdG9uU3dpdGNoQ2xpY2s6IHRoaXMucHJvcHMuc2hvd1ZpZXcoJ21vbnRocycpLFxuXHRcdFx0XHRcdFx0c3dpdGNoQ29sc3BhbjogNSxcblx0XHRcdFx0XHRcdHN3aXRjaFZhbHVlOiB0aGlzLnByb3BzLnZpZXdEYXRlLm1vbnRoKCksXG5cdFx0XHRcdFx0XHRzd2l0Y2hMYWJlbDogbG9jYWxlLm1vbnRocyggZGF0ZSApICsgJyAnICsgZGF0ZS55ZWFyKClcblx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRET00udHIoeyBrZXk6ICdkJ30sIHRoaXMuZ2V0RGF5c09mV2VlayggbG9jYWxlICkubWFwKCBmdW5jdGlvbiggZGF5LCBpbmRleCApeyByZXR1cm4gRE9NLnRoKHsga2V5OiBkYXkgKyBpbmRleCwgY2xhc3NOYW1lOiAnZG93J30sIGRheSApOyB9KSApXG5cdFx0XHRcdF0pLFxuXHRcdFx0XHRET00udGJvZHkoe2tleTogJ3RiJ30sIHRoaXMucmVuZGVyRGF5cygpKVxuXHRcdFx0XTtcblxuXHRcdFx0aWYgKCBmb290ZXIgKVxuXHRcdFx0XHR0YWJsZUNoaWxkcmVuLnB1c2goIGZvb3RlciApO1xuXG5cdFx0XHRyZXR1cm4gRE9NLmRpdih7IGNsYXNzTmFtZTogJ3JkdERheXMnIH0sXG5cdFx0XHRcdERPTS50YWJsZSh7fSwgdGFibGVDaGlsZHJlbiApXG5cdFx0XHQpO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBHZXQgYSBsaXN0IG9mIHRoZSBkYXlzIG9mIHRoZSB3ZWVrXG5cdFx0ICogZGVwZW5kaW5nIG9uIHRoZSBjdXJyZW50IGxvY2FsZVxuXHRcdCAqIEByZXR1cm4ge2FycmF5fSBBIGxpc3Qgd2l0aCB0aGUgc2hvcnRuYW1lIG9mIHRoZSBkYXlzXG5cdFx0ICovXG5cdFx0Z2V0RGF5c09mV2VlazogZnVuY3Rpb24oIGxvY2FsZSApe1xuXHRcdFx0dmFyIGRheXMgPSBsb2NhbGUuX3dlZWtkYXlzTWluLFxuXHRcdFx0XHRmaXJzdCA9IGxvY2FsZS5maXJzdERheU9mV2VlaygpLFxuXHRcdFx0XHRkb3cgPSBbXSxcblx0XHRcdFx0aSA9IDBcblx0XHRcdDtcblxuXHRcdFx0ZGF5cy5mb3JFYWNoKCBmdW5jdGlvbiggZGF5ICl7XG5cdFx0XHRcdC8vIFRPRE86IE1ha2UgdGhlIGRheSBoZWFkZXIgZm9ybWF0IGZsZXhpYmxlLiBUaGlzIHJldHVybnMgdGhlIGRheSdzIGluaXRpYWwuXG5cdFx0XHRcdGRvd1sgKDcgKyAoaSsrKSAtIGZpcnN0KSAlIDcgXSA9IGRheS5zdWJzdHJpbmcoMCwgMSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGRvdztcblx0XHR9LFxuXG5cdFx0cmVuZGVyRGF5czogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZGF0ZSA9IHRoaXMucHJvcHMudmlld0RhdGUsXG5cdFx0XHRcdHNlbGVjdGVkID0gdGhpcy5wcm9wcy5zZWxlY3RlZERhdGUgJiYgdGhpcy5wcm9wcy5zZWxlY3RlZERhdGUuY2xvbmUoKSxcblx0XHRcdFx0cHJldk1vbnRoID0gZGF0ZS5jbG9uZSgpLnN1YnRyYWN0KCAxLCAnbW9udGhzJyApLFxuXHRcdFx0XHRjdXJyZW50WWVhciA9IGRhdGUueWVhcigpLFxuXHRcdFx0XHRjdXJyZW50TW9udGggPSBkYXRlLm1vbnRoKCksXG5cdFx0XHRcdHdlZWtzID0gW10sXG5cdFx0XHRcdGRheXMgPSBbXSxcblx0XHRcdFx0cmVuZGVyZXIgPSB0aGlzLnByb3BzLnJlbmRlckRheSB8fCB0aGlzLnJlbmRlckRheSxcblx0XHRcdFx0aXNWYWxpZCA9IHRoaXMucHJvcHMuaXNWYWxpZERhdGUgfHwgdGhpcy5pc1ZhbGlkRGF0ZSxcblx0XHRcdFx0Y2xhc3NlcywgZGlzYWJsZWQsIGRheVByb3BzLCBjdXJyZW50RGF0ZVxuXHRcdFx0O1xuXG5cdFx0XHQvLyBHbyB0byB0aGUgbGFzdCB3ZWVrIG9mIHRoZSBwcmV2aW91cyBtb250aFxuXHRcdFx0cHJldk1vbnRoLmRhdGUoIHByZXZNb250aC5kYXlzSW5Nb250aCgpICkuc3RhcnRPZignd2VlaycpO1xuXHRcdFx0dmFyIGxhc3REYXkgPSBwcmV2TW9udGguY2xvbmUoKS5hZGQoNDIsICdkJyk7XG5cblx0XHRcdHdoaWxlICggcHJldk1vbnRoLmlzQmVmb3JlKCBsYXN0RGF5ICkgKXtcblx0XHRcdFx0Y2xhc3NlcyA9ICdyZHREYXknO1xuXHRcdFx0XHRjdXJyZW50RGF0ZSA9IHByZXZNb250aC5jbG9uZSgpO1xuXG5cdFx0XHRcdGlmICggKCBwcmV2TW9udGgueWVhcigpID09PSBjdXJyZW50WWVhciAmJiBwcmV2TW9udGgubW9udGgoKSA8IGN1cnJlbnRNb250aCApIHx8ICggcHJldk1vbnRoLnllYXIoKSA8IGN1cnJlbnRZZWFyICkgKVxuXHRcdFx0XHRcdGNsYXNzZXMgKz0gJyByZHRPbGQnO1xuXHRcdFx0XHRlbHNlIGlmICggKCBwcmV2TW9udGgueWVhcigpID09PSBjdXJyZW50WWVhciAmJiBwcmV2TW9udGgubW9udGgoKSA+IGN1cnJlbnRNb250aCApIHx8ICggcHJldk1vbnRoLnllYXIoKSA+IGN1cnJlbnRZZWFyICkgKVxuXHRcdFx0XHRcdGNsYXNzZXMgKz0gJyByZHROZXcnO1xuXG5cdFx0XHRcdGlmICggc2VsZWN0ZWQgJiYgcHJldk1vbnRoLmlzU2FtZShzZWxlY3RlZCwgJ2RheScpIClcblx0XHRcdFx0XHRjbGFzc2VzICs9ICcgcmR0QWN0aXZlJztcblxuXHRcdFx0XHRpZiAocHJldk1vbnRoLmlzU2FtZShtb21lbnQoKSwgJ2RheScpIClcblx0XHRcdFx0XHRjbGFzc2VzICs9ICcgcmR0VG9kYXknO1xuXG5cdFx0XHRcdGRpc2FibGVkID0gIWlzVmFsaWQoIGN1cnJlbnREYXRlLCBzZWxlY3RlZCApO1xuXHRcdFx0XHRpZiAoIGRpc2FibGVkIClcblx0XHRcdFx0XHRjbGFzc2VzICs9ICcgcmR0RGlzYWJsZWQnO1xuXG5cdFx0XHRcdGRheVByb3BzID0ge1xuXHRcdFx0XHRcdGtleTogcHJldk1vbnRoLmZvcm1hdCgnTV9EJyksXG5cdFx0XHRcdFx0J2RhdGEtdmFsdWUnOiBwcmV2TW9udGguZGF0ZSgpLFxuXHRcdFx0XHRcdGNsYXNzTmFtZTogY2xhc3Nlc1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRpZiAoICFkaXNhYmxlZCApXG5cdFx0XHRcdFx0ZGF5UHJvcHMub25DbGljayA9IHRoaXMudXBkYXRlU2VsZWN0ZWREYXRlO1xuXG5cdFx0XHRcdGRheXMucHVzaCggcmVuZGVyZXIoIGRheVByb3BzLCBjdXJyZW50RGF0ZSwgc2VsZWN0ZWQgKSApO1xuXG5cdFx0XHRcdGlmICggZGF5cy5sZW5ndGggPT09IDcgKXtcblx0XHRcdFx0XHR3ZWVrcy5wdXNoKCBET00udHIoIHtrZXk6IHByZXZNb250aC5mb3JtYXQoJ01fRCcpfSwgZGF5cyApICk7XG5cdFx0XHRcdFx0ZGF5cyA9IFtdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cHJldk1vbnRoLmFkZCggMSwgJ2QnICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB3ZWVrcztcblx0XHR9LFxuXG5cdFx0dXBkYXRlU2VsZWN0ZWREYXRlOiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHR0aGlzLnByb3BzLnVwZGF0ZVNlbGVjdGVkRGF0ZShldmVudCwgdHJ1ZSk7XG5cdFx0fSxcblxuXHRcdHJlbmRlckRheTogZnVuY3Rpb24oIHByb3BzLCBjdXJyZW50RGF0ZSApe1xuXHRcdFx0cmV0dXJuIERPTS50ZCggcHJvcHMsIGN1cnJlbnREYXRlLmRhdGUoKSApO1xuXHRcdH0sXG5cblx0XHRyZW5kZXJGb290ZXI6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAoICF0aGlzLnByb3BzLnRpbWVGb3JtYXQgKVxuXHRcdFx0XHRyZXR1cm4gJyc7XG5cblx0XHRcdHZhciBkYXRlID0gdGhpcy5wcm9wcy5zZWxlY3RlZERhdGUgfHwgdGhpcy5wcm9wcy52aWV3RGF0ZTtcblxuXHRcdFx0cmV0dXJuIERPTS50Zm9vdCh7IGtleTogJ3RmJ30sXG5cdFx0XHRcdERPTS50cih7fSxcblx0XHRcdFx0XHRET00udGQoeyBvbkNsaWNrOiB0aGlzLnByb3BzLnNob3dWaWV3KCd0aW1lJyksIGNvbFNwYW46IDcsIGNsYXNzTmFtZTogJ3JkdFRpbWVUb2dnbGUnfSwgZGF0ZS5mb3JtYXQoIHRoaXMucHJvcHMudGltZUZvcm1hdCApKVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH0sXG5cdFx0aXNWYWxpZERhdGU6IGZ1bmN0aW9uKCl7IHJldHVybiAxOyB9XG5cdH0pO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gRGF0ZVRpbWVQaWNrZXJEYXlzO1xuXG5cbi8qKiovIH0sXG4vKiA0ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNF9fO1xuXG4vKioqLyB9LFxuLyogNSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBSZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMilcblx0O1xuXG5cdHZhciBET00gPSBSZWFjdC5ET007XG5cdHZhciBIZWFkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0XHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIERPTS50cih7IGtleTogJ2gnfSwgW1xuXHRcdFx0XHRET00udGgoeyBrZXk6ICdwcmV2JywgY2xhc3NOYW1lOiAncmR0UHJldicgfSwgRE9NLnNwYW4oe29uQ2xpY2s6IHRoaXMucHJvcHMub25QcmV2Q2xpY2t9LCAn4oC5JykpLFxuXHRcdFx0XHRET00udGgoeyBrZXk6ICdzd2l0Y2gnLCBjbGFzc05hbWU6ICdyZHRTd2l0Y2gnLCBvbkNsaWNrOiB0aGlzLnByb3BzLm9uU3dpdGNoQ2xpY2ssIGNvbFNwYW46IHRoaXMucHJvcHMuc3dpdGNoQ29sc3BhbiwgJ2RhdGEtdmFsdWUnOiB0aGlzLnByb3BzLnN3aXRjaFZhbHVlIH0sIHRoaXMucHJvcHMuc3dpdGNoTGFiZWwgKSxcblx0XHRcdFx0RE9NLnRoKHsga2V5OiAnbmV4dCcsIGNsYXNzTmFtZTogJ3JkdE5leHQnIH0sIERPTS5zcGFuKHtvbkNsaWNrOiB0aGlzLnByb3BzLm9uTmV4dENsaWNrfSwgJ+KAuicpKVxuXHRcdFx0XSk7XG5cdFx0fVxuXHR9KTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IEhlYWRlcjtcblxuXG4vKioqLyB9LFxuLyogNiAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBSZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMiksXG5cdFx0SGVhZGVyQ29udHJvbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpXG5cdDtcblxuXHR2YXIgRE9NID0gUmVhY3QuRE9NO1xuXHR2YXIgRGF0ZVRpbWVQaWNrZXJNb250aHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdFx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBET00uZGl2KHsgY2xhc3NOYW1lOiAncmR0TW9udGhzJyB9LCBbXG5cdFx0XHRcdERPTS50YWJsZSh7IGtleTogJ2EnfSwgRE9NLnRoZWFkKHt9LFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoIEhlYWRlckNvbnRyb2xzLCB7XG5cdFx0XHRcdFx0XHRrZXk6ICdjdHJsJyxcblx0XHRcdFx0XHRcdG9uUHJldkNsaWNrOiB0aGlzLnByb3BzLnN1YnRyYWN0VGltZSgxLCAneWVhcnMnKSxcblx0XHRcdFx0XHRcdG9uTmV4dENsaWNrOiB0aGlzLnByb3BzLmFkZFRpbWUoMSwgJ3llYXJzJyksXG5cdFx0XHRcdFx0XHRvblN3aXRjaENsaWNrOiB0aGlzLnByb3BzLnNob3dWaWV3KCd5ZWFycycpLFxuXHRcdFx0XHRcdFx0c3dpdGNoQ29sc3BhbjogMixcblx0XHRcdFx0XHRcdHN3aXRjaFZhbHVlOiB0aGlzLnByb3BzLnZpZXdEYXRlLnllYXIoKSxcblx0XHRcdFx0XHRcdHN3aXRjaExhYmVsOiB0aGlzLnByb3BzLnZpZXdEYXRlLnllYXIoKVxuXHRcdFx0XHRcdH0pKSksXG5cdFx0XHRcdERPTS50YWJsZSh7IGtleTogJ21vbnRocyd9LCBET00udGJvZHkoeyBrZXk6ICdiJ30sIHRoaXMucmVuZGVyTW9udGhzKCkpKVxuXHRcdFx0XSk7XG5cdFx0fSxcblxuXHRcdHJlbmRlck1vbnRoczogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZGF0ZSA9IHRoaXMucHJvcHMuc2VsZWN0ZWREYXRlLFxuXHRcdFx0XHRtb250aCA9IHRoaXMucHJvcHMudmlld0RhdGUubW9udGgoKSxcblx0XHRcdFx0eWVhciA9IHRoaXMucHJvcHMudmlld0RhdGUueWVhcigpLFxuXHRcdFx0XHRyb3dzID0gW10sXG5cdFx0XHRcdGkgPSAwLFxuXHRcdFx0XHRtb250aHMgPSBbXSxcblx0XHRcdFx0cmVuZGVyZXIgPSB0aGlzLnByb3BzLnJlbmRlck1vbnRoIHx8IHRoaXMucmVuZGVyTW9udGgsXG5cdFx0XHRcdGNsYXNzZXMsIHByb3BzXG5cdFx0XHQ7XG5cblx0XHRcdHdoaWxlIChpIDwgMTIpIHtcblx0XHRcdFx0Y2xhc3NlcyA9ICdyZHRNb250aCc7XG5cdFx0XHRcdGlmICggZGF0ZSAmJiBpID09PSBtb250aCAmJiB5ZWFyID09PSBkYXRlLnllYXIoKSApXG5cdFx0XHRcdFx0Y2xhc3NlcyArPSAnIHJkdEFjdGl2ZSc7XG5cblx0XHRcdFx0cHJvcHMgPSB7XG5cdFx0XHRcdFx0a2V5OiBpLFxuXHRcdFx0XHRcdCdkYXRhLXZhbHVlJzogaSxcblx0XHRcdFx0XHRjbGFzc05hbWU6IGNsYXNzZXMsXG5cdFx0XHRcdFx0b25DbGljazogdGhpcy5wcm9wcy51cGRhdGVPbiA9PT0gJ21vbnRocyc/IHRoaXMudXBkYXRlU2VsZWN0ZWRNb250aCA6IHRoaXMucHJvcHMuc2V0RGF0ZSgnbW9udGgnKVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdG1vbnRocy5wdXNoKCByZW5kZXJlciggcHJvcHMsIGksIHllYXIsIGRhdGUgJiYgZGF0ZS5jbG9uZSgpICkpO1xuXG5cdFx0XHRcdGlmICggbW9udGhzLmxlbmd0aCA9PT0gdGhpcy5wcm9wcy5tb250aENvbHVtbnMgKXtcblx0XHRcdFx0XHRyb3dzLnB1c2goIERPTS50cih7IGtleTogbW9udGggKyAnXycgKyByb3dzLmxlbmd0aCB9LCBtb250aHMpICk7XG5cdFx0XHRcdFx0bW9udGhzID0gW107XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpKys7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByb3dzO1xuXHRcdH0sXG5cblx0XHR1cGRhdGVTZWxlY3RlZE1vbnRoOiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHR0aGlzLnByb3BzLnVwZGF0ZVNlbGVjdGVkRGF0ZShldmVudCwgdHJ1ZSk7XG5cdFx0fSxcblxuXHRcdHJlbmRlck1vbnRoOiBmdW5jdGlvbiggcHJvcHMsIG1vbnRoICkge1xuXHRcdFx0dmFyIG1vbnRocyA9IHRoaXMucHJvcHMudmlld0RhdGUubG9jYWxlRGF0YSgpLl9tb250aHM7XG5cdFx0XHRyZXR1cm4gRE9NLnRkKCBwcm9wcywgbW9udGhzLnN0YW5kYWxvbmVcblx0XHRcdFx0PyBjYXBpdGFsaXplKCBtb250aHMuc3RhbmRhbG9uZVsgbW9udGggXSApXG5cdFx0XHRcdDogbW9udGhzWyBtb250aCBdXG5cdFx0XHQpO1xuXHRcdH1cblx0fSk7XG5cblx0ZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHIpIHtcblx0XHRyZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xuXHR9XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBEYXRlVGltZVBpY2tlck1vbnRocztcblxuXG4vKioqLyB9LFxuLyogNyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBSZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMiksXG5cdFx0SGVhZGVyQ29udHJvbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpXG5cdDtcblxuXHR2YXIgRE9NID0gUmVhY3QuRE9NO1xuXHR2YXIgRGF0ZVRpbWVQaWNrZXJZZWFycyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0XHRfZ2V0U3RhcnRpbmdZZWFyOiBmdW5jdGlvbiggeWVhciwgcmFuZ2UgKSB7XG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQoKHllYXIgLSAxKSAvIHJhbmdlLCAxMCkgKiByYW5nZSArIDE7XG5cdFx0fSxcblxuXHRcdF9nZXRSYW5nZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wcm9wcy55ZWFyQ29sdW1ucyAqIHRoaXMucHJvcHMueWVhclJvd3M7XG5cdFx0fSxcblxuXHRcdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgeWVhciA9IHRoaXMuX2dldFN0YXJ0aW5nWWVhcih0aGlzLnByb3BzLnZpZXdEYXRlLnllYXIoKSwgdGhpcy5fZ2V0UmFuZ2UoKSk7XG5cblx0XHRcdHJldHVybiBET00uZGl2KHsgY2xhc3NOYW1lOiAncmR0WWVhcnMnIH0sIFtcblx0XHRcdFx0RE9NLnRhYmxlKHsga2V5OiAnYSd9LCBET00udGhlYWQoe30sXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCggSGVhZGVyQ29udHJvbHMsIHtcblx0XHRcdFx0XHRcdGtleTogJ2N0cmwnLFxuXHRcdFx0XHRcdFx0b25QcmV2Q2xpY2s6IHRoaXMucHJvcHMuc3VidHJhY3RUaW1lKHRoaXMuX2dldFJhbmdlKCksICd5ZWFycycpLFxuXHRcdFx0XHRcdFx0b25OZXh0Q2xpY2s6IHRoaXMucHJvcHMuYWRkVGltZSh0aGlzLl9nZXRSYW5nZSgpLCAneWVhcnMnKSxcblx0XHRcdFx0XHRcdG9uU3dpdGNoQ2xpY2s6IHRoaXMucHJvcHMuc2hvd1ZpZXcoJ3llYXJzJyksXG5cdFx0XHRcdFx0XHRzd2l0Y2hDb2xzcGFuOiAyLFxuXHRcdFx0XHRcdFx0c3dpdGNoTGFiZWw6IHllYXIgKyAnIC0gJyArICh5ZWFyICsgdGhpcy5fZ2V0UmFuZ2UoKSAtIDEpXG5cdFx0XHRcdFx0fSkpKSxcblx0XHRcdFx0RE9NLnRhYmxlKHsga2V5OiAneWVhcnMnfSwgRE9NLnRib2R5KHt9LCB0aGlzLnJlbmRlclllYXJzKCB5ZWFyICkpKVxuXHRcdFx0XSk7XG5cdFx0fSxcblxuXHRcdHJlbmRlclllYXJzOiBmdW5jdGlvbiggeWVhciApIHtcblx0XHRcdHZhciB5ZWFycyA9IFtdLFxuXHRcdFx0XHRpID0gLTEsXG5cdFx0XHRcdHJvd3MgPSBbXSxcblx0XHRcdFx0cmVuZGVyZXIgPSB0aGlzLnByb3BzLnJlbmRlclllYXIgfHwgdGhpcy5yZW5kZXJZZWFyLFxuXHRcdFx0XHRzZWxlY3RlZERhdGUgPSB0aGlzLnByb3BzLnNlbGVjdGVkRGF0ZSxcblx0XHRcdFx0Y2xhc3NlcywgcHJvcHNcblx0XHRcdDtcblxuXHRcdFx0d2hpbGUgKGkgPCB0aGlzLl9nZXRSYW5nZSgpIC0gMSkge1xuXHRcdFx0XHRjbGFzc2VzID0gJ3JkdFllYXInO1xuXHRcdFx0XHRpZiAoIHNlbGVjdGVkRGF0ZSAmJiBzZWxlY3RlZERhdGUueWVhcigpID09PSB5ZWFyIClcblx0XHRcdFx0XHRjbGFzc2VzICs9ICcgcmR0QWN0aXZlJztcblxuXHRcdFx0XHRwcm9wcyA9IHtcblx0XHRcdFx0XHRrZXk6IHllYXIsXG5cdFx0XHRcdFx0J2RhdGEtdmFsdWUnOiB5ZWFyLFxuXHRcdFx0XHRcdGNsYXNzTmFtZTogY2xhc3Nlcyxcblx0XHRcdFx0XHRvbkNsaWNrOiB0aGlzLnByb3BzLnVwZGF0ZU9uID09PSAneWVhcnMnID8gdGhpcy51cGRhdGVTZWxlY3RlZFllYXIgOiB0aGlzLnByb3BzLnNldERhdGUoJ3llYXInKVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHllYXJzLnB1c2goIHJlbmRlcmVyKCBwcm9wcywgeWVhciwgc2VsZWN0ZWREYXRlICYmIHNlbGVjdGVkRGF0ZS5jbG9uZSgpICkpO1xuXG5cdFx0XHRcdGlmICggeWVhcnMubGVuZ3RoID09PSB0aGlzLnByb3BzLnllYXJDb2x1bW5zICl7XG5cdFx0XHRcdFx0cm93cy5wdXNoKCBET00udHIoeyBrZXk6IGkgfSwgeWVhcnMgKSApO1xuXHRcdFx0XHRcdHllYXJzID0gW107XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR5ZWFyKys7XG5cdFx0XHRcdGkrKztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJvd3M7XG5cdFx0fSxcblxuXHRcdHVwZGF0ZVNlbGVjdGVkWWVhcjogZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0dGhpcy5wcm9wcy51cGRhdGVTZWxlY3RlZERhdGUoZXZlbnQsIHRydWUpO1xuXHRcdH0sXG5cblx0XHRyZW5kZXJZZWFyOiBmdW5jdGlvbiggcHJvcHMsIHllYXIgKXtcblx0XHRcdHJldHVybiBET00udGQoIHByb3BzLCB5ZWFyICk7XG5cdFx0fVxuXHR9KTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IERhdGVUaW1lUGlja2VyWWVhcnM7XG5cblxuLyoqKi8gfSxcbi8qIDggKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgUmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpLFxuXHRcdGFzc2lnbiA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cblx0dmFyIERPTSA9IFJlYWN0LkRPTTtcblx0dmFyIERhdGVUaW1lUGlja2VyVGltZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0XHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhpcy5jYWxjdWxhdGVTdGF0ZSggdGhpcy5wcm9wcyApO1xuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlU3RhdGU6IGZ1bmN0aW9uKCBwcm9wcyApe1xuXHRcdFx0dmFyIGRhdGUgPSBwcm9wcy5zZWxlY3RlZERhdGUgfHwgcHJvcHMudmlld0RhdGUsXG5cdFx0XHRcdGZvcm1hdCA9IHByb3BzLnRpbWVGb3JtYXQsXG5cdFx0XHRcdGNvdW50ZXJzID0gW11cblx0XHRcdDtcblxuXHRcdFx0aWYgKCBmb3JtYXQuaW5kZXhPZignSCcpICE9PSAtMSB8fCBmb3JtYXQuaW5kZXhPZignaCcpICE9PSAtMSApe1xuXHRcdFx0XHRjb3VudGVycy5wdXNoKCdob3VycycpO1xuXHRcdFx0XHRpZiAoIGZvcm1hdC5pbmRleE9mKCdtJykgIT09IC0xICl7XG5cdFx0XHRcdFx0Y291bnRlcnMucHVzaCgnbWludXRlcycpO1xuXHRcdFx0XHRcdGlmICggZm9ybWF0LmluZGV4T2YoJ3MnKSAhPT0gLTEgKXtcblx0XHRcdFx0XHRcdGNvdW50ZXJzLnB1c2goJ3NlY29uZHMnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFyIGRheXBhcnQgPSBmYWxzZTtcblx0XHRcdGlmICggdGhpcy5wcm9wcy50aW1lRm9ybWF0LmluZGV4T2YoJyBBJykgIT09IC0xICAmJiB0aGlzLnN0YXRlICE9PSBudWxsICl7XG5cdFx0XHRcdGRheXBhcnQgPSAoIHRoaXMuc3RhdGUuaG91cnMgPj0gMTIgKSA/ICdQTScgOiAnQU0nO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRob3VyczogZGF0ZS5mb3JtYXQoJ0gnKSxcblx0XHRcdFx0bWludXRlczogZGF0ZS5mb3JtYXQoJ21tJyksXG5cdFx0XHRcdHNlY29uZHM6IGRhdGUuZm9ybWF0KCdzcycpLFxuXHRcdFx0XHRtaWxsaXNlY29uZHM6IGRhdGUuZm9ybWF0KCdTU1MnKSxcblx0XHRcdFx0ZGF5cGFydDogZGF5cGFydCxcblx0XHRcdFx0Y291bnRlcnM6IGNvdW50ZXJzXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0cmVuZGVyQ291bnRlcjogZnVuY3Rpb24oIHR5cGUgKXtcblx0XHRcdGlmICh0eXBlICE9PSAnZGF5cGFydCcpIHtcblx0XHRcdFx0dmFyIHZhbHVlID0gdGhpcy5zdGF0ZVsgdHlwZSBdO1xuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ2hvdXJzJyAmJiB0aGlzLnByb3BzLnRpbWVGb3JtYXQuaW5kZXhPZignIEEnKSAhPT0gLTEpIHtcblx0XHRcdFx0XHR2YWx1ZSA9ICh2YWx1ZSAtIDEpICUgMTIgKyAxO1xuXG5cdFx0XHRcdFx0aWYgKHZhbHVlID09PSAwKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IDEyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gRE9NLmRpdih7IGtleTogdHlwZSwgY2xhc3NOYW1lOiAncmR0Q291bnRlcid9LCBbXG5cdFx0XHRcdFx0RE9NLnNwYW4oeyBrZXk6J3VwJywgY2xhc3NOYW1lOiAncmR0QnRuJywgb25Nb3VzZURvd246IHRoaXMub25TdGFydENsaWNraW5nKCAnaW5jcmVhc2UnLCB0eXBlICkgfSwgJ+KWsicgKSxcblx0XHRcdFx0XHRET00uZGl2KHsga2V5OidjJywgY2xhc3NOYW1lOiAncmR0Q291bnQnIH0sIHZhbHVlICksXG5cdFx0XHRcdFx0RE9NLnNwYW4oeyBrZXk6J2RvJywgY2xhc3NOYW1lOiAncmR0QnRuJywgb25Nb3VzZURvd246IHRoaXMub25TdGFydENsaWNraW5nKCAnZGVjcmVhc2UnLCB0eXBlICkgfSwgJ+KWvCcgKVxuXHRcdFx0XHRdKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAnJztcblx0XHR9LFxuXHRcdHJlbmRlckRheVBhcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIERPTS5kaXYoeyBjbGFzc05hbWU6ICdyZHRDb3VudGVyJywga2V5OiAnZGF5UGFydCd9LCBbXG5cdFx0XHRcdERPTS5zcGFuKHsga2V5Oid1cCcsIGNsYXNzTmFtZTogJ3JkdEJ0bicsIG9uTW91c2VEb3duOiB0aGlzLm9uU3RhcnRDbGlja2luZyggJ3RvZ2dsZURheVBhcnQnLCAnaG91cnMnKSB9LCAn4payJyApLFxuXHRcdFx0XHRET00uZGl2KHsga2V5OiB0aGlzLnN0YXRlLmRheXBhcnQsIGNsYXNzTmFtZTogJ3JkdENvdW50J30sIHRoaXMuc3RhdGUuZGF5cGFydCApLFxuXHRcdFx0XHRET00uc3Bhbih7IGtleTonZG8nLCBjbGFzc05hbWU6ICdyZHRCdG4nLCBvbk1vdXNlRG93bjogdGhpcy5vblN0YXJ0Q2xpY2tpbmcoICd0b2dnbGVEYXlQYXJ0JywgJ2hvdXJzJykgfSwgJ+KWvCcgKVxuXHRcdFx0XSk7XG5cdFx0fSxcblx0XHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG1lID0gdGhpcyxcblx0XHRcdFx0Y291bnRlcnMgPSBbXVxuXHRcdFx0O1xuXG5cdFx0XHR0aGlzLnN0YXRlLmNvdW50ZXJzLmZvckVhY2goIGZ1bmN0aW9uKGMpe1xuXHRcdFx0XHRpZiAoIGNvdW50ZXJzLmxlbmd0aCApXG5cdFx0XHRcdFx0Y291bnRlcnMucHVzaCggRE9NLmRpdigge2tleTogJ3NlcCcgKyBjb3VudGVycy5sZW5ndGgsIGNsYXNzTmFtZTogJ3JkdENvdW50ZXJTZXBhcmF0b3InIH0sICc6JyApKTtcblx0XHRcdFx0Y291bnRlcnMucHVzaCggbWUucmVuZGVyQ291bnRlciggYyApICk7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKHRoaXMuc3RhdGUuZGF5cGFydCAhPT0gZmFsc2UpIHtcblx0XHRcdFx0Y291bnRlcnMucHVzaCggbWUucmVuZGVyRGF5UGFydCgpICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdGhpcy5zdGF0ZS5jb3VudGVycy5sZW5ndGggPT09IDMgJiYgdGhpcy5wcm9wcy50aW1lRm9ybWF0LmluZGV4T2YoJ1MnKSAhPT0gLTEgKXtcblx0XHRcdFx0Y291bnRlcnMucHVzaCggRE9NLmRpdigge2NsYXNzTmFtZTogJ3JkdENvdW50ZXJTZXBhcmF0b3InLCBrZXk6ICdzZXA1JyB9LCAnOicgKSk7XG5cdFx0XHRcdGNvdW50ZXJzLnB1c2goXG5cdFx0XHRcdFx0RE9NLmRpdigge2NsYXNzTmFtZTogJ3JkdENvdW50ZXIgcmR0TWlsbGknLCBrZXk6J20nfSxcblx0XHRcdFx0XHRcdERPTS5pbnB1dCh7IHZhbHVlOiB0aGlzLnN0YXRlLm1pbGxpc2Vjb25kcywgdHlwZTogJ3RleHQnLCBvbkNoYW5nZTogdGhpcy51cGRhdGVNaWxsaSB9KVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBET00uZGl2KCB7Y2xhc3NOYW1lOiAncmR0VGltZSd9LFxuXHRcdFx0XHRET00udGFibGUoIHt9LCBbXG5cdFx0XHRcdFx0dGhpcy5yZW5kZXJIZWFkZXIoKSxcblx0XHRcdFx0XHRET00udGJvZHkoe2tleTogJ2InfSwgRE9NLnRyKHt9LCBET00udGQoe30sXG5cdFx0XHRcdFx0XHRET00uZGl2KHsgY2xhc3NOYW1lOiAncmR0Q291bnRlcnMnIH0sIGNvdW50ZXJzIClcblx0XHRcdFx0XHQpKSlcblx0XHRcdFx0XSlcblx0XHRcdCk7XG5cdFx0fSxcblx0XHRjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG1lID0gdGhpcztcblx0XHRcdG1lLnRpbWVDb25zdHJhaW50cyA9IHtcblx0XHRcdFx0aG91cnM6IHtcblx0XHRcdFx0XHRtaW46IDAsXG5cdFx0XHRcdFx0bWF4OiAyMyxcblx0XHRcdFx0XHRzdGVwOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1pbnV0ZXM6IHtcblx0XHRcdFx0XHRtaW46IDAsXG5cdFx0XHRcdFx0bWF4OiA1OSxcblx0XHRcdFx0XHRzdGVwOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNlY29uZHM6IHtcblx0XHRcdFx0XHRtaW46IDAsXG5cdFx0XHRcdFx0bWF4OiA1OSxcblx0XHRcdFx0XHRzdGVwOiAxLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtaWxsaXNlY29uZHM6IHtcblx0XHRcdFx0XHRtaW46IDAsXG5cdFx0XHRcdFx0bWF4OiA5OTksXG5cdFx0XHRcdFx0c3RlcDogMVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0Wydob3VycycsICdtaW51dGVzJywgJ3NlY29uZHMnLCAnbWlsbGlzZWNvbmRzJ10uZm9yRWFjaChmdW5jdGlvbih0eXBlKSB7XG5cdFx0XHRcdGFzc2lnbihtZS50aW1lQ29uc3RyYWludHNbdHlwZV0sIG1lLnByb3BzLnRpbWVDb25zdHJhaW50c1t0eXBlXSk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuc2V0U3RhdGUoIHRoaXMuY2FsY3VsYXRlU3RhdGUoIHRoaXMucHJvcHMgKSApO1xuXHRcdH0sXG5cdFx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24oIG5leHRQcm9wcyApe1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSggdGhpcy5jYWxjdWxhdGVTdGF0ZSggbmV4dFByb3BzICkgKTtcblx0XHR9LFxuXHRcdHVwZGF0ZU1pbGxpOiBmdW5jdGlvbiggZSApe1xuXHRcdFx0dmFyIG1pbGxpID0gcGFyc2VJbnQoIGUudGFyZ2V0LnZhbHVlLCAxMCApO1xuXHRcdFx0aWYgKCBtaWxsaSA9PT0gZS50YXJnZXQudmFsdWUgJiYgbWlsbGkgPj0gMCAmJiBtaWxsaSA8IDEwMDAgKXtcblx0XHRcdFx0dGhpcy5wcm9wcy5zZXRUaW1lKCAnbWlsbGlzZWNvbmRzJywgbWlsbGkgKTtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IG1pbGxpc2Vjb25kczogbWlsbGkgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW5kZXJIZWFkZXI6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAoICF0aGlzLnByb3BzLmRhdGVGb3JtYXQgKVxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0dmFyIGRhdGUgPSB0aGlzLnByb3BzLnNlbGVjdGVkRGF0ZSB8fCB0aGlzLnByb3BzLnZpZXdEYXRlO1xuXHRcdFx0cmV0dXJuIERPTS50aGVhZCh7IGtleTogJ2gnfSwgRE9NLnRyKHt9LFxuXHRcdFx0XHRET00udGgoIHtjbGFzc05hbWU6ICdyZHRTd2l0Y2gnLCBjb2xTcGFuOiA0LCBvbkNsaWNrOiB0aGlzLnByb3BzLnNob3dWaWV3KCdkYXlzJyl9LCBkYXRlLmZvcm1hdCggdGhpcy5wcm9wcy5kYXRlRm9ybWF0ICkgKVxuXHRcdFx0KSk7XG5cdFx0fSxcblx0XHRvblN0YXJ0Q2xpY2tpbmc6IGZ1bmN0aW9uKCBhY3Rpb24sIHR5cGUgKXtcblx0XHRcdHZhciBtZSA9IHRoaXM7XG5cblx0XHRcdHJldHVybiBmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgdXBkYXRlID0ge307XG5cdFx0XHRcdHVwZGF0ZVsgdHlwZSBdID0gbWVbIGFjdGlvbiBdKCB0eXBlICk7XG5cdFx0XHRcdG1lLnNldFN0YXRlKCB1cGRhdGUgKTtcblxuXHRcdFx0XHRtZS50aW1lciA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0bWUuaW5jcmVhc2VUaW1lciA9IHNldEludGVydmFsKCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dXBkYXRlWyB0eXBlIF0gPSBtZVsgYWN0aW9uIF0oIHR5cGUgKTtcblx0XHRcdFx0XHRcdG1lLnNldFN0YXRlKCB1cGRhdGUgKTtcblx0XHRcdFx0XHR9LCA3MCk7XG5cdFx0XHRcdH0sIDUwMCk7XG5cblx0XHRcdFx0bWUubW91c2VVcExpc3RlbmVyID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoIG1lLnRpbWVyICk7XG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbCggbWUuaW5jcmVhc2VUaW1lciApO1xuXHRcdFx0XHRcdG1lLnByb3BzLnNldFRpbWUoIHR5cGUsIG1lLnN0YXRlWyB0eXBlIF0gKTtcblx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtZS5tb3VzZVVwTGlzdGVuZXIpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1lLm1vdXNlVXBMaXN0ZW5lcik7XG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0cGFkVmFsdWVzOiB7XG5cdFx0XHRob3VyczogMSxcblx0XHRcdG1pbnV0ZXM6IDIsXG5cdFx0XHRzZWNvbmRzOiAyLFxuXHRcdFx0bWlsbGlzZWNvbmRzOiAzXG5cdFx0fSxcblx0XHR0b2dnbGVEYXlQYXJ0OiBmdW5jdGlvbiggdHlwZSApeyAvLyB0eXBlIGlzIGFsd2F5cyAnaG91cnMnXG5cdFx0XHR2YXIgdmFsdWUgPSBwYXJzZUludCh0aGlzLnN0YXRlWyB0eXBlIF0sIDEwKSArIDEyO1xuXHRcdFx0aWYgKCB2YWx1ZSA+IHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0ubWF4IClcblx0XHRcdFx0dmFsdWUgPSB0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLm1pbiArICh2YWx1ZSAtICh0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLm1heCArIDEpKTtcblx0XHRcdHJldHVybiB0aGlzLnBhZCggdHlwZSwgdmFsdWUgKTtcblx0XHR9LFxuXHRcdGluY3JlYXNlOiBmdW5jdGlvbiggdHlwZSApe1xuXHRcdFx0dmFyIHZhbHVlID0gcGFyc2VJbnQodGhpcy5zdGF0ZVsgdHlwZSBdLCAxMCkgKyB0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLnN0ZXA7XG5cdFx0XHRpZiAoIHZhbHVlID4gdGhpcy50aW1lQ29uc3RyYWludHNbIHR5cGUgXS5tYXggKVxuXHRcdFx0XHR2YWx1ZSA9IHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0ubWluICsgKCB2YWx1ZSAtICggdGhpcy50aW1lQ29uc3RyYWludHNbIHR5cGUgXS5tYXggICsgMSkgKTtcblx0XHRcdHJldHVybiB0aGlzLnBhZCggdHlwZSwgdmFsdWUgKTtcblx0XHR9LFxuXHRcdGRlY3JlYXNlOiBmdW5jdGlvbiggdHlwZSApe1xuXHRcdFx0dmFyIHZhbHVlID0gcGFyc2VJbnQodGhpcy5zdGF0ZVsgdHlwZSBdLCAxMCkgLSB0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLnN0ZXA7XG5cdFx0XHRpZiAoIHZhbHVlIDwgdGhpcy50aW1lQ29uc3RyYWludHNbIHR5cGUgXS5taW4gKVxuXHRcdFx0XHR2YWx1ZSA9IHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0ubWF4ICsgMSAtICggdGhpcy50aW1lQ29uc3RyYWludHNbIHR5cGUgXS5taW4gLSB2YWx1ZSApO1xuXHRcdFx0cmV0dXJuIHRoaXMucGFkKCB0eXBlLCB2YWx1ZSApO1xuXHRcdH0sXG5cdFx0cGFkOiBmdW5jdGlvbiggdHlwZSwgdmFsdWUgKXtcblx0XHRcdHZhciBzdHIgPSB2YWx1ZSArICcnO1xuXHRcdFx0d2hpbGUgKCBzdHIubGVuZ3RoIDwgdGhpcy5wYWRWYWx1ZXNbIHR5cGUgXSApXG5cdFx0XHRcdHN0ciA9ICcwJyArIHN0cjtcblx0XHRcdHJldHVybiBzdHI7XG5cdFx0fVxuXHR9KTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IERhdGVUaW1lUGlja2VyVGltZTtcblxuXG4vKioqLyB9LFxuLyogOSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIFRoaXMgaXMgZXh0cmFjdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL1BvbWF4L3JlYWN0LW9uY2xpY2tvdXRzaWRlXG5cdC8vIEFuZCBtb2RpZmllZCB0byBzdXBwb3J0IHJlYWN0IDAuMTMgYW5kIHJlYWN0IDAuMTRcblxuXHR2YXIgUmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpLFxuXHRcdHZlcnNpb24gPSBSZWFjdC52ZXJzaW9uICYmIFJlYWN0LnZlcnNpb24uc3BsaXQoJy4nKVxuXHQ7XG5cblx0aWYgKCB2ZXJzaW9uICYmICggdmVyc2lvblswXSA+IDAgfHwgdmVyc2lvblsxXSA+IDEzICkgKVxuXHRcdFJlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMCk7XG5cblx0Ly8gVXNlIGEgcGFyYWxsZWwgYXJyYXkgYmVjYXVzZSB3ZSBjYW4ndCB1c2Vcblx0Ly8gb2JqZWN0cyBhcyBrZXlzLCB0aGV5IGdldCB0b1N0cmluZy1jb2VyY2VkXG5cdHZhciByZWdpc3RlcmVkQ29tcG9uZW50cyA9IFtdO1xuXHR2YXIgaGFuZGxlcnMgPSBbXTtcblxuXHR2YXIgSUdOT1JFX0NMQVNTID0gJ2lnbm9yZS1yZWFjdC1vbmNsaWNrb3V0c2lkZSc7XG5cblx0dmFyIGlzU291cmNlRm91bmQgPSBmdW5jdGlvbihzb3VyY2UsIGxvY2FsTm9kZSkge1xuXHQgaWYgKHNvdXJjZSA9PT0gbG9jYWxOb2RlKSB7XG5cdCAgIHJldHVybiB0cnVlO1xuXHQgfVxuXHQgLy8gU1ZHIDx1c2UvPiBlbGVtZW50cyBkbyBub3QgdGVjaG5pY2FsbHkgcmVzaWRlIGluIHRoZSByZW5kZXJlZCBET00sIHNvXG5cdCAvLyB0aGV5IGRvIG5vdCBoYXZlIGNsYXNzTGlzdCBkaXJlY3RseSwgYnV0IHRoZXkgb2ZmZXIgYSBsaW5rIHRvIHRoZWlyXG5cdCAvLyBjb3JyZXNwb25kaW5nIGVsZW1lbnQsIHdoaWNoIGNhbiBoYXZlIGNsYXNzTGlzdC4gVGhpcyBleHRyYSBjaGVjayBpcyBmb3Jcblx0IC8vIHRoYXQgY2FzZS5cblx0IC8vIFNlZTogaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHMTEvc3RydWN0Lmh0bWwjSW50ZXJmYWNlU1ZHVXNlRWxlbWVudFxuXHQgLy8gRGlzY3Vzc2lvbjogaHR0cHM6Ly9naXRodWIuY29tL1BvbWF4L3JlYWN0LW9uY2xpY2tvdXRzaWRlL3B1bGwvMTdcblx0IGlmIChzb3VyY2UuY29ycmVzcG9uZGluZ0VsZW1lbnQpIHtcblx0ICAgcmV0dXJuIHNvdXJjZS5jb3JyZXNwb25kaW5nRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoSUdOT1JFX0NMQVNTKTtcblx0IH1cblx0IHJldHVybiBzb3VyY2UuY2xhc3NMaXN0LmNvbnRhaW5zKElHTk9SRV9DTEFTUyk7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG5cdCAgIGlmICh0eXBlb2YgdGhpcy5oYW5kbGVDbGlja091dHNpZGUgIT09ICdmdW5jdGlvbicpXG5cdCAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgbGFja3MgYSBoYW5kbGVDbGlja091dHNpZGUoZXZlbnQpIGZ1bmN0aW9uIGZvciBwcm9jZXNzaW5nIG91dHNpZGUgY2xpY2sgZXZlbnRzLicpO1xuXG5cdCAgIHZhciBmbiA9IHRoaXMuX19vdXRzaWRlQ2xpY2tIYW5kbGVyID0gKGZ1bmN0aW9uKGxvY2FsTm9kZSwgZXZlbnRIYW5kbGVyKSB7XG5cdCAgICAgcmV0dXJuIGZ1bmN0aW9uKGV2dCkge1xuXHQgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICAgdmFyIHNvdXJjZSA9IGV2dC50YXJnZXQ7XG5cdCAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcblx0ICAgICAgIC8vIElmIHNvdXJjZT1sb2NhbCB0aGVuIHRoaXMgZXZlbnQgY2FtZSBmcm9tIFwic29tZXdoZXJlXCJcblx0ICAgICAgIC8vIGluc2lkZSBhbmQgc2hvdWxkIGJlIGlnbm9yZWQuIFdlIGNvdWxkIGhhbmRsZSB0aGlzIHdpdGhcblx0ICAgICAgIC8vIGEgbGF5ZXJlZCBhcHByb2FjaCwgdG9vLCBidXQgdGhhdCByZXF1aXJlcyBnb2luZyBiYWNrIHRvXG5cdCAgICAgICAvLyB0aGlua2luZyBpbiB0ZXJtcyBvZiBEb20gbm9kZSBuZXN0aW5nLCBydW5uaW5nIGNvdW50ZXJcblx0ICAgICAgIC8vIHRvIFJlYWN0J3MgXCJ5b3Ugc2hvdWxkbid0IGNhcmUgYWJvdXQgdGhlIERPTVwiIHBoaWxvc29waHkuXG5cdCAgICAgICB3aGlsZSAoc291cmNlLnBhcmVudE5vZGUpIHtcblx0ICAgICAgICAgZm91bmQgPSBpc1NvdXJjZUZvdW5kKHNvdXJjZSwgbG9jYWxOb2RlKTtcblx0ICAgICAgICAgaWYgKGZvdW5kKSByZXR1cm47XG5cdCAgICAgICAgIHNvdXJjZSA9IHNvdXJjZS5wYXJlbnROb2RlO1xuXHQgICAgICAgfVxuXHQgICAgICAgZXZlbnRIYW5kbGVyKGV2dCk7XG5cdCAgICAgfTtcblx0ICAgfShSZWFjdC5maW5kRE9NTm9kZSh0aGlzKSwgdGhpcy5oYW5kbGVDbGlja091dHNpZGUpKTtcblxuXHQgICB2YXIgcG9zID0gcmVnaXN0ZXJlZENvbXBvbmVudHMubGVuZ3RoO1xuXHQgICByZWdpc3RlcmVkQ29tcG9uZW50cy5wdXNoKHRoaXMpO1xuXHQgICBoYW5kbGVyc1twb3NdID0gZm47XG5cblx0ICAgLy8gSWYgdGhlcmUgaXMgYSB0cnV0aHkgZGlzYWJsZU9uQ2xpY2tPdXRzaWRlIHByb3BlcnR5IGZvciB0aGlzXG5cdCAgIC8vIGNvbXBvbmVudCwgZG9uJ3QgaW1tZWRpYXRlbHkgc3RhcnQgbGlzdGVuaW5nIGZvciBvdXRzaWRlIGV2ZW50cy5cblx0ICAgaWYgKCF0aGlzLnByb3BzLmRpc2FibGVPbkNsaWNrT3V0c2lkZSkge1xuXHQgICAgIHRoaXMuZW5hYmxlT25DbGlja091dHNpZGUoKTtcblx0ICAgfVxuXHQgfSxcblxuXHQgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuXHQgICB0aGlzLmRpc2FibGVPbkNsaWNrT3V0c2lkZSgpO1xuXHQgICB0aGlzLl9fb3V0c2lkZUNsaWNrSGFuZGxlciA9IGZhbHNlO1xuXHQgICB2YXIgcG9zID0gcmVnaXN0ZXJlZENvbXBvbmVudHMuaW5kZXhPZih0aGlzKTtcblx0ICAgaWYgKCBwb3M+LTEpIHtcblx0ICAgICBpZiAoaGFuZGxlcnNbcG9zXSkge1xuXHQgICAgICAgLy8gY2xlYW4gdXAgc28gd2UgZG9uJ3QgbGVhayBtZW1vcnlcblx0ICAgICAgIGhhbmRsZXJzLnNwbGljZShwb3MsIDEpO1xuXHQgICAgICAgcmVnaXN0ZXJlZENvbXBvbmVudHMuc3BsaWNlKHBvcywgMSk7XG5cdCAgICAgfVxuXHQgICB9XG5cdCB9LFxuXG5cdCAvKipcblx0ICAqIENhbiBiZSBjYWxsZWQgdG8gZXhwbGljaXRseSBlbmFibGUgZXZlbnQgbGlzdGVuaW5nXG5cdCAgKiBmb3IgY2xpY2tzIGFuZCB0b3VjaGVzIG91dHNpZGUgb2YgdGhpcyBlbGVtZW50LlxuXHQgICovXG5cdCBlbmFibGVPbkNsaWNrT3V0c2lkZTogZnVuY3Rpb24oKSB7XG5cdCAgIHZhciBmbiA9IHRoaXMuX19vdXRzaWRlQ2xpY2tIYW5kbGVyO1xuXHQgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmbik7XG5cdCAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmbik7XG5cdCB9LFxuXG5cdCAvKipcblx0ICAqIENhbiBiZSBjYWxsZWQgdG8gZXhwbGljaXRseSBkaXNhYmxlIGV2ZW50IGxpc3RlbmluZ1xuXHQgICogZm9yIGNsaWNrcyBhbmQgdG91Y2hlcyBvdXRzaWRlIG9mIHRoaXMgZWxlbWVudC5cblx0ICAqL1xuXHQgZGlzYWJsZU9uQ2xpY2tPdXRzaWRlOiBmdW5jdGlvbigpIHtcblx0ICAgdmFyIGZuID0gdGhpcy5fX291dHNpZGVDbGlja0hhbmRsZXI7XG5cdCAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZuKTtcblx0ICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZuKTtcblx0IH1cblx0fTtcblxuXG4vKioqLyB9LFxuLyogMTAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xMF9fO1xuXG4vKioqLyB9XG4vKioqKioqLyBdKVxufSk7XG47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZWFjdC1kYXRldGltZS5qcy5tYXAiXSwiZmlsZSI6InJlYWN0LWRhdGV0aW1lLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
