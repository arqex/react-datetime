'use strict';

var React = require('react');

var DOM = React.DOM;
var DateTimePickerTime = React.createClass({
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
		return DOM.div({ key: type, className: 'rdtCounter'}, [
			DOM.button({ key:'up', className: 'btn', onMouseDown: this.onStartClicking( 'increase', type ) }, '▲' ),
			DOM.div({ key:'c', className: 'rdtCount' }, this.state[ type ] ),
			DOM.button({ key:'do', className: 'btn', onMouseDown: this.onStartClicking( 'decrease', type ) }, '▼' )
		]);
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
	updateMilli: function( e ){
		var milli = parseInt( e.target.value );
		if( milli == e.target.value && milli >= 0 && milli < 1000 ){
			this.props.setTime( 'milliseconds', milli );
			this.setState({ milliseconds: milli });
		}
	},
	renderHeader: function(){
		if( !this.props.dateFormat )
			return '';

		return DOM.thead({ key: 'h'}, DOM.tr({},
			DOM.th( {colSpan: 4, onClick: this.props.showView('days')}, this.props.selectedDate.format( this.props.dateFormat ) )
		));
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
				},80);
			}, 500);

			document.body.addEventListener('mouseup', function(){
				clearTimeout( me.timer );
				clearInterval( me.increaseTimer );
				me.props.setTime( type, me.state[ type ] );
			});
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
