import assign from 'object-assign'
import moment, { Moment } from 'moment'
import React, { FocusEventHandler, ChangeEvent } from 'react'
import CalendarContainer from './CalendarContainer'

const viewModes = Object.freeze({
  YEARS: 'years',
  MONTHS: 'months',
  DAYS: 'days',
  TIME: 'time'
})

export type ViewMode = 'years' | 'months' | 'days' | 'time'

export interface TimeConstraint {
  min: number
  max: number
  step: number
}

export interface TimeConstraints {
  hours?: TimeConstraint
  minutes?: TimeConstraint
  seconds?: TimeConstraint
  milliseconds?: TimeConstraint
}

type EventOrValueHandler<Event> = (event: Event | Moment | string) => void

export interface IDatetimepickerProps {
  /*
       Represents the selected date by the component, in order to use it as a controlled component.
       This prop is parsed by moment.js, so it is possible to use a date string or a moment.js date.
       */
  value?: Date | string | Moment
  /*
       Represents the selected date for the component to use it as a uncontrolled component.
       This prop is parsed by moment.js, so it is possible to use a date string or a moment.js date.
       */
  defaultValue?: Date | string | Moment
  /*
       Represents the month which is viewed on opening the calendar when there is no selected date.
       This prop is parsed by Moment.js, so it is possible to use a date `string` or a `moment` object.
       */
  viewDate?: Date | string | Moment
  /*
       Defines the format for the date. It accepts any moment.js date format.
       If true the date will be displayed using the defaults for the current locale.
       If false the datepicker is disabled and the component can be used as timepicker.
       */
  dateFormat?: boolean | string
  /*
       Defines the format for the time. It accepts any moment.js time format.
       If true the time will be displayed using the defaults for the current locale.
       If false the timepicker is disabled and the component can be used as datepicker.
       */
  timeFormat?: boolean | string
  /*
       Whether to show an input field to edit the date manually.
       */
  input?: boolean
  /*
       Whether to open or close the picker. If not set react-datetime will open the
       datepicker on input focus and close it on click outside.
       */
  open?: boolean
  /*
       Manually set the locale for the react-datetime instance.
       Moment.js locale needs to be loaded to be used, see i18n docs.
       */
  locale?: string
  /*
       A timezone where we want to interpret times into. Use "UTC" to show time in the UTC timezone
       */
  timezone?: string
  /*
       Callback trigger when the date changes. The callback receives the selected `moment` object as
       only parameter, if the date in the input is valid. If the date in the input is not valid, the
       callback receives the value of the input (a string).
       */
  onChange?: EventOrValueHandler<ChangeEvent<any>>
  /*
       Callback trigger for when the user opens the datepicker.
       */
  onFocus?: FocusEventHandler
  /*
       Callback trigger for when the user clicks outside of the input, simulating a regular onBlur.
       The callback receives the selected `moment` object as only parameter, if the date in the input
       is valid. If the date in the input is not valid, the callback receives the value of the
       input (a string).
       */
  onBlur?: EventOrValueHandler<FocusEvent>
  /*
       Callback trigger when the view mode changes. The callback receives the selected view mode
       string ('years', 'months', 'days', 'time') as only parameter.
       */
  onViewModeChange?: (viewMode: string) => void
  /*
       Callback trigger when the user navigates to the previous month, year or decade.
       The callback receives the amount and type ('month', 'year') as parameters.
       */
  onNavigateBack?: (amount: number, type: string) => void
  /*
       Callback trigger when the user navigates to the next month, year or decade.
       The callback receives the amount and type ('month', 'year') as parameters.
       */
  onNavigateForward?: (amount: number, type: string) => void
  /*
       The default view to display when the picker is shown. ('years', 'months', 'days', 'time')
       */
  viewMode?: ViewMode | number
  /*
       Extra class names for the component markup.
       */
  className?: string
  /*
       Defines additional attributes for the input element of the component.
       */
  inputProps?: React.HTMLProps<HTMLInputElement>
  /*
       Define the dates that can be selected. The function receives (currentDate, selectedDate)
       and should return a true or false whether the currentDate is valid or not. See selectable dates.
       */
  isValidDate?: (currentDate: any, selectedDate: any) => boolean
  /*
       Customize the way that the days are shown in the day picker. The accepted function has
       the selectedDate, the current date and the default calculated props for the cell,
       and must return a React component. See appearance customization
       */
  renderInput?: (
    props: any,
    openCalendar: () => any,
    closeCalendar: () => any
  ) => JSX.Element
  renderDay?: (props: any, currentDate: any, selectedDate: any) => JSX.Element
  /*
       Customize the way that the months are shown in the month picker.
       The accepted function has the selectedDate, the current date and the default calculated
       props for the cell, the month and the year to be shown, and must return a
       React component. See appearance customization
       */
  renderMonth?: (
    props: any,
    month: number,
    year: number,
    selectedDate: any
  ) => JSX.Element
  /*
       Customize the way that the years are shown in the year picker.
       The accepted function has the selectedDate, the current date and the default calculated
       props for the cell, the year to be shown, and must return a React component.
       See appearance customization
       */
  renderYear?: (props: any, year: number, selectedDate: any) => JSX.Element
  /*
       Whether to use moment's strict parsing when parsing input.
       */
  strictParsing?: boolean
  /*
       When true, once the day has been selected, the react-datetime will be automatically closed.
       */
  closeOnSelect?: boolean
  /*
       Allow to add some constraints to the time selector. It accepts an object with the format
       {hours:{ min: 9, max: 15, step:2}} so the hours can't be lower than 9 or higher than 15, and
       it will change adding or subtracting 2 hours everytime the buttons are clicked. The constraints
       can be added to the hours, minutes, seconds and milliseconds.
       */
  timeConstraints?: TimeConstraints
  /*
       When true, keep the picker open when click event is triggered outside of component. When false,
       close it.
       */
  disableOnClickOutside?: boolean
}

