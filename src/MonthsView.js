import React from 'react'
import createClass from 'create-react-class'
import onClickOutside from '@capaj/react-onclickoutside'

const DateTimePickerMonths = onClickOutside(
  createClass({
    render() {
      return React.createElement('div', { className: 'rdtMonths' }, [
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
                  onClick: this.props.subtractTime(1, 'years')
                },
                React.createElement('span', {}, '‹')
              ),
              React.createElement(
                'th',
                {
                  key: 'year',
                  className: 'rdtSwitch',
                  onClick: this.props.showView('years'),
                  colSpan: 2,
                  'data-value': this.props.viewDate.year()
                },
                this.props.viewDate.year()
              ),
              React.createElement(
                'th',
                {
                  key: 'next',
                  className: 'rdtNext',
                  onClick: this.props.addTime(1, 'years')
                },
                React.createElement('span', {}, '›')
              )
            ])
          )
        ),
        React.createElement(
          'table',
          { key: 'months' },
          React.createElement('tbody', { key: 'b' }, this.renderMonths())
        )
      ])
    },

    renderMonths() {
      const date = this.props.selectedDate
      const month = this.props.viewDate.month()
      const year = this.props.viewDate.year()
      const rows = []
      let i = 0
      let months = []
      const renderer = this.props.renderMonth || this.renderMonth
      const isValid = this.props.isValidDate || this.alwaysValidDate
      let classes
      let props
      let currentMonth
      let isDisabled
      let noOfDaysInMonth
      let daysInMonth
      let validDay

      const // Date is irrelevant because we're only interested in month
        irrelevantDate = 1

      while (i < 12) {
        classes = 'rdtMonth'
        currentMonth = this.props.viewDate
          .clone()
          .set({ year, month: i, date: irrelevantDate })

        noOfDaysInMonth = currentMonth.endOf('month').format('D')
        daysInMonth = Array.from({ length: noOfDaysInMonth }, (e, i) => i + 1)

        validDay = daysInMonth.find((d) => {
          const day = currentMonth.clone().set('date', d)
          return isValid(day)
        })

        isDisabled = validDay === undefined

        if (isDisabled) classes += ' rdtDisabled'

        if (date && i === date.month() && year === date.year())
          classes += ' rdtActive'

        props = {
          key: i,
          'data-value': i,
          className: classes
        }

        if (!isDisabled)
          props.onClick =
            this.props.updateOn === 'months'
              ? this.updateSelectedMonth
              : this.props.setDate('month')

        months.push(renderer(props, i, year, date && date.clone()))

        if (months.length === 4) {
          rows.push(
            React.createElement(
              'tr',
              { key: `${month}_${rows.length}` },
              months
            )
          )
          months = []
        }

        i++
      }

      return rows
    },

    updateSelectedMonth(event) {
      this.props.updateSelectedDate(event)
    },

    renderMonth(props, month) {
      const localMoment = this.props.viewDate
      const monthStr = localMoment
        .localeData()
        .monthsShort(localMoment.month(month))
      const strLength = 3
      // Because some months are up to 5 characters long, we want to
      // use a fixed string length for consistency
      const monthStrFixedLength = monthStr.substring(0, strLength)
      return React.createElement('td', props, capitalize(monthStrFixedLength))
    },

    alwaysValidDate() {
      return 1
    },

    handleClickOutside() {
      this.props.handleClickOutside()
    }
  })
)

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default DateTimePickerMonths
