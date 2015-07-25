// Create the dom before requiring react
var DOM = require( './testdom');
DOM();

React = require('react');

var ReactAddons = require('react/addons'),
	Utils = React.addons.TestUtils,
	Datetime = require('../DateTime'),
	assert = require('assert'),
	moment = require('moment')
;

// Needs to receive react to work in Travis CI
var createDatetime = function( r, props ){
	document.body.innerHTML = '';

	r.render(
		r.createElement( Datetime, props ),
		document.body
	);

	return document.body.children[0];
};

var date = new Date( 2000, 0, 15 ),
	mDate = moment( date ),
	strDate = mDate.format('L') + ' ' + mDate.format('LT')
;

describe( 'Datetime', function(){
	it( 'Create Datetime', function(){
		var component = createDatetime( React, {});
		assert( component );
		assert.equal( component.children.length, 2 );
		assert.equal( component.children[0].tagName , 'INPUT' );
		assert.equal( component.children[1].tagName , 'DIV' );
	});

	it( 'input=false', function(){
		var component = createDatetime( React, { input: false });
		assert( component );
		assert.equal( component.children.length, 1 );
		assert.equal( component.children[0].tagName , 'DIV' );
	});

	it( 'Date value', function(){
		var component = createDatetime( React, { value: date }),
			input = component.children[0]
		;
		assert.equal( input.value, strDate );
	});

	it( 'Moment value', function(){
		var component = createDatetime( React, { value: mDate }),
			input = component.children[0]
		;
		assert.equal( input.value, strDate );
	});

	it( 'String value', function(){
		var component = createDatetime( React, { value: strDate }),
			input = component.children[0]
		;
		assert.equal( input.value, strDate );
	});

	it( 'Date defaultValue', function(){
		var component = createDatetime( React, { defaultValue: date }),
			input = component.children[0]
		;
		assert.equal( input.value, strDate );
	});

	it( 'Moment defaultValue', function(){
		var component = createDatetime( React, { defaultValue: mDate }),
			input = component.children[0]
		;
		assert.equal( input.value, strDate );
	});

	it( 'String defaultValue', function(){
		var component = createDatetime( React, { defaultValue: strDate }),
			input = component.children[0]
		;
		assert.equal( input.value, strDate );
	});

	it( 'dateFormat', function(){
		var component = createDatetime( React, { value: date, dateFormat: 'M&D' }),
			input = component.children[0]
		;
		assert.equal( input.value, mDate.format('M&D LT') );
	});

	it( 'dateFormat=false', function(){
		var component = createDatetime( React, { value: date, dateFormat: false }),
			input = component.children[0],
			view = component.children[1].children[0]
		;
		assert.equal( input.value, mDate.format('LT') );
		// The view must be the timepicker
		assert.equal( view.className, 'rdtTime' );
		// There must not be a date toggle
		assert.equal( view.querySelectorAll('thead').length, 0);
	});

	it( 'timeFormat', function(){
		var format = 'HH:mm:ss:SSS',
			component = createDatetime( React, { value: date, timeFormat: format }),
			input = component.children[0]
		;
		assert.equal( input.value, mDate.format('L ' + format) );
	});

	it( 'timeFormat=false', function(){
		var component = createDatetime( React, { value: date, timeFormat: false }),
			input = component.children[0],
			view = component.children[1].children[0]
		;
		assert.equal( input.value, mDate.format('L') );
		// The view must be the daypicker
		assert.equal( view.className, 'rdtDays' );
		// There must not be a time toggle
		assert.equal( view.querySelectorAll('.timeToggle').length, 0);
	});

	it( 'viewMode=years', function(){
		var component = createDatetime( React, { viewMode: 'years' }),
			view = component.children[1].children[0]
		;

		assert.equal( view.className, 'rdtYears' );
	});

	it( 'viewMode=months', function(){
		var component = createDatetime( React, { viewMode: 'months' }),
			view = component.children[1].children[0]
		;

		assert.equal( view.className, 'rdtMonths' );
	});

	it( 'viewMode=time', function(){
		var component = createDatetime( React, { viewMode: 'time' }),
			view = component.children[1].children[0]
		;

		assert.equal( view.className, 'rdtTime' );
	});

	it( 'className', function(){
		var component = createDatetime( React, { className: 'custom' });
		assert.notEqual( component.className.indexOf('custom'), -1 );
	});

	it( 'inputProps', function(){
		var component = createDatetime( React, { inputProps: { className: 'myInput', type: 'email' } }),
			input = component.children[0]
		;

		assert.equal( input.className, 'myInput' );
		assert.equal( input.type, 'email' );
	});

	it( 'renderDay', function(){
		var props, currentDate, selectedDate,
			component = createDatetime( React, { value: mDate, renderDay: function( p, current, selected ){
				props = p;
				currentDate = current;
				selectedDate = selected;

				return React.DOM.td( props, 'day' );
			}}),
			view = component.children[1].children[0]
		;

		// Last day should be 6th of february
		assert.equal( currentDate.day(), 6 );
		assert.equal( currentDate.month(), 1 );

		// The date must be the same
		assert.equal( selectedDate.isSame( mDate ), true );

		// There should be a onClick function in the props
		assert.equal( typeof props.onClick, 'function' );

		// The cell text should be 'day'
		assert.equal( view.querySelector('.day').innerHTML, 'day' );
	});


	it( 'renderMonth', function(){
		var props, month, year, selectedDate,
			component = createDatetime( React, { value: mDate, viewMode: 'months', renderMonth: function( p, m, y, selected ){
				props = p;
				month = m;
				year = y;
				selectedDate = selected;

				return React.DOM.td( props, 'month' );
			}}),
			view = component.children[1].children[0]
		;

		// The date must be the same
		assert.equal( selectedDate.isSame( mDate ), true );

		assert.equal( month, 11 );
		assert.equal( year, 2000 );

		// There should be a onClick function in the props
		assert.equal( typeof props.onClick, 'function' );

		// The cell text should be 'day'
		assert.equal( view.querySelector('.month').innerHTML, 'month' );
	});

	it( 'renderYear', function(){
		var props, year, selectedDate,
			component = createDatetime( React, { value: mDate, viewMode: 'years', renderYear: function( p, y, selected ){
				props = p;
				year = y;
				selectedDate = selected;

				return React.DOM.td( props, 'year' );
			}}),
			view = component.children[1].children[0]
		;

		// The date must be the same
		assert.equal( selectedDate.isSame( mDate ), true );

		assert.equal( year, 2010 );

		// There should be a onClick function in the props
		assert.equal( typeof props.onClick, 'function' );

		// The cell text should be 'day'
		assert.equal( view.querySelector('.year').innerHTML, 'year' );
	});
});

