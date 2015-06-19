'use strict';

var React = require('react');

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
		return (
			<div className="dtCounter">
				<div className="btn" onMouseDown={ this.onStartClicking( 'increase', type ) }>&#x25B2;</div>
				<div className="dtCount">{ this.state[ type ] }</div>
				<div className="btn" onMouseDown={ this.onStartClicking( 'decrease', type ) }>&#x25BC;</div>
			</div>
		)
	},
  render: function() {
  	var me = this,
  		counters = []
  	;

  	this.state.counters.forEach( function(c){
  		if( counters.length )
  			counters.push( <div className="dtCounterSeparator">:</div> );
  		counters.push( me.renderCounter( c ) );
  	});
  	if( this.state.counters.length == 3 && this.props.timeFormat.indexOf('S') != -1 ){
  		counters.push( <div className="dtCounterSeparator">:</div> );
  		counters.push( <div className="dtCounter dtMilli"><input value={ this.state.milliseconds } /></div>);
  	}
  	return (
  		<div className="timepicker">
		   <div className="timepicker-picker">
		     <table className="table-condensed">
		     	{ this.renderHeader() }
		       <tbody>
		         <tr><td><div className="dtCounters">{ counters }</div></td></tr>
		        </tbody>
		      </table>
		   </div>
		</div>
  	);
  },
  renderHeader: function(){
  	if( !this.props.dateFormat )
  		return '';

  	return (
  		<thead><tr><th colSpan="4" onClick={ this.props.showView('days') }>{ this.props.selectedDate.format( this.props.dateFormat ) }</th></tr></thead>
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
