// This file is the playground used for development purposes (npm run playground)
// not part of the library
import React, { useCallback, useState } from 'react';
import moment from 'moment-timezone';
import Datetime from '../DateTime';
import './styles.css';

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

 	const [time1, setTime1] = useState(moment('Sun Sep 27 2015 05:00:00 GMT-0700'));
	const [time2, setTime2] = useState(moment('Sun Sep 27 2015 05:00:00 GMT-0400'));

	return (
		<div className="playground-palette">
			<button onClick={externalSetDate}>
				external set date
			</button>

			<div>
				5am PT
				<Datetime
					value={time1}
					onChange={setTime1}
					initialViewMode='time'
				/>
			</div>

			<div>
				5am ET (Displayed Time is in current time zone)
				<Datetime
					value={time2}
					onChange={setTime2}
					initialViewMode='time'
					showTimeZone
					timeFormat={'hh:mma'}
					timeCountersFormat={'hms'}
					dateFormat={'MMM D, YYYY'}
					showTimeFirst
				/>
			</div>

			<div>
				5am ET (Displayed Time is in current time zone) Time First Format
				<Datetime
					value={time2}
					onChange={setTime2}
					initialViewMode='time'
					showTimeZone
					showTimeFirst
				/>
			</div>

			<div>
				Controlled
				<Datetime
					value={value}
					onChange={onChange}
					initialViewMode='time'
				/>
			</div>
			<div>
				Controlled
				<Datetime
					value={value}
					onChange={onChange}
					initialViewMode='time'
				/>
			</div>
			<div>
				Uncontrolled Input
				<Datetime
					initialViewMode='time'
				/>
			</div>
		</div>
	);
};

export default App;
