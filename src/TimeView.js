import React from 'react'
import createClass from 'create-react-class'
import assign from 'object-assign'
import onClickOutside from '@capaj/react-onclickoutside'

const DateTimePickerTime = onClickOutside(
  createClass({
    getInitialState() {
      return this.calculateState(this.props)
    },

    calculateState({ selectedDate, viewDate, timeFormat }) {
      const date = selectedDate || viewDate
      const format = timeFormat
      const counters = []
      if (format.toLowerCase().includes('h')) {
        counters.push('hours')
        if (format.includes('m')) {
          counters.push('minutes')
          if (format.includes('s')) {
            counters.push('seconds')
          }
        }
      }

      const hours = date.format('H')

      let daypart = false
      if (
        this.state !== null &&
        this.props.timeFormat.toLowerCase().includes(' a')
      ) {
        if (this.props.timeFormat.includes(' A')) {
          daypart = hours >= 12 ? 'PM' : 'AM'
        } else {
          daypart = hours >= 12 ? 'pm' : 'am'
        }
      }

      return {
        hours,
        minutes: date.format('mm'),
        seconds: date.format('ss'),
        milliseconds: date.format('SSS'),
        daypart,
        counters
      }
    },

    renderCounter(type) {
      if (type !== 'daypart') {
        let value = this.state[type]
        if (
          type === 'hours' &&
          this.props.timeFormat.toLowerCase().includes(' a')
        ) {
          value = ((value - 1) % 12) + 1

          if (value === 0) {
            value = 12
          }
        }
        return React.createElement(
          'div',
          { key: type, className: 'rdtCounter' },
          [
            React.createElement(
              'span',
              {
                key: 'up',
                className: 'rdtBtn',
                onTouchStart: this.onStartClicking('increase', type),
                onMouseDown: this.onStartClicking('increase', type),
                onContextMenu: this.disableContextMenu
              },
              '▲'
            ),
            React.createElement(
              'div',
              { key: 'c', className: 'rdtCount' },
              value
            ),
            React.createElement(
              'span',
              {
                key: 'do',
                className: 'rdtBtn',
                onTouchStart: this.onStartClicking('decrease', type),
                onMouseDown: this.onStartClicking('decrease', type),
                onContextMenu: this.disableContextMenu
              },
              '▼'
            )
          ]
        )
      }
      return ''
    },

    renderDayPart() {
      return React.createElement(
        'div',
        { key: 'dayPart', className: 'rdtCounter' },
        [
          React.createElement(
            'span',
            {
              key: 'up',
              className: 'rdtBtn',
              onTouchStart: this.onStartClicking('toggleDayPart', 'hours'),
              onMouseDown: this.onStartClicking('toggleDayPart', 'hours'),
              onContextMenu: this.disableContextMenu
            },
            '▲'
          ),
          React.createElement(
            'div',
            { key: this.state.daypart, className: 'rdtCount' },
            this.state.daypart
          ),
          React.createElement(
            'span',
            {
              key: 'do',
              className: 'rdtBtn',
              onTouchStart: this.onStartClicking('toggleDayPart', 'hours'),
              onMouseDown: this.onStartClicking('toggleDayPart', 'hours'),
              onContextMenu: this.disableContextMenu
            },
            '▼'
          )
        ]
      )
    },

    render() {
      const me = this
      const counters = []
      this.state.counters.forEach((c) => {
        if (counters.length)
          counters.push(
            React.createElement(
              'div',
              {
                key: `sep${counters.length}`,
                className: 'rdtCounterSeparator'
              },
              ':'
            )
          )
        counters.push(me.renderCounter(c))
      })

      if (this.state.daypart !== false) {
        counters.push(me.renderDayPart())
      }

      if (
        this.state.counters.length === 3 &&
        this.props.timeFormat.includes('S')
      ) {
        counters.push(
          React.createElement(
            'div',
            { className: 'rdtCounterSeparator', key: 'sep5' },
            ':'
          )
        )
        counters.push(
          React.createElement(
            'div',
            { className: 'rdtCounter rdtMilli', key: 'm' },
            React.createElement('input', {
              value: this.state.milliseconds,
              type: 'text',
              onChange: this.updateMilli
            })
          )
        )
      }

      return React.createElement(
        'div',
        { className: 'rdtTime' },
        React.createElement('table', {}, [
          this.renderHeader(),
          React.createElement(
            'tbody',
            { key: 'b' },
            React.createElement(
              'tr',
              {},
              React.createElement(
                'td',
                {},
                React.createElement(
                  'div',
                  { className: 'rdtCounters' },
                  counters
                )
              )
            )
          )
        ])
      )
    },

    componentWillMount() {
      const me = this
      me.timeConstraints = {
        hours: {
          min: 0,
          max: 23,
          step: 1
        },
        minutes: {
          min: 0,
          max: 59,
          step: 1
        },
        seconds: {
          min: 0,
          max: 59,
          step: 1
        },
        milliseconds: {
          min: 0,
          max: 999,
          step: 1
        }
      }
      ;['hours', 'minutes', 'seconds', 'milliseconds'].forEach((type) => {
        assign(me.timeConstraints[type], me.props.timeConstraints[type])
      })
      this.setState(this.calculateState(this.props))
    },

    componentWillReceiveProps(nextProps) {
      this.setState(this.calculateState(nextProps))
    },

    updateMilli({ target }) {
      const milli = parseInt(target.value, 10)
      if (milli === target.value && milli >= 0 && milli < 1000) {
        this.props.setTime('milliseconds', milli)
        this.setState({ milliseconds: milli })
      }
    },

    renderHeader() {
      if (!this.props.dateFormat) return null

      const date = this.props.selectedDate || this.props.viewDate
      return React.createElement(
        'thead',
        { key: 'h' },
        React.createElement(
          'tr',
          {},
          React.createElement(
            'th',
            {
              className: 'rdtSwitch',
              colSpan: 4,
              onClick: this.props.showView('days')
            },
            date.format(this.props.dateFormat)
          )
        )
      )
    },

    onStartClicking(action, type) {
      const me = this

      return () => {
        const update = {}
        update[type] = me[action](type)
        me.setState(update)

        me.timer = setTimeout(() => {
          me.increaseTimer = setInterval(() => {
            update[type] = me[action](type)
            me.setState(update)
          }, 70)
        }, 500)

        me.mouseUpListener = () => {
          clearTimeout(me.timer)
          clearInterval(me.increaseTimer)
          me.props.setTime(type, me.state[type])
          document.body.removeEventListener('mouseup', me.mouseUpListener)
          document.body.removeEventListener('touchend', me.mouseUpListener)
        }

        document.body.addEventListener('mouseup', me.mouseUpListener)
        document.body.addEventListener('touchend', me.mouseUpListener)
      }
    },

    disableContextMenu(event) {
      event.preventDefault()
      return false
    },

    padValues: {
      hours: 1,
      minutes: 2,
      seconds: 2,
      milliseconds: 3
    },

    toggleDayPart(type) {
      // type is always 'hours'
      let value = parseInt(this.state[type], 10) + 12
      if (value > this.timeConstraints[type].max)
        value =
          this.timeConstraints[type].min +
          (value - (this.timeConstraints[type].max + 1))
      return this.pad(type, value)
    },

    increase(type) {
      let value =
        parseInt(this.state[type], 10) + this.timeConstraints[type].step
      if (value > this.timeConstraints[type].max)
        value =
          this.timeConstraints[type].min +
          (value - (this.timeConstraints[type].max + 1))
      return this.pad(type, value)
    },

    decrease(type) {
      let value =
        parseInt(this.state[type], 10) - this.timeConstraints[type].step
      if (value < this.timeConstraints[type].min)
        value =
          this.timeConstraints[type].max +
          1 -
          (this.timeConstraints[type].min - value)
      return this.pad(type, value)
    },

    pad(type, value) {
      let str = `${value}`
      while (str.length < this.padValues[type]) str = `0${str}`
      return str
    },

    handleClickOutside() {
      this.props.handleClickOutside()
    }
  })
)

export default DateTimePickerTime
