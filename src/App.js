// This file is the playground used for development purposes (npm run playground)
// not part of the library
import React from 'react';
import Datetime from './datetime/DateTime';

// import moment from 'moment';
// import 'moment/locale/tzm-latn';
// moment.locale('tzm-latn');

class App extends React.Component { 
	state = {
		date: new Date()
	}

	render() {
		return (
			<div style={{height: 2000}}>
				<Datetime />
			</div>
		);
	}
}

export default App;
