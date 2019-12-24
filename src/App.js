// This file is the playground used for development purposes (npm run playground)
import React from 'react';
import moment from 'moment';
import DateTime from './datetime/DateTime';

class App extends React.Component {

	constructor() {
		super();
		this.state = {
			locale: 'en'
		};
	}
	
	render() {
		return (
			<div className="App">
				<DateTime initialValue={moment('2015-04-19')} locale={ this.state.locale } />
			</div>
		);
	}

	componentDidMount() {
		this.changeLocale();
	}

	changeLocale() {
		setTimeout(() => {
			this.setState({ locale: 'nl' });
		}, 1000);
	}
}

export default App;
