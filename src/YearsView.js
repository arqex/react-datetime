import React from 'react'
import createClass from 'create-react-class'
import onClickOutside from '@capaj/react-onclickoutside'

const DateTimePickerYears = onClickOutside(
  createClass({
    render() {
      const year = parseInt(this.props.viewDate.year() / 10, 10) * 10

      return React.createElement('div', { className: 'rdtYears' }, [
        React.createElement(
          'table',
          { key: 'a' },
          React.createElement(
            'thead',
            {},
            React.createElement('tr', {}, [
              React.createElement(
                'th',
                {
                  key: 'prev',
                  className: 'rdtPrev',
                  onClick: this.props.subtractTime(10, 'years')
                },
                React.createElement('span', {}, '‹')
              ),
              React.createElement(
                'th',
                {
                  key: 'year',
                  className: 'rdtSwitch',
                  onClick: this.props.showView('years'),
                  colSpan: 2
                },
                `${year}-${year + 9}`
              ),
              React.createElement(
                'th',
                {
                  key: 'next',
                  className: 'rdtNext',
                  onClick: this.props.addTime(10, 'years')
                },
                React.createElement('span', {}, '›')
              )
            ])
          )
        ),
        React.createElement(
          'table',
          { key: 'years' },
          React.createElement('tbody', {}, this.renderYears(year))
        )
      ])
    },

    renderYears(year) {
      let years = []
      let i = -1
      const rows = []
      const renderer = this.props.renderYear || this.renderYear
      const selectedDate = this.props.selectedDate
      const isValid = this.props.isValidDate || this.alwaysValidDate
      let classes
      let props
      let currentYear
      let isDisabled
      let noOfDaysInYear
      let daysInYear
      let validDay

      const // Month and date are irrelevant here because
        // we're only interested in the year
        irrelevantMonth = 0

      const irrelevantDate = 1
      year--
      while (i < 11) {
        classes = 'rdtYear'
        currentYear = this.props.viewDate
          .clone()
          .set({ year, month: irrelevantMonth, date: irrelevantDate })

        // Not sure what 'rdtOld' is for, commenting out for now as it's not working properly
        // if ( i === -1 | i === 10 )
        // classes += ' rdtOld';

        noOfDaysInYear = currentYear.endOf('year').format('DDD')
        daysInYear = Array.from({ length: noOfDaysInYear }, (e, i) => i + 1)

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
          rows.push(React.createElement('tr', { key: i }, years))
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
      return React.createElement('td', props, year)
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
