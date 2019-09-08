import * as React from "react";
import DateTime from "../.";

class CustomizableExample extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      value: new Date(),
      dateFormat: "LL/dd/yyyy",
      timeFormat: "hh:mm a"
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
            onChange={e => this.setState({ [name]: e.target.value })}
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
      </div>
    );
  }
}

export default CustomizableExample;
