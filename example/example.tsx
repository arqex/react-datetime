import DateTime from '../src/DateTime'
import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

ReactDOM.render(
  <div>
    month view
    <DateTime
      viewMode="months"
      dateFormat="MMMM"
      isValidDate={(current) => {
        return current.isBefore(moment().startOf('month'))
      }}
    />
    regular
    <DateTime />
  </div>,
  document.getElementById('datetime')
)
