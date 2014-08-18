###* @jsx React.DOM ###

`import React from './react-es6'`
`import DateTimePickerMinutes from './DateTimePickerMinutes'`
`import DateTimePickerHours from './DateTimePickerHours'`
Glyphicon = require('react-bootstrap/Glyphicon')

DateTimePickerTime = React.createClass(

  propTypes:
    setSelectedHour: React.PropTypes.func.isRequired
    setSelectedMinute: React.PropTypes.func.isRequired
    subtractHour: React.PropTypes.func.isRequired
    addHour: React.PropTypes.func.isRequired
    subtractMinute: React.PropTypes.func.isRequired
    addMinute: React.PropTypes.func.isRequired
    viewDate: React.PropTypes.object.isRequired
    selectedDate: React.PropTypes.object.isRequired
    showHours: React.PropTypes.func.isRequired
    showMinutes: React.PropTypes.func.isRequired
    togglePeriod: React.PropTypes.func.isRequired

  getInitialState: ->
    minutesDisplayed: false
    hoursDisplayed: false

  showMinutes: ->
    @setState minutesDisplayed: true

  showHours: ->
    @setState hoursDisplayed: true

  renderMinutes: ->
    if @state.minutesDisplayed
      `(<DateTimePickerMinutes
            setSelectedMinute={this.props.setSelectedMinute}
       />
       )`
    else
      ''

  renderHours: ->
    if @state.hoursDisplayed
      `(<DateTimePickerHours
            setSelectedHour={this.props.setSelectedHour}
      />
      )`
    else
      ''

  renderPicker: ->
    if !@state.minutesDisplayed && !@state.hoursDisplayed
      `(
      <div className="timepicker-picker">
        <table className="table-condensed">
          <tbody>
            <tr>
              <td><a className="btn" onClick={this.props.addHour}><Glyphicon glyph="chevron-up" /></a></td>

              <td className="separator"></td>

              <td><a className="btn" onClick={this.props.addMinute}><Glyphicon glyph="chevron-up" /></a></td>

              <td className="separator"></td>
            </tr>

            <tr>
              <td><span className="timepicker-hour" onClick={this.showHours}>{this.props.selectedDate.format('h')}</span></td>

              <td className="separator">:</td>

              <td><span className="timepicker-minute" onClick={this.showMinutes}>{this.props.selectedDate.format('mm')}</span></td>

              <td className="separator"></td>

              <td><button className="btn btn-primary" onClick={this.props.togglePeriod} type="button">{this.props.selectedDate.format('A')}</button></td>
            </tr>

            <tr>
              <td><a className="btn" onClick={this.props.subtractHour}><Glyphicon glyph="chevron-down" /></a></td>

              <td className="separator"></td>

              <td><a className="btn" onClick={this.props.subtractMinute}><Glyphicon glyph="chevron-down" /></a></td>

              <td className="separator"></td>
            </tr>
          </tbody>
        </table>
      </div>
      )`
    else
      ''

  render: ->
    `(
        <div className="timepicker">
          {this.renderPicker()}

          {this.renderHours()}

          {this.renderMinutes()}
        </div>
    )`

)

`export default = DateTimePickerTime`