export interface IDatetimepickerState {
  updateOn: string
  inputFormat: string
  viewDate: Moment
  selectedDate: Moment
  inputValue: string
  open: boolean
  currentView: ViewMode
}

class Datetime extends React.Component<
  IDatetimepickerProps,
  IDatetimepickerState
> {
  static displayName: 'DateTime'

  constructor(props: IDatetimepickerProps, context: any) {
    super(props, context)
    const state: IDatetimepickerState = this.getStateFromProps(this.props)

    this.state = state
  }

  parseDate(date, { datetime }) {
    let parsedDate
    if (date && typeof date === 'string')
      parsedDate = this.localMoment(date, datetime)
    else if (date) parsedDate = this.localMoment(date)
    if (parsedDate && !parsedDate.isValid()) parsedDate = null
    return parsedDate
  }

  getStateFromProps(props: IDatetimepickerProps): IDatetimepickerState {
    const formats = this.getFormats(props)
    const date = props.value || props.defaultValue

    let selectedDate
    let viewDate
    let updateOn
    let inputValue
    let { open } = props
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

    if (props.open === undefined) {
      open = !props.input
    }

    let currentView = props.dateFormat
      ? props.viewMode || updateOn || viewModes.DAYS
      : viewModes.TIME

    const state = {
      updateOn,
      inputFormat: formats.datetime,
      viewDate,
      selectedDate,
      inputValue,
      open,
      currentView
    }

    return state
  }

  getUpdateOn({ date }) {
    if (date.match(/[lLD]/)) {
      return viewModes.DAYS
    } else if (date.includes('M')) {
      return viewModes.MONTHS
    } else if (date.includes('Y')) {
      return viewModes.YEARS
    }

    return viewModes.DAYS
  }

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
  }

  componentWillReceiveProps(nextProps: IDatetimepickerProps) {
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
    } //we should only show a valid date if we are provided a isValidDate function. Removed in 2.10.3

    /*if (this.props.isValidDate) {
    updatedState.viewDate = updatedState.viewDate || this.state.viewDate;
    while (!this.props.isValidDate(updatedState.viewDate)) {
    updatedState.viewDate = updatedState.viewDate.add(1, 'day');
    }
    }*/

    this.setState(updatedState)
  }

  onInputChange = (e) => {
    const value = e.target === null ? e : e.target.value
    const localMoment = this.localMoment(value, this.state.inputFormat)
    const update = {
      inputValue: value
    }

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
  }

  onInputKey = ({ which }) => {
    if (which === 9 && this.props.closeOnTab) {
      this.closeCalendar()
    }
  }

  showView = (view) => {
    return () => {
      this.state.currentView !== view && this.props.onViewModeChange(view)
      this.setState({
        currentView: view
      })
    }
  }

  setDate = (type) => {
    const nextViews = {
      month: viewModes.DAYS,
      year: viewModes.MONTHS
    }
    return ({ target }) => {
      this.setState({
        viewDate: this.state.viewDate
          .clone()
          [type](parseInt(target.getAttribute('data-value'), 10))
          .startOf(type),
        currentView: nextViews[type]
      })
      this.props.onViewModeChange(nextViews[type])
    }
  }

  subtractTime = (amount, type, toSelected) => {
    return () => {
      this.props.onNavigateBack(amount, type)
      this.updateTime('subtract', amount, type, toSelected)
    }
  }

  addTime = (amount, type, toSelected) => {
    return () => {
      this.props.onNavigateForward(amount, type)
      this.updateTime('add', amount, type, toSelected)
    }
  }

  updateTime(op, amount, type, toSelected) {
    const update = {}
    const date = toSelected ? 'selectedDate' : 'viewDate'
    update[date] = this.state[date].clone()[op](amount, type)
    this.setState(update)
  }

  allowedSetTime = ['hours', 'minutes', 'seconds', 'milliseconds']

  setTime = (type, value) => {
    let index = this.allowedSetTime.indexOf(type) + 1
    const state = this.state
    const date = (state.selectedDate || state.viewDate).clone()
    let nextType // It is needed to set all the time properties
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
  }

  updateSelectedDate = (e, close) => {
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
  }

  openCalendar = (e: any) => {
    if (!this.state.open) {
      this.setState(
        {
          open: true
        },
        () => {
          this.props.onFocus && this.props.onFocus(e)
        }
      )
    }
  }

  closeCalendar = () => {
    this.setState(
      {
        open: false
      },
      function() {
        this.props.onBlur(this.state.selectedDate || this.state.inputValue)
      }
    )
  }

  handleClickOutside = () => {
    if (
      this.props.input &&
      this.state.open &&
      !this.props.open &&
      !this.props.disableOnClickOutside
    ) {
      this.setState(
        {
          open: false
        },
        function() {
          this.props.onBlur(this.state.selectedDate || this.state.inputValue)
        }
      )
    }
  }

  localMoment(date?, format?, props?) {
    props = props || this.props
    const momentFn = props.timezone
      ? (time) => moment(time).tz(props.timezone, true)
      : moment
    const m = momentFn(date, format, props.strictParsing)
    if (props.locale) m.locale(props.locale)
    return m
  }

  getComponentProps() {
    const componentProps = {
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
    }

    const formats = this.getFormats(this.props)
    const props = {
      dateFormat: formats.date,
      timeFormat: formats.time
    }
    componentProps.fromProps.forEach((name) => {
      props[name] = this.props[name]
    })
    componentProps.fromState.forEach((name) => {
      props[name] = this.state[name]
    })
    componentProps.fromThis.forEach((name) => {
      props[name] = this[name]
    })
    return props
  }

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
          value: this.state && this.state.inputValue
        },
        this.props.inputProps
      )

      if (this.props.renderInput) {
        children = [
          <div key="i">
            {this.props.renderInput(
              finalInputProps,
              this.openCalendar,
              this.closeCalendar
            )}
          </div>
        ]
      } else {
        children = [
          <input
            {...assign(
              {
                key: 'i'
              },
              finalInputProps
            )}
          />
        ]
      }
    } else {
      className += ' rdtStatic'
    }

    if (this.state.open) className += ' rdtOpen'
    return (
      <div className={className}>
        {children.concat(
          <div key="dt" className="rdtPicker">
            <CalendarContainer
              view={this.state.currentView}
              viewProps={this.getComponentProps()}
              onClickOutside={this.handleClickOutside}
            />
          </div>
        )}
      </div>
    )
  }

  static defaultProps = {
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
}

export default Datetime
