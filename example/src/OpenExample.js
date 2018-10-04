import React, { Component } from "react";
import DateTime from "react-datetime";

export default class OpenExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewMode: undefined
    };
  }

  render() {
    return (
      <div>
        <h2>open</h2>
        <p>
          The "open" prop is only consumed when the component is mounted. Useful
          for embedding inside your own popover components.
        </p>
        <p>Try out various viewModes and see how they affect the component.</p>
        <p>
          <button
            type="button"
            onClick={() => this.setState({ viewMode: undefined })}
            disabled={this.state.viewMode === undefined}
          >
            Default - undefined
          </button>
          <button
            type="button"
            onClick={() => this.setState({ viewMode: "years" })}
            disabled={this.state.viewMode === "years"}
          >
            Years
          </button>
          <button
            type="button"
            onClick={() => this.setState({ viewMode: "months" })}
            disabled={this.state.viewMode === "months"}
          >
            Months
          </button>
          <button
            type="button"
            onClick={() => this.setState({ viewMode: "days" })}
            disabled={this.state.viewMode === "days"}
          >
            Days
          </button>
          <button
            type="button"
            onClick={() => this.setState({ viewMode: "time" })}
            disabled={this.state.viewMode === "time"}
          >
            Time
          </button>
        </p>
        <DateTime
          open
          input={false}
          onChange={console.log}
          viewMode={this.state.viewMode}
        />
      </div>
    );
  }
}
