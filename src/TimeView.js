'use strict';

var React = require('react'),
	assign = require('object-assign'),
	moment = require('moment')
;

var DOM = React.DOM;
var DateTimePickerTime = React.createClass({
	getInitialState: function() {
		return this.calculateState( this.props );
	},

	calculateState: function( props ) {
		var date = props.selectedDate || props.viewDate,
			format = props.timeFormat,
			counters = []
		;

		if ( format.toLowerCase().indexOf('h') !== -1 ) {
			counters.push('hours');
			if ( format.indexOf('m') !== -1 ) {
				counters.push('minutes');
				if ( format.indexOf('s') !== -1 ) {
					counters.push('seconds');
				}
			}
		}

		var daypart = false;
		if ( this.state !== null && this.props.timeFormat.toLowerCase().indexOf( ' a' ) !== -1 ) {
			if ( this.props.timeFormat.indexOf( ' A' ) !== -1 ) {
				daypart = ( this.state.hours >= 12 ) ? 'PM' : 'AM';
			} else {
				daypart = ( this.state.hours >= 12 ) ? 'pm' : 'am';
			}
		}

		return {
			hours: date.format( 'H' ),
			minutes: date.format( 'mm' ),
			seconds: date.format( 'ss' ),
			milliseconds: date.format( 'SSS' ),
			daypart: daypart,
			counters: counters
		};
	},

	renderCounter: function( type ) {
		if ( type !== 'daypart' ) {
			var value = this.state[ type ];
			if ( type === 'hours' && this.props.timeFormat.toLowerCase().indexOf( ' a' ) !== -1 ) {
				value = ( value - 1 ) % 12 + 1;

				if ( value === 0 ) {
					value = 12;
				}
			}
			return DOM.div({ key: type, className: 'rdtCounter' }, [
				DOM.span({ key: 'up', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'increase', type ) }, '▲' ),
				DOM.div({ key: 'c', className: 'rdtCount' }, value ),
				DOM.span({ key: 'do', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'decrease', type ) }, '▼' )
			]);
		}
		return '';
	},

	renderDayPart: function() {
		return DOM.div({ key: 'dayPart', className: 'rdtCounter' }, [
			DOM.span({ key: 'up', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'toggleDayPart', 'hours') }, '▲' ),
			DOM.div({ key: this.state.daypart, className: 'rdtCount' }, this.state.daypart ),
			DOM.span({ key: 'do', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'toggleDayPart', 'hours') }, '▼' )
		]);
	},

	render: function() {
		var me = this,
			counters = []
		;

		this.state.counters.forEach( function( c ) {
			if ( counters.length )
				counters.push( DOM.div({ key: 'sep' + counters.length, className: 'rdtCounterSeparator' }, ':' ) );
			counters.push( me.renderCounter( c ) );
		});

		if ( this.state.daypart !== false ) {
			counters.push( me.renderDayPart() );
		}

		if ( this.state.counters.length === 3 && this.props.timeFormat.indexOf( 'S' ) !== -1 ) {
			counters.push( DOM.div({ className: 'rdtCounterSeparator', key: 'sep5' }, ':' ) );
			counters.push(
				DOM.div({ className: 'rdtCounter rdtMilli', key: 'm' },
					DOM.input({ value: this.state.milliseconds, type: 'text', onChange: this.updateMilli } )
					)
				);
		}

		return DOM.div({ className: 'rdtTime' },
			DOM.table({}, [
				this.renderHeader(),
				DOM.tbody({ key: 'b'}, DOM.tr({}, DOM.td({},
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
				step: 1
			},
			milliseconds: {
				min: 0,
				max: 999,
				step: 1
			}
		};
		['hours', 'minutes', 'seconds', 'milliseconds'].forEach( function( type ) {
			assign(me.timeConstraints[ type ], me.props.timeConstraints[ type ]);
		});
		this.updateState( this.calculateState( this.props ) );
	},

	componentWillReceiveProps: function( nextProps ) {
		this.updateState( this.calculateState( nextProps ) );
	},

	updateMilli: function( e ) {
		var milli = parseInt( e.target.value, 10 );
		if ( milli === e.target.value && milli >= 0 && milli < 1000 ) {
			this.props.setTime( 'milliseconds', milli );
			this.updateState( { milliseconds: milli } );
		}
	},

	renderHeader: function() {
		if ( !this.props.dateFormat )
			return null;

		var date = this.props.selectedDate || this.props.viewDate;
		return DOM.thead({ key: 'h' }, DOM.tr({},
			DOM.th({ className: 'rdtSwitch', colSpan: 4, onClick: this.props.showView( 'days' ) }, date.format( this.props.dateFormat ) )
		));
	},

	onStartClicking: function( action, type ) {
		var me = this;

		return function() {
			var update = {};
			update[ type ] = me[ action ]( type );
			me.updateState( update );

			// me.timer = setTimeout( function() {
			// 	me.increaseTimer = setInterval( function() {
			// 		update[ type ] = me[ action ]( type );
			// 		me.updateState( update );
			// 	}, 70);
			// }, 500);

			// me.mouseUpListener = function() {
			// 	clearTimeout( me.timer );
			// 	clearInterval( me.increaseTimer );
			// 	me.props.setTime( type, me.state[ type ] );
			// 	document.body.removeEventListener( 'mouseup', me.mouseUpListener );
			// };

			document.body.addEventListener( 'mouseup', me.mouseUpListener );
		};
	},

	padValues: {
		hours: 1,
		minutes: 2,
		seconds: 2,
		milliseconds: 3
	},

	toggleDayPart: function( type ) { // type is always 'hours'
		var value = parseInt( this.state[ type ], 10) + 12;
		if ( value > this.timeConstraints[ type ].max )
			value = this.timeConstraints[ type ].min + ( value - ( this.timeConstraints[ type ].max + 1 ) );
		return this.pad( type, value );
	},

	increase: function( type ) {
		var value = parseInt( this.state[ type ], 10) + this.timeConstraints[ type ].step;
		if ( value > this.timeConstraints[ type ].max )
			value = this.timeConstraints[ type ].min + ( value - ( this.timeConstraints[ type ].max + 1 ) );
		return this.pad( type, value );
	},

	decrease: function( type ) {
		var value = parseInt( this.state[ type ], 10) - this.timeConstraints[ type ].step;
		if ( value < this.timeConstraints[ type ].min )
			value = this.timeConstraints[ type ].max + 1 - ( this.timeConstraints[ type ].min - value );
		return this.pad( type, value );
	},

	pad: function( type, value ) {
		var str = value + '';
		while ( str.length < this.padValues[ type ] )
			str = '0' + str;
		return str;
	},

	updateState: function( update ) {
		var isConstrained = false;
		var timeProps = [ 'hours', 'minutes', 'seconds', 'milliseconds' ];

		if (this.props.selectedDate.isAfter(this.props.boundaryStart, 'days')
			&& this.props.selectedDate.isBefore(this.props.boundaryEnd, 'days')
		) {
			console.log( 'time is NOT restricted' );

			return this.setState( update );
		} else if (this.props.selectedDate.isSame(this.props.boundaryStart, 'days')) {
			// compare to boundaryStart
			// hours
			if (update.hours < this.props.boundaryStart.hours()) {
				if (this.timeConstraints.hours.max == this.state.hours) {
					update.hours = this.props.boundaryStart.hours();
					isConstrained = true;
				} else {
					update.hours = this.timeConstraints.hours.max;
				}
			} else {
				isConstrained = this.state.hours == this.props.boundaryStart.hours();
			}
			
			// minutes
			// if (isConstrained && update.minutes < this.props.boundaryStart.minutes()) {
			// 	if (update.minutes > this.state.minutes) {
			if (isConstrained) {
				var minutes = update.hasOwnProperty('minutes')
					? parseInt(update.minutes)
					: this.state.minutes;
				if (minutes == 0) {
					update.minutes = this.props.boundaryStart.minutes();
					isConstrained = true;
				} else if (update.minutes < this.props.boundaryStart.minutes()) {
					update.minutes = this.timeConstraints.minutes.max;
					isConstrained = false;
				}
			} else {
				isConstrained = this.state.minutes == this.props.boundaryStart.minutes();
			}

			// seconds
			if (isConstrained) {
				var seconds = update.hasOwnProperty('seconds')
					? parseInt(update.seconds)
					: this.state.seconds;
				if (seconds == 0) {
					update.seconds = this.props.boundaryStart.seconds();
					isConstrained = true;
				} else if (update.seconds < this.props.boundaryStart.seconds()) {
					update.seconds = this.timeConstraints.minutes.max;
					isConstrained = false;
				}
			} else {
				isConstrained = this.state.seconds == this.props.boundaryStart.seconds();
			}

			// milliseconds
			if (isConstrained) {
				var milliseconds = update.hasOwnProperty('milliseconds')
					? parseInt(update.milliseconds)
					: this.state.milliseconds;
				if (milliseconds == 0) {
					update.milliseconds = this.props.boundaryStart.millisecond();
				} else if (update.milliseconds < this.props.boundaryStart.millisecond()) {
					update.milliseconds = this.timeConstraints.minutes.max;
				}
			}

			// if (parseInt(update.minutes, 10) < this.props.boundaryStart.minutes()) {
			// 	if (this.timeConstraints.minutes.max == this.props.boundaryStart.minutes()) {

			// 	} else {

			// 	}
			// 	update.minutes = this.timeConstraints.minutes.max;
			// } else if (parseInt(update.seconds, 10) < this.props.boundaryStart.seconds()) {
			// 	update.seconds = this.timeConstraints.seconds.max;
			// } else if (parseInt(update.milliseconds, 10) < this.props.boundaryStart.millisecond()) {
			// 	update.milliseconds = this.timeConstraints.semillisecondsconds.max;
			// }
		} else {
			// compare to boundaryEnd
			// var selectedTime = this.props.boundaryEnd
			// 	.clone()
			// 	.hours(update.hours)
			// 	.minutes(update.minutes)
			// 	.seconds(update.seconds)
			// 	.milliseconds(update.milliseconds);

			// if (parseInt(update.hours, 10) > this.props.boundaryEnd.hours()) {
			// 	update.hours = this.timeConstraints.hours.min;
			// } else if (parseInt(update.minutes, 10) > this.props.boundaryEnd.minutes()) {
			// 	update.minutes = this.timeConstraints.minutes.min;
			// } else if (parseInt(update.seconds, 10) > this.props.boundaryEnd.seconds()) {
			// 	update.seconds = this.timeConstraints.seconds.min;
			// } else if (parseInt(update.milliseconds, 10) > this.props.boundaryEnd.millisecond()) {
			// 	update.milliseconds = this.timeConstraints.semillisecondsconds.min;
			// }
		}

		console.log( 'time is restricted' )
		console.log( update );

		return this.setState( update );
	}
});

module.exports = DateTimePickerTime;
