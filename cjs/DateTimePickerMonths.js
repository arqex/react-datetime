var DateTimePickerMonths, React, moment;

React = require('react/addons');

moment = require('moment');

DateTimePickerMonths = React.createClass({displayName: "DateTimePickerMonths",
  propTypes: {
    subtractYear: React.PropTypes.func.isRequired,
    addYear: React.PropTypes.func.isRequired,
    viewDate: React.PropTypes.object.isRequired,
    selectedDate: React.PropTypes.object.isRequired,
    showYears: React.PropTypes.func.isRequired,
    setViewMonth: React.PropTypes.func.isRequired
  },
  renderMonths: function() {
    var classes, i, month, months, monthsShort;
    month = this.props.selectedDate.month();
    monthsShort = moment.monthsShort();
    i = 0;
    months = [];
    while (i < 12) {
      classes = {
        month: true,
        'active': i === month && this.props.viewDate.year() === this.props.selectedDate.year()
      };
      months.push(React.createElement("span", {className: React.addons.classSet(classes), onClick: this.props.setViewMonth}, monthsShort[i]));
      i++;
    }
    return months;
  },
  render: function() {
    return (
    React.createElement("div", {className: "datepicker-months", style: {display: 'block'}}, 
          React.createElement("table", {className: "table-condensed"}, 
            React.createElement("thead", null, 
              React.createElement("tr", null, 
                React.createElement("th", {className: "prev", onClick: this.props.subtractYear}, "‹"), 

                React.createElement("th", {className: "switch", colSpan: "5", onClick: this.props.showYears}, this.props.viewDate.year()), 

                React.createElement("th", {className: "next", onClick: this.props.addYear}, "›")
              )
            ), 

            React.createElement("tbody", null, 
              React.createElement("tr", null, 
                React.createElement("td", {colSpan: "7"}, this.renderMonths())
              )
            )
          )
        )
    );
  }
});

module.exports = DateTimePickerMonths;
