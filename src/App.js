// This file is the playground used for development purposes (npm run playground)
// not part of the library
import React from 'react';
import Datetime from './datetime/DateTime';

class App extends React.Component {  
	render() {
		return (
			<Datetime
				ref="datetime"
				renderView={(mode, renderDefault) =>
					this.renderView(mode, renderDefault)
				}
			/>
		);
	}

	renderView(mode, renderDefault) {
		// Only for years, months and days view
		if (mode === 'time') return renderDefault();

		return (
			<div className="wrapper">
				{renderDefault()}
				<div className="controls">
					<button onClick={() => this.goToToday()}>Today</button>
				</div>
			</div>
		);
	}

	goToToday() {
		// Reset
		this.refs.datetime.setViewDate(new Date());
		this.refs.datetime.navigate('days');
	}
}

export default App;
