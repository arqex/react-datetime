import React, { Component } from "react";
import DateTime from "react-datetime";

export default class SimpleExample extends Component {
  render() {
    return (
      <div>
        <h2>Simple Scenario</h2>
        <DateTime onChange={console.log} />
      </div>
    );
  }
}
