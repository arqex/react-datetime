import React from 'react'
import createReactClass from 'create-react-class'
import cx from 'classnames'

const defaultRenderMonth = ({ month, localeData, className, onClick }) => {
  const name = localeData.monthsShort()[month].replace(/\.$/, '')
  return <td className={className} onClick={onClick}>{ name }</td>
}

const MonthsView = createReactClass({
  displayName: 'MonthsView',

  isValidMonth (month) {
    const { isValidDate, viewDate } = this.props
    if (!isValidDate)
      return true

    const date = viewDate.clone().month(month).startOf('month')
    for (; date.month() === month; date.add(1, 'day'))
      if (isValidDate(date.clone()))
        return true

    return false
  },

  selectMonth (month, year) {
    const { updateOn, updateSelectedDate, setDate } = this.props

    return updateOn === 'months' ? updateSelectedDate({ year, month }) : setDate('month', month)
  },

  renderHeading () {
    const { viewDate, addTime, showView } = this.props
    const year = viewDate.year()

    return (
      <table>
        <thead>
          <tr>
            <th className='rdtPrev' onClick={() => addTime(-1, 'years')}>◀</th>
            <th className='rdtSwitch' onClick={() => showView('years')} colSpan={2}>{year}</th>
            <th className='rdtNext' onClick={() => addTime(1, 'years')}>▶</th>
          </tr>
        </thead>
      </table>
    )
  },

  renderMonths () {
    const { viewDate, selectedDate, renderMonth } = this.props
    const year = viewDate.year()
    const localeData = viewDate.localeData()
    const Month = renderMonth || defaultRenderMonth

    const rows = [0, 1, 2].map(row => {
      const cols = [0, 1, 2, 3].map(col => {
        const month = row * 4 + col
        const isActive = selectedDate && selectedDate.month() === month && selectedDate.year() === year
        const isDisabled = !this.isValidMonth(month)

        const classes = cx('rdtMonth', {
          rdtActive: isActive,
          rdtDisabled: isDisabled
        })

        const props = {
          month,
          year,
          localeData,
          selectedDate: selectedDate && selectedDate.clone(),
          className: classes,
          onClick: isDisabled ? null : () => this.selectMonth(month, year)
        }

        return <Month key={month} {...props} />
      })

      return <tr key={row}>{ cols }</tr>
    })

    return <table><tbody>{ rows }</tbody></table>
  },

  render () {
    return (
      <div className='rdtMonths'>
        { this.renderHeading() }
        { this.renderMonths() }
      </div>
    )
  }
})

export default MonthsView
