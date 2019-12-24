// This file is the playground used for development purposes (npm run playground)
import React from 'react';
import DateTime from './datetime/DateTime';

function App() {
	return (
		<div className="App">
			<DateTime initialValue={moment('2015-04-19')} />
		</div>
	);
}

export default App;
