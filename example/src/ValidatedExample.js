import React, { Component } from "react";
import DateTime from "react-datetime";
import isBefore from "date-fns/is_before";
import startOfMonth from "date-fns/start_of_month";

export default class ValidatedExample extends Component {
  render() {
    return (
      <div>
        <h2>isValidDate</h2>
        <p>You can use "isValidDate" to disable all dates after last month.</p>
        <DateTime
          viewMode="months"
          dateFormat="MMMM"
          isValidDate={current => isBefore(current, startOfMonth(new Date()))}
          onChange={console.log}
        />
      </div>
    );
  }
}
