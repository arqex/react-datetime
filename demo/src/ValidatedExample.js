import React, { Component } from 'react'
import DateTime from 'react-datetime'

export default class ValidatedExample extends Component {
  render() {
    return (
      <div>
        <h2>isValidDate</h2>
        <p>
          You can use "isValidDate" to disable all dates after last month.
        </p>
        <DateTime
          viewMode='months'
          dateFormat='MMMM'
          isValidDate={current => current.isBefore(DateTime.moment().startOf('month'))}
          onChange={console.log}
        />
      </div>
    )
  }
}
