var DateTimePickerDays, React, moment;

React = require('react/addons');

moment = require('moment');

DateTimePickerDays = React.createClass({displayName: "DateTimePickerDays",
  propTypes: {
    subtractMonth: React.PropTypes.func.isRequired,
    addMonth: React.PropTypes.func.isRequired,
    viewDate: React.PropTypes.object.isRequired,
    selectedDate: React.PropTypes.object.isRequired,
    showToday: React.PropTypes.bool,
    daysOfWeekDisabled: React.PropTypes.array,
    setSelectedDate: React.PropTypes.func.isRequired,
    showMonths: React.PropTypes.func.isRequired
  },
  getDefaultProps: function() {
    return {
      showToday: true
    };
  },
  renderDays: function() {
    var cells, classes, days, html, i, month, nextMonth, prevMonth, row, year, _i, _len, _ref;
    year = this.props.viewDate.year();
    month = this.props.viewDate.month();
    prevMonth = this.props.viewDate.clone().subtract(1, "months");
    days = prevMonth.daysInMonth();
    prevMonth.date(days).startOf('week');
    nextMonth = moment(prevMonth).clone().add(42, "d");
    html = [];
    cells = [];
    while (prevMonth.isBefore(nextMonth)) {
      classes = {
        day: true
      };
      if (prevMonth.year() < year || (prevMonth.year() === year && prevMonth.month() < month)) {
        classes['old'] = true;
      } else if (prevMonth.year() > year || (prevMonth.year() === year && prevMonth.month() > month)) {
        classes['new'] = true;
      }
      if (prevMonth.isSame(moment({
        y: this.props.selectedDate.year(),
        M: this.props.selectedDate.month(),
        d: this.props.selectedDate.date()
      }))) {
        classes['active'] = true;
      }
      if (this.props.showToday) {
        if (prevMonth.isSame(moment(), 'day')) {
          classes['today'] = true;
        }
      }
      if (this.props.daysOfWeekDisabled) {
        _ref = this.props.daysOfWeekDisabled;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if (prevMonth.day() === this.props.daysOfWeekDisabled[i]) {
            classes['disabled'] = true;
            break;
          }
        }
      }
      cells.push(React.createElement("td", {key: prevMonth.month() + '-' + prevMonth.date(), className: React.addons.classSet(classes), onClick: this.props.setSelectedDate}, prevMonth.date()));
      if (prevMonth.weekday() === moment().endOf('week').weekday()) {
        row = React.createElement("tr", {key: prevMonth.month() + '-' + prevMonth.date()}, cells);
        html.push(row);
        cells = [];
      }
      prevMonth.add(1, "d");
    }
    return html;
  },
  render: function() {
    return (
    React.createElement("div", {className: "datepicker-days", style: {display: 'block'}}, 
        React.createElement("table", {className: "table-condensed"}, 
          React.createElement("thead", null, 
            React.createElement("tr", null, 
              React.createElement("th", {className: "prev", onClick: this.props.subtractMonth}, "‹"), 

              React.createElement("th", {className: "switch", colSpan: "5", onClick: this.props.showMonths}, moment.months()[this.props.viewDate.month()], " ", this.props.viewDate.year()), 

              React.createElement("th", {className: "next", onClick: this.props.addMonth}, "›")
            ), 

            React.createElement("tr", null, 
              React.createElement("th", {className: "dow"}, "Su"), 

              React.createElement("th", {className: "dow"}, "Mo"), 

              React.createElement("th", {className: "dow"}, "Tu"), 

              React.createElement("th", {className: "dow"}, "We"), 

              React.createElement("th", {className: "dow"}, "Th"), 

              React.createElement("th", {className: "dow"}, "Fr"), 

              React.createElement("th", {className: "dow"}, "Sa")
            )
          ), 

          React.createElement("tbody", null, 
            this.renderDays()
          )
        )
      )
    );
  }
});

module.exports = DateTimePickerDays;
