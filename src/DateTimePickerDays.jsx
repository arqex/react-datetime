var DateTimePickerDays, React, moment;

React = require('react');

moment = require('moment');

DateTimePickerDays = React.createClass({
  propTypes: {
    subtractMonth: React.PropTypes.func.isRequired,
    addMonth: React.PropTypes.func.isRequired,
    viewDate: React.PropTypes.object.isRequired,
    selectedDate: React.PropTypes.object.isRequired,
    showToday: React.PropTypes.bool,
    daysOfWeekDisabled: React.PropTypes.array,
    setSelectedDate: React.PropTypes.func.isRequired,
    showMonths: React.PropTypes.func.isRequired,
    minDate: React.PropTypes.object,
    maxDate: React.PropTypes.object
  },
  getDefaultProps: function() {
    return {
      showToday: true
    };
  },
  renderDays: function() {
    var cells, classes, days, html, i, month, nextMonth, prevMonth, minDate, maxDate, row, year, _i, _len, _ref;
    year = this.props.viewDate.year();
    month = this.props.viewDate.month();
    prevMonth = this.props.viewDate.clone().subtract(1, "months");
    days = prevMonth.daysInMonth();
    prevMonth.date(days).startOf('week');
    nextMonth = moment(prevMonth).clone().add(42, "d");
    minDate = this.props.minDate ? this.props.minDate.clone().subtract(1, 'days') : this.props.minDate;
    maxDate = this.props.maxDate ? this.props.maxDate.clone() : this.props.maxDate;
    html = [];
    cells = [];
    while (prevMonth.isBefore(nextMonth)) {
      classes = 'day';
      if (prevMonth.year() < year || (prevMonth.year() === year && prevMonth.month() < month)) {
        classes += " old";
      } else if (prevMonth.year() > year || (prevMonth.year() === year && prevMonth.month() > month)) {
        classes += " new";
      }
      if (prevMonth.isSame(moment({
        y: this.props.selectedDate.year(),
        M: this.props.selectedDate.month(),
        d: this.props.selectedDate.date()
      }))) {
        classes += " active";
      }
      if (this.props.showToday) {
        if (prevMonth.isSame(moment(), 'day')) {
          classes += " today";
        }
      }
      if ((minDate && prevMonth.isBefore(minDate)) || (maxDate && prevMonth.isAfter(maxDate))) {
        classes += " disabled";
      }
      if (this.props.daysOfWeekDisabled) {
        _ref = this.props.daysOfWeekDisabled;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if (prevMonth.day() === this.props.daysOfWeekDisabled[i]) {
            classes += " disabled";
            break;
          }
        }
      }
      cells.push(<td key={prevMonth.month() + '-' + prevMonth.date()} className={ classes } onClick={this.props.updateDate}>{prevMonth.date()}</td>);
      if (prevMonth.weekday() === moment().endOf('week').weekday()) {
        row = <tr key={prevMonth.month() + '-' + prevMonth.date()}>{cells}</tr>;
        html.push(row);
        cells = [];
      }
      prevMonth.add(1, "d");
    }
    return html;
  },
  render: function() {
  	var footer = this.renderFooter();
    return (
    <div className="datepicker-days" style={{display: 'block'}}>
        <table className="table-condensed">
          <thead>
            <tr>
              <th className="prev" onClick={this.props.subtractTime(1, 'months')}>‹</th>

              <th className="switch" colSpan="5" onClick={this.props.showView('months')}>{moment.months()[this.props.viewDate.month()]} {this.props.viewDate.year()}</th>

              <th className="next" onClick={this.props.addTime(1, 'months')}>›</th>
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

          { this.renderFooter() }

        </table>
      </div>
    );
  },
  renderFooter: function(){
  		if( !this.props.timeFormat )
  			return '';

  		return (
  			<tfoot>
  				<tr>
  					<td onClick={this.props.showView('time')} colSpan="7" className="timeToggle">&#8986; { this.props.selectedDate.format( this.props.timeFormat ) }</td>
  				</tr>
  			</tfoot>
  		)
  }
});

module.exports = DateTimePickerDays;
