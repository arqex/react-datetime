###* @jsx React.DOM ###

DateTimePickerDays = React.createClass(

  propTypes:
    subtractMonth: React.PropTypes.func.isRequired
    addMonth: React.PropTypes.func.isRequired
    viewDate: React.PropTypes.object.isRequired
    selectedDate: React.PropTypes.object.isRequired
    showToday: React.PropTypes.bool
    daysOfWeekDisabled: React.PropTypes.array
    setSelectedDate: React.PropTypes.func.isRequired
    showMonths: React.PropTypes.func.isRequired

  getDefaultProps: ->
    showToday: true

  renderDays: ->
    year = @props.viewDate.year()
    month = @props.viewDate.month()

    prevMonth = @props.viewDate.clone().subtract("months", 1)
    days = prevMonth.daysInMonth()
    prevMonth.date(days).startOf('week')

    nextMonth = _.clone(moment(prevMonth)).add(42, "d")

    html = []
    cells = []

    while prevMonth.isBefore(nextMonth)
      classes =
        day: true

      if prevMonth.year() < year || (prevMonth.year() == year && prevMonth.month() < month)
        classes['old'] = true
      else if prevMonth.year() > year || (prevMonth.year() == year && prevMonth.month() > month)
        classes['new'] = true

      if prevMonth.isSame(moment({ y: @props.selectedDate.year(), M: @props.selectedDate.month(), d: @props.selectedDate.date() }))
        classes['active'] = true

      # if isInDisableDates(prevMonth) || !isInEnableDates(prevMonth)
      #   clsName += ' disabled'

      if @props.showToday
          if prevMonth.isSame(moment(), 'day')
            classes['today'] = true


      if @props.daysOfWeekDisabled
          for i in @props.daysOfWeekDisabled
              if prevMonth.day() == @props.daysOfWeekDisabled[i]
                classes['disabled'] = true
                break;

      cells.push `<td className={React.addons.classSet(classes)} onClick={this.props.setSelectedDate}>{prevMonth.date()}</td>`

      if prevMonth.weekday() == moment().endOf('week').weekday()
        row = `<tr>{cells}</tr>`
        html.push(row)
        cells = []

      prevMonth.add(1, "d")

    html

  render: ->
    `(
    <div className="datepicker-days" style={{display: 'block'}}>
        <table className="table-condensed">
          <thead>
            <tr>
              <th className="prev" onClick={this.props.subtractMonth}>‹</th>

              <th className="switch" colSpan="5" onClick={this.props.showMonths}>{moment.months()[this.props.viewDate.month()]} {this.props.viewDate.year()}</th>

              <th className="next" onClick={this.props.addMonth}>›</th>
            </tr>

            <tr>
              <th className="dow">Su</th>

              <th className="dow">Mo</th>

              <th className="dow">Tu</th>

              <th className="dow">We</th>

              <th className="dow">Th</th>

              <th className="dow">Fr</th>

              <th className="dow">Sa</th>
            </tr>
          </thead>

          <tbody>
            {this.renderDays()}
          </tbody>
        </table>
      </div>
    )`

)

`export default = DateTimePickerDays;`