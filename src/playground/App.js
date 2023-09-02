import React from 'react';
import Datetime from '../DateTime'; // Import your calendar library
import moment from 'moment-timezone';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      timeZone: 'America/Los_Angeles', // Initial time zone
    };
  }

  // Function to check if a date is in daylight saving time
  checkDaylightSavingTime = (date) => {
    // Use moment-timezone to determine if the date is in DST
    const isDST = moment(date).tz('America/Los_Angeles').isDST();
    return isDST;
  };

  // Function to update time zone and selected date
  handleDateChange = (newDate) => {
    const isDaylightSavingTime = this.checkDaylightSavingTime(newDate);

    // Update time zone based on daylight saving time
    const newTimeZone = isDaylightSavingTime ? 'America/Los_Angeles' : 'America/Los_Angeles|PST PDT';

    this.setState({
      date: newDate,
      timeZone: newTimeZone,
    });
  };

  render() {
    return (
      <div>
        <Datetime
          displayTimeZone={this.state.timeZone}
          timeFormat={'h:mm a z'}
          onChange={this.handleDateChange}
          value={this.state.date}
        />
      </div>
    );
  }
}

export default App;
