import assign from 'object-assign'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import moment from 'moment'
import React from 'react'
import CalendarContainer from './src/CalendarContainer'

const viewModes = Object.freeze({
  YEARS: 'years',
  MONTHS: 'months',
  DAYS: 'days',
  TIME: 'time'
})

const TYPES = PropTypes
const Datetime = createClass({
  displayName: 'DateTime',
  propTypes: {
    // value: TYPES.object | TYPES.string,
    // defaultValue: TYPES.object | TYPES.string,
    // viewDate: TYPES.object | TYPES.string,
    onFocus: TYPES.func,
    onBlur: TYPES.func,
    onChange: TYPES.func,
    onViewModeChange: TYPES.func,
    onNavigateBack: TYPES.func,
    onNavigateForward: TYPES.func,
    locale: TYPES.string,
    timezone: TYPES.string,
    input: TYPES.bool,
    // dateFormat: TYPES.string | TYPES.bool,
    // timeFormat: TYPES.string | TYPES.bool,
    inputProps: TYPES.object,
    timeConstraints: TYPES.object,
    viewMode: TYPES.oneOf([
      viewModes.YEARS,
      viewModes.MONTHS,
      viewModes.DAYS,
      viewModes.TIME
    ]),
    isValidDate: TYPES.func,
    open: TYPES.bool,
    strictParsing: TYPES.bool,
    closeOnSelect: TYPES.bool,
    closeOnTab: TYPES.bool
  },

  getInitialState() {
    const state = this.getStateFromProps(this.props)

    if (state.open === undefined) state.open = !this.props.input

    state.currentView = this.props.dateFormat
      ? this.props.viewMode || state.updateOn || viewModes.DAYS
      : viewModes.TIME

    return state
  },

  parseDate(date, { datetime }) {
    let parsedDate

    if (date && typeof date === 'string')
      parsedDate = this.localMoment(date, datetime)
    else if (date) parsedDate = this.localMoment(date)
    if (parsedDate && !parsedDate.isValid()) parsedDate = null

    return parsedDate
  },

  getStateFromProps(props) {
    const formats = this.getFormats(props)
    const date = props.value || props.defaultValue
    let selectedDate
    let viewDate
    let updateOn
    let inputValue

    selectedDate = this.parseDate(date, formats)

    viewDate = this.parseDate(props.viewDate, formats)

    viewDate = selectedDate
      ? selectedDate.clone().startOf('month')
      : viewDate
      ? viewDate.clone().startOf('month')
      : this.localMoment().startOf('month')

    updateOn = this.getUpdateOn(formats)

    if (selectedDate) inputValue = selectedDate.format(formats.datetime)
    else if (date.isValid && !date.isValid()) inputValue = ''
    else inputValue = date || ''

    return {
      updateOn,
      inputFormat: formats.datetime,
      viewDate,
      selectedDate,
      inputValue,
      open: props.open
    }
  },

  getUpdateOn({ date }) {
    if (date.match(/[lLD]/)) {
      return viewModes.DAYS
    } else if (date.includes('M')) {
      return viewModes.MONTHS
    } else if (date.includes('Y')) {
      return viewModes.YEARS
    }

    return viewModes.DAYS
  },

  getFormats(props) {
    const formats = {
      date: props.dateFormat || '',
      time: props.timeFormat || ''
    }

    const locale = this.localMoment(props.date, null, props).localeData()
    if (formats.date === true) {
      formats.date = locale.longDateFormat('L')
    } else if (this.getUpdateOn(formats) !== viewModes.DAYS) {
      formats.time = ''
    }

    if (formats.time === true) {
      formats.time = locale.longDateFormat('LT')
    }

    formats.datetime =
      formats.date && formats.time
        ? `${formats.date} ${formats.time}`
        : formats.date || formats.time

    return formats
  },

  componentWillReceiveProps(nextProps) {
    const formats = this.getFormats(nextProps)
    let updatedState = {}
    if (
      nextProps.value !== this.props.value ||
      formats.datetime !== this.getFormats(this.props).datetime
    ) {
      updatedState = this.getStateFromProps(nextProps)
    }

    if (updatedState.open === undefined) {
      if (typeof nextProps.open !== 'undefined') {
        updatedState.open = nextProps.open
      } else if (
        this.props.closeOnSelect &&
        this.state.currentView !== viewModes.TIME
      ) {
        updatedState.open = false
      } else {
        updatedState.open = this.state.open
      }
    }

    if (nextProps.viewMode !== this.props.viewMode) {
      updatedState.currentView = nextProps.viewMode
    }

    if (nextProps.locale !== this.props.locale) {
      if (this.state.viewDate) {
        const updatedViewDate = this.state.viewDate
          .clone()
          .locale(nextProps.locale)
        updatedState.viewDate = updatedViewDate
      }
      if (this.state.selectedDate) {
        const updatedSelectedDate = this.state.selectedDate
          .clone()
          .locale(nextProps.locale)
        updatedState.selectedDate = updatedSelectedDate
        updatedState.inputValue = updatedSelectedDate.format(formats.datetime)
      }
    }

    if (nextProps.timezone !== this.props.timezone) {
      if (nextProps.timezone) {
        if (this.state.viewDate)
          updatedState.viewDate = this.state.viewDate
            .clone()
            .tz(nextProps.timezone, true)
        if (this.state.selectedDate) {
          updatedState.selectedDate = this.state.selectedDate
            .clone()
            .tz(nextProps.timezone, true)
          updatedState.inputValue = updatedState.selectedDate.format(
            formats.datetime
          )
        }
      } else {
        if (this.state.viewDate)
          updatedState.viewDate = this.state.viewDate.clone().local()
        if (this.state.selectedDate) {
          updatedState.selectedDate = this.state.selectedDate.clone().local()
          updatedState.inputValue = updatedState.selectedDate.format(
            formats.datetime
          )
        }
      }
    }

    if (nextProps.viewDate !== this.props.viewDate) {
      updatedState.viewDate = moment(nextProps.viewDate)
    }
    //we should only show a valid date if we are provided a isValidDate function. Removed in 2.10.3
    /*if (this.props.isValidDate) {
			updatedState.viewDate = updatedState.viewDate || this.state.viewDate;
			while (!this.props.isValidDate(updatedState.viewDate)) {
				updatedState.viewDate = updatedState.viewDate.add(1, 'day');
			}
		}*/
    this.setState(updatedState)
  },

  onInputChange(e) {
    const value = e.target === null ? e : e.target.value
    const localMoment = this.localMoment(value, this.state.inputFormat)
    const update = { inputValue: value }
    if (localMoment.isValid() && !this.props.value) {
      update.selectedDate = localMoment
      update.viewDate = localMoment.clone().startOf('month')
    } else {
      update.selectedDate = null
    }

    return this.setState(update, function() {
      return this.props.onChange(
        localMoment.isValid() ? localMoment : this.state.inputValue
      )
    })
  },

  onInputKey({ which }) {
    if (which === 9 && this.props.closeOnTab) {
      this.closeCalendar()
    }
  },

  showView(view) {
    const me = this
    return () => {
      me.state.currentView !== view && me.props.onViewModeChange(view)
      me.setState({ currentView: view })
    }
  },

  setDate(type) {
    const me = this

    const nextViews = {
      month: viewModes.DAYS,
      year: viewModes.MONTHS
    }

    return ({ target }) => {
      me.setState({
        viewDate: me.state.viewDate
          .clone()
          [type](parseInt(target.getAttribute('data-value'), 10))
          .startOf(type),
        currentView: nextViews[type]
      })
      me.props.onViewModeChange(nextViews[type])
    }
  },

  subtractTime(amount, type, toSelected) {
    const me = this
    return () => {
      me.props.onNavigateBack(amount, type)
      me.updateTime('subtract', amount, type, toSelected)
    }
  },

  addTime(amount, type, toSelected) {
    const me = this
    return () => {
      me.props.onNavigateForward(amount, type)
      me.updateTime('add', amount, type, toSelected)
    }
  },

  updateTime(op, amount, type, toSelected) {
    const update = {}
    const date = toSelected ? 'selectedDate' : 'viewDate'

    update[date] = this.state[date].clone()[op](amount, type)

    this.setState(update)
  },

  allowedSetTime: ['hours', 'minutes', 'seconds', 'milliseconds'],
  setTime(type, value) {
    let index = this.allowedSetTime.indexOf(type) + 1
    const state = this.state
    const date = (state.selectedDate || state.viewDate).clone()
    let nextType

    // It is needed to set all the time properties
    // to not to reset the time
    date[type](value)
    for (; index < this.allowedSetTime.length; index++) {
      nextType = this.allowedSetTime[index]
      date[nextType](date[nextType]())
    }

    if (!this.props.value) {
      this.setState({
        selectedDate: date,
        inputValue: date.format(state.inputFormat)
      })
    }
    this.props.onChange(date)
  },

  updateSelectedDate(e, close) {
    const target = e.target
    let modifier = 0
    const viewDate = this.state.viewDate
    const currentDate = this.state.selectedDate || viewDate
    let date

    if (target.className.includes('rdtDay')) {
      if (target.className.includes('rdtNew')) modifier = 1
      else if (target.className.includes('rdtOld')) modifier = -1

      date = viewDate
        .clone()
        .month(viewDate.month() + modifier)
        .date(parseInt(target.getAttribute('data-value'), 10))
    } else if (target.className.includes('rdtMonth')) {
      date = viewDate
        .clone()
        .month(parseInt(target.getAttribute('data-value'), 10))
        .date(currentDate.date())
    } else if (target.className.includes('rdtYear')) {
      date = viewDate
        .clone()
        .month(currentDate.month())
        .date(currentDate.date())
        .year(parseInt(target.getAttribute('data-value'), 10))
    }

    date
      .hours(currentDate.hours())
      .minutes(currentDate.minutes())
      .seconds(currentDate.seconds())
      .milliseconds(currentDate.milliseconds())

    if (!this.props.value) {
      const open = !(this.props.closeOnSelect && close)
      if (!open) {
        this.props.onBlur(date)
      }

      this.setState({
        selectedDate: date,
        viewDate: date.clone().startOf('month'),
        inputValue: date.format(this.state.inputFormat),
        open
      })
    } else {
      if (this.props.closeOnSelect && close) {
        this.closeCalendar()
      }
    }

    this.props.onChange(date)
  },

  openCalendar(e) {
    if (!this.state.open) {
      this.setState({ open: true }, function() {
        this.props.onFocus(e)
      })
    }
  },

  closeCalendar() {
    this.setState({ open: false }, function() {
      this.props.onBlur(this.state.selectedDate || this.state.inputValue)
    })
  },

  handleClickOutside() {
    if (
      this.props.input &&
      this.state.open &&
      !this.props.open &&
      !this.props.disableOnClickOutside
    ) {
      this.setState({ open: false }, function() {
        this.props.onBlur(this.state.selectedDate || this.state.inputValue)
      })
    }
  },

  localMoment(date, format, props) {
    props = props || this.props
    const momentFn = props.timezone
      ? (time) => moment(time).tz(props.timezone, true)
      : moment
    const m = momentFn(date, format, props.strictParsing)
    if (props.locale) m.locale(props.locale)
    return m
  },

  componentProps: {
    fromProps: [
      'value',
      'isValidDate',
      'renderDay',
      'renderMonth',
      'renderYear',
      'timeConstraints'
    ],
    fromState: ['viewDate', 'selectedDate', 'updateOn'],
    fromThis: [
      'setDate',
      'setTime',
      'showView',
      'addTime',
      'subtractTime',
      'updateSelectedDate',
      'localMoment',
      'handleClickOutside'
    ]
  },

  getComponentProps() {
    const me = this
    const formats = this.getFormats(this.props)
    const props = { dateFormat: formats.date, timeFormat: formats.time }
    this.componentProps.fromProps.forEach((name) => {
      props[name] = me.props[name]
    })
    this.componentProps.fromState.forEach((name) => {
      props[name] = me.state[name]
    })
    this.componentProps.fromThis.forEach((name) => {
      props[name] = me[name]
    })

    return props
  },

  render() {
    // TODO: Make a function or clean up this code,
    // logic right now is really hard to follow
    let className = `rdt${
      this.props.className
        ? Array.isArray(this.props.className)
          ? ` ${this.props.className.join(' ')}`
          : ` ${this.props.className}`
        : ''
    }`

    let children = []

    if (this.props.input) {
      const finalInputProps = assign(
        {
          type: 'text',
          className: 'form-control',
          onClick: this.openCalendar,
          onFocus: this.openCalendar,
          onChange: this.onInputChange,
          onKeyDown: this.onInputKey,
          value: this.state.inputValue
        },
        this.props.inputProps
      )
      if (this.props.renderInput) {
        children = [
          React.createElement(
            'div',
            { key: 'i' },
            this.props.renderInput(
              finalInputProps,
              this.openCalendar,
              this.closeCalendar
            )
          )
        ]
      } else {
        children = [
          React.createElement('input', assign({ key: 'i' }, finalInputProps))
        ]
      }
    } else {
      className += ' rdtStatic'
    }

    if (this.state.open) className += ' rdtOpen'

    return React.createElement(
      'div',
      { className },
      children.concat(
        React.createElement(
          'div',
          { key: 'dt', className: 'rdtPicker' },
          React.createElement(CalendarContainer, {
            view: this.state.currentView,
            viewProps: this.getComponentProps(),
            onClickOutside: this.handleClickOutside
          })
        )
      )
    )
  }
})

Datetime.defaultProps = {
  className: '',
  defaultValue: '',
  inputProps: {},
  input: true,
  onFocus() {},
  onBlur() {},
  onChange() {},
  onViewModeChange() {},
  onNavigateBack() {},
  onNavigateForward() {},
  timeFormat: true,
  timeConstraints: {},
  dateFormat: true,
  strictParsing: true,
  closeOnSelect: false,
  closeOnTab: true,
  timezone: null
}

export default Datetime
