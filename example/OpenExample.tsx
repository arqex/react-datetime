import * as React from "react";
import DateTime from "../.";

export default class OpenExample extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      viewMode: undefined
    };

    // Bind functions
    this.renderButton = this.renderButton.bind(this);
  }

  renderButton(text, viewMode) {
    return (
      <button
        type="button"
        onClick={() => this.setState({ viewMode: viewMode })}
        disabled={this.state.viewMode === viewMode}
      >
        {text}
      </button>
    );
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
          {this.renderButton("Default - undefined", undefined)}
          {this.renderButton("Years", "years")}
          {this.renderButton("Months", "months")}
          {this.renderButton("Days", "days")}
          {this.renderButton("Time", "time")}
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
