import React from 'react';
import createClass from 'create-react-class';

const timeConstraints = {
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

export default class TimeView extends React.Component {
	constructor( props ) {
		super( props );

		this.constraints = this.createConstraints(props);
	}

	createConstraints( props ) {
		let constraints = {};

		Object.keys( timeConstraints ).forEach( type => {
			constraints[ type ] = { ...timeConstraints[type], ...(props.timeConstraints[type] || {}) };
		});

		return constraints;
	}

	render() {
		let items = [];

		const timeParts = this.getTimeParts( this.props.selectedDate || this.props.viewDate );
		
		this.getCounters().forEach( (c, i) => {
			if ( i ) {
				items.push(
					<div key={ `sep${i}` } className="rdtCounterSeparator">:</div>
				);
			}

			items.push( this.renderCounter(c, timeParts[c]) );
		});

		items.push( this.renderDayPart() );

		return (
			<div className="rdtTime">
				<table>
					{ this.renderHeader() }
					<tbody>
						<div className="rdtCounters">
							{ items }
						</div>
					</tbody>
				</table>
			</div>
		);
	}

	renderCounter( type, value ) {
		if ( type === 'hours' && this.isAMPM() ) {
			value = ( value - 1 ) % 12 + 1;

			if ( value === 0 ) {
				value = 12;
			}
		}
		return (
			<div key={ type } classNAme="rdtCounter">
				<span className="rdt" onMouseDown={ () => this.onStartClicking('increase', type)}>▲</span>
				<div className="rdtCount">{ value }</div>
				<span className="rdt" onMouseDown={ () => this.onStartClicking('decrease', type)}>▼</span>
			</div>
		);
	}

	renderDayPart() {
		return React.createElement('div', { key: 'dayPart', className: 'rdtCounter' }, [
			React.createElement('span', { key: 'up', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'toggleDayPart', 'hours') }, '▲' ),
			React.createElement('div', { key: this.state.daypart, className: 'rdtCount' }, this.state.daypart ),
			React.createElement('span', { key: 'do', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'toggleDayPart', 'hours') }, '▼' )
		]);
	}

	getCounters() {
		let counters = [];
		let format = this.props.format;
		
		if ( format.toLowerCase().indexOf('h') !== -1 ) {
			counters.push('hours');
			if ( format.indexOf('m') !== -1 ) {
				counters.push('minutes');
				if ( format.indexOf('s') !== -1 ) {
					counters.push('seconds');
					if ( format.indexOf('S') !== -1 ) {
						counters.push('milliseconds');
					}
				}
			}
		}

		if ( this.isAMPM() ) {
			counters.push('ampm');
		}

		return counters;
	}

	isAMPM() {
		return this.props.timeFormat.toLowerCase().indexOf( ' a' ) !== -1;
	}

	getTimeParts( date ) {
		let ampm = false;
		var hours = date.hours();
		let timeFormat = this.props.timeFormat;

		if ( this.isAMPM() ) {
			let isCaps = timeFormat.indexOf(' A') !== -1;
			if ( hours < 12 ) {
				ampm = isCaps ? 'AM' : 'am';
			}
			else {
				ampm = isCaps ? 'PM': 'pm';
			}
		}

		return {
			hours: this.pad( 'hours', hours ),
			minutes: this.pad( 'minutes', date.minutes() ),
			seconds: this.pad( 'seconds', date.seconds() ),
			milliseconds: this.pad('milliseconds', date.milliseconds() ),
			ampm
		};
	}
}

