var DateTimePickerYears, React;

React = require('react/addons');

DateTimePickerYears = React.createClass({displayName: "DateTimePickerYears",
  propTypes: {
    subtractDecade: React.PropTypes.func.isRequired,
    addDecade: React.PropTypes.func.isRequired,
    viewDate: React.PropTypes.object.isRequired,
    selectedDate: React.PropTypes.object.isRequired,
    setViewYear: React.PropTypes.func.isRequired
  },
  renderYears: function() {
    var classes, i, year, years;
    years = [];
    year = parseInt(this.props.viewDate.year() / 10, 10) * 10;
    year--;
    i = -1;
    while (i < 11) {
      classes = {
        year: true,
        old: i === -1 | i === 10,
        active: this.props.selectedDate.year() === year
      };
      years.push(React.createElement("span", {className: React.addons.classSet(classes), onClick: this.props.setViewYear}, year));
      year++;
      i++;
    }
    return years;
  },
  render: function() {
    var year;
    year = parseInt(this.props.viewDate.year() / 10, 10) * 10;
    return (
      React.createElement("div", {className: "datepicker-years", style: {display: "block"}}, 
        React.createElement("table", {className: "table-condensed"}, 
          React.createElement("thead", null, 
            React.createElement("tr", null, 
              React.createElement("th", {className: "prev", onClick: this.props.subtractDecade}, "‹"), 

              React.createElement("th", {className: "switch", colSpan: "5"}, year, " - ", year+9), 

              React.createElement("th", {className: "next", onClick: this.props.addDecade}, "›")
            )
          ), 

          React.createElement("tbody", null, 
            React.createElement("tr", null, 
              React.createElement("td", {colSpan: "7"}, this.renderYears())
            )
          )
        )
      )
    );
  }
});

module.exports = DateTimePickerYears;
