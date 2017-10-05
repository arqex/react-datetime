import DateTime from '../src/DateTime'
import React from 'react'
import ReactDOM from 'react-dom'

const max = DateTime.moment().startOf('month')

const options = {
  dateFormat: 'DD/MM/YYYY',
  timeFormat: 'h:mm:ss SSS A',
  isValidDate: current => current.isBefore(max)
}

ReactDOM.render(<DateTime {...options} />, document.getElementById('datetime'))
