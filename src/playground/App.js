// This file is the playground used for development purposes (npm run playground)
// not part of the library
import React, { useCallback, useState } from 'react';
import Datetime from '../DateTime';
import moment from 'moment';

// import moment from 'moment';
// import 'moment/locale/tzm-latn';
// moment.locale('tzm-latn');

const App = () => {
	const [value, setValue] = useState();
	const onChange = useCallback((newValue) => {
		setValue(newValue);
	}, [setValue]);
	const externalSetDate = useCallback(() => {
		setValue(moment());
	}, [setValue]);

	return (
		<div>
			<button onClick={externalSetDate}>
				external set date
			</button>

			<div>
				Controlled
				<Datetime
					value={value}
					onChange={onChange}
				/>
			</div>
			<div>
				Uncontrolled Input
				<Datetime
				/>
			</div>
		</div>
	);
};

export default App;
