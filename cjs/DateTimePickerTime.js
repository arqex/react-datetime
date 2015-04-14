var DateTimePickerHours, DateTimePickerMinutes, DateTimePickerTime, Glyphicon, React;

React = require('react');

DateTimePickerMinutes = require('./DateTimePickerMinutes');

DateTimePickerHours = require('./DateTimePickerHours');

Glyphicon = require('react-bootstrap').Glyphicon;

DateTimePickerTime = React.createClass({displayName: "DateTimePickerTime",
  propTypes: {
    setSelectedHour: React.PropTypes.func.isRequired,
    setSelectedMinute: React.PropTypes.func.isRequired,
    subtractHour: React.PropTypes.func.isRequired,
    addHour: React.PropTypes.func.isRequired,
    subtractMinute: React.PropTypes.func.isRequired,
    addMinute: React.PropTypes.func.isRequired,
    viewDate: React.PropTypes.object.isRequired,
    selectedDate: React.PropTypes.object.isRequired,
    togglePeriod: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {
      minutesDisplayed: false,
      hoursDisplayed: false
    };
  },
  showMinutes: function() {
    return this.setState({
      minutesDisplayed: true
    });
  },
  showHours: function() {
    return this.setState({
      hoursDisplayed: true
    });
  },
  renderMinutes: function() {
    if (this.state.minutesDisplayed) {
      return (React.createElement(DateTimePickerMinutes, {
            setSelectedMinute: this.props.setSelectedMinute}
       )
       );
    } else {
      return null;
    }
  },
  renderHours: function() {
    if (this.state.hoursDisplayed) {
      return (React.createElement(DateTimePickerHours, {
            setSelectedHour: this.props.setSelectedHour}
      )
      );
    } else {
      return null;
    }
  },
  renderPicker: function() {
    if (!this.state.minutesDisplayed && !this.state.hoursDisplayed) {
      return (
      React.createElement("div", {className: "timepicker-picker"}, 
        React.createElement("table", {className: "table-condensed"}, 
          React.createElement("tbody", null, 
            React.createElement("tr", null, 
              React.createElement("td", null, React.createElement("a", {className: "btn", onClick: this.props.addHour}, React.createElement(Glyphicon, {glyph: "chevron-up"}))), 

              React.createElement("td", {className: "separator"}), 

              React.createElement("td", null, React.createElement("a", {className: "btn", onClick: this.props.addMinute}, React.createElement(Glyphicon, {glyph: "chevron-up"}))), 

              React.createElement("td", {className: "separator"})
            ), 

            React.createElement("tr", null, 
              React.createElement("td", null, React.createElement("span", {className: "timepicker-hour", onClick: this.showHours}, this.props.selectedDate.format('h'))), 

              React.createElement("td", {className: "separator"}, ":"), 

              React.createElement("td", null, React.createElement("span", {className: "timepicker-minute", onClick: this.showMinutes}, this.props.selectedDate.format('mm'))), 

              React.createElement("td", {className: "separator"}), 

              React.createElement("td", null, React.createElement("button", {className: "btn btn-primary", onClick: this.props.togglePeriod, type: "button"}, this.props.selectedDate.format('A')))
            ), 

            React.createElement("tr", null, 
              React.createElement("td", null, React.createElement("a", {className: "btn", onClick: this.props.subtractHour}, React.createElement(Glyphicon, {glyph: "chevron-down"}))), 

              React.createElement("td", {className: "separator"}), 

              React.createElement("td", null, React.createElement("a", {className: "btn", onClick: this.props.subtractMinute}, React.createElement(Glyphicon, {glyph: "chevron-down"}))), 

              React.createElement("td", {className: "separator"})
            )
          )
        )
      )
      );
    } else {
      return '';
    }
  },
  render: function() {
    return (
        React.createElement("div", {className: "timepicker"}, 
          this.renderPicker(), 

          this.renderHours(), 

          this.renderMinutes()
        )
    );
  }
});

module.exports = DateTimePickerTime;
