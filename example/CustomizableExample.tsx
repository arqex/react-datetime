import * as React from "react";
import DateTime from "../.";

class CustomizableExample extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      value: new Date(),
      viewMode: "days",
      dateFormat: "LL/dd/yyyy",
      timeFormat: "hh:mm a",
      input: true,
      disableOnClickOutside: false
    };

    // Bind functions
    this.renderSelect = this.renderSelect.bind(this);
    this.renderCheckbox = this.renderCheckbox.bind(this);
  }

  renderSelect({ name, children }) {
    return (
      <div className="form-group">
        <label className="control-label col-xs-6">{name}</label>

        <div className="col-xs-6">
          <select
            className="form-control"
            value={this.state[name]}
            onChange={e => this.setState({ [name]: e.target.value })}
          >
            {children}
          </select>
        </div>
      </div>
    );
  }

  renderCheckbox({ name }) {
    return (
      <div className="form-group">
        <label className="control-label col-xs-6">{name}</label>

        <div className="col-xs-6">
          <input
            type="checkbox"
            checked={this.state[name]}
            onChange={e => this.setState({ [name]: e.target.checked })}
          />
        </div>
      </div>
    );
  }

  render() {
    const Select = this.renderSelect;
    const Checkbox = this.renderCheckbox;

    return (
      <div className="form-horizontal">
        <h2>Customization props</h2>
        <p>
          Try out various configuration options and see how they affect the
          component.
        </p>

        <h3>Controlled</h3>
        <DateTime
          value={new Date()}
          onChange={newValue => {
            console.log(newValue);
            this.setState({ value: newValue });
          }}
          {...this.state}
        />
        <h3>Uncontrolled</h3>
        <DateTime defaultValue={new Date()} {...this.state} />

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

        <Select name="viewMode">
          <option>years</option>
          <option>months</option>
          <option>days</option>
          <option>time</option>
        </Select>

        <Checkbox name="input" />
        <Checkbox name="disableOnClickOutside" />
      </div>
    );
  }
}

export default CustomizableExample;
