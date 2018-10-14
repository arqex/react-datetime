import React, { Component } from "react";
import DateTime from "@nateradebaugh/react-datetime";

export default class SimpleExample extends Component {
  render() {
    return (
      <div>
        <h2>Simple Scenario</h2>
        <DateTime
          dateFormat="YYYY-MM-DD"
          timeFormat={false}
          defaultValue={Date.UTC(2000, 0, 15, 2, 2, 2, 2)}
          onChange={console.log}
        />
      </div>
    );
  }
}
