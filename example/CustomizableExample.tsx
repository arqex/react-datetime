import * as React from "react";
import DateTime from "../.";

class CustomizableExample extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      value: new Date(),
      viewMode: "days",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "HH:mm A",
      input: true,
      utc: false,
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

        <DateTime
          value={new Date()}
          onChange={newValue => {
            console.log(newValue);
            this.setState({ value: newValue });
          }}
          {...this.state}
        />

        <hr />

        <Select name="dateFormat">
          <option value="">false</option>
          <option>YYYY-MM-DD</option>
          <option>MM/DD/YYYY</option>
          <option>DD.MM.YYYY</option>
          <option>MM-DD</option>
          <option>MMMM</option>
          <option>YYYY/MM</option>
          <option>YYYY</option>
        </Select>

        <Select name="timeFormat">
          <option value="">false</option>
          <option>hh:mm A</option>
          <option>HH:mm:ss</option>
          <option>HH:mm:SSS</option>
          <option>hh:mm:SSS a</option>
          <option>hmm</option>
          <option>HH:mm Z</option>
        </Select>

        <Select name="viewMode">
          <option>years</option>
          <option>months</option>
          <option>days</option>
          <option>time</option>
        </Select>

        <Checkbox name="input" />
        <Checkbox name="utc" />
        <Checkbox name="disableOnClickOutside" />
      </div>
    );
  }
}

export default CustomizableExample;
