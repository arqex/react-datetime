'use strict';

var React = require('react'),
	assign = require('object-assign');

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

		if( format.indexOf('H') != -1 || format.indexOf('h') != -1 ){
			counters.push('hours');
			if( format.indexOf('m') != -1 ){
				counters.push('minutes');
				if( format.indexOf('s') != -1 ){
					counters.push('seconds');
				}
			}
		}

		var daypart = false;
		if( this.props.timeFormat.indexOf(' A') != -1  && this.state != null ){
			daypart = ( this.state.hours > 12 ) ? 'PM' : 'AM';
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
			if (type === 'hours' && this.props.timeFormat.indexOf(' A') != -1 && value > 12) {
				value = value - 12;
			}
			return DOM.div({ key: type, className: 'rdtCounter'}, [
				DOM.span({ key:'up', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'increase', type ) }, '▲' ),
				DOM.div({ key:'c', className: 'rdtCount' }, value ),
				DOM.span({ key:'do', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'decrease', type ) }, '▼' )
			]);
		}
		return '';
	},
	render: function() {
		var me = this,
			counters = []
		;

		this.state.counters.forEach( function(c){
			if( counters.length )
				counters.push( DOM.div( {key: 'sep' + counters.length, className: 'rdtCounterSeparator' }, ':' ));
			counters.push( me.renderCounter( c ) );
		});


		if (this.state.daypart !== false) {
			counters.push(DOM.div({ key: this.state.daypart, className: 'rdtDayPart'}, this.state.daypart ));
		}

		if( this.state.counters.length == 3 && this.props.timeFormat.indexOf('S') != -1 ){
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
		['hours', 'minutes', 'seconds', 'milliseconds'].forEach(function(type) {
			assign(me.settings[type], me.props[type]);
		});
	},
	componentWillReceiveProps: function( nextProps, nextState ){
		this.setState( this.calculateState( nextProps ) );
	},
	updateMilli: function( e ){
		var milli = parseInt( e.target.value );
		if( milli == e.target.value && milli >= 0 && milli < 1000 ){
			this.props.setTime( 'milliseconds', milli );
			this.setState({ milliseconds: milli });
		}
	},
	renderHeader: function(){
		if( !this.props.dateFormat )
			return null;

		var date = this.props.selectedDate || this.props.viewDate;
		return DOM.thead({ key: 'h'}, DOM.tr({},
			DOM.th( {className: 'rdtSwitch', colSpan: 4, onClick: this.props.showView('days')}, date.format( this.props.dateFormat ) )
		));
	},
	onStartClicking: function( action, type ){
		var me = this,
			update = {},
			value = this.state[ type ]
		;


		return function(){
			var update = {};
			update[ type ] = me[ action ]( type );
			me.setState( update );

			me.timer = setTimeout( function(){
				me.increaseTimer = setInterval( function(){
					update[ type ] = me[ action ]( type );
					me.setState( update );
				},70);
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
	settings: {
		hours: {
			min: 0,
			max: 23,
			pad: 1,
			step: 1,
		},
		minutes: {
			min: 0,
			max: 59,
			pad: 2,
			step: 1,
		},
		seconds: {
			min: 0,
			max: 59,
			pad: 2,
			step: 1,
		},
		milliseconds: {
			min: 0,
			max: 999,
			pad: 3,
			step: 1,
		},
	},
	increase: function( type ){
		var value = parseInt(this.state[ type ]) + this.settings[ type ].step;
		if( value > this.settings[ type ].max )
			value = this.settings[ type ].min;
		return this.pad( type, value );
	},
	decrease: function( type ){
		var value = parseInt(this.state[ type ]) - this.settings[ type ].step;
		if( value < this.settings[ type ].min )
			value = this.settings[ type ].max;
		return this.pad( type, value );
	},
	pad: function( type, value ){
		var str = value + '';
		while( str.length < this.settings[ type ].pad )
			str = '0' + str;
		return str;
	}
});

module.exports = DateTimePickerTime;
