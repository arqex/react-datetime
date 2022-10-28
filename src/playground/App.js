// This file is the playground used for development purposes (npm run playground)
// not part of the library
import React from 'react';
import Datetime from '../DateTime';

// import moment from 'moment';
// import 'moment/locale/tzm-latn';
// moment.locale('tzm-latn');

class App extends React.Component { 
	state = {
		value: '',
	}

	render() {
		return (
			<div>
				<button onClick={() => this.setState({value: ''})}>Reset</button>
				<Datetime value={this.state.value} onChange={(value) => this.setState({value})} />
			</div>
		);
	}
}

export default App;
