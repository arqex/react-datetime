// Create the dom before requiring react
var DOM = require( './testdom');
DOM();


// Needs to be global to work in Travis CI
React = require('react');
ReactDOM = require('react-dom');

var Datetime = require('../DateTime'),
	assert = require('assert'),
	moment = require('moment'),
	TestUtils = require('react-addons-test-utils')
;

var createDatetime = function( props ){
	document.body.innerHTML = '<div id="root"></div>';

	ReactDOM.render(
		React.createElement( Datetime, props ),
		document.getElementById('root')
	);

	return document.getElementById('root').children[0];
};

var trigger = function( name, element ){
	var ev = document.createEvent("MouseEvents");
	 ev.initEvent(name, true, true);
	 element.dispatchEvent( ev );
};

var ev = TestUtils.Simulate;
var dt = {
	dt: function(){
		return document.getElementById('root').children[0];
	},
	view: function(){
		return this.dt().children[1].children[0];
	},
	input: function(){
		return this.dt().children[0];
	},
	switcher: function(){
		return document.querySelector('.rdtSwitch');
	},
	timeSwitcher: function(){
		return document.querySelector('.rdtTimeToggle');
	},
	year: function( n ){
		var years = document.querySelectorAll('.rdtYear button');
		return years[ n || 0 ];
	},
	month: function( n ){
		var months = document.querySelectorAll('.rdtMonth button');
		return months[ n || 0 ];
	},
	day: function( n ){
		return Array.from(document.querySelectorAll('.rdtDay button')).find(function(button) { return button.innerHTML === n; });
	},
	active: function(){
		return document.querySelector('.rdtActive button');
	},
	next: function(){
		return document.querySelector('.rdtNext span');
	},
	prev: function(){
		return document.querySelector('.rdtPrev span');
	},
	timeUp: function( n ){
		return document.querySelectorAll('.rdtCounter')[ n ].children[0];
	},
	timeDown: function( n ){
		return document.querySelectorAll('.rdtCounter')[ n ].children[2];
	},
	hour: function(){
		return document.querySelectorAll('.rdtCount')[0];
	},
	minute: function(){
		return document.querySelectorAll('.rdtCount')[1];
	},
	second: function(){
		return document.querySelectorAll('.rdtCount')[2];
	},
	milli: function(){
		return document.querySelector('.rdtMilli input');
	}
};

var date = new Date( 2000, 0, 15, 2, 2, 2, 2 ),
	mDate = moment( date ),
	strDate = mDate.format('L') + ' ' + mDate.format('LT')
;

