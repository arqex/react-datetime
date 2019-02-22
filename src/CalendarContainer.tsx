import React from 'react'
import DaysView from './DaysView'
import MonthsView from './MonthsView'
import YearsView from './YearsView'
import TimeView from './TimeView'

const viewComponents = {
  days: DaysView,
  months: MonthsView,
  years: YearsView,
  time: TimeView
}

function CalendarContainer(props: {
  view: keyof typeof viewComponents
  viewProps: any
}) {
  return React.createElement(viewComponents[props.view], props.viewProps)
}

export default CalendarContainer
