'use strict'
var React = require('react')
var createClass = require('create-react-class')
var DaysView = require('./DaysView')
var MonthsView = require('./MonthsView')
var YearsView = require('./YearsView')
var TimeView = require('./TimeView')

var CalendarContainer = createClass({
  viewComponents: {
    days: DaysView,
    months: MonthsView,
    years: YearsView,
    time: TimeView
  },

  render: function() {
    return React.createElement(
      this.viewComponents[this.props.view],
      this.props.viewProps
    )
  }
})

module.exports = CalendarContainer