describe( 'Datetime', function(){
	it( 'Create Datetime', function(){
		var component = createDatetime({});
		assert( component );
		assert.equal( component.children.length, 2 );
		assert.equal( component.children[0].tagName , 'INPUT' );
		assert.equal( component.children[1].tagName , 'DIV' );
	});

	it( 'input=false', function(){
		var component = createDatetime({ input: false });
		assert( component );
		assert.equal( component.children.length, 1 );
		assert.equal( component.children[0].tagName , 'DIV' );
	});


	it( 'Date value', function(){
		var component = createDatetime({ value: date }),
			input = component.children[0]
		;
		assert.equal( input.value, strDate );
	});

	it( 'Moment value', function(){
		var component = createDatetime({ value: mDate }),
			input = component.children[0]
		;
		assert.equal( input.value, strDate );
	});

	it( 'String value', function(){
		var component = createDatetime({ value: strDate }),
			input = component.children[0]
		;
		assert.equal( input.value, strDate );
	});

	it( 'Date defaultValue', function(){
		var component = createDatetime({ defaultValue: date }),
			input = component.children[0]
		;
		assert.equal( input.value, strDate );
	});

	it( 'Moment defaultValue', function(){
		var component = createDatetime({ defaultValue: mDate }),
			input = component.children[0]
		;
		assert.equal( input.value, strDate );
	});

	it( 'String defaultValue', function(){
		var component = createDatetime({ defaultValue: strDate }),
			input = component.children[0]
		;
		assert.equal( input.value, strDate );
	});

	it( 'dateFormat', function(){
		var component = createDatetime({ value: date, dateFormat: 'M&D' }),
			input = component.children[0]
		;
		assert.equal( input.value, mDate.format('M&D LT') );
	});

	it( 'dateFormat=false', function(){
		var component = createDatetime({ value: date, dateFormat: false }),
			input = component.children[0],
			view = dt.view()
		;
		assert.equal( input.value, mDate.format('LT') );
		// The view must be the timepicker
		assert.equal( view.className, 'rdtTime' );
		// There must not be a date toggle
		assert.equal( view.querySelectorAll('thead').length, 0);
	});
	it( 'timeFormat', function(){
		var format = 'HH:mm:ss:SSS',
			component = createDatetime({ value: date, timeFormat: format }),
			input = component.children[0]
		;
		assert.equal( input.value, mDate.format('L ' + format) );
	});

	it( 'timeFormat=false', function(){
		var component = createDatetime({ value: date, timeFormat: false }),
			input = component.children[0],
			view = dt.view()
		;
		assert.equal( input.value, mDate.format('L') );
		// The view must be the daypicker
		assert.equal( view.className, 'rdtDays' );
		// There must not be a time toggle
		assert.equal( view.querySelectorAll('.timeToggle').length, 0);
	});

	it( 'viewMode=years', function(){
		var component = createDatetime({ viewMode: 'years' }),
			view = dt.view()
		;

		assert.equal( view.className, 'rdtYears' );
	});

	it( 'viewMode=months', function(){
		var component = createDatetime({ viewMode: 'months' }),
			view = dt.view()
		;

		assert.equal( view.className, 'rdtMonths' );
	});

	it( 'viewMode=time', function(){
		var component = createDatetime({ viewMode: 'time' }),
			view = dt.view()
		;

		assert.equal( view.className, 'rdtTime' );
	});

	it( 'className of type string', function(){
		var component = createDatetime({ className: 'custom' });
		assert.notEqual( component.className.indexOf('custom'), -1 );
	});

		it( 'className of type string array', function(){
				var component = createDatetime({ className: ['custom1', 'custom2'] });
				assert.notEqual( component.className.indexOf('custom1'), -1 );
				assert.notEqual( component.className.indexOf('custom2'), -1 );
		});

	it( 'inputProps', function(){
		var component = createDatetime({ inputProps: { className: 'myInput', type: 'email' } }),
			input = component.children[0]
		;

		assert.equal( input.className, 'myInput' );
		assert.equal( input.type, 'email' );
	});

	it( 'renderDay', function(){
		var props, currentDate, selectedDate,
			component = createDatetime({ value: mDate, renderDay: function( p, current, selected ){
				props = p;
				currentDate = current;
				selectedDate = selected;

				return React.DOM.td( props, 'day' );
			}}),
			view = dt.view()
		;

		// Last day should be 6th of february
		assert.equal( currentDate.day(), 6 );
		assert.equal( currentDate.month(), 1 );

		// The date must be the same
		assert.equal( selectedDate.isSame( mDate ), true );

		// There should be a onClick function in the props
		assert.equal( typeof props.onClick, 'function' );

		// The cell text should be 'day'
		assert.equal( view.querySelector('.rdtDay').innerHTML, 'day' );
	});


	it( 'renderMonth', function(){
		var props, month, year, selectedDate,
			component = createDatetime({ value: mDate, viewMode: 'months', renderMonth: function( p, m, y, selected ){
				props = p;
				month = m;
				year = y;
				selectedDate = selected;

				return React.DOM.td( props, 'month' );
			}}),
			view = dt.view()
		;

		// The date must be the same
		assert.equal( selectedDate.isSame( mDate ), true );

		assert.equal( month, 11 );
		assert.equal( year, 2000 );

		// There should be a onClick function in the props
		assert.equal( typeof props.onClick, 'function' );

		// The cell text should be 'day'
		assert.equal( view.querySelector('.rdtMonth').innerHTML, 'month' );
	});

	it( 'renderYear', function(){
		var props, year, selectedDate,
			component = createDatetime({ value: mDate, viewMode: 'years', renderYear: function( p, y, selected ){
				props = p;
				year = y;
				selectedDate = selected;

				return React.DOM.td( props, 'year' );
			}}),
			view = dt.view()
		;

		// The date must be the same
		assert.equal( selectedDate.isSame( mDate ), true );

		assert.equal( year, 2004 );

		// There should be a onClick function in the props
		assert.equal( typeof props.onClick, 'function' );

		// The cell text should be 'day'
		assert.equal( view.querySelector('.rdtYear').innerHTML, 'year' );
	});

	it( 'Time pickers depends on the time format', function(){
		createDatetime({ viewMode: 'time', timeFormat: "HH:mm:ss:SSS"});
		assert.equal( document.querySelectorAll('.rdtCounter').length, 4 );

		createDatetime({ viewMode: 'time', timeFormat: "HH:mm:ss"});
		assert.equal( document.querySelectorAll('.rdtCounter').length, 3 );

		createDatetime({ viewMode: 'time', timeFormat: "HH:mm"});
		assert.equal( document.querySelectorAll('.rdtCounter').length, 2 );

		createDatetime({ viewMode: 'time', timeFormat: "HH"});
		assert.equal( document.querySelectorAll('.rdtCounter').length, 1 );
	});

	it( 'viewChange', function(){
		createDatetime({viewMode: 'time' });

		assert.equal( dt.view().className, 'rdtTime' );
		ev.click( dt.switcher() );
		assert.equal( dt.view().className, 'rdtDays' );
		ev.click( dt.switcher() );
		assert.equal( dt.view().className, 'rdtMonths' );
		ev.click( dt.switcher() );
		assert.equal( dt.view().className, 'rdtYears' );
	});

	it( 'switch to time', function(){
		createDatetime({});
		assert.equal( dt.view().className, 'rdtDays' );
		ev.click( dt.timeSwitcher() );
		assert.equal( dt.view().className, 'rdtTime' );
	})

	it( 'selectYear', function(){
		createDatetime({ viewMode: 'years', defaultValue: date });
		assert.equal( dt.view().className, 'rdtYears' );
		assert.equal( dt.switcher().innerHTML, '1993 - 2004' );

		// First year is 1993
		ev.click( dt.year() );
		assert.equal( dt.view().className, 'rdtMonths' );
		assert.equal( dt.switcher().innerHTML, '1993' );
	});

	it( 'forward year range', function(){
		createDatetime({ viewMode: 'years', defaultValue: date });

		assert.equal( dt.switcher().innerHTML, '1993 - 2004' );
		ev.click( dt.next() );
		assert.equal( dt.switcher().innerHTML, '2005 - 2016' );
		ev.click( dt.next() );
		assert.equal( dt.switcher().innerHTML, '2017 - 2028' );
	});


	it( 'back year range', function(){
		createDatetime({ viewMode: 'years', defaultValue: date });

		assert.equal( dt.switcher().innerHTML, '1993 - 2004' );
		ev.click( dt.prev() );
		assert.equal( dt.switcher().innerHTML, '1981 - 1992' );
		ev.click( dt.prev() );
		assert.equal( dt.switcher().innerHTML, '1969 - 1980' );
	});

	it( 'selectMonth', function(){
		createDatetime({ viewMode: 'months', defaultValue: date });
		assert.equal( dt.view().className, 'rdtMonths' );
		assert.equal( dt.switcher().innerHTML, '2000' );

		ev.click( dt.month(1) );
		assert.equal( dt.view().className, 'rdtDays' );
		assert.equal( dt.switcher().getAttribute('data-value'), "1" );
	});

	it( 'increase year', function(){
		createDatetime({ viewMode: 'months', defaultValue: date });

		assert.equal( dt.switcher().getAttribute('data-value'), '2000' );
		ev.click( dt.next() );
		assert.equal( dt.switcher().getAttribute('data-value'), '2001' );
		ev.click( dt.next() );
		assert.equal( dt.switcher().getAttribute('data-value'), '2002' );
	});


	it( 'decrease year', function(){
		createDatetime({ viewMode: 'months', defaultValue: date });

		assert.equal( dt.switcher().getAttribute('data-value'), '2000' );
		ev.click( dt.prev() );
		assert.equal( dt.switcher().getAttribute('data-value'), '1999' );
		ev.click( dt.prev() );
		assert.equal( dt.switcher().getAttribute('data-value'), '1998' );
	});

	it( 'increase month', function(){
		createDatetime({ defaultValue: date });

		assert.equal( dt.switcher().getAttribute('data-value'), '0' );
		ev.click( dt.next() );
		assert.equal( dt.switcher().getAttribute('data-value'), '1' );
		ev.click( dt.next() );
		assert.equal( dt.switcher().getAttribute('data-value'), '2' );
	});

	it( 'decrease month', function(){
		createDatetime({ defaultValue: date });

		assert.equal( dt.switcher().getAttribute('data-value'), '0' );
		ev.click( dt.prev() );
		assert.equal( dt.switcher().getAttribute('data-value'), '11' );
		ev.click( dt.prev() );
		assert.equal( dt.switcher().getAttribute('data-value'), '10' );
	});

	it( 'open picker', function(){
		createDatetime({});
		assert.equal(dt.dt().className.indexOf('rdtOpen'), -1);
		ev.focus( dt.input() );
		assert.notEqual(dt.dt().className.indexOf('rdtOpen'), -1);
	});

	it( 'onSelect', function( done ){
		createDatetime({ defaultValue: date, onChange: function( selected ){
			assert.equal( selected.date(), 2 );
			assert.equal( selected.month(), mDate.month() );
			assert.equal( selected.year(), mDate.year() );
			done();
		}});

		ev.click( dt.day( '02' ) );
	});

	it( 'multiple onSelect', function( done ){
		var i = 0;
		createDatetime({ defaultValue: date, onChange: function( selected ){
			i++;
			if( i > 2 ){
				assert.equal( selected.date(), 4 );
				assert.equal( selected.month(), mDate.month() );
				assert.equal( selected.year(), mDate.year() );
				done();
			}
		}});

		ev.click( dt.day( '02' ) );
		ev.click( dt.day( '03' ) );
		ev.click( dt.day( '04' ) );
	});

	it( 'onFocus', function(){
		var focus = false;
		createDatetime({ value: date, onFocus: function( selected ){
			focus = true;
		}});

		ev.focus( dt.input() );
		assert.equal( focus, true );
	});

	it( 'onBlur', function(){
		createDatetime({ value: date, onBlur: function( selected ){
			assert.equal( dt.dt().className.indexOf( 'rdtOpen' ), -1 );
			assert.equal( selected.date(), mDate.date() );
			assert.equal( selected.month(), mDate.month() );
			assert.equal( selected.year(), mDate.year() );
			done();
		}});

		assert.equal( dt.dt().className.indexOf( 'rdtOpen' ), -1 );
		ev.focus( dt.input() );
		assert.notEqual( dt.dt().className.indexOf( 'rdtOpen' ), -1 );
		trigger( 'click', document.body );
	});

	it( 'closeOnTab:true', function(){
		createDatetime({ value: date });

		assert.equal( dt.dt().className.indexOf( 'rdtOpen' ), -1 );
		ev.focus( dt.input() );
		assert.notEqual( dt.dt().className.indexOf( 'rdtOpen' ), -1 );
		TestUtils.Simulate.keyDown(dt.input(), {key: "Tab", keyCode: 9, which: 9});
		assert.equal( dt.dt().className.indexOf( 'rdtOpen' ), -1 );
		trigger( 'click', document.body );
	});

	it( 'closeOnTab:false', function(){
		createDatetime({ value: date, closeOnTab: false });

		assert.equal( dt.dt().className.indexOf( 'rdtOpen' ), -1 );
		ev.focus( dt.input() );
		assert.notEqual( dt.dt().className.indexOf( 'rdtOpen' ), -1 );
		TestUtils.Simulate.keyDown(dt.input(), {key: "Tab", keyCode: 9, which: 9});
		assert.notEqual( dt.dt().className.indexOf( 'rdtOpen' ), -1 );
		trigger( 'click', document.body );
	});

	describe( 'pressing ESC key', function(){
		function runEscTestsWithProps(props) {
			createDatetime(props);

			assert.equal( dt.dt().className.indexOf( 'rdtOpen' ), -1 );
			ev.focus( dt.input() );
			assert.notEqual( dt.dt().className.indexOf( 'rdtOpen' ), -1 );
			TestUtils.Simulate.keyDown(dt.view(), {key: "Escape", keyCode: 27, which: 27});
			assert.equal( dt.dt().className.indexOf( 'rdtOpen' ), -1 );
		}

		describe( 'when input is writable', function(){
			it( 'returns to the input and closes the datepicker', function() {
				runEscTestsWithProps({});
				assert.equal( document.activeElement.tagName, 'INPUT' );
				trigger( 'click', document.body );
			});
		});

		describe( 'when input is read-only', function(){
			it( 'closes the datepicker without focusing the input', function() {
				runEscTestsWithProps({ inputProps: { readOnly: true } });
				assert.notEqual( document.activeElement.tagName, 'INPUT' );
				trigger( 'click', document.body );
			});
		});
	});

	it( 'increase time', function( done ){
		var i = 0;
		createDatetime({ timeFormat: "HH:mm:ss:SSS", viewMode: 'time', defaultValue: date, onChange: function( selected ){
			i++;
			if( i > 2 ){
				assert.equal( selected.hour(), 3 );
				assert.equal( selected.minute(), 3 );
				assert.equal( selected.second(), 3 );
				done();
			}
		}});

		trigger( 'mousedown', dt.timeUp( 0 ) );
		trigger('mouseup', document.body );
		assert.equal( dt.hour().innerHTML, 3 );
		trigger( 'mousedown', dt.timeUp( 1 ) );
		trigger( 'mouseup', dt.timeUp( 1 ) );
		assert.equal( dt.minute().innerHTML, 3 );
		trigger( 'mousedown', dt.timeUp( 2 ) );
		trigger( 'mouseup', dt.timeUp( 2 ) );
		assert.equal( dt.second().innerHTML, 3 );
	});

	it( 'decrease time', function( done ){
		var i = 0;
		createDatetime({ timeFormat: "HH:mm:ss:SSS", viewMode: 'time', defaultValue: date, onChange: function( selected ){
			i++;
			if( i > 2 ){
				assert.equal( selected.hour(), 1 );
				assert.equal( selected.minute(), 1 );
				assert.equal( selected.second(), 1 );
				done();
			}
		}});

		trigger('mousedown', dt.timeDown( 0 ) );
		trigger('mouseup', dt.timeDown( 0 ) );
		assert.equal( dt.hour().innerHTML, 1 );
		trigger('mousedown', dt.timeDown( 1 ) );
		trigger('mouseup', dt.timeDown( 1 ) );
		assert.equal( dt.minute().innerHTML, 1 );
		trigger('mousedown', dt.timeDown( 2 ) );
		trigger('mouseup', dt.timeDown( 2 ) );
		assert.equal( dt.second().innerHTML, 1 );
	});

	it( 'long increase time', function( done ){
		var i = 0;
		createDatetime({ timeFormat: "HH:mm:ss:SSS", viewMode: 'time', defaultValue: date});

		trigger( 'mousedown', dt.timeUp( 0 ) );
		setTimeout( function(){
			trigger('mouseup', document.body );
			assert.notEqual( dt.hour().innerHTML, 2 );
			assert.notEqual( dt.hour().innerHTML, 3 );
			done();
		}, 920 );
	});

	it( 'long decrease time', function( done ){
		var i = 0;
		createDatetime({ timeFormat: "HH:mm:ss:SSS", viewMode: 'time', defaultValue: date});

		trigger( 'mousedown', dt.timeDown( 0 ) );
		setTimeout( function(){
			trigger('mouseup', document.body );
			assert.notEqual( dt.hour().innerHTML, 1 );
			assert.notEqual( dt.hour().innerHTML, 0 );
			done();
		}, 920 );
	});

	it( 'increase time with timeConstraints', function( done ){
		var i = 0;
		createDatetime({ timeFormat: "HH:mm:ss:SSS", viewMode: 'time', defaultValue: date, onChange: function( selected ){
			i++;
			if( i > 2 ){
				assert.equal( selected.minute(), 17 );
				assert.equal( selected.second(), 3 );
				done();
			}
		}, timeConstraints: { hours: { max: 6, step: 8 }, minutes: { step: 15 }}});

		trigger( 'mousedown', dt.timeUp( 0 ) );
		trigger('mouseup', document.body );
		assert.equal( dt.hour().innerHTML, 3 );
		trigger( 'mousedown', dt.timeUp( 1 ) );
		trigger( 'mouseup', dt.timeUp( 1 ) );
		assert.equal( dt.minute().innerHTML, 17 );
		trigger( 'mousedown', dt.timeUp( 2 ) );
		trigger( 'mouseup', dt.timeUp( 2 ) );
		assert.equal( dt.second().innerHTML, 3 );
	});

	it( 'decrease time with timeConstraints', function( done ){
		createDatetime({ timeFormat: "HH:mm:ss:SSS", viewMode: 'time', defaultValue: date, onChange: function( selected ){
			assert.equal( selected.minute(), 47 );
			done();
		}, timeConstraints: { minutes: { step: 15 }}});

		trigger( 'mousedown', dt.timeDown( 1 ) );
		trigger( 'mouseup', dt.timeDown( 1 ) );
		assert.equal( dt.minute().innerHTML, 47 );
	});

	it( 'invalid input value', function( done ){
		createDatetime({ defaultValue: 'luis', onChange: function( updated ){
			assert.equal( mDate.format('L LT'), updated.format('L LT') );
			done();
		}});

		assert.equal( dt.input().value, 'luis' );
		dt.input().value = strDate;
		ev.change( dt.input() );
	});

	it( 'invalid moment object as input value', function( done ){
		var value = moment(null);
		createDatetime({ value: value, onChange: function( updated ){
			assert.equal( mDate.format('L LT'), updated.format('L LT') );
			done();
		}});

		assert.equal( dt.input().value, '' );
		dt.input().value = strDate;
		ev.change( dt.input() );
	});

	it( 'delete input value', function( done ){
		createDatetime({ defaultValue: date, onChange: function( date ){
			assert.equal( date, '' );
			done();
		}});
		dt.input().value = '';
		ev.change( dt.input() );
	});

	it( 'strictParsing=true', function( done ){
		var invalidStrDate = strDate + 'x';
		createDatetime({ defaultValue: '', strictParsing: true, onChange: function( updated ){
			assert.equal( updated, invalidStrDate);
			done();
		}});

		dt.input().value = invalidStrDate;
		ev.change( dt.input() );
	});

	it( 'strictParsing=false', function( done ){
		var invalidStrDate = strDate + 'x';
		createDatetime({ defaultValue: '', strictParsing: false, onChange: function( updated ){
			assert.equal( mDate.format('L LT'), updated.format('L LT') );
			done();
		}});

		dt.input().value = invalidStrDate;
		ev.change( dt.input() );
	});

	describe( 'keyboard navigation', function(){
		function getTitle() {
			return dt.switcher().innerHTML;
		}

		function getActiveLabel() {
			return dt.active().innerHTML;
		}

		function triggerKeyDown(element, key, ctrl) {
			var keyCodes = {
				enter: 13,
				space: 32,
				pageup: 33,
				pagedown: 34,
				end: 35,
				home: 36,
				left: 37,
				up: 38,
				right: 39,
				down: 40,
				esc: 27
			};

			var props = { keyCode: keyCodes[key], which: keyCodes[key] };
			if (ctrl) {
				props.ctrlKey = true;
			}

			TestUtils.Simulate.keyDown(element, props);
		}

		beforeEach(function(){
			var date = new Date('September 30, 2010 15:30:00');
			createDatetime({
				defaultValue: date,
				monthColumns: 3,
				yearColumns: 5,
				yearRows: 4
			});
		});

		describe( 'day mode', function(){
			it( 'will be able to activate previous day', function(){
				triggerKeyDown(dt.view(), 'left');
				assert.strictEqual(getActiveLabel(), '29');
			});

			it( 'will be able to select with enter', function(){
				triggerKeyDown(dt.view(), 'left');
				triggerKeyDown(dt.view(), 'enter');
				assert.equal(dt.input().value, '09/29/2010 3:30 PM');
			});

			it( 'will be able to select with space', function(){
				triggerKeyDown(dt.view(), 'left');
				triggerKeyDown(dt.view(), 'space');
				assert.equal(dt.input().value, '09/29/2010 3:30 PM');
			});

			it( 'will be able to activate next day', function(){
				triggerKeyDown(dt.view(), 'right');
				assert.strictEqual(getActiveLabel(), '01');
				assert.strictEqual(getTitle(), 'October 2010');
			});

			it( 'will be able to activate same day in previous week', function(){
				triggerKeyDown(dt.view(), 'up');
				assert.strictEqual(getActiveLabel(), '23');
			});

			it( 'will be able to activate same day in next week', function(){
				triggerKeyDown(dt.view(), 'down');
				assert.strictEqual(getActiveLabel(), '07');
				assert.strictEqual(getTitle(), 'October 2010');
			});

			it( 'will be able to activate same date in previous month', function(){
				triggerKeyDown(dt.view(), 'pageup');
				assert.strictEqual(getActiveLabel(), '30');
				assert.strictEqual(getTitle(), 'August 2010');
			});

			it( 'will be able to activate same date in next month', function(){
				triggerKeyDown(dt.view(), 'pagedown');
				assert.strictEqual(getActiveLabel(), '30');
				assert.strictEqual(getTitle(), 'October 2010');
			});

			it( 'will be able to activate first day of the month', function(){
				triggerKeyDown(dt.view(), 'home');
				assert.strictEqual(getActiveLabel(), '01');
				assert.strictEqual(getTitle(), 'September 2010');
			});

			it( 'will be able to activate last day of the month', function(){
				dt.input().value = new Date('September 1, 2010 15:30:00');
				triggerKeyDown(dt.view(), 'end');
				assert.strictEqual(getActiveLabel(), '30');
				assert.strictEqual(getTitle(), 'September 2010');
			});

			it( 'will be able to move to month mode', function(){
				triggerKeyDown(dt.view(), 'up', true);
				assert.strictEqual(getActiveLabel(), 'September');
				assert.strictEqual(getTitle(), '2010');
			});

			it( 'will not respond when trying to move to lower mode', function(){
				triggerKeyDown(dt.view(), 'down', true);
				assert.strictEqual(getActiveLabel(), '30');
				assert.strictEqual(getTitle(), 'September 2010');
			});
		});

		describe( 'month mode', function(){
			beforeEach(function(){
				triggerKeyDown(dt.view(), 'up', true);
			});

			it( 'will be able to activate previous month', function(){
				triggerKeyDown(dt.view(), 'left');
				assert.strictEqual(getActiveLabel(), 'August');
			});

			it( 'will be able to activate next month', function(){
				triggerKeyDown(dt.view(), 'right');
				assert.strictEqual(getActiveLabel(), 'October');
			});

			it( 'will be able to activate same month in previous row', function(){
				triggerKeyDown(dt.view(), 'up');
				assert.strictEqual(getActiveLabel(), 'June');
			});

			it( 'will be able to activate same month in next row', function(){
				triggerKeyDown(dt.view(), 'down');
				assert.strictEqual(getActiveLabel(), 'December');
			});

			it( 'will be able to activate same date in previous year', function(){
				triggerKeyDown(dt.view(), 'pageup');
				assert.strictEqual(getActiveLabel(), 'September');
				assert.strictEqual(getTitle(), '2009');
			});

			it( 'will be able to activate same date in next year', function(){
				triggerKeyDown(dt.view(), 'pagedown');
				assert.strictEqual(getActiveLabel(), 'September');
				assert.strictEqual(getTitle(), '2011');
			});

			it( 'will be able to activate first month of the year', function(){
				triggerKeyDown(dt.view(), 'home');
				assert.strictEqual(getActiveLabel(), 'January');
				assert.strictEqual(getTitle(), '2010');
			});

			it( 'will be able to activate last month of the year', function(){
				triggerKeyDown(dt.view(), 'end');
				assert.strictEqual(getActiveLabel(), 'December');
				assert.strictEqual(getTitle(), '2010');
			});

			it( 'will be able to move to year mode', function(){
				triggerKeyDown(dt.view(), 'up', true);
				assert.strictEqual(getActiveLabel(), '2010');
				assert.strictEqual(getTitle(), '2001 - 2020');
			});

			it( 'will be able to move to day mode', function(){
				triggerKeyDown(dt.view(), 'down', true);
				assert.strictEqual(getActiveLabel(), '30');
				assert.strictEqual(getTitle(), 'September 2010');
			});

			it( 'will move to day mode when selecting', function(){
				triggerKeyDown(dt.view(), 'left', true);
				triggerKeyDown(dt.view(), 'enter', true);
				assert.strictEqual(getActiveLabel(), '30');
				assert.strictEqual(getTitle(), 'August 2010');
				assert.equal(dt.input().value, '09/30/2010 3:30 PM');
			});
		});

		describe( 'year mode', function(){
			beforeEach(function(){
				triggerKeyDown(dt.view(), 'up', true);
				triggerKeyDown(dt.view(), 'up', true);
			});

			it( 'will be able to activate previous year', function(){
				triggerKeyDown(dt.view(), 'left');
				assert.strictEqual(getActiveLabel(), '2009');
			});

			it( 'will be able to activate next year', function(){
				triggerKeyDown(dt.view(), 'right');
				assert.strictEqual(getActiveLabel(), '2011');
			});

			it( 'will be able to activate same year in previous row', function(){
				triggerKeyDown(dt.view(), 'up');
				assert.strictEqual(getActiveLabel(), '2005');
			});

			it( 'will be able to activate same year in next row', function(){
				triggerKeyDown(dt.view(), 'down');
				assert.strictEqual(getActiveLabel(), '2015');
			});

			it( 'will be able to activate same date in previous view', function(){
				triggerKeyDown(dt.view(), 'pageup');
				assert.strictEqual(getActiveLabel(), '1990');
			});

			it( 'will be able to activate same date in next view', function(){
				triggerKeyDown(dt.view(), 'pagedown');
				assert.strictEqual(getActiveLabel(), '2030');
			});

			it( 'will be able to activate first year of the year', function(){
				triggerKeyDown(dt.view(), 'home');
				assert.strictEqual(getActiveLabel(), '2001');
			});

			it( 'will be able to activate last year of the year', function(){
				triggerKeyDown(dt.view(), 'end');
				assert.strictEqual(getActiveLabel(), '2020');
			});

			it( 'will not respond when trying to move to upper mode', function(){
				triggerKeyDown(dt.view(), 'up', true);
				assert.strictEqual(getTitle(), '2001 - 2020');
			});

			it( 'will be able to move to month mode', function(){
				triggerKeyDown(dt.view(), 'down', true);
				assert.strictEqual(getActiveLabel(), 'September');
				assert.strictEqual(getTitle(), '2010');
			});

			it( 'will move to month mode when selecting', function(){
				triggerKeyDown(dt.view(), 'left', true);
				triggerKeyDown(dt.view(), 'enter', true);
				assert.strictEqual(getActiveLabel(), 'September');
				assert.strictEqual(getTitle(), '2009');
				assert.equal(dt.input().value, '09/30/2010 3:30 PM');
			});
		});
	});
});
