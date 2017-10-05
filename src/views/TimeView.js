import React from 'react'
import createReactClass from 'create-react-class'

const separator = <div className='rdtCounterSeparator'>:</div>
const pad2 = value => ('00' + (value || '')).slice(-2)
const capitalise = str => str[0].toUpperCase() + str.slice(1)

const format12Hours = hours => (hours + 12 - 1) % 12 + 1
const format24Hours = hours => hours
const formatHours = meridiem => meridiem ? format12Hours : format24Hours

const defaultTimeConstraints = {
  hours: { min: 0, max: 23, step: 1 },
  minutes: { min: 0, max: 59, step: 1 },
  seconds: { min: 0, max: 59, step: 1 }
}

const TimeView = createReactClass({
  displayName: 'TimeView',

  getInitialState () {
    const { selectedDate, viewDate, timeFormat } = this.props
    const date = selectedDate || viewDate

    return {
      date,
      ms: date.milliseconds(),
      parts: this.calculateParts(timeFormat),
    }
  },

  componentWillReceiveProps({ selectedDate, viewDate, timeFormat }) {
    const state = {}

    const date = selectedDate || viewDate
    if (date !== this.state.date) {
      state.date = date
      state.ms = date.milliseconds()
    }

    if (timeFormat !== this.props.timeFormat) {
      state.parts = this.calculateParts({ timeFormat })
    }

    this.setState(state)
  },

  componentWillUnmount() {
    this.clearTimers()
  },

  calculateParts(format) {
    const hours = format.toLowerCase().indexOf('h') !== -1
    const minutes = hours && format.indexOf('m') !== -1
    const seconds = minutes && format.indexOf('s') !== -1
    const milliseconds = seconds && format.indexOf('S') !== -1
    const meridiem = format[format.toLowerCase().indexOf('a')]

    return { hours, minutes, seconds, milliseconds, meridiem }
  },

  toggleMeridiem () {
    const { min, max } = defaultTimeConstraints.hours // this.timeConstraints.hours TODO
    const hours = Math.min(max, Math.max(min, (this.state.date.hours() + 12) % 24))

    this.props.setTime('hours', hours)
  },

  updateMilliseconds (e) {
    const { value } = e.target
    const ms = parseInt(value, 10)

    if (ms.toString() === value && ms >= 0 && ms < 1000) {
      this.props.setTime('milliseconds', ms)
    } else {
      this.setState({ ms: value })
    }
  },

  increase (type) {
    const { min, max, step } = defaultTimeConstraints[type] // this.props TODO
    let value = this.state.date[type]() + step
    value = value > max ? min + (value - (max + 1)) : value

    this.setState({ date: this.state.date.clone()[type](value) })
  },

  decrease (type) {
    const { min, max, step } = defaultTimeConstraints[type] // this.props TODO
    let value = this.state.date[type]() - step
    value = value < min ? max + 1 - (min - value) : value

    this.setState({ date: this.state.date.clone()[type](value) })
  },

  clearTimers() {
    clearTimeout(this._repeatTimer)
    clearInterval(this._increaseTimer)

    if (this._mouseUpHandler) {
      document.body.removeEventListener('mouseup', this._mouseUpHandler)
      this._mouseUpHandler = null
    }
  },

  onStartClicking (action, type) {
    this[action](type)

    this.clearTimers()

    this._repeatTimer = setTimeout(() => {
      this._increaseTimer = setInterval(() => this[action](type), 70)
    }, 500)

    this._mouseUpHandler = () => {
      this.clearTimers()
      this.props.setTime(type, this.state.date[type]())
    }

    document.body.addEventListener('mouseup', this._mouseUpHandler)
  },

  renderCounter (type) {
    const value = this.state.date[type]()
    const formatter = type === 'hours' ? formatHours(this.state.parts.meridiem) : pad2

    return (
      <div className={`rdtCounter rdt${capitalise(type)}`}>
        <button onMouseDown={() => this.onStartClicking('increase', type)}>▲</button>
        <div className='rdtCount'>{ formatter(value) }</div>
        <button onMouseDown={() => this.onStartClicking('decrease', type)}>▼</button>
      </div>
    )
  },

  renderMeridiem () {
    const { date, parts: { meridiem } } = this.state

    return (
      <div className='rdtCounter rdtMeridiem'>
        <button onMouseDown={this.toggleMeridiem}>▲</button>
        <div className='rdtCount'>{ date.format(meridiem) }</div>
        <button onMouseDown={this.toggleMeridiem}>▼</button>
      </div>
    )
  },

  renderMilliseconds() {
    return (
      <div className='rdtCounter rdtMilli'>
        <input type='text' value={this.state.ms} onChange={this.updateMilliseconds} />
      </div>
    )
  },

  renderCounters() {
    const { hours, minutes, seconds, meridiem, milliseconds } = this.state.parts

    return (
      <div className='rdtCounters'>
        { hours && this.renderCounter('hours') }
        { minutes && separator }
        { minutes && this.renderCounter('minutes') }
        { seconds && separator }
        { seconds && this.renderCounter('seconds') }
        { meridiem && this.renderMeridiem() }
        { milliseconds && !meridiem && separator }
        { milliseconds && this.renderMilliseconds() }
      </div>
    )
  },

  renderHeader () {
    const { dateFormat } = this.props

    return !dateFormat ? null : (
      <table>
        <thead>
          <tr>
            <th className='rdtSwitch' onClick={() => this.props.showView('days')}>
              { this.state.date.format(dateFormat) }
            </th>
          </tr>
        </thead>
      </table>
    )
  },

  render () {
    return (
      <div className='rdtTime'>
        { this.renderHeader() }
        { this.renderCounters() }
      </div>
    )
  }
})

export default TimeView
