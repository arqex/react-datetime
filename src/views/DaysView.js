import React from 'react'
import createReactClass from 'create-react-class'
import cx from 'classnames'

const defaultRenderDay = ({ date, className, onClick }) =>
  <td className={className} onClick={onClick}>{ date.date() }</td>

const DaysView = createReactClass({
  displayName: 'DaysView',

  getLocale () {
    return this.props.viewDate.localeData()
  },

  getDaysOfWeek () {
    const locale = this.getLocale()
    const dow = locale.weekdaysMin()
    const first = locale.firstDayOfWeek()

    return [ ...dow.slice(first), ...dow.slice(0, first) ]
  },

  selectDate (date) {
    this.props.updateSelectedDate({ year: date.year(), month: date.month(), date: date.date() })
  },

  renderHeading () {
    const { viewDate, addTime, showView } = this.props
    const year = viewDate.year()
    const month = viewDate.month()
    const monthName = this.getLocale().months()[month]

    return (
      <thead>
        <tr>
          <th className='rdtPrev' onClick={() => addTime(-1, 'months')}>◀</th>
          <th className='rdtSwitch' onClick={() => showView('months')} colSpan={5}>{ `${monthName} ${year}` }</th>
          <th className='rdtNext' onClick={() => addTime(1, 'months')}>▶</th>
        </tr>
        <tr>
          { this.getDaysOfWeek().map((day, index) => <th key={index} className='rdtDoW'>{ day }</th>) }
        </tr>
      </thead>
    )
  },

  renderDays () {
    const { viewDate, selectedDate, renderDay, isValidDate } = this.props
    const startDate = viewDate.clone().subtract(1, 'month').endOf('month').startOf('week')
    const Day = renderDay || defaultRenderDay
    const today = Date.now()

    const weeks = [0, 1, 2, 3, 4, 5].map(week => {
      const days = [0, 1, 2, 3, 4, 5, 6].map(day => {
        const date = startDate.clone().add(week * 7 + day, 'days')
        const isActive = selectedDate && date.isSame(selectedDate, 'day')
        const isDisabled = isValidDate && !isValidDate(date.clone(), selectedDate && selectedDate.clone())

        const classes = cx('rdtDay', {
          rdtActive: isActive,
          rdtDisabled: isDisabled,
          rdtToday: date.isSame(today, 'day'),
          rdtOld: date.isBefore(viewDate, 'month'),
          rdtNew: date.isAfter(viewDate, 'month')
        })

        const props = {
          date: date.clone(),
          selectedDate: selectedDate && selectedDate.clone(),
          className: classes,
          onClick: isDisabled ? null : () => this.selectDate(date)
        }

        return <Day key={date.dayOfYear()} {...props} />
      })

      return <tr key={week}>{ days }</tr>
    })

    return <tbody>{ weeks }</tbody>
  },

  renderFooter () {
    const { timeFormat, selectedDate, viewDate, showView } = this.props

    return !timeFormat ? null : (
      <tfoot>
        <tr>
          <td className='rdtSwitch' onClick={() => showView('time')} colSpan={7}>
            { (selectedDate || viewDate).format(timeFormat) }
          </td>
        </tr>
      </tfoot>
    )
  },

  render () {
    return (
      <div className='rdtDays'>
        <table>
          { this.renderHeading() }
          { this.renderDays() }
          { this.renderFooter() }
        </table>
      </div>
    )
  }
})

export default DaysView