var DateTimePickerTime = createClass({
	getInitialState: function() {
		this.timeConstraints = {
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

		let me = this;
		['hours', 'minutes', 'seconds', 'milliseconds'].forEach( function( type ) {
			Object.assign(me.timeConstraints[ type ], me.props.timeConstraints[ type ]);
		});

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

		var hours = date.hours();

		var daypart = false;
		if ( this.state !== null && this.props.timeFormat.toLowerCase().indexOf( ' a' ) !== -1 ) {
			if ( this.props.timeFormat.indexOf( ' A' ) !== -1 ) {
				daypart = ( hours >= 12 ) ? 'PM' : 'AM';
			} else {
				daypart = ( hours >= 12 ) ? 'pm' : 'am';
			}
		}

		return {
			hours: this.pad( 'hours', hours ),
			minutes: this.pad( 'minutes', date.minutes() ),
			seconds: this.pad( 'seconds', date.seconds() ),
			milliseconds: this.pad('milliseconds', date.milliseconds() ),
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
			return React.createElement('div', { key: type, className: 'rdtCounter' }, [
				React.createElement('span', { key: 'up', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'increase', type ) }, '▲' ),
				React.createElement('div', { key: 'c', className: 'rdtCount' }, value ),
				React.createElement('span', { key: 'do', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'decrease', type ) }, '▼' )
			]);
		}
		return '';
	},

	renderDayPart: function() {
		return React.createElement('div', { key: 'dayPart', className: 'rdtCounter' }, [
			React.createElement('span', { key: 'up', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'toggleDayPart', 'hours') }, '▲' ),
			React.createElement('div', { key: this.state.daypart, className: 'rdtCount' }, this.state.daypart ),
			React.createElement('span', { key: 'do', className: 'rdtBtn', onMouseDown: this.onStartClicking( 'toggleDayPart', 'hours') }, '▼' )
		]);
	},

	render: function() {
		var me = this,
			counters = []
		;

		this.state.counters.forEach( function( c ) {
			if ( counters.length )
				counters.push( React.createElement('div', { key: 'sep' + counters.length, className: 'rdtCounterSeparator' }, ':' ) );
			counters.push( me.renderCounter( c ) );
		});

		if ( this.state.daypart !== false ) {
			counters.push( me.renderDayPart() );
		}

		if ( this.state.counters.length === 3 && this.props.timeFormat.indexOf( 'S' ) !== -1 ) {
			counters.push( React.createElement('div', { className: 'rdtCounterSeparator', key: 'sep5' }, ':' ) );
			counters.push(
				React.createElement('div', { className: 'rdtCounter rdtMilli', key: 'm' },
					React.createElement('input', { value: this.state.milliseconds, type: 'text', onChange: this.updateMilli } )
				)
			);
		}

		return React.createElement('div', { className: 'rdtTime' },
			React.createElement('table', {}, [
				this.renderHeader(),
				React.createElement('tbody', { key: 'b'}, React.createElement('tr', {}, React.createElement('td', {},
					React.createElement('div', { className: 'rdtCounters' }, counters )
				)))
			])
		);
	},

	componentDidMount: function() {
		this.setState( this.calculateState( this.props ) );
	},

	updateMilli: function( e ) {
		var milli = parseInt( e.target.value, 10 );
		if ( milli === e.target.value && milli >= 0 && milli < 1000 ) {
			this.props.setTime( 'milliseconds', milli );
			this.setState( { milliseconds: milli } );
		}
	},

	renderHeader: function() {
		if ( !this.props.dateFormat )
			return null;

		var date = this.props.selectedDate || this.props.viewDate;
		return React.createElement('thead', { key: 'h' }, React.createElement('tr', {},
			React.createElement('th', { className: 'rdtSwitch', colSpan: 4, onClick: () => this.props.showView( 'days' ) }, date.format( this.props.dateFormat ) )
		));
	},

	onStartClicking: function( action, type ) {
		var me = this;

		return function( e ) {
			if ( e && e.button && e.button !== 0 ) {
				// Only left clicks, thanks
				return;
			}

			var update = {};
			update[ type ] = me[ action ]( type );
			me.setState( update );

			me.timer = setTimeout( function() {
				me.increaseTimer = setInterval( function() {
					update[ type ] = me[ action ]( type );
					me.setState( update );
				}, 70);
			}, 500);

			me.mouseUpListener = function() {
				clearTimeout( me.timer );
				clearInterval( me.increaseTimer );
				me.props.setTime( type, me.state[ type ] );
				document.body.removeEventListener( 'mouseup', me.mouseUpListener );
				document.body.removeEventListener( 'touchend', me.mouseUpListener );
			};

			document.body.addEventListener( 'mouseup', me.mouseUpListener );
			document.body.addEventListener( 'touchend', me.mouseUpListener );
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
		var tc = this.timeConstraints[ type ];
		if ( value > tc.max )
			value = tc.min + ( value - ( tc.max + 1 ) );
		return this.pad( type, value );
	},

	increase: function( type ) {
		var tc = this.timeConstraints[ type ];
		var value = parseInt( this.state[ type ], 10) + tc.step;
		if ( value > tc.max )
			value = tc.min + ( value - ( tc.max + 1 ) );
		return this.pad( type, value );
	},

	decrease: function( type ) {
		var tc = this.timeConstraints[ type ];
		var value = parseInt( this.state[ type ], 10) - tc.step;
		if ( value < tc.min )
			value = tc.max + 1 - ( tc.min - value );
		return this.pad( type, value );
	},

	pad: function( type, value ) {
		var str = value + '';
		while ( str.length < this.padValues[ type ] )
			str = '0' + str;
		return str;
	},
});

module.exports = DateTimePickerTime;
