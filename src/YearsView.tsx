import React from 'react'
import createClass from 'create-react-class'
import onClickOutside from '@capaj/react-onclickoutside'

const DateTimePickerYears = onClickOutside(
  createClass({
    render() {
      const year = parseInt(this.props.viewDate.year() / 10, 10) * 10
      return (
        <div className="rdtYears">
          <table key="a">
            <thead>
              <tr>
                <th
                  key="prev"
                  className="rdtPrev"
                  onClick={this.props.subtractTime(10, 'years')}
                >
                  <span>‹</span>
                </th>
                <th
                  key="year"
                  className="rdtSwitch"
                  onClick={this.props.showView('years')}
                  colSpan={2}
                >{`${year}-${year + 9}`}</th>
                <th
                  key="next"
                  className="rdtNext"
                  onClick={this.props.addTime(10, 'years')}
                >
                  <span>›</span>
                </th>
              </tr>
            </thead>
          </table>
          <table key="years">
            <tbody>{this.renderYears(year)}</tbody>
          </table>
        </div>
      )
    },

    renderYears(year) {
      let years = []
      let i = -1
      const rows = []
      const renderer = this.props.renderYear || this.renderYear
      const selectedDate = this.props.selectedDate
      const isValid = this.props.isValidDate || this.alwaysValidDate
      let classes: string
      let props
      let currentYear
      let isDisabled: boolean
      let noOfDaysInYear
      let daysInYear: number[]
      let validDay: number
      const // Month and date are irrelevant here because
        // we're only interested in the year
        irrelevantMonth = 0
      const irrelevantDate = 1
      year--

      while (i < 11) {
        classes = 'rdtYear'
        currentYear = this.props.viewDate.clone().set({
          year,
          month: irrelevantMonth,
          date: irrelevantDate
        }) // Not sure what 'rdtOld' is for, commenting out for now as it's not working properly
        // if ( i === -1 | i === 10 )
        // classes += ' rdtOld';

        noOfDaysInYear = currentYear.endOf('year').format('DDD')
        daysInYear = Array.from(
          {
            length: noOfDaysInYear
          },
          (e, i) => i + 1
        )
        validDay = daysInYear.find((d) => {
          const day = currentYear.clone().dayOfYear(d)
          return isValid(day)
        })
        isDisabled = validDay === undefined
        if (isDisabled) classes += ' rdtDisabled'
        if (selectedDate && selectedDate.year() === year)
          classes += ' rdtActive'
        props = {
          key: year,
          'data-value': year,
          className: classes
        }
        if (!isDisabled)
          props.onClick =
            this.props.updateOn === 'years'
              ? this.updateSelectedYear
              : this.props.setDate('year')
        years.push(renderer(props, year, selectedDate && selectedDate.clone()))

        if (years.length === 4) {
          rows.push(<tr key={i}>{years}</tr>)
          years = []
        }

        year++
        i++
      }

      return rows
    },

    updateSelectedYear(event) {
      this.props.updateSelectedDate(event)
    },

    renderYear(props, year) {
      return <td {...props}>{year}</td>
    },

    alwaysValidDate() {
      return 1
    },

    handleClickOutside() {
      this.props.handleClickOutside()
    }
  })
)
export default DateTimePickerYears
