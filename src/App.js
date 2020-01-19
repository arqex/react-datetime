// This file is the playground used for development purposes (npm run playground)
import React from 'react';
import moment from 'moment';
import DateTime from './datetime/DateTime';

class App extends React.Component {

	constructor() {
		super();
		this.state = {
			locale: 'nl',
			value: moment('2025-01-01', 'YYYY-MM-DD')
		};
	}
	
	render() {
		return (
			<div className="App">
				<DateTime initialViewMode="years" isValidDate={ this.isValidDate } />
			</div>
		);
	}

	componentDidMount() {
		this.changeLocale();
	}

	changeLocale() {
		setTimeout(() => {
			this.setState({ locale: 'sv' });
		}, 5000);
	}

	renderYear(fnProps, fnYear, selected) {
		console.log( fnYear, selected );
		return <td {...fnProps}>custom-content</td>;
	}
	
	isValidDate( current ) {
		return current.isBefore(moment('2026-01-01', 'YYYY-MM-DD'));
	}
}

export default App;
