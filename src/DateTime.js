import React from 'react'
import createReactClass from 'create-react-class'
import cx from 'classnames'
import PropTypes from 'prop-types'
import moment from 'moment'
import Picker from './Picker'
import views from './views'

const setDateNextViews = { month: 'days', year: 'months' }

const componentProps = {
  fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear', 'timeConstraints'],
  fromState: ['viewDate', 'selectedDate', 'updateOn'],
  fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'updateSelectedDate', 'localMoment']
}

const DateTime = createReactClass({
  displayName: 'DateTime',

  propTypes: {
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onViewModeChange: PropTypes.func,
    locale: PropTypes.string,
    utc: PropTypes.bool,
    input: PropTypes.bool,
    dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    timeFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    inputProps: PropTypes.object,
    timeConstraints: PropTypes.object,
    viewMode: PropTypes.oneOf(['years', 'months', 'days', 'time']),
    isValidDate: PropTypes.func,
    open: PropTypes.bool,
    strictParsing: PropTypes.bool,
    closeOnSelect: PropTypes.bool,
    closeOnTab: PropTypes.bool
  },

  getDefaultProps () {
    const nof = () => {}

    return {
      className: '',
      defaultValue: '',
      inputProps: {},
      input: true,
      onFocus: nof,
      onBlur: nof,
      onChange: nof,
      onViewModeChange: nof,
      timeFormat: true,
      timeConstraints: {},
      dateFormat: true,
      strictParsing: true,
      closeOnSelect: false,
      closeOnTab: true,
      utc: false
    }
  },

  getInitialState () {
    const props = this.props
    const state = this.getStateFromProps(props)
    state.open = state.open !== undefined ? state.open : !props.input
    state.currentView = props.dateFormat ? (props.viewMode || state.updateOn || 'days') : 'time'

    return state
  },

  // TODO
  getStateFromProps (props) {
    var formats = this.getFormats( props ),
      date = props.value || props.defaultValue,
      selectedDate, viewDate, updateOn, inputValue

    if ( date && typeof date === 'string' )
      selectedDate = this.localMoment( date, formats.datetime )
    else if ( date )
      selectedDate = this.localMoment( date )

    if ( selectedDate && !selectedDate.isValid() )
      selectedDate = null

    viewDate = selectedDate ?
      selectedDate.clone().startOf('month') :
      this.localMoment().startOf('month')

    updateOn = this.getUpdateOn(formats)

    if ( selectedDate )
      inputValue = selectedDate.format(formats.datetime)
    else if ( date.isValid && !date.isValid() )
      inputValue = ''
    else
      inputValue = date || ''

    return {
      updateOn,
      viewDate,
      selectedDate,
      inputValue,
      inputFormat: formats.datetime,
      open: props.open
    }
  },

  // TODO
  getUpdateOn ( formats ) {
    if ( formats.date.match(/[lLD]/) ) {
      return 'days'
    } else if ( formats.date.indexOf('M') !== -1 ) {
      return 'months'
    } else if ( formats.date.indexOf('Y') !== -1 ) {
      return 'years'
    }

    return 'days'
  },

  // TODO
  getFormats ( props ) {
    var formats = {
        date: props.dateFormat || '',
        time: props.timeFormat || ''
      },
      locale = this.localMoment( props.date, null, props ).localeData()

    if ( formats.date === true ) {
      formats.date = locale.longDateFormat('L')
    }
    else if ( this.getUpdateOn(formats) !== 'days' ) {
      formats.time = ''
    }

    if ( formats.time === true ) {
      formats.time = locale.longDateFormat('LT')
    }

    formats.datetime = formats.date && formats.time ?
      formats.date + ' ' + formats.time :
      formats.date || formats.time

    return formats
  },

  // TODO
  componentWillReceiveProps ( nextProps ) {
    var formats = this.getFormats( nextProps ),
      updatedState = {}

    if ( nextProps.value !== this.props.value ||
      formats.datetime !== this.getFormats( this.props ).datetime ) {
      updatedState = this.getStateFromProps( nextProps )
    }

    if ( updatedState.open === undefined ) {
      if ( this.props.closeOnSelect && this.state.currentView !== 'time' ) {
        updatedState.open = false
      } else {
        updatedState.open = this.state.open
      }
    }

    if ( nextProps.viewMode !== this.props.viewMode ) {
      updatedState.currentView = nextProps.viewMode
    }

    if ( nextProps.locale !== this.props.locale ) {
      if ( this.state.viewDate ) {
        var updatedViewDate = this.state.viewDate.clone().locale( nextProps.locale )
        updatedState.viewDate = updatedViewDate
      }
      if ( this.state.selectedDate ) {
        var updatedSelectedDate = this.state.selectedDate.clone().locale( nextProps.locale )
        updatedState.selectedDate = updatedSelectedDate
        updatedState.inputValue = updatedSelectedDate.format( formats.datetime )
      }
    }

    if ( nextProps.utc !== this.props.utc ) {
      if ( nextProps.utc ) {
        if ( this.state.viewDate )
          updatedState.viewDate = this.state.viewDate.clone().utc()
        if ( this.state.selectedDate ) {
          updatedState.selectedDate = this.state.selectedDate.clone().utc()
          updatedState.inputValue = updatedState.selectedDate.format( formats.datetime )
        }
      } else {
        if ( this.state.viewDate )
          updatedState.viewDate = this.state.viewDate.clone().local()
        if ( this.state.selectedDate ) {
          updatedState.selectedDate = this.state.selectedDate.clone().local()
          updatedState.inputValue = updatedState.selectedDate.format(formats.datetime)
        }
      }
    }
    this.setState( updatedState )
  },

  // TODO
  onInputChange ( e ) {
    var value = e.target === null ? e : e.target.value,
      localMoment = this.localMoment( value, this.state.inputFormat ),
      update = { inputValue: value }

    if ( localMoment.isValid() && !this.props.value ) {
      update.selectedDate = localMoment
      update.viewDate = localMoment.clone().startOf('month')
    } else {
      update.selectedDate = null
    }

    return this.setState( update, function() {
      return this.props.onChange( localMoment.isValid() ? localMoment : this.state.inputValue )
    })
  },

  onInputKey (e) {
    if (e.key === 'Tab' && this.props.closeOnTab) {
      this.closeCalendar()
    }
  },

  showView (view) {
    if (this.state.currentView !== view) {
      this.setState({ currentView: view })

      this.props.onViewModeChange(view)
    }
  },

  setDate(type, value) {
    const { viewDate, currentView } = this.state
    const date = viewDate.clone()[type](value).startOf(type)
    const view = setDateNextViews[type] || currentView

    this.setState({ viewDate: date, currentView: view })

    if (currentView !== view) {
      this.props.onViewModeChange(view)
    }
  },

  addTime (amount, type) {
    const viewDate = this.state.viewDate.clone().add(amount, type)

    this.setState({ viewDate })
  },

  setTime (type, value) {
    const { selectedDate, viewDate, inputFormat } = this.state
    const date = (selectedDate || viewDate).clone()[type](value)

    // TODO !?! It is needed to set all the time properties to not to reset the time
    // switch (type) {
    //   case 'hours': date.minutes(date.minutes()) // falls through
    //   case 'minutes': date.seconds(date.seconds()) // falls through
    //   case 'seconds': date.milliseconds(date.milliseconds())
    // }

    if (!this.props.value) {
      this.setState({
        selectedDate: date,
        inputValue: date.format(inputFormat)
      })
    }

    this.props.onChange(date)
  },

  updateSelectedDate (values) {
    const { value, closeOnSelect, onChange } = this.props
    const { selectedDate, viewDate, inputFormat } = this.state
    const close = closeOnSelect && 'date' in values
    const date = (selectedDate || viewDate).clone().set(values)

    if (!value) {
      this.setState({
        open: !close,
        selectedDate: date,
        viewDate: date.clone().startOf('month'),
        inputValue: date.format(inputFormat)
      }, () => close && this.onBlur())
    } else if (close) {
      this.closeCalendar()
    }

    onChange(date)
  },

  openCalendar () {
    if (!this.state.open) {
      this.setState({ open: true }, () => this.props.onFocus())
    }
  },

  closeCalendar () {
    if (this.state.open) {
      this.setState({ open: false }, this.onBlur)
    }
  },

  handleClickOutside () {
    if (this.props.input && this.state.open && !this.props.open) {
      this.setState({ open: false }, this.onBlur)
    }
  },

  // TODO
  localMoment ( date, format, props ) {
    props = props || this.props
    var momentFn = props.utc ? moment.utc : moment
    var m = momentFn( date, format, props.strictParsing )
    if ( props.locale )
      m.locale( props.locale )
    return m
  },

  // TODO
  getComponentProps () {
    const formats = this.getFormats( this.props )
    const props = {dateFormat: formats.date, timeFormat: formats.time}

    componentProps.fromProps.forEach(name => {
      props[name] = this.props[name]
    })
    componentProps.fromState.forEach(name => {
      props[name] = this.state[name]
    })
    componentProps.fromThis.forEach(name => {
      props[name] = this[name]
    })

    return props
  },

  onBlur() {
    const { selectedDate, inputValue } = this.state

    this.props.onBlur(selectedDate, inputValue)
  },

  renderInput() {
    return (
      <input type='text'
        className='form-control'
        onFocus={this.openCalendar}
        onChange={this.onInputChange}
        onKeyDown={this.onInputKey}
        value={this.state.inputValue}
        {...this.props.inputProps}
      />
    )
  },

  renderPicker() {
    const View = views[this.state.currentView]
    const viewProps = this.getComponentProps()

    return (
      <Picker onClickOutside={this.handleClickOutside}>
        <View {...viewProps} />
      </Picker>
    )
  },

  render() {
    const { input, className } = this.props
    const { open } = this.state

    const classes = cx('rdt', className, {
      rdtStatic: !input,
      rdtOpen: open
    })

    return (
      <div className={classes}>
        { input && this.renderInput() }
        { open && this.renderPicker() }
      </div>
    )
  }
})

// Make moment accessible through the DateTime class
DateTime.moment = moment

export default DateTime
