// This file is the playground used for development purposes (npm run playground)
// not part of the library
import React from 'react';
import Datetime from './datetime/DateTime';

class App extends React.Component { 
	state = {
		date: new Date()
	}

	render() {
		return (
			<div>
				<Datetime
					ref="datetime"
					value={ this.state.date }
				/>
				<button onClick={ this._update }>Update</button>
			</div>
		);
	}
	
	_update = () => {
		this.setState({
			date: new Date( this.state.date.getTime() + 10000000000 )
		});
	}
}

export default App;
