###* @jsx React.DOM ###

React = require 'react'
DateTimePickerDays = require './DateTimePickerDays'
DateTimePickerMonths = require './DateTimePickerMonths'
DateTimePickerYears = require './DateTimePickerYears'

DateTimePickerDate = React.createClass(
  propTypes:
    subtractMonth: React.PropTypes.func.isRequired
    addMonth: React.PropTypes.func.isRequired
    viewDate: React.PropTypes.object.isRequired
    selectedDate: React.PropTypes.object.isRequired
    showToday: React.PropTypes.bool
    daysOfWeekDisabled: React.PropTypes.array
    setSelectedDate: React.PropTypes.func.isRequired
    subtractYear: React.PropTypes.func.isRequired
    addYear: React.PropTypes.func.isRequired
    setViewMonth: React.PropTypes.func.isRequired
    setViewYear: React.PropTypes.func.isRequired
    addDecade: React.PropTypes.func.isRequired
    subtractDecade: React.PropTypes.func.isRequired

  getInitialState: ->
    daysDisplayed: true
    monthsDisplayed: false
    yearsDisplayed: false

  showMonths: ->
    @setState
      daysDisplayed: false
      monthsDisplayed: true

  showYears: ->
    @setState
      monthsDisplayed: false
      yearsDisplayed: true

  setViewYear: (e) ->
    @props.setViewYear(e.target.innerHTML)
    @setState
      yearsDisplayed: false
      monthsDisplayed: true

  setViewMonth: (e) ->
    @props.setViewMonth(e.target.innerHTML)
    @setState
      monthsDisplayed: false
      daysDisplayed: true

  renderDays: ->
    if @state.daysDisplayed
      `(
      <DateTimePickerDays
            addMonth={this.props.addMonth}
            subtractMonth={this.props.subtractMonth}
            setSelectedDate={this.props.setSelectedDate}
            viewDate={this.props.viewDate}
            selectedDate={this.props.selectedDate}
            showToday={this.props.showToday}
            daysOfWeekDisabled={this.props.daysOfWeekDisabled}
            showMonths={this.showMonths}
      />
      )`
    else
      ''

  renderMonths: ->
    if @state.monthsDisplayed
      `(
      <DateTimePickerMonths
            subtractYear={this.props.subtractYear}
            addYear={this.props.addYear}
            viewDate={this.props.viewDate}
            selectedDate={this.props.selectedDate}
            showYears={this.showYears}
            setViewMonth={this.setViewMonth}
      />
      )`
    else
      ''

  renderYears: ->
    if @state.yearsDisplayed
      `(
      <DateTimePickerYears
            viewDate={this.props.viewDate}
            selectedDate={this.props.selectedDate}
            setViewYear={this.setViewYear}
            addDecade={this.props.addDecade}
            subtractDecade={this.props.subtractDecade}
      />
      )`
    else
      ''

  render: ->
    `(
    <div className="datepicker">
      {this.renderDays()}

      {this.renderMonths()}

      {this.renderYears()}
    </div>
    )`

)

module.exports = DateTimePickerDate