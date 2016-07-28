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
		var years = document.querySelectorAll('.rdtYear');
		return years[ n || 0 ];
	},
	month: function( n ){
		var months = document.querySelectorAll('.rdtMonth');
		return months[ n || 0 ];
	},
	day: function( n ){
		return document.querySelector('.rdtDay[data-value="' + n + '"]');
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

	it( 'className', function(){
		var component = createDatetime({ className: 'custom' });
		assert.notEqual( component.className.indexOf('custom'), -1 );
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

		assert.equal( year, 2010 );

		// There should be a onClick function in the props
		assert.equal( typeof props.onClick, 'function' );

		// The cell text should be 'day'
		assert.equal( view.querySelector('.rdtYear').innerHTML, 'year' );
	});

	it( 'Time pickers depends on the time format', function() {
		createDatetime({ viewMode: 'time', timeFormat: "HH:mm:ss:SSS"});
		assert.equal( document.querySelectorAll('.rdtCounter').length, 4 );

		createDatetime({ viewMode: 'time', timeFormat: "HH:mm:ss"});
		assert.equal( document.querySelectorAll('.rdtCounter').length, 3 );

		createDatetime({ viewMode: 'time', timeFormat: "HH:mm"});
		assert.equal( document.querySelectorAll('.rdtCounter').length, 2 );

		createDatetime({ viewMode: 'time', timeFormat: "HH"});
		assert.equal( document.querySelectorAll('.rdtCounter').length, 1 );
	});

	it( 'viewChange', function() {
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
		assert.equal( dt.switcher().innerHTML, '2000-2009' );

		// First year is 1999
		ev.click( dt.year() );
		assert.equal( dt.view().className, 'rdtMonths' );
		assert.equal( dt.switcher().innerHTML, '1999' );
	});

	it( 'increase decade', function(){
		createDatetime({ viewMode: 'years', defaultValue: date });

		assert.equal( dt.switcher().innerHTML, '2000-2009' );
		ev.click( dt.next() );
		assert.equal( dt.switcher().innerHTML, '2010-2019' );
		ev.click( dt.next() );
		assert.equal( dt.switcher().innerHTML, '2020-2029' );
	});


	it( 'decrease decade', function(){
		createDatetime({ viewMode: 'years', defaultValue: date });

		assert.equal( dt.switcher().innerHTML, '2000-2009' );
		ev.click( dt.prev() );
		assert.equal( dt.switcher().innerHTML, '1990-1999' );
		ev.click( dt.prev() );
		assert.equal( dt.switcher().innerHTML, '1980-1989' );
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

		ev.click( dt.day( 2 ) );
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

		ev.click( dt.day( 2 ) );
		ev.click( dt.day( 3 ) );
		ev.click( dt.day( 4 ) );
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
});
