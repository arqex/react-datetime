import React from 'react';
import ViewNavigation from '../parts/ViewNavigation';
import { getKeyboardProps } from '../utils';

export default class MonthsView extends React.Component {
	render() {
		return (
			<div className="rdtMonths">
				<table>
					<thead>
						{ this.renderNavigation() }
					</thead>
				</table>
				<table>
					<tbody>
						{ this.renderMonths() }
					</tbody>
				</table>
			</div>
		);
	}

	renderNavigation() {
		let year = this.props.viewDate.year();

		return (
			<ViewNavigation
				onClickPrev={ () => this.props.navigate( -1, 'years' ) }
				onClickSwitch={ () => this.props.showView( 'years' ) }
				onClickNext={ () => this.props.navigate( 1, 'years' ) }
				switchContent={ year }
				switchColSpan="2"
			/>
		);
	}

	renderMonths() {
		// 12 months in 3 rows for every view
		let rows = [ [], [], [] ];

		for ( let month = 0; month < 12; month++ ) {
			let row = getRow( rows, month );

			row.push( this.renderMonth( month ) );
		}

		return rows.map( (months, i) => (
			<tr key={i}>{ months }</tr>
		));
	}

	renderMonth( month ) {
		const selectedDate = this.props.selectedDate;
		let className = 'rdtMonth';
		let onClick;
		let keyboardProps = {};

		if ( this.isDisabledMonth( month ) ) {
			className += ' rdtDisabled';
		}
		else {
			onClick = this._updateSelectedMonth;
			keyboardProps = getKeyboardProps(onClick);
		}

		if ( selectedDate && selectedDate.year() === this.props.viewDate.year() && selectedDate.month() === month ) {
			className += ' rdtActive';
		}

		let props = {
			...keyboardProps,
			key: month,
			className,
			'data-value': month,
			onClick
		};

		if ( this.props.renderMonth ) {
			return this.props.renderMonth(
				props,
				month,
				this.props.viewDate.year(),
				this.props.selectedDate && this.props.selectedDate.clone()
			);
		}

		return (
			<td { ...props }>
				{ this.getMonthText( month ) }
			</td>
		);
	}
	
	isDisabledMonth( month ) {
		let isValidDate = this.props.isValidDate;

		if ( !isValidDate ) {
			// If no validator is set, all days are valid
			return false;
		}

		// If one day in the month is valid, the year should be clickable
		let date = this.props.viewDate.clone().set({month});
		let day = date.endOf( 'month' ).date() + 1;

		while ( day-- > 1 ) {
			if ( isValidDate( date.date(day) ) ) {
				return false;
			}
		}
		return true;
	}

	getMonthText( month ) {
		const localMoment = this.props.viewDate;
		const monthStr = localMoment.localeData().monthsShort( localMoment.month( month ) );

		// Because some months are up to 5 characters long, we want to
		// use a fixed string length for consistency
		return capitalize( monthStr.substring( 0, 3 ) );
	}

	_updateSelectedMonth = event => {
		this.props.updateDate( event );
	}
}

function getRow( rows, year ) {
	if ( year < 4 ) {
		return rows[0];
	}
	if ( year < 8 ) {
		return rows[1];
	}

	return rows[2];
}

function capitalize( str ) {
	return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
}
