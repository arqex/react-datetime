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
				<Datetime />
			</div>
		);
	}
}

export default App;
