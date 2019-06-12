import * as React from 'react';
import DateTime from '../.';

export default class SimpleExample extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      value: undefined,
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
