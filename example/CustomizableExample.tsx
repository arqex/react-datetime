import * as React from "react";
import DateTime from "../.";

class CustomizableExample extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      value: new Date(2019, 7, 2, 11, 25),
      dateFormat: "LL/dd/yyyy",
      timeFormat: "hh:mm a",
      dateTypeMode: undefined
    };

    // Bind functions
    this.renderSelect = this.renderSelect.bind(this);
  }

  renderSelect({ name, children }) {
    return (
      <div className="form-group">
        <label className="control-label col-xs-6">{name}</label>

        <div className="col-xs-6">
          <select
            className="form-control"
            value={this.state[name]}
            onChange={e => {
              let newValue: any = e.target.value;
              if (newValue === "true") {
                newValue = true;
              } else if (newValue === "false") {
                newValue = false;
              }

              this.setState({ [name]: newValue });
            }}
          >
            {children}
          </select>
        </div>
      </div>
    );
  }

  render() {
    const Select = this.renderSelect;

    return (
      <div className="form-horizontal">
        <h2>Customization props</h2>
        <p>
          Try out various configuration options and see how they affect the
          component.
        </p>

        <div>
          <strong>Value:</strong> {JSON.stringify(this.state.value)}
        </div>

        <DateTime
          value={this.state.value}
          onChange={newValue => {
            console.log(newValue);
            this.setState({ value: newValue });
          }}
          {...this.state}
        />

        <hr />

        <Select name="dateFormat">
          <option value="">false</option>
          <option>yyyy-LL-dd</option>
          <option>LL/dd/yyyy</option>
          <option>dd.LL.yyyy</option>
          <option>LL-dd</option>
          <option>LLLL</option>
          <option>yyyy/LL</option>
          <option>yyyy</option>
        </Select>

        <Select name="timeFormat">
          <option value="">false</option>
          <option>hh:mm a</option>
          <option>HH:mm:ss</option>
          <option>HH:mm:SSS</option>
          <option>hh:mm:SSS a</option>
          <option>hmm</option>
          <option>HH:mm xxx</option>
        </Select>

        <Select name="dateTypeMode">
          <option value="">default (Date)</option>
          <option>utc-ms-timestamp</option>
          <option>input-format</option>
          <option>Date</option>
        </Select>
      </div>
    );
  }
}

export default CustomizableExample;
