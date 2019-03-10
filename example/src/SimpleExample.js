import React, { Component } from "react";
import DateTime from "@nateradebaugh/react-datetime";

export default class SimpleExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: undefined
    };
  }

  render() {
    return (
      <div>
        <h2>Simple Scenario</h2>
        <DateTime
          value={this.state.value}
          onChange={newVal => {
            console.log({ newVal });
            this.setState({ value: newVal });
          }}
        />
      </div>
    );
  }
}
