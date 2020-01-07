// This file is the playground used for development purposes (npm run playground)
import React from 'react';
import moment from 'moment';
import 'moment/locale/nl';
import 'moment/locale/sv';
import DateTime from './datetime/DateTime';

class App extends React.Component {

	constructor() {
		super();
		this.state = {
			locale: 'nl'
		};
	}
	
	render() {
		return (
			<div className="App">
				<DateTime
					initialViewMode="days"
					locale={ this.state.locale }
					isValidDate={ current => current.isBefore( moment('2026-01-01', 'YYYY-MM-DD') ) } />
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
}

export default App;
