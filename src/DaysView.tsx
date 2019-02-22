import React from 'react'
import createClass from 'create-react-class'
import moment, { Moment } from 'moment'
import onClickOutside from '@capaj/react-onclickoutside'

const DateTimePickerDays = onClickOutside(
  createClass({
    render() {
      const footer = this.renderFooter()
      const date = this.props.viewDate
      const locale = date.localeData()
      let tableChildren
      tableChildren = [
        <thead key="th">
          <tr key="h">
            <th
              key="p"
              className="rdtPrev"
              onClick={this.props.subtractTime(1, 'months')}
            >
              <span>‹</span>
            </th>
            <th
              key="s"
              className="rdtSwitch"
              onClick={this.props.showView('months')}
              colSpan={5}
              data-value={this.props.viewDate.month()}
            >{`${locale.months(date)} ${date.year()}`}</th>
            <th
              key="n"
              className="rdtNext"
              onClick={this.props.addTime(1, 'months')}
            >
              <span>›</span>
            </th>
          </tr>
          <tr key="d">
            {this.getDaysOfWeek(locale).map((day, index) => (
              <th key={day + index} className="dow">
                {day}
              </th>
            ))}
          </tr>
        </thead>,
        <tbody key="tb">{this.renderDays()}</tbody>
      ]
      if (footer) tableChildren.push(footer)
      return (
        <div className="rdtDays">
          <table>{tableChildren}</table>
        </div>
      )
    },

    /**
     * Get a list of the days of the week
     * depending on the current locale
     * @return {array} A list with the shortname of the days
     */
    getDaysOfWeek(locale: moment.Locale) {
      // @ts-ignore
      const days = locale._weekdaysMin
      const first = locale.firstDayOfWeek()
      const dow = []
      let i = 0
      days.forEach((day) => {
        dow[(7 + i++ - first) % 7] = day
      })
      return dow
    },

    renderDays() {
      const date = this.props.viewDate
      const selected =
        this.props.selectedDate && this.props.selectedDate.clone()
      const prevMonth = date.clone().subtract(1, 'months')
      const currentYear = date.year()
      const currentMonth = date.month()
      const weeks = []
      let days = []
      const renderer = this.props.renderDay || this.renderDay
      const isValid = this.props.isValidDate || this.alwaysValidDate
      let classes
      let isDisabled
      let dayProps
      let currentDate // Go to the last week of the previous month

      prevMonth.date(prevMonth.daysInMonth()).startOf('week')
      const lastDay = prevMonth.clone().add(42, 'd')

      while (prevMonth.isBefore(lastDay)) {
        classes = 'rdtDay'
        currentDate = prevMonth.clone()
        if (
          (prevMonth.year() === currentYear &&
            prevMonth.month() < currentMonth) ||
          prevMonth.year() < currentYear
        )
          classes += ' rdtOld'
        else if (
          (prevMonth.year() === currentYear &&
            prevMonth.month() > currentMonth) ||
          prevMonth.year() > currentYear
        )
          classes += ' rdtNew'
        if (selected && prevMonth.isSame(selected, 'day'))
          classes += ' rdtActive'
        if (prevMonth.isSame(moment(), 'day')) classes += ' rdtToday'
        isDisabled = !isValid(currentDate, selected)
        if (isDisabled) classes += ' rdtDisabled'
        dayProps = {
          key: prevMonth.format('M_D'),
          'data-value': prevMonth.date(),
          className: classes
        }
        if (!isDisabled) dayProps.onClick = this.updateSelectedDate
        days.push(renderer(dayProps, currentDate, selected))

        if (days.length === 7) {
          weeks.push(<tr key={prevMonth.format('M_D')}>{days}</tr>)
          days = []
        }

        prevMonth.add(1, 'd')
      }

      return weeks
    },

    updateSelectedDate(event) {
      this.props.updateSelectedDate(event, true)
    },

    renderDay(props, currentDate) {
      return <td {...props}>{currentDate.date()}</td>
    },

    renderFooter() {
      if (!this.props.timeFormat) return ''
      const date = this.props.selectedDate || this.props.viewDate
      return (
        <tfoot key="tf">
          <tr>
            <td
              onClick={this.props.showView('time')}
              colSpan={7}
              className="rdtTimeToggle"
            >
              {date.format(this.props.timeFormat)}
            </td>
          </tr>
        </tfoot>
      )
    },

    alwaysValidDate() {
      return 1
    },

    handleClickOutside() {
      this.props.handleClickOutside()
    }
  })
)
export default DateTimePickerDays
