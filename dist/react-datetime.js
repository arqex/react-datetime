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
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_11__) {
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
		MonthsView = __webpack_require__(7),
		YearsView = __webpack_require__(8),
		TimeView = __webpack_require__(9),
		moment = __webpack_require__(4)
	;

	var KEYS = { 13: 'enter', 27: 'esc', 32: 'space', 33: 'pageup', 34: 'pagedown', 35: 'end', 36: 'home', 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

	var TYPES = React.PropTypes;
	var Datetime = React.createClass({
		mixins: [
			__webpack_require__(10)
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
		HeaderControls = __webpack_require__(5),
		utils = __webpack_require__(6)
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
				first = this.firstDayOfWeek(),
				dow = [],
				i = 0
			;

			days.forEach( function( day ){
				// TODO: Make the day header format flexible. This returns the day's initial.
				dow[ (7 + (i++) - first) % 7 ] = day.substring(0, 1);
			});

			return dow;
		},

		firstDayOfWeek: function(){
			return this.props.startingDay == null
				? this.props.viewDate.localeData().firstDayOfWeek()
				: this.props.startingDay;
		},

		setToLastWeekInMonth: function(date){
			var firstDayOfWeek = this.firstDayOfWeek(),
				lastDay = date.endOf('month'),
				sub
			;
			if (lastDay.day() >= firstDayOfWeek)
				sub = lastDay.day() - firstDayOfWeek;
			else
				sub = lastDay.day() + (7 - firstDayOfWeek);
			lastDay.subtract(sub, 'days');
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

			this.setToLastWeekInMonth(prevMonth);
			var lastDay = prevMonth.clone().add(42, 'd');

			while ( prevMonth.isBefore( lastDay ) ){
				var action = { type: 'day', date: prevMonth.date() };
				dayProps = { key: prevMonth.format('M_D') };
				classes = 'rdtDay';
				currentDate = prevMonth.clone();

				if ( ( prevMonth.year() === currentYear && prevMonth.month() < currentMonth ) || ( prevMonth.year() < currentYear ) ) {
					classes += ' rdtOld';
					action.old = true;
				}
				else if ( ( prevMonth.year() === currentYear && prevMonth.month() > currentMonth ) || ( prevMonth.year() > currentYear ) ) {
					classes += ' rdtNew';
					action.new = true;
				}

				if ( prevMonth.isSame(date, 'day') ) {
					classes += ' rdtActive';
					if (this.props.open) {
						dayProps.ref = utils.focusInput;
					}
				}

				if ( selected && prevMonth.isSame(selected, 'day') )
					classes += ' rdtSelected';

				if (prevMonth.isSame(moment(), 'day') )
					classes += ' rdtToday';

				disabled = !isValid( currentDate, selected );
				if ( disabled )
					classes += ' rdtDisabled';

				dayProps.className = classes;

				// TODO: Button component with action as prop instead of bound click handler?
				if ( !disabled )
					dayProps.onClick = this.updateSelectedDate.bind(this, action);

				days.push( renderer( dayProps, currentDate, selected ) );

				if ( days.length === 7 ){
					weeks.push( DOM.tr( {key: prevMonth.format('M_D')}, days ) );
					days = [];
				}

				prevMonth.add( 1, 'd' );
			}

			return weeks;
		},

		updateSelectedDate: function( action, event ) {
			this.props.updateSelectedDate(event, action, true);
		},

		renderDay: function( props, currentDate ){
			var buttonProps = { onClick: props.onClick, ref: props.ref };
			return DOM.td({ key: props.key, className: props.className }, DOM.button( buttonProps, currentDate.format('DD') ));
		},

		renderFooter: function(){
			if ( !this.props.timeFormat )
				return '';

			var date = this.props.selectedDate || this.props.viewDate;

			return DOM.tfoot({ key: 'tf'},
				DOM.tr({},
					DOM.td({ colSpan: 7 }, DOM.button({ onClick: this.props.showView('time'), className: 'rdtTimeToggle'}, date.format( this.props.timeFormat )))
				)
			);
		},

		handleKeyDown: function( key ){
			// TODO: Curry/make nicer
			switch (key) {
				case 'select':
					this.updateSelectedDate({ type: 'day', date: this.props.viewDate.date() });
					break;
				case 'nextView':
					this.props.showView('months')();
					break;
				case 'left':
					this.props.subtractTime(1, 'days')();
					break;
				case 'up':
					this.props.subtractTime(1, 'weeks')();
					break;
				case 'right':
					this.props.addTime(1, 'days')();
					break;
				case 'down':
					this.props.addTime(1, 'weeks')();
					break;
				case 'pageup':
					this.props.subtractTime(1, 'months')();
					break;
				case 'pagedown':
					this.props.addTime(1, 'months')();
					break;
				case 'home':
					this.props.startOf('month')();
					break;
				case 'end':
					this.props.endOf('month')();
					break;
			}
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
	var Header = React.createClass({

		render: function() {
			return DOM.tr({ key: 'h'}, [
				DOM.th({ key: 'prev' }, DOM.button({ className: 'rdtPrev' }, DOM.span({onClick: this.props.onPrevClick}))),
				DOM.th({ key: 'switch', colSpan: this.props.switchColspan }, DOM.button({ className: 'rdtSwitch', onClick: this.props.onSwitchClick, 'data-value': this.props.switchValue }, this.props.switchLabel )),
				DOM.th({ key: 'next' }, DOM.button({ className: 'rdtNext' }, DOM.span({onClick: this.props.onNextClick})))
			]);
		}
	});

	module.exports = Header;


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
		focusInput: function( input ) {
			if (input != null) input.focus();
		}
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2),
		HeaderControls = __webpack_require__(5),
		utils = __webpack_require__(6)
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
				var action = { type: 'month', month: i };
				props = {
					key: i,
					onClick: this.props.updateOn === 'months'? this.updateSelectedMonth.bind(this, action) : this.props.setDate('month', i)
				};

				classes = 'rdtMonth';
				if ( i === month ) {
					classes += ' rdtActive';
					if (this.props.open) {
						props.ref = utils.focusInput;
					}
				}

				if ( date && i === date.month() && year === date.year() )
					classes += ' rdtSelected';

				props.className = classes;

				months.push( renderer( props, i, year, date && date.clone() ));

				if ( months.length === this.props.monthColumns ){
					rows.push( DOM.tr({ key: month + '_' + rows.length }, months) );
					months = [];
				}

				i++;
			}

			return rows;
		},

		updateSelectedMonth: function( action, event ) {
			this.props.updateSelectedDate(event, action, true);
		},

		renderMonth: function( props, month ) {
			var months = this.props.viewDate.localeData()._months,
				buttonProps = { onClick: props.onClick, ref: props.ref }
			;
			return DOM.td({ key: props.key, className: props.className }, DOM.button( buttonProps, months.standalone
				? capitalize( months.standalone[ month ] )
				: months[ month ]
			));
		},

		handleKeyDown: function( key ) {
			// TODO: Curry/make nicer
			switch (key) {
				case 'select':
					if (this.props.updateOn === 'months')
						this.updateSelectedMonth({ type: 'month', month: this.props.viewDate.month() });
					else
						this.props.setDate('month', this.props.viewDate.month())();
					break;
				case 'nextView':
					this.props.showView('years')();
					break;
				case 'prevView':
					this.props.showView('days')();
					break;
				case 'left':
					this.props.subtractTime(1, 'months')();
					break;
				case 'up':
					this.props.subtractTime(this.props.monthColumns, 'months')();
					break;
				case 'right':
					this.props.addTime(1, 'months')();
					break;
				case 'down':
					this.props.addTime(this.props.monthColumns, 'months')();
					break;
				case 'pageup':
					this.props.subtractTime(1, 'years')();
					break;
				case 'pagedown':
					this.props.addTime(1, 'years')();
					break;
				case 'home':
					this.props.startOf('year')();
					break;
				case 'end':
					this.props.endOf('year')();
					break;
			}
		}
	});

	function capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	module.exports = DateTimePickerMonths;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2),
		HeaderControls = __webpack_require__(5),
		utils = __webpack_require__(6)
	;

	var DOM = React.DOM;
	var DateTimePickerYears = React.createClass({
		getStartingYear: function() {
			var range = this.getRange();
			return parseInt((this.props.viewDate.year() - 1) / range, 10) * range + 1;
		},

		getRange: function() {
			return this.props.yearColumns * this.props.yearRows;
		},

		render: function() {
			var year = this.getStartingYear();

			return DOM.div({ className: 'rdtYears' }, [
				DOM.table({ key: 'a'}, DOM.thead({},
					React.createElement( HeaderControls, {
						key: 'ctrl',
						onPrevClick: this.props.subtractTime(this.getRange(), 'years'),
						onNextClick: this.props.addTime(this.getRange(), 'years'),
						onSwitchClick: this.props.showView('years'),
						switchColspan: 2,
						switchLabel: year + ' - ' + (year + this.getRange() - 1)
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
				viewYear = this.props.viewDate.year(),
				classes, props
			;

			while (i < this.getRange() - 1) {
				var action = { type: 'year', year: year };
				props = {
					key: year,
					onClick: this.props.updateOn === 'years' ? this.updateSelectedYear.bind(this, action) : this.props.setDate('year', year)
				};

				classes = 'rdtYear';
				if ( viewYear === year ) {
					classes += ' rdtActive';
					if (this.props.open) {
						props.ref = utils.focusInput;
					}
				}

				if ( selectedDate && selectedDate.year() === year )
					classes += ' rdtSelected';

				props.className = classes;

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

		updateSelectedYear: function( action, event ) {
			this.props.updateSelectedDate(event, action, true);
		},

		renderYear: function( props, year ){
			var buttonProps = { onClick: props.onClick, ref: props.ref };
			return DOM.td({ key: props.key, className: props.className }, DOM.button( buttonProps, year ));
		},

		handleKeyDown: function( key ) {
			// TODO: Curry/make nicer
			switch (key) {
				case 'select':
					if (this.props.updateOn === 'years')
						this.updateSelectedYear({ type: 'year', year: this.props.viewDate.year() });
					else
						this.props.setDate('year', this.props.viewDate.year())();
					break;
				case 'prevView':
					this.props.showView('months')();
					break;
				case 'left':
					this.props.subtractTime(1, 'years')();
					break;
				case 'up':
					this.props.subtractTime(this.props.yearColumns, 'years')();
					break;
				case 'right':
					this.props.addTime(1, 'years')();
					break;
				case 'down':
					this.props.addTime(this.props.yearColumns, 'years')();
					break;
				case 'pageup':
					this.props.subtractTime(this.getRange(), 'years')();
					break;
				case 'pagedown':
					this.props.addTime(this.getRange(), 'years')();
					break;
				case 'home':
					this.props.setYear(this.getStartingYear())();
					break;
				case 'end':
					this.props.setYear(this.getStartingYear() + this.getRange() - 1)();
					break;
			}
		}
	});

	module.exports = DateTimePickerYears;


/***/ },
/* 9 */
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
				DOM.th({}, DOM.button( {className: 'rdtSwitch', colSpan: 4, onClick: this.props.showView('days')}, date.format( this.props.dateFormat ) ))
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// This is extracted from https://github.com/Pomax/react-onclickoutside
	// And modified to support react 0.13 and react 0.14

	var React = __webpack_require__(2),
		version = React.version && React.version.split('.')
	;

	if ( version && ( version[0] > 0 || version[1] > 13 ) )
		React = __webpack_require__(11);

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
/* 11 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-datetime.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWFjdC1kYXRldGltZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJSZWFjdFwiKSwgcmVxdWlyZShcIm1vbWVudFwiKSwgcmVxdWlyZShcIlJlYWN0RE9NXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcIlJlYWN0XCIsIFwibW9tZW50XCIsIFwiUmVhY3RET01cIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXRpbWVcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJSZWFjdFwiKSwgcmVxdWlyZShcIm1vbWVudFwiKSwgcmVxdWlyZShcIlJlYWN0RE9NXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJEYXRldGltZVwiXSA9IGZhY3Rvcnkocm9vdFtcIlJlYWN0XCJdLCByb290W1wibW9tZW50XCJdLCByb290W1wiUmVhY3RET01cIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8yX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNF9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzExX18pIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuXG5cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBhc3NpZ24gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpLFxuXHRcdFJlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKSxcblx0XHREYXlzVmlldyA9IF9fd2VicGFja19yZXF1aXJlX18oMyksXG5cdFx0TW9udGhzVmlldyA9IF9fd2VicGFja19yZXF1aXJlX18oNyksXG5cdFx0WWVhcnNWaWV3ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg4KSxcblx0XHRUaW1lVmlldyA9IF9fd2VicGFja19yZXF1aXJlX18oOSksXG5cdFx0bW9tZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXyg0KVxuXHQ7XG5cblx0dmFyIEtFWVMgPSB7IDEzOiAnZW50ZXInLCAyNzogJ2VzYycsIDMyOiAnc3BhY2UnLCAzMzogJ3BhZ2V1cCcsIDM0OiAncGFnZWRvd24nLCAzNTogJ2VuZCcsIDM2OiAnaG9tZScsIDM3OiAnbGVmdCcsIDM4OiAndXAnLCAzOTogJ3JpZ2h0JywgNDA6ICdkb3duJyB9O1xuXG5cdHZhciBUWVBFUyA9IFJlYWN0LlByb3BUeXBlcztcblx0dmFyIERhdGV0aW1lID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRcdG1peGluczogW1xuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXygxMClcblx0XHRdLFxuXHRcdHZpZXdDb21wb25lbnRzOiB7XG5cdFx0XHRkYXlzOiBEYXlzVmlldyxcblx0XHRcdG1vbnRoczogTW9udGhzVmlldyxcblx0XHRcdHllYXJzOiBZZWFyc1ZpZXcsXG5cdFx0XHR0aW1lOiBUaW1lVmlld1xuXHRcdH0sXG5cdFx0cHJvcFR5cGVzOiB7XG5cdFx0XHQvLyB2YWx1ZTogVFlQRVMub2JqZWN0IHwgVFlQRVMuc3RyaW5nLFxuXHRcdFx0Ly8gZGVmYXVsdFZhbHVlOiBUWVBFUy5vYmplY3QgfCBUWVBFUy5zdHJpbmcsXG5cdFx0XHRvbkZvY3VzOiBUWVBFUy5mdW5jLFxuXHRcdFx0b25CbHVyOiBUWVBFUy5mdW5jLFxuXHRcdFx0b25DaGFuZ2U6IFRZUEVTLmZ1bmMsXG5cdFx0XHRsb2NhbGU6IFRZUEVTLnN0cmluZyxcblx0XHRcdGlucHV0OiBUWVBFUy5ib29sLFxuXHRcdFx0Ly8gZGF0ZUZvcm1hdDogVFlQRVMuc3RyaW5nIHwgVFlQRVMuYm9vbCxcblx0XHRcdC8vIHRpbWVGb3JtYXQ6IFRZUEVTLnN0cmluZyB8IFRZUEVTLmJvb2wsXG5cdFx0XHRpbnB1dFByb3BzOiBUWVBFUy5vYmplY3QsXG5cdFx0XHR0aW1lQ29uc3RyYWludHM6IFRZUEVTLm9iamVjdCxcblx0XHRcdHZpZXdNb2RlOiBUWVBFUy5vbmVPZihbJ3llYXJzJywgJ21vbnRocycsICdkYXlzJywgJ3RpbWUnXSksXG5cdFx0XHRpc1ZhbGlkRGF0ZTogVFlQRVMuZnVuYyxcblx0XHRcdG9wZW46IFRZUEVTLmJvb2wsXG5cdFx0XHRzdHJpY3RQYXJzaW5nOiBUWVBFUy5ib29sLFxuXHRcdFx0Y2xvc2VPblNlbGVjdDogVFlQRVMuYm9vbCxcblx0XHRcdGNsb3NlT25UYWI6IFRZUEVTLmJvb2wsXG5cdFx0XHRzdGFydGluZ0RheTogVFlQRVMubnVtYmVyLFxuXHRcdFx0bW9udGhDb2x1bW5zOiBUWVBFUy5udW1iZXIsXG5cdFx0XHR5ZWFyQ29sdW1uczogVFlQRVMubnVtYmVyLFxuXHRcdFx0eWVhclJvd3M6IFRZUEVTLm51bWJlclxuXHRcdH0sXG5cblx0XHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5vZiA9IGZ1bmN0aW9uKCl7fTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNsYXNzTmFtZTogJycsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogJycsXG5cdFx0XHRcdGlucHV0UHJvcHM6IHt9LFxuXHRcdFx0XHRpbnB1dDogdHJ1ZSxcblx0XHRcdFx0b25Gb2N1czogbm9mLFxuXHRcdFx0XHRvbkJsdXI6IG5vZixcblx0XHRcdFx0b25DaGFuZ2U6IG5vZixcblx0XHRcdFx0dGltZUZvcm1hdDogdHJ1ZSxcblx0XHRcdFx0dGltZUNvbnN0cmFpbnRzOiB7fSxcblx0XHRcdFx0ZGF0ZUZvcm1hdDogdHJ1ZSxcblx0XHRcdFx0c3RyaWN0UGFyc2luZzogdHJ1ZSxcblx0XHRcdFx0Y2xvc2VPblNlbGVjdDogZmFsc2UsXG5cdFx0XHRcdGNsb3NlT25UYWI6IHRydWUsXG5cdFx0XHRcdG1vbnRoQ29sdW1uczogNCxcblx0XHRcdFx0eWVhckNvbHVtbnM6IDQsXG5cdFx0XHRcdHllYXJSb3dzOiAzXG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21Qcm9wcyggdGhpcy5wcm9wcyApO1xuXG5cdFx0XHRpZiAoIHN0YXRlLm9wZW4gPT09IHVuZGVmaW5lZCApXG5cdFx0XHRcdHN0YXRlLm9wZW4gPSAhdGhpcy5wcm9wcy5pbnB1dDtcblxuXHRcdFx0c3RhdGUuY3VycmVudFZpZXcgPSB0aGlzLnByb3BzLmRhdGVGb3JtYXQgPyAodGhpcy5wcm9wcy52aWV3TW9kZSB8fCBzdGF0ZS51cGRhdGVPbiB8fCAnZGF5cycpIDogJ3RpbWUnO1xuXG5cdFx0XHRyZXR1cm4gc3RhdGU7XG5cdFx0fSxcblxuXHRcdGdldFN0YXRlRnJvbVByb3BzOiBmdW5jdGlvbiggcHJvcHMgKXtcblx0XHRcdHZhciBmb3JtYXRzID0gdGhpcy5nZXRGb3JtYXRzKCBwcm9wcyApLFxuXHRcdFx0XHRkYXRlID0gcHJvcHMudmFsdWUgfHwgcHJvcHMuZGVmYXVsdFZhbHVlLFxuXHRcdFx0XHRzZWxlY3RlZERhdGUsIHZpZXdEYXRlLCB1cGRhdGVPbiwgaW5wdXRWYWx1ZVxuXHRcdFx0O1xuXG5cdFx0XHRpZiAoIGRhdGUgJiYgdHlwZW9mIGRhdGUgPT09ICdzdHJpbmcnIClcblx0XHRcdFx0c2VsZWN0ZWREYXRlID0gdGhpcy5sb2NhbE1vbWVudCggZGF0ZSwgZm9ybWF0cy5kYXRldGltZSApO1xuXHRcdFx0ZWxzZSBpZiAoIGRhdGUgKVxuXHRcdFx0XHRzZWxlY3RlZERhdGUgPSB0aGlzLmxvY2FsTW9tZW50KCBkYXRlICk7XG5cblx0XHRcdGlmICggc2VsZWN0ZWREYXRlICYmICFzZWxlY3RlZERhdGUuaXNWYWxpZCgpIClcblx0XHRcdFx0c2VsZWN0ZWREYXRlID0gbnVsbDtcblxuXHRcdFx0dmlld0RhdGUgPSBzZWxlY3RlZERhdGUgP1xuXHRcdFx0XHRzZWxlY3RlZERhdGUuY2xvbmUoKS5zdGFydE9mKCdkYXknKSA6XG5cdFx0XHRcdHRoaXMubG9jYWxNb21lbnQoKS5zdGFydE9mKCdkYXknKVxuXHRcdFx0O1xuXG5cdFx0XHR1cGRhdGVPbiA9IHRoaXMuZ2V0VXBkYXRlT24oZm9ybWF0cyk7XG5cblx0XHRcdGlmICggc2VsZWN0ZWREYXRlIClcblx0XHRcdFx0aW5wdXRWYWx1ZSA9IHNlbGVjdGVkRGF0ZS5mb3JtYXQoZm9ybWF0cy5kYXRldGltZSk7XG5cdFx0XHRlbHNlIGlmICggZGF0ZS5pc1ZhbGlkICYmICFkYXRlLmlzVmFsaWQoKSApXG5cdFx0XHRcdGlucHV0VmFsdWUgPSAnJztcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5wdXRWYWx1ZSA9IGRhdGUgfHwgJyc7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHVwZGF0ZU9uOiB1cGRhdGVPbixcblx0XHRcdFx0aW5wdXRGb3JtYXQ6IGZvcm1hdHMuZGF0ZXRpbWUsXG5cdFx0XHRcdHZpZXdEYXRlOiB2aWV3RGF0ZSxcblx0XHRcdFx0c2VsZWN0ZWREYXRlOiBzZWxlY3RlZERhdGUsXG5cdFx0XHRcdGlucHV0VmFsdWU6IGlucHV0VmFsdWUsXG5cdFx0XHRcdG9wZW46IHByb3BzLm9wZW5cblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdGdldFVwZGF0ZU9uOiBmdW5jdGlvbihmb3JtYXRzKXtcblx0XHRcdGlmICggZm9ybWF0cy5kYXRlLm1hdGNoKC9bbExEXS8pICl7XG5cdFx0XHRcdHJldHVybiAnZGF5cyc7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICggZm9ybWF0cy5kYXRlLmluZGV4T2YoJ00nKSAhPT0gLTEgKXtcblx0XHRcdFx0cmV0dXJuICdtb250aHMnO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIGZvcm1hdHMuZGF0ZS5pbmRleE9mKCdZJykgIT09IC0xICl7XG5cdFx0XHRcdHJldHVybiAneWVhcnMnO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gJ2RheXMnO1xuXHRcdH0sXG5cblx0XHRnZXRGb3JtYXRzOiBmdW5jdGlvbiggcHJvcHMgKXtcblx0XHRcdHZhciBmb3JtYXRzID0ge1xuXHRcdFx0XHRcdGRhdGU6IHByb3BzLmRhdGVGb3JtYXQgfHwgJycsXG5cdFx0XHRcdFx0dGltZTogcHJvcHMudGltZUZvcm1hdCB8fCAnJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRsb2NhbGUgPSB0aGlzLmxvY2FsTW9tZW50KCBwcm9wcy5kYXRlICkubG9jYWxlRGF0YSgpXG5cdFx0XHQ7XG5cblx0XHRcdGlmICggZm9ybWF0cy5kYXRlID09PSB0cnVlICl7XG5cdFx0XHRcdGZvcm1hdHMuZGF0ZSA9IGxvY2FsZS5sb25nRGF0ZUZvcm1hdCgnTCcpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIHRoaXMuZ2V0VXBkYXRlT24oZm9ybWF0cykgIT09ICdkYXlzJyApe1xuXHRcdFx0XHRmb3JtYXRzLnRpbWUgPSAnJztcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBmb3JtYXRzLnRpbWUgPT09IHRydWUgKXtcblx0XHRcdFx0Zm9ybWF0cy50aW1lID0gbG9jYWxlLmxvbmdEYXRlRm9ybWF0KCdMVCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3JtYXRzLmRhdGV0aW1lID0gZm9ybWF0cy5kYXRlICYmIGZvcm1hdHMudGltZSA/XG5cdFx0XHRcdGZvcm1hdHMuZGF0ZSArICcgJyArIGZvcm1hdHMudGltZSA6XG5cdFx0XHRcdGZvcm1hdHMuZGF0ZSB8fCBmb3JtYXRzLnRpbWVcblx0XHRcdDtcblxuXHRcdFx0cmV0dXJuIGZvcm1hdHM7XG5cdFx0fSxcblxuXHRcdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuXHRcdFx0dmFyIGZvcm1hdHMgPSB0aGlzLmdldEZvcm1hdHMoIG5leHRQcm9wcyApLFxuXHRcdFx0XHR1cGRhdGUgPSB7fVxuXHRcdFx0O1xuXG5cdFx0XHRpZiAoIG5leHRQcm9wcy52YWx1ZSAhPT0gdGhpcy5wcm9wcy52YWx1ZSApe1xuXHRcdFx0XHR1cGRhdGUgPSB0aGlzLmdldFN0YXRlRnJvbVByb3BzKCBuZXh0UHJvcHMgKTtcblx0XHRcdH1cblx0XHRcdGlmICggZm9ybWF0cy5kYXRldGltZSAhPT0gdGhpcy5nZXRGb3JtYXRzKCB0aGlzLnByb3BzICkuZGF0ZXRpbWUgKSB7XG5cdFx0XHRcdHVwZGF0ZS5pbnB1dEZvcm1hdCA9IGZvcm1hdHMuZGF0ZXRpbWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdXBkYXRlLm9wZW4gPT09IHVuZGVmaW5lZCApe1xuXHRcdFx0XHRpZiAoIHRoaXMucHJvcHMuY2xvc2VPblNlbGVjdCAmJiB0aGlzLnN0YXRlLmN1cnJlbnRWaWV3ICE9PSAndGltZScgKXtcblx0XHRcdFx0XHR1cGRhdGUub3BlbiA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHVwZGF0ZS5vcGVuID0gdGhpcy5zdGF0ZS5vcGVuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuc2V0U3RhdGUoIHVwZGF0ZSApO1xuXHRcdH0sXG5cblx0XHRvbklucHV0Q2hhbmdlOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdHZhciB2YWx1ZSA9IGUudGFyZ2V0ID09PSBudWxsID8gZSA6IGUudGFyZ2V0LnZhbHVlLFxuXHRcdFx0XHRsb2NhbE1vbWVudCA9IHRoaXMubG9jYWxNb21lbnQoIHZhbHVlLCB0aGlzLnN0YXRlLmlucHV0Rm9ybWF0ICksXG5cdFx0XHRcdHVwZGF0ZSA9IHsgaW5wdXRWYWx1ZTogdmFsdWUgfVxuXHRcdFx0O1xuXG5cdFx0XHRpZiAoIGxvY2FsTW9tZW50LmlzVmFsaWQoKSAmJiAhdGhpcy5wcm9wcy52YWx1ZSApIHtcblx0XHRcdFx0dXBkYXRlLnNlbGVjdGVkRGF0ZSA9IGxvY2FsTW9tZW50O1xuXHRcdFx0XHR1cGRhdGUudmlld0RhdGUgPSBsb2NhbE1vbWVudC5jbG9uZSgpLnN0YXJ0T2YoJ2RheScpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHVwZGF0ZS5zZWxlY3RlZERhdGUgPSBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcy5zZXRTdGF0ZSggdXBkYXRlLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucHJvcHMub25DaGFuZ2UoIGxvY2FsTW9tZW50LmlzVmFsaWQoKSA/IGxvY2FsTW9tZW50IDogdGhpcy5zdGF0ZS5pbnB1dFZhbHVlICk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0b25JbnB1dEtleTogZnVuY3Rpb24oIGUgKXtcblx0XHRcdGlmICggZS53aGljaCA9PT0gOSAmJiB0aGlzLnByb3BzLmNsb3NlT25UYWIgKXtcblx0XHRcdFx0dGhpcy5jbG9zZUNhbGVuZGFyKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHNob3dWaWV3OiBmdW5jdGlvbiggdmlldyApe1xuXHRcdFx0dmFyIG1lID0gdGhpcztcblx0XHRcdHJldHVybiBmdW5jdGlvbigpe1xuXHRcdFx0XHRtZS5zZXRTdGF0ZSh7IGN1cnJlbnRWaWV3OiB2aWV3IH0pO1xuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0c2V0RGF0ZTogZnVuY3Rpb24oIHR5cGUsIHZhbHVlICl7XG5cdFx0XHR2YXIgbWUgPSB0aGlzLFxuXHRcdFx0XHRuZXh0Vmlld3MgPSB7XG5cdFx0XHRcdFx0bW9udGg6ICdkYXlzJyxcblx0XHRcdFx0XHR5ZWFyOiAnbW9udGhzJ1xuXHRcdFx0XHR9XG5cdFx0XHQ7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcblx0XHRcdFx0bWUuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdHZpZXdEYXRlOiBtZS5zdGF0ZS52aWV3RGF0ZS5jbG9uZSgpWyB0eXBlIF0oIHZhbHVlICksXG5cdFx0XHRcdFx0Y3VycmVudFZpZXc6IG5leHRWaWV3c1sgdHlwZSBdXG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0YWRkVGltZTogZnVuY3Rpb24oIGFtb3VudCwgdHlwZSwgdG9TZWxlY3RlZCApe1xuXHRcdFx0cmV0dXJuIHRoaXMudXBkYXRlVGltZSggJ2FkZCcsIFsgYW1vdW50LCB0eXBlIF0sIHRvU2VsZWN0ZWQgKTtcblx0XHR9LFxuXG5cdFx0c3VidHJhY3RUaW1lOiBmdW5jdGlvbiggYW1vdW50LCB0eXBlLCB0b1NlbGVjdGVkICl7XG5cdFx0XHRyZXR1cm4gdGhpcy51cGRhdGVUaW1lKCAnc3VidHJhY3QnLCBbIGFtb3VudCwgdHlwZSBdLCB0b1NlbGVjdGVkICk7XG5cdFx0fSxcblxuXHRcdHN0YXJ0T2Y6IGZ1bmN0aW9uKCB0eXBlICl7XG5cdFx0XHRyZXR1cm4gdGhpcy51cGRhdGVUaW1lKCAnc3RhcnRPZicsIFsgdHlwZSBdICk7XG5cdFx0fSxcblxuXHRcdGVuZE9mOiBmdW5jdGlvbiggdHlwZSApe1xuXHRcdFx0cmV0dXJuIHRoaXMudXBkYXRlVGltZSggJ2VuZE9mJywgWyB0eXBlIF0gKTtcblx0XHR9LFxuXG5cdFx0c2V0WWVhcjogZnVuY3Rpb24oIHllYXIgKXtcblx0XHRcdHJldHVybiB0aGlzLnVwZGF0ZVRpbWUoICd5ZWFyJywgWyB5ZWFyIF0gKTtcblx0XHR9LFxuXG5cdFx0dXBkYXRlVGltZTogZnVuY3Rpb24oIG9wLCBhcmdzLCB0b1NlbGVjdGVkICl7XG5cdFx0XHR2YXIgbWUgPSB0aGlzO1xuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIHVwZGF0ZSA9IHt9LFxuXHRcdFx0XHRcdGRhdGUgPSB0b1NlbGVjdGVkID8gJ3NlbGVjdGVkRGF0ZScgOiAndmlld0RhdGUnLFxuXHRcdFx0XHRcdG5ld1RpbWUgPSBtZS5zdGF0ZVsgZGF0ZSBdLmNsb25lKClcblx0XHRcdFx0O1xuXG5cdFx0XHRcdHVwZGF0ZVsgZGF0ZSBdID0gbmV3VGltZVsgb3AgXS5hcHBseShuZXdUaW1lLCBhcmdzKTtcblxuXHRcdFx0XHRtZS5zZXRTdGF0ZSggdXBkYXRlICk7XG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRhbGxvd2VkU2V0VGltZTogWydob3VycycsICdtaW51dGVzJywgJ3NlY29uZHMnLCAnbWlsbGlzZWNvbmRzJ10sXG5cdFx0c2V0VGltZTogZnVuY3Rpb24oIHR5cGUsIHZhbHVlICl7XG5cdFx0XHR2YXIgaW5kZXggPSB0aGlzLmFsbG93ZWRTZXRUaW1lLmluZGV4T2YoIHR5cGUgKSArIDEsXG5cdFx0XHRcdHN0YXRlID0gdGhpcy5zdGF0ZSxcblx0XHRcdFx0ZGF0ZSA9IChzdGF0ZS5zZWxlY3RlZERhdGUgfHwgc3RhdGUudmlld0RhdGUpLmNsb25lKCksXG5cdFx0XHRcdG5leHRUeXBlXG5cdFx0XHQ7XG5cblx0XHRcdC8vIEl0IGlzIG5lZWRlZCB0byBzZXQgYWxsIHRoZSB0aW1lIHByb3BlcnRpZXNcblx0XHRcdC8vIHRvIG5vdCB0byByZXNldCB0aGUgdGltZVxuXHRcdFx0ZGF0ZVsgdHlwZSBdKCB2YWx1ZSApO1xuXHRcdFx0Zm9yICg7IGluZGV4IDwgdGhpcy5hbGxvd2VkU2V0VGltZS5sZW5ndGg7IGluZGV4KyspIHtcblx0XHRcdFx0bmV4dFR5cGUgPSB0aGlzLmFsbG93ZWRTZXRUaW1lW2luZGV4XTtcblx0XHRcdFx0ZGF0ZVsgbmV4dFR5cGUgXSggZGF0ZVtuZXh0VHlwZV0oKSApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICF0aGlzLnByb3BzLnZhbHVlICl7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdHNlbGVjdGVkRGF0ZTogZGF0ZSxcblx0XHRcdFx0XHRpbnB1dFZhbHVlOiBkYXRlLmZvcm1hdCggc3RhdGUuaW5wdXRGb3JtYXQgKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHRoaXMucHJvcHMub25DaGFuZ2UoIGRhdGUgKTtcblx0XHR9LFxuXG5cdFx0dXBkYXRlU2VsZWN0ZWREYXRlOiBmdW5jdGlvbiggZSwgYWN0aW9uLCBjbG9zZSApIHtcblx0XHRcdHZhciBtb2RpZmllciA9IDAsXG5cdFx0XHRcdHZpZXdEYXRlID0gdGhpcy5zdGF0ZS52aWV3RGF0ZSxcblx0XHRcdFx0Y3VycmVudERhdGUgPSB0aGlzLnN0YXRlLnNlbGVjdGVkRGF0ZSB8fCB2aWV3RGF0ZSxcblx0XHRcdFx0ZGF0ZVxuXHRcdFx0O1xuXG5cdFx0XHRpZiAoYWN0aW9uLnR5cGUgPT09ICdkYXknKXtcblx0XHRcdFx0aWYgKGFjdGlvbi5uZXcpXG5cdFx0XHRcdFx0bW9kaWZpZXIgPSAxO1xuXHRcdFx0XHRlbHNlIGlmIChhY3Rpb24ub2xkKVxuXHRcdFx0XHRcdG1vZGlmaWVyID0gLTE7XG5cblx0XHRcdFx0ZGF0ZSA9IHZpZXdEYXRlLmNsb25lKClcblx0XHRcdFx0XHQubW9udGgoIHZpZXdEYXRlLm1vbnRoKCkgKyBtb2RpZmllciApXG5cdFx0XHRcdFx0LmRhdGUoIGFjdGlvbi5kYXRlICk7XG5cdFx0XHR9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSAnbW9udGgnKXtcblx0XHRcdFx0ZGF0ZSA9IHZpZXdEYXRlLmNsb25lKClcblx0XHRcdFx0XHQubW9udGgoIGFjdGlvbi5tb250aCApXG5cdFx0XHRcdFx0LmRhdGUoIGN1cnJlbnREYXRlLmRhdGUoKSApO1xuXHRcdFx0fSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gJ3llYXInKXtcblx0XHRcdFx0ZGF0ZSA9IHZpZXdEYXRlLmNsb25lKClcblx0XHRcdFx0XHQubW9udGgoIGN1cnJlbnREYXRlLm1vbnRoKCkgKVxuXHRcdFx0XHRcdC5kYXRlKCBjdXJyZW50RGF0ZS5kYXRlKCkgKVxuXHRcdFx0XHRcdC55ZWFyKCBhY3Rpb24ueWVhciApO1xuXHRcdFx0fVxuXG5cdFx0XHRkYXRlLmhvdXJzKCBjdXJyZW50RGF0ZS5ob3VycygpIClcblx0XHRcdFx0Lm1pbnV0ZXMoIGN1cnJlbnREYXRlLm1pbnV0ZXMoKSApXG5cdFx0XHRcdC5zZWNvbmRzKCBjdXJyZW50RGF0ZS5zZWNvbmRzKCkgKVxuXHRcdFx0XHQubWlsbGlzZWNvbmRzKCBjdXJyZW50RGF0ZS5taWxsaXNlY29uZHMoKSApO1xuXG5cdFx0XHRpZiAoICF0aGlzLnByb3BzLnZhbHVlICl7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdHNlbGVjdGVkRGF0ZTogZGF0ZSxcblx0XHRcdFx0XHR2aWV3RGF0ZTogZGF0ZS5jbG9uZSgpLnN0YXJ0T2YoJ2RheScpLFxuXHRcdFx0XHRcdGlucHV0VmFsdWU6IGRhdGUuZm9ybWF0KCB0aGlzLnN0YXRlLmlucHV0Rm9ybWF0ICksXG5cdFx0XHRcdFx0b3BlbjogISh0aGlzLnByb3BzLmNsb3NlT25TZWxlY3QgJiYgY2xvc2UgKVxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICh0aGlzLnByb3BzLmNsb3NlT25TZWxlY3QgJiYgY2xvc2UpIHtcblx0XHRcdFx0XHR0aGlzLmNsb3NlQ2FsZW5kYXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnByb3BzLm9uQ2hhbmdlKCBkYXRlICk7XG5cdFx0fSxcblxuXHRcdG9wZW5DYWxlbmRhcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIXRoaXMuc3RhdGUub3Blbikge1xuXHRcdFx0XHR0aGlzLnByb3BzLm9uRm9jdXMoKTtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IG9wZW46IHRydWUgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGNsb3NlQ2FsZW5kYXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IG9wZW46IGZhbHNlIH0pO1xuXHRcdFx0dGhpcy5wcm9wcy5vbkJsdXIoIHRoaXMuc3RhdGUuc2VsZWN0ZWREYXRlIHx8IHRoaXMuc3RhdGUuaW5wdXRWYWx1ZSApO1xuXHRcdFx0aWYgKCEodGhpcy5wcm9wcy5pbnB1dFByb3BzICYmIHRoaXMucHJvcHMuaW5wdXRQcm9wcy5yZWFkT25seSkpXG5cdFx0XHRcdHRoaXMuaW5wdXRJbnN0YW5jZS5mb2N1cygpO1xuXHRcdH0sXG5cblx0XHRoYW5kbGVDbGlja091dHNpZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAoIHRoaXMucHJvcHMuaW5wdXQgJiYgdGhpcy5zdGF0ZS5vcGVuICYmICF0aGlzLnByb3BzLm9wZW4gKXtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IG9wZW46IGZhbHNlIH0pO1xuXHRcdFx0XHR0aGlzLnByb3BzLm9uQmx1ciggdGhpcy5zdGF0ZS5zZWxlY3RlZERhdGUgfHwgdGhpcy5zdGF0ZS5pbnB1dFZhbHVlICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGxvY2FsTW9tZW50OiBmdW5jdGlvbiggZGF0ZSwgZm9ybWF0ICl7XG5cdFx0XHR2YXIgbSA9IG1vbWVudCggZGF0ZSwgZm9ybWF0LCB0aGlzLnByb3BzLnN0cmljdFBhcnNpbmcgKTtcblx0XHRcdGlmICggdGhpcy5wcm9wcy5sb2NhbGUgKVxuXHRcdFx0XHRtLmxvY2FsZSggdGhpcy5wcm9wcy5sb2NhbGUgKTtcblx0XHRcdHJldHVybiBtO1xuXHRcdH0sXG5cblx0XHRjb21wb25lbnRQcm9wczoge1xuXHRcdFx0ZnJvbVByb3BzOiBbJ3ZhbHVlJywgJ2lzVmFsaWREYXRlJywgJ3JlbmRlckRheScsICdyZW5kZXJNb250aCcsICdyZW5kZXJZZWFyJywgJ3RpbWVDb25zdHJhaW50cycsICdzdGFydGluZ0RheScsICdtb250aENvbHVtbnMnLCAneWVhckNvbHVtbnMnLCAneWVhclJvd3MnXSxcblx0XHRcdGZyb21TdGF0ZTogWyd2aWV3RGF0ZScsICdzZWxlY3RlZERhdGUnLCAndXBkYXRlT24nLCAnb3BlbiddLFxuXHRcdFx0ZnJvbVRoaXM6IFsnc2V0RGF0ZScsICdzZXRUaW1lJywgJ3Nob3dWaWV3JywgJ2FkZFRpbWUnLCAnc3VidHJhY3RUaW1lJywgJ3N0YXJ0T2YnLCAnZW5kT2YnLCAnc2V0WWVhcicsICd1cGRhdGVTZWxlY3RlZERhdGUnLCAnbG9jYWxNb21lbnQnXVxuXHRcdH0sXG5cblx0XHRnZXRDb21wb25lbnRQcm9wczogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBtZSA9IHRoaXMsXG5cdFx0XHRcdGZvcm1hdHMgPSB0aGlzLmdldEZvcm1hdHMoIHRoaXMucHJvcHMgKSxcblx0XHRcdFx0cHJvcHMgPSB7ZGF0ZUZvcm1hdDogZm9ybWF0cy5kYXRlLCB0aW1lRm9ybWF0OiBmb3JtYXRzLnRpbWUsIHJlZjogdGhpcy5yZWZWaWV3fVxuXHRcdFx0O1xuXG5cdFx0XHR0aGlzLmNvbXBvbmVudFByb3BzLmZyb21Qcm9wcy5mb3JFYWNoKCBmdW5jdGlvbiggbmFtZSApe1xuXHRcdFx0XHRwcm9wc1sgbmFtZSBdID0gbWUucHJvcHNbIG5hbWUgXTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5jb21wb25lbnRQcm9wcy5mcm9tU3RhdGUuZm9yRWFjaCggZnVuY3Rpb24oIG5hbWUgKXtcblx0XHRcdFx0cHJvcHNbIG5hbWUgXSA9IG1lLnN0YXRlWyBuYW1lIF07XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuY29tcG9uZW50UHJvcHMuZnJvbVRoaXMuZm9yRWFjaCggZnVuY3Rpb24oIG5hbWUgKXtcblx0XHRcdFx0cHJvcHNbIG5hbWUgXSA9IG1lWyBuYW1lIF07XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHByb3BzO1xuXHRcdH0sXG5cblx0XHRyZWZWaWV3OiBmdW5jdGlvbiggdmlld0luc3RhbmNlICl7XG5cdFx0XHR0aGlzLnZpZXdJbnN0YW5jZSA9IHZpZXdJbnN0YW5jZTtcblx0XHR9LFxuXG5cdFx0cmVmSW5wdXQ6IGZ1bmN0aW9uKCBpbnB1dEluc3RhbmNlICl7XG5cdFx0XHR0aGlzLmlucHV0SW5zdGFuY2UgPSBpbnB1dEluc3RhbmNlO1xuXHRcdH0sXG5cblx0XHRvblBpY2tlcktleTogZnVuY3Rpb24oIGUgKXtcblx0XHRcdHZhciBrZXkgPSBLRVlTW2Uud2hpY2hdO1xuXG5cdFx0XHQvLyBUT0RPOiBEaXNhYmxlZD9cblx0XHRcdGlmICgha2V5IHx8IGUuc2hpZnRLZXkgfHwgZS5hbHRLZXkpIHsgLy98fCAkc2NvcGUuZGlzYWJsZWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQvLyBUT0RPOiBzaG9ydGN1dFByb3BhZ2F0aW9uIG9wdGlvbj9cblx0XHRcdC8vaWYgKCFzZWxmLnNob3J0Y3V0UHJvcGFnYXRpb24pXG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRpZiAoa2V5ID09PSAnZXNjJykge1xuXHRcdFx0XHR0aGlzLmNsb3NlQ2FsZW5kYXIoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoa2V5ID09PSAnZW50ZXInIHx8IGtleSA9PT0gJ3NwYWNlJykge1xuXHRcdFx0XHRrZXkgPSAnc2VsZWN0Jztcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGUuY3RybEtleSAmJiBrZXkgPT09ICd1cCcpIHtcblx0XHRcdFx0a2V5ID0gJ25leHRWaWV3Jztcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGUuY3RybEtleSAmJiBrZXkgPT09ICdkb3duJykge1xuXHRcdFx0XHRrZXkgPSAncHJldlZpZXcnO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnZpZXdJbnN0YW5jZS5oYW5kbGVLZXlEb3duKGtleSwgZSk7XG5cdFx0fSxcblxuXHRcdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgQ29tcG9uZW50ID0gdGhpcy52aWV3Q29tcG9uZW50c1sgdGhpcy5zdGF0ZS5jdXJyZW50VmlldyBdLFxuXHRcdFx0XHRET00gPSBSZWFjdC5ET00sXG5cdFx0XHRcdGNsYXNzTmFtZSA9ICdyZHQnICsgKHRoaXMucHJvcHMuY2xhc3NOYW1lID9cblx0XHRcdFx0XHRcdFx0XHRcdFx0KCBBcnJheS5pc0FycmF5KCB0aGlzLnByb3BzLmNsYXNzTmFtZSApID9cblx0XHRcdFx0XHRcdFx0XHRcdFx0JyAnICsgdGhpcy5wcm9wcy5jbGFzc05hbWUuam9pbiggJyAnICkgOiAnICcgKyB0aGlzLnByb3BzLmNsYXNzTmFtZSkgOiAnJyksXG5cdFx0XHRcdGNoaWxkcmVuID0gW11cblx0XHRcdDtcblxuXHRcdFx0aWYgKCB0aGlzLnByb3BzLmlucHV0ICl7XG5cdFx0XHRcdGNoaWxkcmVuID0gWyBET00uaW5wdXQoIGFzc2lnbih7XG5cdFx0XHRcdFx0a2V5OiAnaScsXG5cdFx0XHRcdFx0cmVmOiB0aGlzLnJlZklucHV0LFxuXHRcdFx0XHRcdHR5cGU6J3RleHQnLFxuXHRcdFx0XHRcdGNsYXNzTmFtZTogJ2Zvcm0tY29udHJvbCcsXG5cdFx0XHRcdFx0b25Gb2N1czogdGhpcy5vcGVuQ2FsZW5kYXIsXG5cdFx0XHRcdFx0b25DaGFuZ2U6IHRoaXMub25JbnB1dENoYW5nZSxcblx0XHRcdFx0XHRvbktleURvd246IHRoaXMub25JbnB1dEtleSxcblx0XHRcdFx0XHR2YWx1ZTogdGhpcy5zdGF0ZS5pbnB1dFZhbHVlXG5cdFx0XHRcdH0sIHRoaXMucHJvcHMuaW5wdXRQcm9wcyApKV07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGFzc05hbWUgKz0gJyByZHRTdGF0aWMnO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHRoaXMuc3RhdGUub3BlbiApXG5cdFx0XHRcdGNsYXNzTmFtZSArPSAnIHJkdE9wZW4nO1xuXG5cdFx0XHRyZXR1cm4gRE9NLmRpdih7Y2xhc3NOYW1lOiBjbGFzc05hbWV9LCBjaGlsZHJlbi5jb25jYXQoXG5cdFx0XHRcdERPTS5kaXYoXG5cdFx0XHRcdFx0eyBrZXk6ICdkdCcsIGNsYXNzTmFtZTogJ3JkdFBpY2tlcicsIG9uS2V5RG93bjogdGhpcy5vblBpY2tlcktleSB9LFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoIENvbXBvbmVudCwgdGhpcy5nZXRDb21wb25lbnRQcm9wcygpKVxuXHRcdFx0XHQpXG5cdFx0XHQpKTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIE1ha2UgbW9tZW50IGFjY2Vzc2libGUgdGhyb3VnaCB0aGUgRGF0ZXRpbWUgY2xhc3Ncblx0RGF0ZXRpbWUubW9tZW50ID0gbW9tZW50O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gRGF0ZXRpbWU7XG5cblxuLyoqKi8gfSxcbi8qIDEgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5cdGZ1bmN0aW9uIFRvT2JqZWN0KHZhbCkge1xuXHRcdGlmICh2YWwgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gT2JqZWN0KHZhbCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvd25FbnVtZXJhYmxlS2V5cyhvYmopIHtcblx0XHR2YXIga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaik7XG5cblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0a2V5cyA9IGtleXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGtleXMuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBwcm9wSXNFbnVtZXJhYmxlLmNhbGwob2JqLCBrZXkpO1xuXHRcdH0pO1xuXHR9XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHRcdHZhciBmcm9tO1xuXHRcdHZhciBrZXlzO1xuXHRcdHZhciB0byA9IFRvT2JqZWN0KHRhcmdldCk7XG5cblx0XHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdFx0ZnJvbSA9IGFyZ3VtZW50c1tzXTtcblx0XHRcdGtleXMgPSBvd25FbnVtZXJhYmxlS2V5cyhPYmplY3QoZnJvbSkpO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dG9ba2V5c1tpXV0gPSBmcm9tW2tleXNbaV1dO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0bztcblx0fTtcblxuXG4vKioqLyB9LFxuLyogMiAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzJfXztcblxuLyoqKi8gfSxcbi8qIDMgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgUmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpLFxuXHRcdG1vbWVudCA9IF9fd2VicGFja19yZXF1aXJlX18oNCksXG5cdFx0SGVhZGVyQ29udHJvbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpLFxuXHRcdHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KVxuXHQ7XG5cblx0dmFyIERPTSA9IFJlYWN0LkRPTTtcblx0dmFyIERhdGVUaW1lUGlja2VyRGF5cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0XHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGZvb3RlciA9IHRoaXMucmVuZGVyRm9vdGVyKCksXG5cdFx0XHRcdGRhdGUgPSB0aGlzLnByb3BzLnZpZXdEYXRlLFxuXHRcdFx0XHRsb2NhbGUgPSBkYXRlLmxvY2FsZURhdGEoKSxcblx0XHRcdFx0dGFibGVDaGlsZHJlblxuXHRcdFx0O1xuXG5cdFx0XHR0YWJsZUNoaWxkcmVuID0gW1xuXHRcdFx0XHRET00udGhlYWQoeyBrZXk6ICd0aCd9LCBbXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCggSGVhZGVyQ29udHJvbHMsIHtcblx0XHRcdFx0XHRcdGtleTogJ2N0cmwnLFxuXHRcdFx0XHRcdFx0b25QcmV2Q2xpY2s6IHRoaXMucHJvcHMuc3VidHJhY3RUaW1lKDEsICdtb250aHMnKSxcblx0XHRcdFx0XHRcdG9uTmV4dENsaWNrOiB0aGlzLnByb3BzLmFkZFRpbWUoMSwgJ21vbnRocycpLFxuXHRcdFx0XHRcdFx0b25Td2l0Y2hDbGljazogdGhpcy5wcm9wcy5zaG93VmlldygnbW9udGhzJyksXG5cdFx0XHRcdFx0XHRzd2l0Y2hDb2xzcGFuOiA1LFxuXHRcdFx0XHRcdFx0c3dpdGNoVmFsdWU6IHRoaXMucHJvcHMudmlld0RhdGUubW9udGgoKSxcblx0XHRcdFx0XHRcdHN3aXRjaExhYmVsOiBsb2NhbGUubW9udGhzKCBkYXRlICkgKyAnICcgKyBkYXRlLnllYXIoKVxuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdERPTS50cih7IGtleTogJ2QnfSwgdGhpcy5nZXREYXlzT2ZXZWVrKCBsb2NhbGUgKS5tYXAoIGZ1bmN0aW9uKCBkYXksIGluZGV4ICl7IHJldHVybiBET00udGgoeyBrZXk6IGRheSArIGluZGV4LCBjbGFzc05hbWU6ICdkb3cnfSwgZGF5ICk7IH0pIClcblx0XHRcdFx0XSksXG5cdFx0XHRcdERPTS50Ym9keSh7a2V5OiAndGInfSwgdGhpcy5yZW5kZXJEYXlzKCkpXG5cdFx0XHRdO1xuXG5cdFx0XHRpZiAoIGZvb3RlciApXG5cdFx0XHRcdHRhYmxlQ2hpbGRyZW4ucHVzaCggZm9vdGVyICk7XG5cblx0XHRcdHJldHVybiBET00uZGl2KHsgY2xhc3NOYW1lOiAncmR0RGF5cycgfSxcblx0XHRcdFx0RE9NLnRhYmxlKHt9LCB0YWJsZUNoaWxkcmVuIClcblx0XHRcdCk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdldCBhIGxpc3Qgb2YgdGhlIGRheXMgb2YgdGhlIHdlZWtcblx0XHQgKiBkZXBlbmRpbmcgb24gdGhlIGN1cnJlbnQgbG9jYWxlXG5cdFx0ICogQHJldHVybiB7YXJyYXl9IEEgbGlzdCB3aXRoIHRoZSBzaG9ydG5hbWUgb2YgdGhlIGRheXNcblx0XHQgKi9cblx0XHRnZXREYXlzT2ZXZWVrOiBmdW5jdGlvbiggbG9jYWxlICl7XG5cdFx0XHR2YXIgZGF5cyA9IGxvY2FsZS5fd2Vla2RheXNNaW4sXG5cdFx0XHRcdGZpcnN0ID0gdGhpcy5maXJzdERheU9mV2VlaygpLFxuXHRcdFx0XHRkb3cgPSBbXSxcblx0XHRcdFx0aSA9IDBcblx0XHRcdDtcblxuXHRcdFx0ZGF5cy5mb3JFYWNoKCBmdW5jdGlvbiggZGF5ICl7XG5cdFx0XHRcdC8vIFRPRE86IE1ha2UgdGhlIGRheSBoZWFkZXIgZm9ybWF0IGZsZXhpYmxlLiBUaGlzIHJldHVybnMgdGhlIGRheSdzIGluaXRpYWwuXG5cdFx0XHRcdGRvd1sgKDcgKyAoaSsrKSAtIGZpcnN0KSAlIDcgXSA9IGRheS5zdWJzdHJpbmcoMCwgMSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGRvdztcblx0XHR9LFxuXG5cdFx0Zmlyc3REYXlPZldlZWs6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhpcy5wcm9wcy5zdGFydGluZ0RheSA9PSBudWxsXG5cdFx0XHRcdD8gdGhpcy5wcm9wcy52aWV3RGF0ZS5sb2NhbGVEYXRhKCkuZmlyc3REYXlPZldlZWsoKVxuXHRcdFx0XHQ6IHRoaXMucHJvcHMuc3RhcnRpbmdEYXk7XG5cdFx0fSxcblxuXHRcdHNldFRvTGFzdFdlZWtJbk1vbnRoOiBmdW5jdGlvbihkYXRlKXtcblx0XHRcdHZhciBmaXJzdERheU9mV2VlayA9IHRoaXMuZmlyc3REYXlPZldlZWsoKSxcblx0XHRcdFx0bGFzdERheSA9IGRhdGUuZW5kT2YoJ21vbnRoJyksXG5cdFx0XHRcdHN1YlxuXHRcdFx0O1xuXHRcdFx0aWYgKGxhc3REYXkuZGF5KCkgPj0gZmlyc3REYXlPZldlZWspXG5cdFx0XHRcdHN1YiA9IGxhc3REYXkuZGF5KCkgLSBmaXJzdERheU9mV2Vlaztcblx0XHRcdGVsc2Vcblx0XHRcdFx0c3ViID0gbGFzdERheS5kYXkoKSArICg3IC0gZmlyc3REYXlPZldlZWspO1xuXHRcdFx0bGFzdERheS5zdWJ0cmFjdChzdWIsICdkYXlzJyk7XG5cdFx0fSxcblxuXHRcdHJlbmRlckRheXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGRhdGUgPSB0aGlzLnByb3BzLnZpZXdEYXRlLFxuXHRcdFx0XHRzZWxlY3RlZCA9IHRoaXMucHJvcHMuc2VsZWN0ZWREYXRlICYmIHRoaXMucHJvcHMuc2VsZWN0ZWREYXRlLmNsb25lKCksXG5cdFx0XHRcdHByZXZNb250aCA9IGRhdGUuY2xvbmUoKS5zdWJ0cmFjdCggMSwgJ21vbnRocycgKSxcblx0XHRcdFx0Y3VycmVudFllYXIgPSBkYXRlLnllYXIoKSxcblx0XHRcdFx0Y3VycmVudE1vbnRoID0gZGF0ZS5tb250aCgpLFxuXHRcdFx0XHR3ZWVrcyA9IFtdLFxuXHRcdFx0XHRkYXlzID0gW10sXG5cdFx0XHRcdHJlbmRlcmVyID0gdGhpcy5wcm9wcy5yZW5kZXJEYXkgfHwgdGhpcy5yZW5kZXJEYXksXG5cdFx0XHRcdGlzVmFsaWQgPSB0aGlzLnByb3BzLmlzVmFsaWREYXRlIHx8IHRoaXMuaXNWYWxpZERhdGUsXG5cdFx0XHRcdGNsYXNzZXMsIGRpc2FibGVkLCBkYXlQcm9wcywgY3VycmVudERhdGVcblx0XHRcdDtcblxuXHRcdFx0dGhpcy5zZXRUb0xhc3RXZWVrSW5Nb250aChwcmV2TW9udGgpO1xuXHRcdFx0dmFyIGxhc3REYXkgPSBwcmV2TW9udGguY2xvbmUoKS5hZGQoNDIsICdkJyk7XG5cblx0XHRcdHdoaWxlICggcHJldk1vbnRoLmlzQmVmb3JlKCBsYXN0RGF5ICkgKXtcblx0XHRcdFx0dmFyIGFjdGlvbiA9IHsgdHlwZTogJ2RheScsIGRhdGU6IHByZXZNb250aC5kYXRlKCkgfTtcblx0XHRcdFx0ZGF5UHJvcHMgPSB7IGtleTogcHJldk1vbnRoLmZvcm1hdCgnTV9EJykgfTtcblx0XHRcdFx0Y2xhc3NlcyA9ICdyZHREYXknO1xuXHRcdFx0XHRjdXJyZW50RGF0ZSA9IHByZXZNb250aC5jbG9uZSgpO1xuXG5cdFx0XHRcdGlmICggKCBwcmV2TW9udGgueWVhcigpID09PSBjdXJyZW50WWVhciAmJiBwcmV2TW9udGgubW9udGgoKSA8IGN1cnJlbnRNb250aCApIHx8ICggcHJldk1vbnRoLnllYXIoKSA8IGN1cnJlbnRZZWFyICkgKSB7XG5cdFx0XHRcdFx0Y2xhc3NlcyArPSAnIHJkdE9sZCc7XG5cdFx0XHRcdFx0YWN0aW9uLm9sZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoICggcHJldk1vbnRoLnllYXIoKSA9PT0gY3VycmVudFllYXIgJiYgcHJldk1vbnRoLm1vbnRoKCkgPiBjdXJyZW50TW9udGggKSB8fCAoIHByZXZNb250aC55ZWFyKCkgPiBjdXJyZW50WWVhciApICkge1xuXHRcdFx0XHRcdGNsYXNzZXMgKz0gJyByZHROZXcnO1xuXHRcdFx0XHRcdGFjdGlvbi5uZXcgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBwcmV2TW9udGguaXNTYW1lKGRhdGUsICdkYXknKSApIHtcblx0XHRcdFx0XHRjbGFzc2VzICs9ICcgcmR0QWN0aXZlJztcblx0XHRcdFx0XHRpZiAodGhpcy5wcm9wcy5vcGVuKSB7XG5cdFx0XHRcdFx0XHRkYXlQcm9wcy5yZWYgPSB1dGlscy5mb2N1c0lucHV0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggc2VsZWN0ZWQgJiYgcHJldk1vbnRoLmlzU2FtZShzZWxlY3RlZCwgJ2RheScpIClcblx0XHRcdFx0XHRjbGFzc2VzICs9ICcgcmR0U2VsZWN0ZWQnO1xuXG5cdFx0XHRcdGlmIChwcmV2TW9udGguaXNTYW1lKG1vbWVudCgpLCAnZGF5JykgKVxuXHRcdFx0XHRcdGNsYXNzZXMgKz0gJyByZHRUb2RheSc7XG5cblx0XHRcdFx0ZGlzYWJsZWQgPSAhaXNWYWxpZCggY3VycmVudERhdGUsIHNlbGVjdGVkICk7XG5cdFx0XHRcdGlmICggZGlzYWJsZWQgKVxuXHRcdFx0XHRcdGNsYXNzZXMgKz0gJyByZHREaXNhYmxlZCc7XG5cblx0XHRcdFx0ZGF5UHJvcHMuY2xhc3NOYW1lID0gY2xhc3NlcztcblxuXHRcdFx0XHQvLyBUT0RPOiBCdXR0b24gY29tcG9uZW50IHdpdGggYWN0aW9uIGFzIHByb3AgaW5zdGVhZCBvZiBib3VuZCBjbGljayBoYW5kbGVyP1xuXHRcdFx0XHRpZiAoICFkaXNhYmxlZCApXG5cdFx0XHRcdFx0ZGF5UHJvcHMub25DbGljayA9IHRoaXMudXBkYXRlU2VsZWN0ZWREYXRlLmJpbmQodGhpcywgYWN0aW9uKTtcblxuXHRcdFx0XHRkYXlzLnB1c2goIHJlbmRlcmVyKCBkYXlQcm9wcywgY3VycmVudERhdGUsIHNlbGVjdGVkICkgKTtcblxuXHRcdFx0XHRpZiAoIGRheXMubGVuZ3RoID09PSA3ICl7XG5cdFx0XHRcdFx0d2Vla3MucHVzaCggRE9NLnRyKCB7a2V5OiBwcmV2TW9udGguZm9ybWF0KCdNX0QnKX0sIGRheXMgKSApO1xuXHRcdFx0XHRcdGRheXMgPSBbXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHByZXZNb250aC5hZGQoIDEsICdkJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gd2Vla3M7XG5cdFx0fSxcblxuXHRcdHVwZGF0ZVNlbGVjdGVkRGF0ZTogZnVuY3Rpb24oIGFjdGlvbiwgZXZlbnQgKSB7XG5cdFx0XHR0aGlzLnByb3BzLnVwZGF0ZVNlbGVjdGVkRGF0ZShldmVudCwgYWN0aW9uLCB0cnVlKTtcblx0XHR9LFxuXG5cdFx0cmVuZGVyRGF5OiBmdW5jdGlvbiggcHJvcHMsIGN1cnJlbnREYXRlICl7XG5cdFx0XHR2YXIgYnV0dG9uUHJvcHMgPSB7IG9uQ2xpY2s6IHByb3BzLm9uQ2xpY2ssIHJlZjogcHJvcHMucmVmIH07XG5cdFx0XHRyZXR1cm4gRE9NLnRkKHsga2V5OiBwcm9wcy5rZXksIGNsYXNzTmFtZTogcHJvcHMuY2xhc3NOYW1lIH0sIERPTS5idXR0b24oIGJ1dHRvblByb3BzLCBjdXJyZW50RGF0ZS5mb3JtYXQoJ0REJykgKSk7XG5cdFx0fSxcblxuXHRcdHJlbmRlckZvb3RlcjogZnVuY3Rpb24oKXtcblx0XHRcdGlmICggIXRoaXMucHJvcHMudGltZUZvcm1hdCApXG5cdFx0XHRcdHJldHVybiAnJztcblxuXHRcdFx0dmFyIGRhdGUgPSB0aGlzLnByb3BzLnNlbGVjdGVkRGF0ZSB8fCB0aGlzLnByb3BzLnZpZXdEYXRlO1xuXG5cdFx0XHRyZXR1cm4gRE9NLnRmb290KHsga2V5OiAndGYnfSxcblx0XHRcdFx0RE9NLnRyKHt9LFxuXHRcdFx0XHRcdERPTS50ZCh7IGNvbFNwYW46IDcgfSwgRE9NLmJ1dHRvbih7IG9uQ2xpY2s6IHRoaXMucHJvcHMuc2hvd1ZpZXcoJ3RpbWUnKSwgY2xhc3NOYW1lOiAncmR0VGltZVRvZ2dsZSd9LCBkYXRlLmZvcm1hdCggdGhpcy5wcm9wcy50aW1lRm9ybWF0ICkpKVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH0sXG5cblx0XHRoYW5kbGVLZXlEb3duOiBmdW5jdGlvbigga2V5ICl7XG5cdFx0XHQvLyBUT0RPOiBDdXJyeS9tYWtlIG5pY2VyXG5cdFx0XHRzd2l0Y2ggKGtleSkge1xuXHRcdFx0XHRjYXNlICdzZWxlY3QnOlxuXHRcdFx0XHRcdHRoaXMudXBkYXRlU2VsZWN0ZWREYXRlKHsgdHlwZTogJ2RheScsIGRhdGU6IHRoaXMucHJvcHMudmlld0RhdGUuZGF0ZSgpIH0pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICduZXh0Vmlldyc6XG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5zaG93VmlldygnbW9udGhzJykoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnbGVmdCc6XG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5zdWJ0cmFjdFRpbWUoMSwgJ2RheXMnKSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICd1cCc6XG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5zdWJ0cmFjdFRpbWUoMSwgJ3dlZWtzJykoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAncmlnaHQnOlxuXHRcdFx0XHRcdHRoaXMucHJvcHMuYWRkVGltZSgxLCAnZGF5cycpKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2Rvd24nOlxuXHRcdFx0XHRcdHRoaXMucHJvcHMuYWRkVGltZSgxLCAnd2Vla3MnKSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdwYWdldXAnOlxuXHRcdFx0XHRcdHRoaXMucHJvcHMuc3VidHJhY3RUaW1lKDEsICdtb250aHMnKSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdwYWdlZG93bic6XG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5hZGRUaW1lKDEsICdtb250aHMnKSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdob21lJzpcblx0XHRcdFx0XHR0aGlzLnByb3BzLnN0YXJ0T2YoJ21vbnRoJykoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnZW5kJzpcblx0XHRcdFx0XHR0aGlzLnByb3BzLmVuZE9mKCdtb250aCcpKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGlzVmFsaWREYXRlOiBmdW5jdGlvbigpeyByZXR1cm4gMTsgfVxuXHR9KTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IERhdGVUaW1lUGlja2VyRGF5cztcblxuXG4vKioqLyB9LFxuLyogNCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzRfXztcblxuLyoqKi8gfSxcbi8qIDUgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgUmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpO1xuXG5cdHZhciBET00gPSBSZWFjdC5ET007XG5cdHZhciBIZWFkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0XHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIERPTS50cih7IGtleTogJ2gnfSwgW1xuXHRcdFx0XHRET00udGgoeyBrZXk6ICdwcmV2JyB9LCBET00uYnV0dG9uKHsgY2xhc3NOYW1lOiAncmR0UHJldicgfSwgRE9NLnNwYW4oe29uQ2xpY2s6IHRoaXMucHJvcHMub25QcmV2Q2xpY2t9KSkpLFxuXHRcdFx0XHRET00udGgoeyBrZXk6ICdzd2l0Y2gnLCBjb2xTcGFuOiB0aGlzLnByb3BzLnN3aXRjaENvbHNwYW4gfSwgRE9NLmJ1dHRvbih7IGNsYXNzTmFtZTogJ3JkdFN3aXRjaCcsIG9uQ2xpY2s6IHRoaXMucHJvcHMub25Td2l0Y2hDbGljaywgJ2RhdGEtdmFsdWUnOiB0aGlzLnByb3BzLnN3aXRjaFZhbHVlIH0sIHRoaXMucHJvcHMuc3dpdGNoTGFiZWwgKSksXG5cdFx0XHRcdERPTS50aCh7IGtleTogJ25leHQnIH0sIERPTS5idXR0b24oeyBjbGFzc05hbWU6ICdyZHROZXh0JyB9LCBET00uc3Bhbih7b25DbGljazogdGhpcy5wcm9wcy5vbk5leHRDbGlja30pKSlcblx0XHRcdF0pO1xuXHRcdH1cblx0fSk7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBIZWFkZXI7XG5cblxuLyoqKi8gfSxcbi8qIDYgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0ge1xuXHRcdGZvY3VzSW5wdXQ6IGZ1bmN0aW9uKCBpbnB1dCApIHtcblx0XHRcdGlmIChpbnB1dCAhPSBudWxsKSBpbnB1dC5mb2N1cygpO1xuXHRcdH1cblx0fTtcblxuXG4vKioqLyB9LFxuLyogNyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBSZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMiksXG5cdFx0SGVhZGVyQ29udHJvbHMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpLFxuXHRcdHV0aWxzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KVxuXHQ7XG5cblx0dmFyIERPTSA9IFJlYWN0LkRPTTtcblx0dmFyIERhdGVUaW1lUGlja2VyTW9udGhzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRcdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gRE9NLmRpdih7IGNsYXNzTmFtZTogJ3JkdE1vbnRocycgfSwgW1xuXHRcdFx0XHRET00udGFibGUoeyBrZXk6ICdhJ30sIERPTS50aGVhZCh7fSxcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCBIZWFkZXJDb250cm9scywge1xuXHRcdFx0XHRcdFx0a2V5OiAnY3RybCcsXG5cdFx0XHRcdFx0XHRvblByZXZDbGljazogdGhpcy5wcm9wcy5zdWJ0cmFjdFRpbWUoMSwgJ3llYXJzJyksXG5cdFx0XHRcdFx0XHRvbk5leHRDbGljazogdGhpcy5wcm9wcy5hZGRUaW1lKDEsICd5ZWFycycpLFxuXHRcdFx0XHRcdFx0b25Td2l0Y2hDbGljazogdGhpcy5wcm9wcy5zaG93VmlldygneWVhcnMnKSxcblx0XHRcdFx0XHRcdHN3aXRjaENvbHNwYW46IDIsXG5cdFx0XHRcdFx0XHRzd2l0Y2hWYWx1ZTogdGhpcy5wcm9wcy52aWV3RGF0ZS55ZWFyKCksXG5cdFx0XHRcdFx0XHRzd2l0Y2hMYWJlbDogdGhpcy5wcm9wcy52aWV3RGF0ZS55ZWFyKClcblx0XHRcdFx0XHR9KSkpLFxuXHRcdFx0XHRET00udGFibGUoeyBrZXk6ICdtb250aHMnfSwgRE9NLnRib2R5KHsga2V5OiAnYid9LCB0aGlzLnJlbmRlck1vbnRocygpKSlcblx0XHRcdF0pO1xuXHRcdH0sXG5cblx0XHRyZW5kZXJNb250aHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGRhdGUgPSB0aGlzLnByb3BzLnNlbGVjdGVkRGF0ZSxcblx0XHRcdFx0bW9udGggPSB0aGlzLnByb3BzLnZpZXdEYXRlLm1vbnRoKCksXG5cdFx0XHRcdHllYXIgPSB0aGlzLnByb3BzLnZpZXdEYXRlLnllYXIoKSxcblx0XHRcdFx0cm93cyA9IFtdLFxuXHRcdFx0XHRpID0gMCxcblx0XHRcdFx0bW9udGhzID0gW10sXG5cdFx0XHRcdHJlbmRlcmVyID0gdGhpcy5wcm9wcy5yZW5kZXJNb250aCB8fCB0aGlzLnJlbmRlck1vbnRoLFxuXHRcdFx0XHRjbGFzc2VzLCBwcm9wc1xuXHRcdFx0O1xuXG5cdFx0XHR3aGlsZSAoaSA8IDEyKSB7XG5cdFx0XHRcdHZhciBhY3Rpb24gPSB7IHR5cGU6ICdtb250aCcsIG1vbnRoOiBpIH07XG5cdFx0XHRcdHByb3BzID0ge1xuXHRcdFx0XHRcdGtleTogaSxcblx0XHRcdFx0XHRvbkNsaWNrOiB0aGlzLnByb3BzLnVwZGF0ZU9uID09PSAnbW9udGhzJz8gdGhpcy51cGRhdGVTZWxlY3RlZE1vbnRoLmJpbmQodGhpcywgYWN0aW9uKSA6IHRoaXMucHJvcHMuc2V0RGF0ZSgnbW9udGgnLCBpKVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGNsYXNzZXMgPSAncmR0TW9udGgnO1xuXHRcdFx0XHRpZiAoIGkgPT09IG1vbnRoICkge1xuXHRcdFx0XHRcdGNsYXNzZXMgKz0gJyByZHRBY3RpdmUnO1xuXHRcdFx0XHRcdGlmICh0aGlzLnByb3BzLm9wZW4pIHtcblx0XHRcdFx0XHRcdHByb3BzLnJlZiA9IHV0aWxzLmZvY3VzSW5wdXQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBkYXRlICYmIGkgPT09IGRhdGUubW9udGgoKSAmJiB5ZWFyID09PSBkYXRlLnllYXIoKSApXG5cdFx0XHRcdFx0Y2xhc3NlcyArPSAnIHJkdFNlbGVjdGVkJztcblxuXHRcdFx0XHRwcm9wcy5jbGFzc05hbWUgPSBjbGFzc2VzO1xuXG5cdFx0XHRcdG1vbnRocy5wdXNoKCByZW5kZXJlciggcHJvcHMsIGksIHllYXIsIGRhdGUgJiYgZGF0ZS5jbG9uZSgpICkpO1xuXG5cdFx0XHRcdGlmICggbW9udGhzLmxlbmd0aCA9PT0gdGhpcy5wcm9wcy5tb250aENvbHVtbnMgKXtcblx0XHRcdFx0XHRyb3dzLnB1c2goIERPTS50cih7IGtleTogbW9udGggKyAnXycgKyByb3dzLmxlbmd0aCB9LCBtb250aHMpICk7XG5cdFx0XHRcdFx0bW9udGhzID0gW107XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpKys7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByb3dzO1xuXHRcdH0sXG5cblx0XHR1cGRhdGVTZWxlY3RlZE1vbnRoOiBmdW5jdGlvbiggYWN0aW9uLCBldmVudCApIHtcblx0XHRcdHRoaXMucHJvcHMudXBkYXRlU2VsZWN0ZWREYXRlKGV2ZW50LCBhY3Rpb24sIHRydWUpO1xuXHRcdH0sXG5cblx0XHRyZW5kZXJNb250aDogZnVuY3Rpb24oIHByb3BzLCBtb250aCApIHtcblx0XHRcdHZhciBtb250aHMgPSB0aGlzLnByb3BzLnZpZXdEYXRlLmxvY2FsZURhdGEoKS5fbW9udGhzLFxuXHRcdFx0XHRidXR0b25Qcm9wcyA9IHsgb25DbGljazogcHJvcHMub25DbGljaywgcmVmOiBwcm9wcy5yZWYgfVxuXHRcdFx0O1xuXHRcdFx0cmV0dXJuIERPTS50ZCh7IGtleTogcHJvcHMua2V5LCBjbGFzc05hbWU6IHByb3BzLmNsYXNzTmFtZSB9LCBET00uYnV0dG9uKCBidXR0b25Qcm9wcywgbW9udGhzLnN0YW5kYWxvbmVcblx0XHRcdFx0PyBjYXBpdGFsaXplKCBtb250aHMuc3RhbmRhbG9uZVsgbW9udGggXSApXG5cdFx0XHRcdDogbW9udGhzWyBtb250aCBdXG5cdFx0XHQpKTtcblx0XHR9LFxuXG5cdFx0aGFuZGxlS2V5RG93bjogZnVuY3Rpb24oIGtleSApIHtcblx0XHRcdC8vIFRPRE86IEN1cnJ5L21ha2UgbmljZXJcblx0XHRcdHN3aXRjaCAoa2V5KSB7XG5cdFx0XHRcdGNhc2UgJ3NlbGVjdCc6XG5cdFx0XHRcdFx0aWYgKHRoaXMucHJvcHMudXBkYXRlT24gPT09ICdtb250aHMnKVxuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVTZWxlY3RlZE1vbnRoKHsgdHlwZTogJ21vbnRoJywgbW9udGg6IHRoaXMucHJvcHMudmlld0RhdGUubW9udGgoKSB9KTtcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR0aGlzLnByb3BzLnNldERhdGUoJ21vbnRoJywgdGhpcy5wcm9wcy52aWV3RGF0ZS5tb250aCgpKSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICduZXh0Vmlldyc6XG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5zaG93VmlldygneWVhcnMnKSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdwcmV2Vmlldyc6XG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5zaG93VmlldygnZGF5cycpKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2xlZnQnOlxuXHRcdFx0XHRcdHRoaXMucHJvcHMuc3VidHJhY3RUaW1lKDEsICdtb250aHMnKSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICd1cCc6XG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5zdWJ0cmFjdFRpbWUodGhpcy5wcm9wcy5tb250aENvbHVtbnMsICdtb250aHMnKSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdyaWdodCc6XG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5hZGRUaW1lKDEsICdtb250aHMnKSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdkb3duJzpcblx0XHRcdFx0XHR0aGlzLnByb3BzLmFkZFRpbWUodGhpcy5wcm9wcy5tb250aENvbHVtbnMsICdtb250aHMnKSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdwYWdldXAnOlxuXHRcdFx0XHRcdHRoaXMucHJvcHMuc3VidHJhY3RUaW1lKDEsICd5ZWFycycpKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3BhZ2Vkb3duJzpcblx0XHRcdFx0XHR0aGlzLnByb3BzLmFkZFRpbWUoMSwgJ3llYXJzJykoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnaG9tZSc6XG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5zdGFydE9mKCd5ZWFyJykoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnZW5kJzpcblx0XHRcdFx0XHR0aGlzLnByb3BzLmVuZE9mKCd5ZWFyJykoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyKSB7XG5cdFx0cmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcblx0fVxuXG5cdG1vZHVsZS5leHBvcnRzID0gRGF0ZVRpbWVQaWNrZXJNb250aHM7XG5cblxuLyoqKi8gfSxcbi8qIDggKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgUmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpLFxuXHRcdEhlYWRlckNvbnRyb2xzID0gX193ZWJwYWNrX3JlcXVpcmVfXyg1KSxcblx0XHR1dGlscyA9IF9fd2VicGFja19yZXF1aXJlX18oNilcblx0O1xuXG5cdHZhciBET00gPSBSZWFjdC5ET007XG5cdHZhciBEYXRlVGltZVBpY2tlclllYXJzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRcdGdldFN0YXJ0aW5nWWVhcjogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcmFuZ2UgPSB0aGlzLmdldFJhbmdlKCk7XG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQoKHRoaXMucHJvcHMudmlld0RhdGUueWVhcigpIC0gMSkgLyByYW5nZSwgMTApICogcmFuZ2UgKyAxO1xuXHRcdH0sXG5cblx0XHRnZXRSYW5nZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wcm9wcy55ZWFyQ29sdW1ucyAqIHRoaXMucHJvcHMueWVhclJvd3M7XG5cdFx0fSxcblxuXHRcdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgeWVhciA9IHRoaXMuZ2V0U3RhcnRpbmdZZWFyKCk7XG5cblx0XHRcdHJldHVybiBET00uZGl2KHsgY2xhc3NOYW1lOiAncmR0WWVhcnMnIH0sIFtcblx0XHRcdFx0RE9NLnRhYmxlKHsga2V5OiAnYSd9LCBET00udGhlYWQoe30sXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCggSGVhZGVyQ29udHJvbHMsIHtcblx0XHRcdFx0XHRcdGtleTogJ2N0cmwnLFxuXHRcdFx0XHRcdFx0b25QcmV2Q2xpY2s6IHRoaXMucHJvcHMuc3VidHJhY3RUaW1lKHRoaXMuZ2V0UmFuZ2UoKSwgJ3llYXJzJyksXG5cdFx0XHRcdFx0XHRvbk5leHRDbGljazogdGhpcy5wcm9wcy5hZGRUaW1lKHRoaXMuZ2V0UmFuZ2UoKSwgJ3llYXJzJyksXG5cdFx0XHRcdFx0XHRvblN3aXRjaENsaWNrOiB0aGlzLnByb3BzLnNob3dWaWV3KCd5ZWFycycpLFxuXHRcdFx0XHRcdFx0c3dpdGNoQ29sc3BhbjogMixcblx0XHRcdFx0XHRcdHN3aXRjaExhYmVsOiB5ZWFyICsgJyAtICcgKyAoeWVhciArIHRoaXMuZ2V0UmFuZ2UoKSAtIDEpXG5cdFx0XHRcdFx0fSkpKSxcblx0XHRcdFx0RE9NLnRhYmxlKHsga2V5OiAneWVhcnMnfSwgRE9NLnRib2R5KHt9LCB0aGlzLnJlbmRlclllYXJzKCB5ZWFyICkpKVxuXHRcdFx0XSk7XG5cdFx0fSxcblxuXHRcdHJlbmRlclllYXJzOiBmdW5jdGlvbiggeWVhciApIHtcblx0XHRcdHZhciB5ZWFycyA9IFtdLFxuXHRcdFx0XHRpID0gLTEsXG5cdFx0XHRcdHJvd3MgPSBbXSxcblx0XHRcdFx0cmVuZGVyZXIgPSB0aGlzLnByb3BzLnJlbmRlclllYXIgfHwgdGhpcy5yZW5kZXJZZWFyLFxuXHRcdFx0XHRzZWxlY3RlZERhdGUgPSB0aGlzLnByb3BzLnNlbGVjdGVkRGF0ZSxcblx0XHRcdFx0dmlld1llYXIgPSB0aGlzLnByb3BzLnZpZXdEYXRlLnllYXIoKSxcblx0XHRcdFx0Y2xhc3NlcywgcHJvcHNcblx0XHRcdDtcblxuXHRcdFx0d2hpbGUgKGkgPCB0aGlzLmdldFJhbmdlKCkgLSAxKSB7XG5cdFx0XHRcdHZhciBhY3Rpb24gPSB7IHR5cGU6ICd5ZWFyJywgeWVhcjogeWVhciB9O1xuXHRcdFx0XHRwcm9wcyA9IHtcblx0XHRcdFx0XHRrZXk6IHllYXIsXG5cdFx0XHRcdFx0b25DbGljazogdGhpcy5wcm9wcy51cGRhdGVPbiA9PT0gJ3llYXJzJyA/IHRoaXMudXBkYXRlU2VsZWN0ZWRZZWFyLmJpbmQodGhpcywgYWN0aW9uKSA6IHRoaXMucHJvcHMuc2V0RGF0ZSgneWVhcicsIHllYXIpXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Y2xhc3NlcyA9ICdyZHRZZWFyJztcblx0XHRcdFx0aWYgKCB2aWV3WWVhciA9PT0geWVhciApIHtcblx0XHRcdFx0XHRjbGFzc2VzICs9ICcgcmR0QWN0aXZlJztcblx0XHRcdFx0XHRpZiAodGhpcy5wcm9wcy5vcGVuKSB7XG5cdFx0XHRcdFx0XHRwcm9wcy5yZWYgPSB1dGlscy5mb2N1c0lucHV0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggc2VsZWN0ZWREYXRlICYmIHNlbGVjdGVkRGF0ZS55ZWFyKCkgPT09IHllYXIgKVxuXHRcdFx0XHRcdGNsYXNzZXMgKz0gJyByZHRTZWxlY3RlZCc7XG5cblx0XHRcdFx0cHJvcHMuY2xhc3NOYW1lID0gY2xhc3NlcztcblxuXHRcdFx0XHR5ZWFycy5wdXNoKCByZW5kZXJlciggcHJvcHMsIHllYXIsIHNlbGVjdGVkRGF0ZSAmJiBzZWxlY3RlZERhdGUuY2xvbmUoKSApKTtcblxuXHRcdFx0XHRpZiAoIHllYXJzLmxlbmd0aCA9PT0gdGhpcy5wcm9wcy55ZWFyQ29sdW1ucyApe1xuXHRcdFx0XHRcdHJvd3MucHVzaCggRE9NLnRyKHsga2V5OiBpIH0sIHllYXJzICkgKTtcblx0XHRcdFx0XHR5ZWFycyA9IFtdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0eWVhcisrO1xuXHRcdFx0XHRpKys7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByb3dzO1xuXHRcdH0sXG5cblx0XHR1cGRhdGVTZWxlY3RlZFllYXI6IGZ1bmN0aW9uKCBhY3Rpb24sIGV2ZW50ICkge1xuXHRcdFx0dGhpcy5wcm9wcy51cGRhdGVTZWxlY3RlZERhdGUoZXZlbnQsIGFjdGlvbiwgdHJ1ZSk7XG5cdFx0fSxcblxuXHRcdHJlbmRlclllYXI6IGZ1bmN0aW9uKCBwcm9wcywgeWVhciApe1xuXHRcdFx0dmFyIGJ1dHRvblByb3BzID0geyBvbkNsaWNrOiBwcm9wcy5vbkNsaWNrLCByZWY6IHByb3BzLnJlZiB9O1xuXHRcdFx0cmV0dXJuIERPTS50ZCh7IGtleTogcHJvcHMua2V5LCBjbGFzc05hbWU6IHByb3BzLmNsYXNzTmFtZSB9LCBET00uYnV0dG9uKCBidXR0b25Qcm9wcywgeWVhciApKTtcblx0XHR9LFxuXG5cdFx0aGFuZGxlS2V5RG93bjogZnVuY3Rpb24oIGtleSApIHtcblx0XHRcdC8vIFRPRE86IEN1cnJ5L21ha2UgbmljZXJcblx0XHRcdHN3aXRjaCAoa2V5KSB7XG5cdFx0XHRcdGNhc2UgJ3NlbGVjdCc6XG5cdFx0XHRcdFx0aWYgKHRoaXMucHJvcHMudXBkYXRlT24gPT09ICd5ZWFycycpXG5cdFx0XHRcdFx0XHR0aGlzLnVwZGF0ZVNlbGVjdGVkWWVhcih7IHR5cGU6ICd5ZWFyJywgeWVhcjogdGhpcy5wcm9wcy52aWV3RGF0ZS55ZWFyKCkgfSk7XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0dGhpcy5wcm9wcy5zZXREYXRlKCd5ZWFyJywgdGhpcy5wcm9wcy52aWV3RGF0ZS55ZWFyKCkpKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3ByZXZWaWV3Jzpcblx0XHRcdFx0XHR0aGlzLnByb3BzLnNob3dWaWV3KCdtb250aHMnKSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdsZWZ0Jzpcblx0XHRcdFx0XHR0aGlzLnByb3BzLnN1YnRyYWN0VGltZSgxLCAneWVhcnMnKSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICd1cCc6XG5cdFx0XHRcdFx0dGhpcy5wcm9wcy5zdWJ0cmFjdFRpbWUodGhpcy5wcm9wcy55ZWFyQ29sdW1ucywgJ3llYXJzJykoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAncmlnaHQnOlxuXHRcdFx0XHRcdHRoaXMucHJvcHMuYWRkVGltZSgxLCAneWVhcnMnKSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdkb3duJzpcblx0XHRcdFx0XHR0aGlzLnByb3BzLmFkZFRpbWUodGhpcy5wcm9wcy55ZWFyQ29sdW1ucywgJ3llYXJzJykoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAncGFnZXVwJzpcblx0XHRcdFx0XHR0aGlzLnByb3BzLnN1YnRyYWN0VGltZSh0aGlzLmdldFJhbmdlKCksICd5ZWFycycpKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3BhZ2Vkb3duJzpcblx0XHRcdFx0XHR0aGlzLnByb3BzLmFkZFRpbWUodGhpcy5nZXRSYW5nZSgpLCAneWVhcnMnKSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdob21lJzpcblx0XHRcdFx0XHR0aGlzLnByb3BzLnNldFllYXIodGhpcy5nZXRTdGFydGluZ1llYXIoKSkoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnZW5kJzpcblx0XHRcdFx0XHR0aGlzLnByb3BzLnNldFllYXIodGhpcy5nZXRTdGFydGluZ1llYXIoKSArIHRoaXMuZ2V0UmFuZ2UoKSAtIDEpKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IERhdGVUaW1lUGlja2VyWWVhcnM7XG5cblxuLyoqKi8gfSxcbi8qIDkgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgUmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpLFxuXHRcdGFzc2lnbiA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cblx0dmFyIERPTSA9IFJlYWN0LkRPTTtcblx0dmFyIERhdGVUaW1lUGlja2VyVGltZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0XHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhpcy5jYWxjdWxhdGVTdGF0ZSggdGhpcy5wcm9wcyApO1xuXHRcdH0sXG5cdFx0Y2FsY3VsYXRlU3RhdGU6IGZ1bmN0aW9uKCBwcm9wcyApe1xuXHRcdFx0dmFyIGRhdGUgPSBwcm9wcy5zZWxlY3RlZERhdGUgfHwgcHJvcHMudmlld0RhdGUsXG5cdFx0XHRcdGZvcm1hdCA9IHByb3BzLnRpbWVGb3JtYXQsXG5cdFx0XHRcdGNvdW50ZXJzID0gW11cblx0XHRcdDtcblxuXHRcdFx0aWYgKCBmb3JtYXQuaW5kZXhPZignSCcpICE9PSAtMSB8fCBmb3JtYXQuaW5kZXhPZignaCcpICE9PSAtMSApe1xuXHRcdFx0XHRjb3VudGVycy5wdXNoKCdob3VycycpO1xuXHRcdFx0XHRpZiAoIGZvcm1hdC5pbmRleE9mKCdtJykgIT09IC0xICl7XG5cdFx0XHRcdFx0Y291bnRlcnMucHVzaCgnbWludXRlcycpO1xuXHRcdFx0XHRcdGlmICggZm9ybWF0LmluZGV4T2YoJ3MnKSAhPT0gLTEgKXtcblx0XHRcdFx0XHRcdGNvdW50ZXJzLnB1c2goJ3NlY29uZHMnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFyIGRheXBhcnQgPSBmYWxzZTtcblx0XHRcdGlmICggdGhpcy5wcm9wcy50aW1lRm9ybWF0LmluZGV4T2YoJyBBJykgIT09IC0xICAmJiB0aGlzLnN0YXRlICE9PSBudWxsICl7XG5cdFx0XHRcdGRheXBhcnQgPSAoIHRoaXMuc3RhdGUuaG91cnMgPj0gMTIgKSA/ICdQTScgOiAnQU0nO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRob3VyczogZGF0ZS5mb3JtYXQoJ0gnKSxcblx0XHRcdFx0bWludXRlczogZGF0ZS5mb3JtYXQoJ21tJyksXG5cdFx0XHRcdHNlY29uZHM6IGRhdGUuZm9ybWF0KCdzcycpLFxuXHRcdFx0XHRtaWxsaXNlY29uZHM6IGRhdGUuZm9ybWF0KCdTU1MnKSxcblx0XHRcdFx0ZGF5cGFydDogZGF5cGFydCxcblx0XHRcdFx0Y291bnRlcnM6IGNvdW50ZXJzXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0cmVuZGVyQ291bnRlcjogZnVuY3Rpb24oIHR5cGUgKXtcblx0XHRcdGlmICh0eXBlICE9PSAnZGF5cGFydCcpIHtcblx0XHRcdFx0dmFyIHZhbHVlID0gdGhpcy5zdGF0ZVsgdHlwZSBdO1xuXHRcdFx0XHRpZiAodHlwZSA9PT0gJ2hvdXJzJyAmJiB0aGlzLnByb3BzLnRpbWVGb3JtYXQuaW5kZXhPZignIEEnKSAhPT0gLTEpIHtcblx0XHRcdFx0XHR2YWx1ZSA9ICh2YWx1ZSAtIDEpICUgMTIgKyAxO1xuXG5cdFx0XHRcdFx0aWYgKHZhbHVlID09PSAwKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IDEyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gRE9NLmRpdih7IGtleTogdHlwZSwgY2xhc3NOYW1lOiAncmR0Q291bnRlcid9LCBbXG5cdFx0XHRcdFx0RE9NLnNwYW4oeyBrZXk6J3VwJywgY2xhc3NOYW1lOiAncmR0QnRuJywgb25Nb3VzZURvd246IHRoaXMub25TdGFydENsaWNraW5nKCAnaW5jcmVhc2UnLCB0eXBlICkgfSwgJ+KWsicgKSxcblx0XHRcdFx0XHRET00uZGl2KHsga2V5OidjJywgY2xhc3NOYW1lOiAncmR0Q291bnQnIH0sIHZhbHVlICksXG5cdFx0XHRcdFx0RE9NLnNwYW4oeyBrZXk6J2RvJywgY2xhc3NOYW1lOiAncmR0QnRuJywgb25Nb3VzZURvd246IHRoaXMub25TdGFydENsaWNraW5nKCAnZGVjcmVhc2UnLCB0eXBlICkgfSwgJ+KWvCcgKVxuXHRcdFx0XHRdKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAnJztcblx0XHR9LFxuXHRcdHJlbmRlckRheVBhcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIERPTS5kaXYoeyBjbGFzc05hbWU6ICdyZHRDb3VudGVyJywga2V5OiAnZGF5UGFydCd9LCBbXG5cdFx0XHRcdERPTS5zcGFuKHsga2V5Oid1cCcsIGNsYXNzTmFtZTogJ3JkdEJ0bicsIG9uTW91c2VEb3duOiB0aGlzLm9uU3RhcnRDbGlja2luZyggJ3RvZ2dsZURheVBhcnQnLCAnaG91cnMnKSB9LCAn4payJyApLFxuXHRcdFx0XHRET00uZGl2KHsga2V5OiB0aGlzLnN0YXRlLmRheXBhcnQsIGNsYXNzTmFtZTogJ3JkdENvdW50J30sIHRoaXMuc3RhdGUuZGF5cGFydCApLFxuXHRcdFx0XHRET00uc3Bhbih7IGtleTonZG8nLCBjbGFzc05hbWU6ICdyZHRCdG4nLCBvbk1vdXNlRG93bjogdGhpcy5vblN0YXJ0Q2xpY2tpbmcoICd0b2dnbGVEYXlQYXJ0JywgJ2hvdXJzJykgfSwgJ+KWvCcgKVxuXHRcdFx0XSk7XG5cdFx0fSxcblx0XHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG1lID0gdGhpcyxcblx0XHRcdFx0Y291bnRlcnMgPSBbXVxuXHRcdFx0O1xuXG5cdFx0XHR0aGlzLnN0YXRlLmNvdW50ZXJzLmZvckVhY2goIGZ1bmN0aW9uKGMpe1xuXHRcdFx0XHRpZiAoIGNvdW50ZXJzLmxlbmd0aCApXG5cdFx0XHRcdFx0Y291bnRlcnMucHVzaCggRE9NLmRpdigge2tleTogJ3NlcCcgKyBjb3VudGVycy5sZW5ndGgsIGNsYXNzTmFtZTogJ3JkdENvdW50ZXJTZXBhcmF0b3InIH0sICc6JyApKTtcblx0XHRcdFx0Y291bnRlcnMucHVzaCggbWUucmVuZGVyQ291bnRlciggYyApICk7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKHRoaXMuc3RhdGUuZGF5cGFydCAhPT0gZmFsc2UpIHtcblx0XHRcdFx0Y291bnRlcnMucHVzaCggbWUucmVuZGVyRGF5UGFydCgpICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdGhpcy5zdGF0ZS5jb3VudGVycy5sZW5ndGggPT09IDMgJiYgdGhpcy5wcm9wcy50aW1lRm9ybWF0LmluZGV4T2YoJ1MnKSAhPT0gLTEgKXtcblx0XHRcdFx0Y291bnRlcnMucHVzaCggRE9NLmRpdigge2NsYXNzTmFtZTogJ3JkdENvdW50ZXJTZXBhcmF0b3InLCBrZXk6ICdzZXA1JyB9LCAnOicgKSk7XG5cdFx0XHRcdGNvdW50ZXJzLnB1c2goXG5cdFx0XHRcdFx0RE9NLmRpdigge2NsYXNzTmFtZTogJ3JkdENvdW50ZXIgcmR0TWlsbGknLCBrZXk6J20nfSxcblx0XHRcdFx0XHRcdERPTS5pbnB1dCh7IHZhbHVlOiB0aGlzLnN0YXRlLm1pbGxpc2Vjb25kcywgdHlwZTogJ3RleHQnLCBvbkNoYW5nZTogdGhpcy51cGRhdGVNaWxsaSB9KVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBET00uZGl2KCB7Y2xhc3NOYW1lOiAncmR0VGltZSd9LFxuXHRcdFx0XHRET00udGFibGUoIHt9LCBbXG5cdFx0XHRcdFx0dGhpcy5yZW5kZXJIZWFkZXIoKSxcblx0XHRcdFx0XHRET00udGJvZHkoe2tleTogJ2InfSwgRE9NLnRyKHt9LCBET00udGQoe30sXG5cdFx0XHRcdFx0XHRET00uZGl2KHsgY2xhc3NOYW1lOiAncmR0Q291bnRlcnMnIH0sIGNvdW50ZXJzIClcblx0XHRcdFx0XHQpKSlcblx0XHRcdFx0XSlcblx0XHRcdCk7XG5cdFx0fSxcblx0XHRjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG1lID0gdGhpcztcblx0XHRcdG1lLnRpbWVDb25zdHJhaW50cyA9IHtcblx0XHRcdFx0aG91cnM6IHtcblx0XHRcdFx0XHRtaW46IDAsXG5cdFx0XHRcdFx0bWF4OiAyMyxcblx0XHRcdFx0XHRzdGVwOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1pbnV0ZXM6IHtcblx0XHRcdFx0XHRtaW46IDAsXG5cdFx0XHRcdFx0bWF4OiA1OSxcblx0XHRcdFx0XHRzdGVwOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNlY29uZHM6IHtcblx0XHRcdFx0XHRtaW46IDAsXG5cdFx0XHRcdFx0bWF4OiA1OSxcblx0XHRcdFx0XHRzdGVwOiAxLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtaWxsaXNlY29uZHM6IHtcblx0XHRcdFx0XHRtaW46IDAsXG5cdFx0XHRcdFx0bWF4OiA5OTksXG5cdFx0XHRcdFx0c3RlcDogMVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0Wydob3VycycsICdtaW51dGVzJywgJ3NlY29uZHMnLCAnbWlsbGlzZWNvbmRzJ10uZm9yRWFjaChmdW5jdGlvbih0eXBlKSB7XG5cdFx0XHRcdGFzc2lnbihtZS50aW1lQ29uc3RyYWludHNbdHlwZV0sIG1lLnByb3BzLnRpbWVDb25zdHJhaW50c1t0eXBlXSk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuc2V0U3RhdGUoIHRoaXMuY2FsY3VsYXRlU3RhdGUoIHRoaXMucHJvcHMgKSApO1xuXHRcdH0sXG5cdFx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24oIG5leHRQcm9wcyApe1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSggdGhpcy5jYWxjdWxhdGVTdGF0ZSggbmV4dFByb3BzICkgKTtcblx0XHR9LFxuXHRcdHVwZGF0ZU1pbGxpOiBmdW5jdGlvbiggZSApe1xuXHRcdFx0dmFyIG1pbGxpID0gcGFyc2VJbnQoIGUudGFyZ2V0LnZhbHVlLCAxMCApO1xuXHRcdFx0aWYgKCBtaWxsaSA9PT0gZS50YXJnZXQudmFsdWUgJiYgbWlsbGkgPj0gMCAmJiBtaWxsaSA8IDEwMDAgKXtcblx0XHRcdFx0dGhpcy5wcm9wcy5zZXRUaW1lKCAnbWlsbGlzZWNvbmRzJywgbWlsbGkgKTtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7IG1pbGxpc2Vjb25kczogbWlsbGkgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW5kZXJIZWFkZXI6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAoICF0aGlzLnByb3BzLmRhdGVGb3JtYXQgKVxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0dmFyIGRhdGUgPSB0aGlzLnByb3BzLnNlbGVjdGVkRGF0ZSB8fCB0aGlzLnByb3BzLnZpZXdEYXRlO1xuXHRcdFx0cmV0dXJuIERPTS50aGVhZCh7IGtleTogJ2gnfSwgRE9NLnRyKHt9LFxuXHRcdFx0XHRET00udGgoe30sIERPTS5idXR0b24oIHtjbGFzc05hbWU6ICdyZHRTd2l0Y2gnLCBjb2xTcGFuOiA0LCBvbkNsaWNrOiB0aGlzLnByb3BzLnNob3dWaWV3KCdkYXlzJyl9LCBkYXRlLmZvcm1hdCggdGhpcy5wcm9wcy5kYXRlRm9ybWF0ICkgKSlcblx0XHRcdCkpO1xuXHRcdH0sXG5cdFx0b25TdGFydENsaWNraW5nOiBmdW5jdGlvbiggYWN0aW9uLCB0eXBlICl7XG5cdFx0XHR2YXIgbWUgPSB0aGlzO1xuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIHVwZGF0ZSA9IHt9O1xuXHRcdFx0XHR1cGRhdGVbIHR5cGUgXSA9IG1lWyBhY3Rpb24gXSggdHlwZSApO1xuXHRcdFx0XHRtZS5zZXRTdGF0ZSggdXBkYXRlICk7XG5cblx0XHRcdFx0bWUudGltZXIgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdG1lLmluY3JlYXNlVGltZXIgPSBzZXRJbnRlcnZhbCggZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHVwZGF0ZVsgdHlwZSBdID0gbWVbIGFjdGlvbiBdKCB0eXBlICk7XG5cdFx0XHRcdFx0XHRtZS5zZXRTdGF0ZSggdXBkYXRlICk7XG5cdFx0XHRcdFx0fSwgNzApO1xuXHRcdFx0XHR9LCA1MDApO1xuXG5cdFx0XHRcdG1lLm1vdXNlVXBMaXN0ZW5lciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCBtZS50aW1lciApO1xuXHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwoIG1lLmluY3JlYXNlVGltZXIgKTtcblx0XHRcdFx0XHRtZS5wcm9wcy5zZXRUaW1lKCB0eXBlLCBtZS5zdGF0ZVsgdHlwZSBdICk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbWUubW91c2VVcExpc3RlbmVyKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtZS5tb3VzZVVwTGlzdGVuZXIpO1xuXHRcdFx0fTtcblx0XHR9LFxuXHRcdHBhZFZhbHVlczoge1xuXHRcdFx0aG91cnM6IDEsXG5cdFx0XHRtaW51dGVzOiAyLFxuXHRcdFx0c2Vjb25kczogMixcblx0XHRcdG1pbGxpc2Vjb25kczogM1xuXHRcdH0sXG5cdFx0dG9nZ2xlRGF5UGFydDogZnVuY3Rpb24oIHR5cGUgKXsgLy8gdHlwZSBpcyBhbHdheXMgJ2hvdXJzJ1xuXHRcdFx0dmFyIHZhbHVlID0gcGFyc2VJbnQodGhpcy5zdGF0ZVsgdHlwZSBdLCAxMCkgKyAxMjtcblx0XHRcdGlmICggdmFsdWUgPiB0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLm1heCApXG5cdFx0XHRcdHZhbHVlID0gdGhpcy50aW1lQ29uc3RyYWludHNbIHR5cGUgXS5taW4gKyAodmFsdWUgLSAodGhpcy50aW1lQ29uc3RyYWludHNbIHR5cGUgXS5tYXggKyAxKSk7XG5cdFx0XHRyZXR1cm4gdGhpcy5wYWQoIHR5cGUsIHZhbHVlICk7XG5cdFx0fSxcblx0XHRpbmNyZWFzZTogZnVuY3Rpb24oIHR5cGUgKXtcblx0XHRcdHZhciB2YWx1ZSA9IHBhcnNlSW50KHRoaXMuc3RhdGVbIHR5cGUgXSwgMTApICsgdGhpcy50aW1lQ29uc3RyYWludHNbIHR5cGUgXS5zdGVwO1xuXHRcdFx0aWYgKCB2YWx1ZSA+IHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0ubWF4IClcblx0XHRcdFx0dmFsdWUgPSB0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLm1pbiArICggdmFsdWUgLSAoIHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0ubWF4ICArIDEpICk7XG5cdFx0XHRyZXR1cm4gdGhpcy5wYWQoIHR5cGUsIHZhbHVlICk7XG5cdFx0fSxcblx0XHRkZWNyZWFzZTogZnVuY3Rpb24oIHR5cGUgKXtcblx0XHRcdHZhciB2YWx1ZSA9IHBhcnNlSW50KHRoaXMuc3RhdGVbIHR5cGUgXSwgMTApIC0gdGhpcy50aW1lQ29uc3RyYWludHNbIHR5cGUgXS5zdGVwO1xuXHRcdFx0aWYgKCB2YWx1ZSA8IHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0ubWluIClcblx0XHRcdFx0dmFsdWUgPSB0aGlzLnRpbWVDb25zdHJhaW50c1sgdHlwZSBdLm1heCArIDEgLSAoIHRoaXMudGltZUNvbnN0cmFpbnRzWyB0eXBlIF0ubWluIC0gdmFsdWUgKTtcblx0XHRcdHJldHVybiB0aGlzLnBhZCggdHlwZSwgdmFsdWUgKTtcblx0XHR9LFxuXHRcdHBhZDogZnVuY3Rpb24oIHR5cGUsIHZhbHVlICl7XG5cdFx0XHR2YXIgc3RyID0gdmFsdWUgKyAnJztcblx0XHRcdHdoaWxlICggc3RyLmxlbmd0aCA8IHRoaXMucGFkVmFsdWVzWyB0eXBlIF0gKVxuXHRcdFx0XHRzdHIgPSAnMCcgKyBzdHI7XG5cdFx0XHRyZXR1cm4gc3RyO1xuXHRcdH1cblx0fSk7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBEYXRlVGltZVBpY2tlclRpbWU7XG5cblxuLyoqKi8gfSxcbi8qIDEwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0Ly8gVGhpcyBpcyBleHRyYWN0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vUG9tYXgvcmVhY3Qtb25jbGlja291dHNpZGVcblx0Ly8gQW5kIG1vZGlmaWVkIHRvIHN1cHBvcnQgcmVhY3QgMC4xMyBhbmQgcmVhY3QgMC4xNFxuXG5cdHZhciBSZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMiksXG5cdFx0dmVyc2lvbiA9IFJlYWN0LnZlcnNpb24gJiYgUmVhY3QudmVyc2lvbi5zcGxpdCgnLicpXG5cdDtcblxuXHRpZiAoIHZlcnNpb24gJiYgKCB2ZXJzaW9uWzBdID4gMCB8fCB2ZXJzaW9uWzFdID4gMTMgKSApXG5cdFx0UmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDExKTtcblxuXHQvLyBVc2UgYSBwYXJhbGxlbCBhcnJheSBiZWNhdXNlIHdlIGNhbid0IHVzZVxuXHQvLyBvYmplY3RzIGFzIGtleXMsIHRoZXkgZ2V0IHRvU3RyaW5nLWNvZXJjZWRcblx0dmFyIHJlZ2lzdGVyZWRDb21wb25lbnRzID0gW107XG5cdHZhciBoYW5kbGVycyA9IFtdO1xuXG5cdHZhciBJR05PUkVfQ0xBU1MgPSAnaWdub3JlLXJlYWN0LW9uY2xpY2tvdXRzaWRlJztcblxuXHR2YXIgaXNTb3VyY2VGb3VuZCA9IGZ1bmN0aW9uKHNvdXJjZSwgbG9jYWxOb2RlKSB7XG5cdCBpZiAoc291cmNlID09PSBsb2NhbE5vZGUpIHtcblx0ICAgcmV0dXJuIHRydWU7XG5cdCB9XG5cdCAvLyBTVkcgPHVzZS8+IGVsZW1lbnRzIGRvIG5vdCB0ZWNobmljYWxseSByZXNpZGUgaW4gdGhlIHJlbmRlcmVkIERPTSwgc29cblx0IC8vIHRoZXkgZG8gbm90IGhhdmUgY2xhc3NMaXN0IGRpcmVjdGx5LCBidXQgdGhleSBvZmZlciBhIGxpbmsgdG8gdGhlaXJcblx0IC8vIGNvcnJlc3BvbmRpbmcgZWxlbWVudCwgd2hpY2ggY2FuIGhhdmUgY2xhc3NMaXN0LiBUaGlzIGV4dHJhIGNoZWNrIGlzIGZvclxuXHQgLy8gdGhhdCBjYXNlLlxuXHQgLy8gU2VlOiBodHRwOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9zdHJ1Y3QuaHRtbCNJbnRlcmZhY2VTVkdVc2VFbGVtZW50XG5cdCAvLyBEaXNjdXNzaW9uOiBodHRwczovL2dpdGh1Yi5jb20vUG9tYXgvcmVhY3Qtb25jbGlja291dHNpZGUvcHVsbC8xN1xuXHQgaWYgKHNvdXJjZS5jb3JyZXNwb25kaW5nRWxlbWVudCkge1xuXHQgICByZXR1cm4gc291cmNlLmNvcnJlc3BvbmRpbmdFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhJR05PUkVfQ0xBU1MpO1xuXHQgfVxuXHQgcmV0dXJuIHNvdXJjZS5jbGFzc0xpc3QuY29udGFpbnMoSUdOT1JFX0NMQVNTKTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IHtcblx0IGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcblx0ICAgaWYgKHR5cGVvZiB0aGlzLmhhbmRsZUNsaWNrT3V0c2lkZSAhPT0gJ2Z1bmN0aW9uJylcblx0ICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvbmVudCBsYWNrcyBhIGhhbmRsZUNsaWNrT3V0c2lkZShldmVudCkgZnVuY3Rpb24gZm9yIHByb2Nlc3Npbmcgb3V0c2lkZSBjbGljayBldmVudHMuJyk7XG5cblx0ICAgdmFyIGZuID0gdGhpcy5fX291dHNpZGVDbGlja0hhbmRsZXIgPSAoZnVuY3Rpb24obG9jYWxOb2RlLCBldmVudEhhbmRsZXIpIHtcblx0ICAgICByZXR1cm4gZnVuY3Rpb24oZXZ0KSB7XG5cdCAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgICB2YXIgc291cmNlID0gZXZ0LnRhcmdldDtcblx0ICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuXHQgICAgICAgLy8gSWYgc291cmNlPWxvY2FsIHRoZW4gdGhpcyBldmVudCBjYW1lIGZyb20gXCJzb21ld2hlcmVcIlxuXHQgICAgICAgLy8gaW5zaWRlIGFuZCBzaG91bGQgYmUgaWdub3JlZC4gV2UgY291bGQgaGFuZGxlIHRoaXMgd2l0aFxuXHQgICAgICAgLy8gYSBsYXllcmVkIGFwcHJvYWNoLCB0b28sIGJ1dCB0aGF0IHJlcXVpcmVzIGdvaW5nIGJhY2sgdG9cblx0ICAgICAgIC8vIHRoaW5raW5nIGluIHRlcm1zIG9mIERvbSBub2RlIG5lc3RpbmcsIHJ1bm5pbmcgY291bnRlclxuXHQgICAgICAgLy8gdG8gUmVhY3QncyBcInlvdSBzaG91bGRuJ3QgY2FyZSBhYm91dCB0aGUgRE9NXCIgcGhpbG9zb3BoeS5cblx0ICAgICAgIHdoaWxlIChzb3VyY2UucGFyZW50Tm9kZSkge1xuXHQgICAgICAgICBmb3VuZCA9IGlzU291cmNlRm91bmQoc291cmNlLCBsb2NhbE5vZGUpO1xuXHQgICAgICAgICBpZiAoZm91bmQpIHJldHVybjtcblx0ICAgICAgICAgc291cmNlID0gc291cmNlLnBhcmVudE5vZGU7XG5cdCAgICAgICB9XG5cdCAgICAgICBldmVudEhhbmRsZXIoZXZ0KTtcblx0ICAgICB9O1xuXHQgICB9KFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpLCB0aGlzLmhhbmRsZUNsaWNrT3V0c2lkZSkpO1xuXG5cdCAgIHZhciBwb3MgPSByZWdpc3RlcmVkQ29tcG9uZW50cy5sZW5ndGg7XG5cdCAgIHJlZ2lzdGVyZWRDb21wb25lbnRzLnB1c2godGhpcyk7XG5cdCAgIGhhbmRsZXJzW3Bvc10gPSBmbjtcblxuXHQgICAvLyBJZiB0aGVyZSBpcyBhIHRydXRoeSBkaXNhYmxlT25DbGlja091dHNpZGUgcHJvcGVydHkgZm9yIHRoaXNcblx0ICAgLy8gY29tcG9uZW50LCBkb24ndCBpbW1lZGlhdGVseSBzdGFydCBsaXN0ZW5pbmcgZm9yIG91dHNpZGUgZXZlbnRzLlxuXHQgICBpZiAoIXRoaXMucHJvcHMuZGlzYWJsZU9uQ2xpY2tPdXRzaWRlKSB7XG5cdCAgICAgdGhpcy5lbmFibGVPbkNsaWNrT3V0c2lkZSgpO1xuXHQgICB9XG5cdCB9LFxuXG5cdCBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG5cdCAgIHRoaXMuZGlzYWJsZU9uQ2xpY2tPdXRzaWRlKCk7XG5cdCAgIHRoaXMuX19vdXRzaWRlQ2xpY2tIYW5kbGVyID0gZmFsc2U7XG5cdCAgIHZhciBwb3MgPSByZWdpc3RlcmVkQ29tcG9uZW50cy5pbmRleE9mKHRoaXMpO1xuXHQgICBpZiAoIHBvcz4tMSkge1xuXHQgICAgIGlmIChoYW5kbGVyc1twb3NdKSB7XG5cdCAgICAgICAvLyBjbGVhbiB1cCBzbyB3ZSBkb24ndCBsZWFrIG1lbW9yeVxuXHQgICAgICAgaGFuZGxlcnMuc3BsaWNlKHBvcywgMSk7XG5cdCAgICAgICByZWdpc3RlcmVkQ29tcG9uZW50cy5zcGxpY2UocG9zLCAxKTtcblx0ICAgICB9XG5cdCAgIH1cblx0IH0sXG5cblx0IC8qKlxuXHQgICogQ2FuIGJlIGNhbGxlZCB0byBleHBsaWNpdGx5IGVuYWJsZSBldmVudCBsaXN0ZW5pbmdcblx0ICAqIGZvciBjbGlja3MgYW5kIHRvdWNoZXMgb3V0c2lkZSBvZiB0aGlzIGVsZW1lbnQuXG5cdCAgKi9cblx0IGVuYWJsZU9uQ2xpY2tPdXRzaWRlOiBmdW5jdGlvbigpIHtcblx0ICAgdmFyIGZuID0gdGhpcy5fX291dHNpZGVDbGlja0hhbmRsZXI7XG5cdCAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZuKTtcblx0ICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZuKTtcblx0IH0sXG5cblx0IC8qKlxuXHQgICogQ2FuIGJlIGNhbGxlZCB0byBleHBsaWNpdGx5IGRpc2FibGUgZXZlbnQgbGlzdGVuaW5nXG5cdCAgKiBmb3IgY2xpY2tzIGFuZCB0b3VjaGVzIG91dHNpZGUgb2YgdGhpcyBlbGVtZW50LlxuXHQgICovXG5cdCBkaXNhYmxlT25DbGlja091dHNpZGU6IGZ1bmN0aW9uKCkge1xuXHQgICB2YXIgZm4gPSB0aGlzLl9fb3V0c2lkZUNsaWNrSGFuZGxlcjtcblx0ICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZm4pO1xuXHQgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZm4pO1xuXHQgfVxuXHR9O1xuXG5cbi8qKiovIH0sXG4vKiAxMSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzExX187XG5cbi8qKiovIH1cbi8qKioqKiovIF0pXG59KTtcbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlYWN0LWRhdGV0aW1lLmpzLm1hcCJdLCJmaWxlIjoicmVhY3QtZGF0ZXRpbWUuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
