import React from 'react'
import createReactClass from 'create-react-class'
import cx from 'classnames'

const defaultRenderYear = ({ year, className, onClick }) =>
  <td className={className} onClick={onClick}>{year}</td>

const YearsView = createReactClass({
  displayName: 'YearsView',

  isValidYear (year) {
    const { isValidDate, viewDate } = this.props
    if (!isValidDate)
      return true

    const date = viewDate.clone().year(year).startOf('year')
    for (; date.year() === year; date.add(1, 'day'))
      if (isValidDate(date.clone()))
        return true

    return false
  },

  selectYear (year) {
    const { updateOn, updateSelectedDate, setDate } = this.props

    return updateOn === 'years' ? updateSelectedDate({ year }) : setDate('year', year)
  },

  renderHeading (startYear) {
    const { addTime } = this.props

    return (
      <table>
        <thead>
          <tr>
            <th className='rdtPrev' onClick={() => addTime(-10, 'years')}>◀</th>
            <th className='rdtSwitch' colSpan={2}>{startYear}-{startYear+9}</th>
            <th className='rdtNext' onClick={() => addTime(10, 'years')}>▶</th>
          </tr>
        </thead>
      </table>
    )
  },

  renderYears (startYear) {
    const { selectedDate, renderYear } = this.props
    const Year = renderYear || defaultRenderYear

    const rows = [0, 1, 2].map(row => {
      const cols = [0, 1, 2, 3].map(col => {
        const index = row * 4 + col
        const year = startYear + index - 1
        const isActive = selectedDate && selectedDate.year() === year
        const isDisabled = !this.isValidYear(year)

        const classes = cx('rdtYear', {
          rdtActive: isActive,
          rdtDisabled: isDisabled,
          rdtOld: year < startYear,
          rdtNew: year > startYear + 9
        })

        const props = {
          year: year,
          selectedDate: selectedDate && selectedDate.clone(),
          className: classes,
          onClick: isDisabled ? null : () => this.selectYear(year)
        }

        return <Year key={col} {...props} />
      })

      return <tr key={row}>{ cols }</tr>
    })

    return <table><tbody>{ rows }</tbody></table>
  },

  render () {
    const startYear = Math.floor(this.props.viewDate.year() / 10) * 10

    return (
      <div className='rdtYears'>
        { this.renderHeading(startYear) }
        { this.renderYears(startYear) }
      </div>
    )
  }
})

export default YearsView
