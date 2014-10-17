###* @jsx React.DOM ###

React = require 'react'
DateTimePicker = require './DateTimePicker'
moment = require 'moment'
Glyphicon = require 'react-bootstrap/Glyphicon'

DateTimeField = React.createClass(

  propTypes:
    dateTime: React.PropTypes.string
    onChange: React.PropTypes.func
    format: React.PropTypes.string
    inputFormat: React.PropTypes.string

  getDefaultProps: ->
    dateTime: moment()
    format: 'X'
    inputFormat: "MM/DD/YY H:mm A"
    showToday: true
    daysOfWeekDisabled: []

  getInitialState: ->
    showDatePicker: true
    showTimePicker: false
    widgetStyle:
      display: 'block'
      position: 'absolute'
      left: -9999
      'z-index': '9999 !important'
    viewDate: moment(@props.dateTime, @props.format).startOf("month")
    selectedDate: moment(@props.dateTime, @props.format)
    inputValue: moment(@props.dateTime, @props.format).format(@props.inputFormat)

  componentWillReceiveProps: (nextProps) ->
    @setState
      viewDate: moment(nextProps.dateTime, nextProps.format).startOf("month")
      selectedDate: moment(nextProps.dateTime, nextProps.format)
      inputValue: moment(nextProps.dateTime, nextProps.format).format(nextProps.inputFormat)

  # to improve with detection only onBlur
  onChange: (event) ->
    if moment(event.target.value, @props.format).isValid()
      @setState
        selectedDate: moment(event.target.value, @props.format)
        inputValue: moment(event.target.value, @props.format).format(@props.inputFormat)
    else
      @setState inputValue: event.target.value
      console.log "This is not a valid date"

    @props.onChange(@state.selectedDate.format(@props.format))

  setSelectedDate: (e) ->
    @setState selectedDate: @state.viewDate.clone().date(parseInt(e.target.innerHTML)).hour(@state.selectedDate.hours()).minute(@state.selectedDate.minutes()), ->
      @closePicker()
      @props.onChange(@state.selectedDate.format(@props.format))
      @setState inputValue: @state.selectedDate.format(@props.inputFormat)

  setSelectedHour: (e) ->
    @setState selectedDate: @state.selectedDate.clone().hour(parseInt(e.target.innerHTML)).minute(@state.selectedDate.minutes()), ->
      @closePicker()
      @props.onChange(@state.selectedDate.format(@props.format))
      @setState inputValue: @state.selectedDate.format(@props.inputFormat)

  setSelectedMinute: (e) ->
    @setState selectedDate: @state.selectedDate.clone().hour(@state.selectedDate.hours()).minute(parseInt(e.target.innerHTML)), ->
      @closePicker()
      @props.onChange(@state.selectedDate.format(@props.format))
      @setState inputValue: @state.selectedDate.format(@props.inputFormat)

  setViewMonth: (month) ->
    @setState viewDate: @state.viewDate.clone().month(month)

  setViewYear: (year) ->
    @setState viewDate: @state.viewDate.clone().year(year)

  addMinute: ->
    @setState selectedDate: @state.selectedDate.clone().add("minutes", 1)

  addHour: ->
    @setState selectedDate: @state.selectedDate.clone().add("hours", 1)

  addMonth: ->
    @setState viewDate: @state.viewDate.add("months", 1)

  addYear: ->
    @setState viewDate: @state.viewDate.add("years", 1)

  addDecade: ->
    @setState viewDate: @state.viewDate.add("years", 10)

  subtractMinute: ->
    @setState selectedDate: @state.selectedDate.clone().subtract("minutes", 1)

  subtractHour: ->
    @setState selectedDate: @state.selectedDate.clone().subtract("hours", 1)

  subtractMonth: ->
    @setState viewDate: @state.viewDate.subtract("months", 1)

  subtractYear: ->
    @setState viewDate: @state.viewDate.subtract("years", 1)

  subtractDecade: ->
    @setState viewDate: @state.viewDate.subtract("years", 10)

  togglePeriod: ->
    if @state.selectedDate.hour() > 12
      @setState selectedDate: @state.selectedDate.clone().subtract('hours', 12)
    else
      @setState selectedDate: @state.selectedDate.clone().add('hours', 12)

  togglePicker: ->
    @setState
      showDatePicker: !@state.showDatePicker
      showTimePicker: !@state.showTimePicker

  onClick: ->
    if @state.showPicker
      @closePicker()
    else
      @setState showPicker: true

      gBCR = @refs.dtpbutton.getDOMNode().getBoundingClientRect()
      classes =
        "bootstrap-datetimepicker-widget": true
        "dropdown-menu": true

      offset =
        top: gBCR.top + window.pageYOffset - document.documentElement.clientTop
        left: gBCR.left + window.pageXOffset - document.documentElement.clientLeft

      offset.top = offset.top + @refs.datetimepicker.getDOMNode().offsetHeight

      scrollTop = `(window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop`


      placePosition =
        if @props.direction == 'up'
          'top'
        else if @props.direction == 'bottom'
          'bottom'
        else if @props.direction == 'auto'
          if offset.top + @refs.widget.getDOMNode().offsetHeight > window.offsetHeight + scrollTop && @refs.widget.offsetHeight + @refs.datetimepicker.getDOMNode().offsetHeight > offset.top
            'top'
          else
            'bottom'

      if placePosition == 'top'
        # offset.top -= @refs.widget.getDOMNode().offsetHeight + @refs.datetimepicker.getDOMNode().offsetHeight + 15
        offset.top = - @refs.widget.getDOMNode().offsetHeight-this.getDOMNode().clientHeight-2
        classes["top"] = true
        classes["bottom"] = false
        classes['pull-right'] = true
      else
        # offset.top += 1
        offset.top = 40
        classes["top"] = false
        classes["bottom"] = true
        classes['pull-right'] = true


      # if @props.orientation == 'left'
      #   classes["left-oriented"] = true
      #   offset.left = offset.left - @refs.widget.getDOMNode.

      # if document.body.clientWidth < offset.left + @refs.widget.getDOMNode().offsetWidth
      #   offset.right = document.body.clientWidth - offset.left - @refs.dtpbutton.getDOMNode().offsetWidth
      #   offset.left = "auto"
      #   classes['pull-right'] = true
      # else
      #   offset.right = "auto"
      #   classes["pull-right"] = false

      styles =
        display: 'block'
        position: 'absolute'
        top: offset.top
        # top: 40
        # left: offset.left
        # right: offset.right
        left: 'auto'
        right: 40

      @setState
        widgetStyle: styles
        widgetClasses: classes

  closePicker: (e) ->
    style = @state.widgetStyle
    style['left'] = -9999

    @setState
      showPicker: false
      widgetStyle: style



  renderOverlay: ->
    styles =
      position: 'fixed'
      top: 0
      bottom: 0
      left: 0
      right: 0
      'z-index': '999'

    if @state.showPicker
      `(<div style={styles} onClick={this.closePicker} />)`
    else
      ''

  render: ->

    `(
          <div>
            {this.renderOverlay()}
            <DateTimePicker ref="widget"
                  widgetClasses={this.state.widgetClasses}
                  widgetStyle={this.state.widgetStyle}
                  showDatePicker={this.state.showDatePicker}
                  showTimePicker={this.state.showTimePicker}
                  viewDate={this.state.viewDate}
                  selectedDate={this.state.selectedDate}
                  showToday={this.props.showToday}
                  daysOfWeekDisabled={this.props.daysOfWeekDisabled}
                  addDecade={this.addDecade}
                  addYear={this.addYear}
                  addMonth={this.addMonth}
                  addHour={this.addHour}
                  addMinute={this.addMinute}
                  subtractDecade={this.subtractDecade}
                  subtractYear={this.subtractYear}
                  subtractMonth={this.subtractMonth}
                  subtractHour={this.subtractHour}
                  subtractMinute={this.subtractMinute}
                  setViewYear={this.setViewYear}
                  setViewMonth={this.setViewMonth}
                  setSelectedDate={this.setSelectedDate}
                  setSelectedHour={this.setSelectedHour}
                  setSelectedMinute={this.setSelectedMinute}
                  togglePicker={this.togglePicker}
                  togglePeriod={this.togglePeriod}
            />
            <div className="input-group date" ref="datetimepicker">
              <input type="text" className="form-control" onChange={this.onChange} value={this.state.selectedDate.format(this.props.inputFormat)} />
              <span className="input-group-addon" onClick={this.onClick} onBlur={this.onBlur} ref="dtpbutton"><Glyphicon glyph="calendar" /></span>
            </div>
          </div>
    )`
)

module.exports = DateTimeField
