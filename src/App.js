// This file is the playground used for development purposes (npm run playground)
import React from 'react';
import DateTime from './datetime/DateTime';

function renderView( viewType, renderDefault ) {
	return (
		<div className="customView">
			<span className="viewType">{ viewType }</span>
			{ renderDefault() }
		</div>
	);
}

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
				<DateTime renderView={ renderView }
					initialViewMode="years" />
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
