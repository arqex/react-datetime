import React, { Component } from 'react'
import DateTime from 'react-datetime'

export default class CustomizableExample extends Component {
  state = {
    viewMode: 'days',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'HH:mm A',
    input: true,
    utc: false,
    closeOnSelect: false,
    closeOnTab: true,
  }

  render() {
    const Select = ({name, children}) => (
      <div className="form-group">
        <label className="control-label col-xs-6">
          {name}
        </label>

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
    )

    const Checkbox = ({name}) => (
      <div className="form-group">
        <label className="control-label col-xs-6">
          {name}
        </label>

        <div className="col-xs-6">
          <input
            type="checkbox"
            checked={this.state[name]}
            onChange={e => this.setState({ [name]: e.target.checked })}
          />
        </div>
      </div>
    )

    return (
      <div className="form-horizontal">
        <h2>Customization props</h2>
        <p>
          Try out various configuration options and see how they affect the component.
        </p>

        <DateTime
          defaultValue={new Date()}
          onChange={console.log}
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
          <option>L</option>
          <option>LL</option>
        </Select>

        <Select name="timeFormat">
          <option value="">false</option>
          <option>HH:mm A</option>
          <option>HH:mm:ss</option>
          <option>HH:mm:SSS</option>
          <option>hmm</option>
          <option>HH:mm Z</option>
          <option>LT</option>
          <option>LTS</option>
        </Select>

        <Select name="viewMode">
          <option>years</option>
          <option>months</option>
          <option>days</option>
          <option>time</option>
        </Select>

        <Checkbox name="utc" />

        <Checkbox name="closeOnSelect" />

        <Checkbox name="closeOnTab" />
      </div>
    )
  }
}
