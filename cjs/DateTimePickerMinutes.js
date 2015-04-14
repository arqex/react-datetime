var DateTimePickerMinutes, React;

React = require('react');

DateTimePickerMinutes = React.createClass({displayName: "DateTimePickerMinutes",
  propTypes: {
    setSelectedMinute: React.PropTypes.func.isRequired
  },
  render: function() {
    return (
      React.createElement("div", {className: "timepicker-minutes", "data-action": "selectMinute", style: {display: 'block'}}, 
        React.createElement("table", {className: "table-condensed"}, 
          React.createElement("tbody", null, 
            React.createElement("tr", null, 
              React.createElement("td", {className: "minute", onClick: this.props.setSelectedMinute}, "00"), 

              React.createElement("td", {className: "minute", onClick: this.props.setSelectedMinute}, "05"), 

              React.createElement("td", {className: "minute", onClick: this.props.setSelectedMinute}, "10"), 

              React.createElement("td", {className: "minute", onClick: this.props.setSelectedMinute}, "15")
            ), 

            React.createElement("tr", null, 
              React.createElement("td", {className: "minute", onClick: this.props.setSelectedMinute}, "20"), 

              React.createElement("td", {className: "minute", onClick: this.props.setSelectedMinute}, "25"), 

              React.createElement("td", {className: "minute", onClick: this.props.setSelectedMinute}, "30"), 

              React.createElement("td", {className: "minute", onClick: this.props.setSelectedMinute}, "35")
            ), 

            React.createElement("tr", null, 
              React.createElement("td", {className: "minute", onClick: this.props.setSelectedMinute}, "40"), 

              React.createElement("td", {className: "minute", onClick: this.props.setSelectedMinute}, "45"), 

              React.createElement("td", {className: "minute", onClick: this.props.setSelectedMinute}, "50"), 

              React.createElement("td", {className: "minute", onClick: this.props.setSelectedMinute}, "55")
            )
          )
        )
      )
    );
  }
});

module.exports = DateTimePickerMinutes;
