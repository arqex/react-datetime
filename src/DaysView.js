import React from 'react'
import createClass from 'create-react-class'
import moment from 'moment'
import onClickOutside from '@capaj/react-onclickoutside'

const DateTimePickerDays = onClickOutside(
  createClass({
    render() {
      const footer = this.renderFooter()
      const date = this.props.viewDate
      const locale = date.localeData()
      let tableChildren

      tableChildren = [
        React.createElement('thead', { key: 'th' }, [
          React.createElement('tr', { key: 'h' }, [
            React.createElement(
              'th',
              {
                key: 'p',
                className: 'rdtPrev',
                onClick: this.props.subtractTime(1, 'months')
              },
              React.createElement('span', {}, '‹')
            ),
            React.createElement(
              'th',
              {
                key: 's',
                className: 'rdtSwitch',
                onClick: this.props.showView('months'),
                colSpan: 5,
                'data-value': this.props.viewDate.month()
              },
              `${locale.months(date)} ${date.year()}`
            ),
            React.createElement(
              'th',
              {
                key: 'n',
                className: 'rdtNext',
                onClick: this.props.addTime(1, 'months')
              },
              React.createElement('span', {}, '›')
            )
          ]),
          React.createElement(
            'tr',
            { key: 'd' },
            this.getDaysOfWeek(locale).map((day, index) =>
              React.createElement(
                'th',
                { key: day + index, className: 'dow' },
                day
              )
            )
          )
        ]),
        React.createElement('tbody', { key: 'tb' }, this.renderDays())
      ]

      if (footer) tableChildren.push(footer)

      return React.createElement(
        'div',
        { className: 'rdtDays' },
        React.createElement('table', {}, tableChildren)
      )
    },

    /**
     * Get a list of the days of the week
     * depending on the current locale
     * @return {array} A list with the shortname of the days
     */
    getDaysOfWeek(locale) {
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
      let currentDate

      // Go to the last week of the previous month
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
          weeks.push(
            React.createElement('tr', { key: prevMonth.format('M_D') }, days)
          )
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
      return React.createElement('td', props, currentDate.date())
    },

    renderFooter() {
      if (!this.props.timeFormat) return ''

      const date = this.props.selectedDate || this.props.viewDate

      return React.createElement(
        'tfoot',
        { key: 'tf' },
        React.createElement(
          'tr',
          {},
          React.createElement(
            'td',
            {
              onClick: this.props.showView('time'),
              colSpan: 7,
              className: 'rdtTimeToggle'
            },
            date.format(this.props.timeFormat)
          )
        )
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
