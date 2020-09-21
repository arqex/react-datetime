import React from 'react';
import ViewNavigation from './ViewNavigation';

export default class DaysView extends React.Component {
	static defaultProps = {
		isValidDate: () => true
	}

	render() {
		const date = this.props.viewDate;
		const locale = date.localeData();

		let startOfMonth = date.clone().startOf('month');
		let endOfMonth = date.clone().endOf('month');

		return (
			<div className="rdtDays">
				<table>
					<thead>
						{ this.renderNavigation( date, locale ) }
						{ this.renderDayHeaders( locale ) }
					</thead>
					<tbody>
						{ this.renderDays( date, startOfMonth, endOfMonth ) }
					</tbody>
					{ this.renderFooter( date ) }
				</table>
			</div>
		);
	}

	renderNavigation( date, locale ) {
		return (
			<ViewNavigation
				onClickPrev={ () => this.props.navigate( -1, 'months' ) }
				onClickSwitch={ () => this.props.showView( 'months' ) }
				onClickNext={ () => this.props.navigate( 1, 'months' ) }
				switchContent={ locale.months( date ) + ' ' + date.year() }
				switchColSpan={5}
				switchProps={ { 'data-value': this.props.viewDate.month() } }
			/>
		);
	}

	renderDayHeaders( locale ) {
		let dayItems = this.getDaysOfWeek( locale ).map( (day, index) => (
			<th key={ day + index } className="dow">{ day }</th>
		));

		return (
			<tr>
				{ dayItems }
			</tr>
		);
	}

	renderDays( date, startOfMonth, endOfMonth ) {
		// We need 42 days in 6 rows
		// starting in the last week of the previous month
		let rows = [[], [], [], [], [], []];

		let startDate = date.clone().subtract( 1, 'months');
		startDate.date( startDate.daysInMonth() ).startOf('week');

		let endDate = startDate.clone().add( 42, 'd' );
		let i = 0;

		while ( startDate.isBefore( endDate ) ) {
			let row = this.getRow( rows, i++ );
			row.push( this.renderDay( startDate, startOfMonth, endOfMonth ) );
			startDate.add( 1, 'd' );
		}

		return rows.map( (r, i) => (
			<tr key={ `${endDate.month()}_${i}` }>{ r }</tr>
		));
	}

	renderDay( date, startOfMonth, endOfMonth ) {
		let selectedDate = this.props.selectedDate;

		let dayProps = {
			key: date.format('M_D'),
			'data-value': date.date(),
			'data-month': date.month(),
			'data-year': date.year()
		};

		let className = 'rdtDay';
		if ( date.isBefore( startOfMonth ) ) {
			className += ' rdtOld';
		}
		else if ( date.isAfter( endOfMonth ) ) {
			className += ' rdtNew';
		}
		if ( selectedDate && date.isSame( selectedDate, 'day' ) ) {
			className += ' rdtActive';
		}
		if ( date.isSame( this.props.moment(), 'day' ) ) {
			className += ' rdtToday';
		}

		if ( this.props.isValidDate(date) ) {
			dayProps.onClick = this._setDate;
		}
		else {
			className += ' rdtDisabled';
		}

		dayProps.className = className;

		if ( this.props.renderDay ) {
			return this.props.renderDay(
				dayProps, date.clone(), selectedDate && selectedDate.clone()
			);
		}

		return (
			<td { ...dayProps }>{ date.date() }</td>
		);
	}

	renderFooter( date ) {
		if ( !this.props.timeFormat ) return;

		return (
			<tfoot>
				<tr>
					<td onClick={ () => this.props.showView('time') }
						colSpan={7}
						className="rdtTimeToggle">
						{ date.format( this.props.timeFormat ) }
					</td>
				</tr>
			</tfoot>
		);
	}

	_setDate = e => {
		this.props.updateDate( e );
	}

	/**
	 * Get a list of the days of the week
	 * depending on the current locale
	 * @return {array} A list with the shortname of the days
	 */
	getDaysOfWeek(locale) {
		const first = locale.firstDayOfWeek();
		let dow = [];
		let i = 0;

		locale._weekdaysMin.forEach(function (day) {
			dow[(7 + (i++) - first) % 7] = day;
		});

		return dow;
	}

	getRow( rows, day ) {
		return rows[ Math.floor( day / 7 ) ];
	}
}
