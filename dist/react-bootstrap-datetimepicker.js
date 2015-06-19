(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("moment"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "moment"], factory);
	else if(typeof exports === 'object')
		exports["Datetime"] = factory(require("React"), require("moment"));
	else
		root["Datetime"] = factory(root["React"], root["moment"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_6__) {
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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign = __webpack_require__(4),
		React = __webpack_require__(3),
		DaysView = __webpack_require__(5),
		MonthsView = __webpack_require__(7),
		YearsView = __webpack_require__(2),
		TimeView = __webpack_require__(8),
		moment = __webpack_require__(6)
	;

	var Constants = {
	    MODE_DATE: 'date',
	    MODE_DATETIME: 'datetime',
	    MODE_TIME: 'time'
	};

	var Datetime = React.createClass({displayName: "Datetime",
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
			var Component = this.viewComponents[ this.state.currentView ];
			return (
				React.createElement("div", {className: "datetimePicker"}, 
					React.createElement("input", React.__spread({ref: "input", type: "text", className: "form-control", onFocus: this.openCalendar, onChange: this.onChange, value: this.state.inputValue},  this.props.inputProps)), 
					React.createElement("div", {className:  this.state.widgetClasses, style:  this.state.widgetStyle}, 
						React.createElement(Component, React.__spread({},   this.getComponentProps() ))
					)
				)
			);
		}
	});

	module.exports = Datetime;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var DateTimePickerYears, React;

	React = __webpack_require__(3);

	DateTimePickerYears = React.createClass({displayName: "DateTimePickerYears",
	  renderYears: function() {
	    var classes, i, year, years, rows;
	    years = [];
	    year = parseInt(this.props.viewDate.year() / 10, 10) * 10;
	    year--;
	    i = -1;
	    rows = [];
	    while (i < 11) {
	    	if( (i+1) && (i+1) % 4 == 0 ){
	    		rows.push( React.createElement("tr", null, years ) );
	    		years = [];
	    	}
	    	classes = 'year';
	    	if( i === -1 | i === 10 )
	    		classes += ' old';
	    	if( this.props.selectedDate.year() === year )
	    		classes += ' active';

	      years.push(React.createElement("td", {key: year, className: classes, onClick: this.props.setDate('year')}, year));
	      year++;
	      i++;
	    }
	    rows.push( React.createElement("tr", null, years ) );
	    return rows;
	  },
	  render: function() {
	    var year;
	    year = parseInt(this.props.viewDate.year() / 10, 10) * 10;
	    return (
	      React.createElement("div", {className: "datepicker-years", style: {display: "block"}}, 
	        React.createElement("table", {className: "table-condensed"}, 
	          React.createElement("thead", null, 
	            React.createElement("tr", null, 
	              React.createElement("th", {className: "prev", onClick: this.props.subtractTime(10, 'years')}, "‹"), 
	              React.createElement("th", {className: "switch", colSpan: "5"}, year, " - ", year+9), 
	              React.createElement("th", {className: "next", onClick: this.props.addTime(10, 'years')}, "›")
	            )
	          )
	        ), 
	        React.createElement("table", null, 
	          React.createElement("tbody", null, 
	            this.renderYears()
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = DateTimePickerYears;


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var DateTimePickerDays, React, moment;

	React = __webpack_require__(3);

	moment = __webpack_require__(6);

	DateTimePickerDays = React.createClass({displayName: "DateTimePickerDays",

	  renderDays: function() {
	    var cells, classes, days, html, i, month, nextMonth, prevMonth, minDate, maxDate, row, year, _i, _len, _ref;
	    year = this.props.viewDate.year();
	    month = this.props.viewDate.month();
	    prevMonth = this.props.viewDate.clone().subtract(1, "months");
	    days = prevMonth.daysInMonth();
	    prevMonth.date(days).startOf('week');
	    nextMonth = moment(prevMonth).clone().add(42, "d");
	    minDate = this.props.minDate ? this.props.minDate.clone().subtract(1, 'days') : this.props.minDate;
	    maxDate = this.props.maxDate ? this.props.maxDate.clone() : this.props.maxDate;
	    html = [];
	    cells = [];
	    while (prevMonth.isBefore(nextMonth)) {
	      classes = 'day';
	      if (prevMonth.year() < year || (prevMonth.year() === year && prevMonth.month() < month)) {
	        classes += " old";
	      } else if (prevMonth.year() > year || (prevMonth.year() === year && prevMonth.month() > month)) {
	        classes += " new";
	      }
	      if (prevMonth.isSame(moment({
	        y: this.props.selectedDate.year(),
	        M: this.props.selectedDate.month(),
	        d: this.props.selectedDate.date()
	      }))) {
	        classes += " active";
	      }

			if (prevMonth.isSame(moment(), 'day')) {
			 classes += " today";
			}

	      if ((minDate && prevMonth.isBefore(minDate)) || (maxDate && prevMonth.isAfter(maxDate))) {
	        classes += " disabled";
	      }

	      cells.push(React.createElement("td", {key: prevMonth.month() + '-' + prevMonth.date(), className: classes, onClick: this.props.updateDate}, prevMonth.date()));
	      if (prevMonth.weekday() === moment().endOf('week').weekday()) {
	        row = React.createElement("tr", {key: prevMonth.month() + '-' + prevMonth.date()}, cells);
	        html.push(row);
	        cells = [];
	      }
	      prevMonth.add(1, "d");
	    }
	    return html;
	  },
	  render: function() {
	  	var footer = this.renderFooter();
	    return (
	    React.createElement("div", {className: "datepicker-days", style: {display: 'block'}}, 
	        React.createElement("table", {className: "table-condensed"}, 
	          React.createElement("thead", null, 
	            React.createElement("tr", null, 
	              React.createElement("th", {className: "prev", onClick: this.props.subtractTime(1, 'months')}, "‹"), 

	              React.createElement("th", {className: "switch", colSpan: "5", onClick: this.props.showView('months')}, moment.months()[this.props.viewDate.month()], " ", this.props.viewDate.year()), 

	              React.createElement("th", {className: "next", onClick: this.props.addTime(1, 'months')}, "›")
	            ), 

	            React.createElement("tr", null, 
	              React.createElement("th", {className: "dow"}, "Su"), 

	              React.createElement("th", {className: "dow"}, "Mo"), 

	              React.createElement("th", {className: "dow"}, "Tu"), 

	              React.createElement("th", {className: "dow"}, "We"), 

	              React.createElement("th", {className: "dow"}, "Th"), 

	              React.createElement("th", {className: "dow"}, "Fr"), 

	              React.createElement("th", {className: "dow"}, "Sa")
	            )
	          ), 

	          React.createElement("tbody", null, 
	            this.renderDays()
	          ), 

	           this.renderFooter() 

	        )
	      )
	    );
	  },
	  renderFooter: function(){
	  		if( !this.props.timeFormat )
	  			return '';

	  		return (
	  			React.createElement("tfoot", null, 
	  				React.createElement("tr", null, 
	  					React.createElement("td", {onClick: this.props.showView('time'), colSpan: "7", className: "timeToggle"}, "⌚ ",  this.props.selectedDate.format( this.props.timeFormat) )
	  				)
	  			)
	  		)
	  }
	});

	module.exports = DateTimePickerDays;


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var DateTimePickerMonths, React, moment;

	React = __webpack_require__(3);

	moment = __webpack_require__(6);

	DateTimePickerMonths = React.createClass({displayName: "DateTimePickerMonths",
	  renderMonths: function() {
	    var classes, i, month, months, monthsShort, rows;
	    month = this.props.selectedDate.month();
	    monthsShort = moment.monthsShort();
	    rows = [],
	    i = 0;
	    months = [];
	    while (i < 12) {
	    	if( i && i % 4 == 0 ){
	    		rows.push( React.createElement("tr", null, months ) );
	    		months = [];
	    	}

	      classes = "month";
	      if( i === month && this.props.viewDate.year() === this.props.selectedDate.year() )
	        classes += " active";

	      months.push(React.createElement("td", {key: i, className: classes, onClick: this.props.setDate('month')}, monthsShort[i]));
	      i++;
	    }
	    rows.push( React.createElement("tr", null, months ) );
	    return rows;
	  },
	  render: function() {
	    return (
	    	React.createElement("div", {className: "datepicker-months", style: {display: 'block'}}, 
				React.createElement("table", {className: "table-condensed"}, 
					React.createElement("thead", null, 
						React.createElement("tr", null, 
							React.createElement("th", {className: "prev", onClick: this.props.subtractTime(1, 'years')}, "‹"), 

							React.createElement("th", {className: "switch", colSpan: "5", onClick: this.props.showView('years')}, this.props.viewDate.year()), 

							React.createElement("th", {className: "next", onClick: this.props.addTime(1, 'years')}, "›")
						)
					)
				), 
				React.createElement("table", null, 
					React.createElement("tbody", null, 
						this.renderMonths()
					)
				)
			)
	    );
	  }
	});

	module.exports = DateTimePickerMonths;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(3);

	var DateTimePickerTime = React.createClass({displayName: "DateTimePickerTime",
		getInitialState: function(){
			var date = this.props.selectedDate,
				format = this.props.timeFormat,
				counters = []
			;

			if( format.indexOf('H') != -1 || format.indexOf('h') != -1 ){
				counters.push('hours');
				if( format.indexOf('m') != -1 ){
					counters.push('minutes');
					if( format.indexOf('s') != -1 ){
						counters.push('seconds');
					}
				}
			}

			return {
				hours: date.format('H'),
				minutes: date.format('mm'),
				seconds: date.format('ss'),
				milliseconds: date.format('SSS'),
				counters: counters
			};
		},
		renderCounter: function( type ){
			return (
				React.createElement("div", {className: "dtCounter"}, 
					React.createElement("div", {className: "btn", onMouseDown:  this.onStartClicking( 'increase', type) }, "▲"), 
					React.createElement("div", {className: "dtCount"},  this.state[ type] ), 
					React.createElement("div", {className: "btn", onMouseDown:  this.onStartClicking( 'decrease', type) }, "▼")
				)
			)
		},
	  render: function() {
	  	var me = this,
	  		counters = []
	  	;

	  	this.state.counters.forEach( function(c){
	  		if( counters.length )
	  			counters.push( React.createElement("div", {className: "dtCounterSeparator"}, ":") );
	  		counters.push( me.renderCounter( c ) );
	  	});
	  	if( this.state.counters.length == 3 && this.props.timeFormat.indexOf('S') != -1 ){
	  		counters.push( React.createElement("div", {className: "dtCounterSeparator"}, ":") );
	  		counters.push( React.createElement("div", {className: "dtCounter dtMilli"}, React.createElement("input", {value:  this.state.milliseconds})));
	  	}
	  	return (
	  		React.createElement("div", {className: "timepicker"}, 
			   React.createElement("div", {className: "timepicker-picker"}, 
			     React.createElement("table", {className: "table-condensed"}, 
			     	 this.renderHeader(), 
			       React.createElement("tbody", null, 
			         React.createElement("tr", null, React.createElement("td", null, React.createElement("div", {className: "dtCounters"}, counters )))
			        )
			      )
			   )
			)
	  	);
	  },
	  renderHeader: function(){
	  	if( !this.props.dateFormat )
	  		return '';

	  	return (
	  		React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {colSpan: "4", onClick:  this.props.showView('days') },  this.props.selectedDate.format( this.props.dateFormat) )))
	  	);
	  },
	  onStartClicking: function( action, type ){
		  	var me = this,
		  		update = {}
		  	;
		  	return function(){
		  		var update = {};
		  		update[ type ] = me[ action ]( type );
		  		me.setState( update );

				me.timer = setTimeout( function(){
					me.increaseTimer = setInterval( function(){
					  	update[ type ] = me[ action ]( type );
					  	me.setState( update );
					},80)
				}, 500);

				document.body.addEventListener('mouseup', function(){
					clearTimeout( me.timer );
					clearInterval( me.increaseTimer );
					me.props.setTime( type, me.state[ type ] );
				});
				console.log( 'Start clicking');
		  	};
		},

		maxValues: {
			hours: 23,
			minutes: 59,
			seconds: 59,
			milliseconds: 999
		},
		padValues: {
			hours: 1,
			minutes: 2,
			seconds: 2,
			milliseconds: 3
		},
		increase: function( type ){
			var value = parseInt(this.state[ type ]) + 1;
			if( value > this.maxValues[ type ] )
				value = 0;
			return this.pad( type, value );
		},
		decrease: function( type ){
			var value = parseInt(this.state[ type ]) - 1;
			if( value < 0 )
				value = this.maxValues[ type ];
			return this.pad( type, value );
		},
		pad: function( type, value ){
			var str = value + '';
			while( str.length < this.padValues[ type ] )
				str = '0' + str;
			return str;
		}
	});

	module.exports = DateTimePickerTime;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * A mixin for handling (effectively) onClickOutside for React components.
	 * Note that we're not intercepting any events in this approach, and we're
	 * not using double events for capturing and discarding in layers or wrappers.
	 *
	 * The idea is that components define function
	 *
	 *   handleClickOutside: function() { ... }
	 *
	 * If no such function is defined, an error will be thrown, as this means
	 * either it still needs to be written, or the component should not be using
	 * this mixing since it will not exhibit onClickOutside behaviour.
	 *
	 */
	(function (root, factory) {
	  if (true) {
	    // AMD. Register as an anonymous module.
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // Node. Note that this does not work with strict
	    // CommonJS, but only CommonJS-like environments
	    // that support module.exports
	    module.exports = factory();
	  } else {
	    // Browser globals (root is window)
	    root.OnClickOutside = factory();
	  }
	}(this, function () {
	  "use strict";

	  // Use a parallel array because we can't use
	  // objects as keys, they get toString-coerced
	  var registeredComponents = [];
	  var handlers = [];

	  var IGNORE_CLASS = 'ignore-react-onclickoutside';

	  return {
	    componentDidMount: function() {
	      if(!this.handleClickOutside)
	        throw new Error("Component lacks a handleClickOutside(event) function for processing outside click events.");

	      var fn = this.__outsideClickHandler = (function(localNode, eventHandler) {
	        return function(evt) {
	          var source = evt.target;
	          var found = false;
	          // If source=local then this event came from "somewhere"
	          // inside and should be ignored. We could handle this with
	          // a layered approach, too, but that requires going back to
	          // thinking in terms of Dom node nesting, running counter
	          // to React's "you shouldn't care about the DOM" philosophy.
	          while(source.parentNode) {
	            found = (source === localNode || source.classList.contains(IGNORE_CLASS));
	            if(found) return;
	            source = source.parentNode;
	          }
	          eventHandler(evt);
	        }
	      }(this.getDOMNode(), this.handleClickOutside));

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
	      if( pos>-1) {
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
	      document.addEventListener("mousedown", fn);
	      document.addEventListener("touchstart", fn);
	    },

	    /**
	     * Can be called to explicitly disable event listening
	     * for clicks and touches outside of this element.
	     */
	    disableOnClickOutside: function(fn) {
	      var fn = this.__outsideClickHandler;
	      document.removeEventListener("mousedown", fn);
	      document.removeEventListener("touchstart", fn);
	    }
	  };

	}));


/***/ }
/******/ ])
});
;