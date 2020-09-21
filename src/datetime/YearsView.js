import React from 'react';
import ViewNavigation from './ViewNavigation';

export default class YearsView extends React.Component {
	render() {
		const viewYear = parseInt( this.props.viewDate.year() / 10, 10 ) * 10;

		return (
			<div className="rdtYears">
				<table>
					<thead>
						{ this.renderNavigation( viewYear ) }
					</thead>
				</table>
				<table>
					<tbody>
						{ this.renderYears( viewYear ) }
					</tbody>
				</table>
			</div>
		);
	}

	renderNavigation( viewYear ) {
		return (
			<ViewNavigation
				onClickPrev={ () => this.props.navigate( -10, 'years' ) }
				onClickSwitch={ () => this.props.showView( 'years' ) }
				onClickNext={ () => this.props.navigate( 10, 'years' ) }
				switchContent={ `${viewYear}-${viewYear + 9}` }
			/>
		);
	}

	renderYears( viewYear ) {
		// 12 years in 3 rows for every view
		let rows = [ [], [], [] ];
		let selectedYear = this.props.selectedDate && this.props.selectedDate.year();

		for ( let year = viewYear - 1; year < viewYear + 11; year++ ) {
			let row = this.getRow( rows, year - viewYear );

			row.push(
				this.renderYear( year, selectedYear )
			);
		}

		return rows.map( (years, i) => (
			<tr key={i}>{ years }</tr>
		));
	}

	renderYear( year, selectedYear ) {
		let className = 'rdtYear';
		let onClick;

		if ( this.isDisabledYear( year ) ) {
			className += ' rdtDisabled';
		}
		else {
			onClick = this._updateSelectedYear;
		}

		if ( selectedYear === year ) {
			className += ' rdtActive';
		}

		let props = {key: year, className, 'data-value': year, onClick };

		if ( this.props.renderYear ) {
			return this.props.renderYear(
				props,
				year,
				this.props.selectedDate && this.props.selectedDate.clone()
			);
		}

		return (
			<td { ...props }>
				{ year }
			</td>
		);
	}

	getRow( rows, year ) {
		if ( year < 3 ) {
			return rows[0];
		}
		if ( year < 7 ) {
			return rows[1];
		}

		return rows[2];
	}

	disabledYearsCache = {};
	isDisabledYear( year ) {
		let cache = this.disabledYearsCache;
		if ( cache[year] !== undefined ) {
			return cache[year];
		}

		let isValidDate = this.props.isValidDate;

		if ( !isValidDate ) {
			// If no validator is set, all days are valid
			return false;
		}

		// If one day in the year is valid, the year should be clickable
		let date = this.props.viewDate.clone().set({year});
		let day = date.endOf( 'year' ).dayOfYear() + 1;

		while ( day-- > 1 ) {
			if ( isValidDate( date.dayOfYear(day) ) ) {
				cache[year] = false;
				return false;
			}
		}

		cache[year] = true;
		return true;
	}

	_updateSelectedYear = event => {
		this.props.updateDate( event );
	}
}
