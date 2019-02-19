import DateTime from '../DateTime.js'
import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

ReactDOM.render(
  React.createElement(DateTime, {
    viewMode: 'months',
    dateFormat: 'MMMM',
    isValidDate(current) {
      return current.isBefore(moment().startOf('month'))
    }
  }),
  document.getElementById('datetime')
)
