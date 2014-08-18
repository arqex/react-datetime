
/** @jsx React.DOM */
import React from './react-es6';
import DateTimePicker from './DateTimePicker';
var DateTimeField, Glyphicon;

Glyphicon = require('react-bootstrap/Glyphicon');

DateTimeField = React.createClass({
  propTypes: {
    dateTime: React.PropTypes.string,
    onChange: React.PropTypes.func,
    format: React.PropTypes.string,
    inputFormat: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      dateTime: moment(),
      format: 'X',
      inputFormat: "MM/DD/YY H:mm A",
      showToday: true,
      daysOfWeekDisabled: []
    };
  },
  getInitialState: function() {
    return {
      showDatePicker: true,
      showTimePicker: false,
      widgetStyle: {
        display: 'block',
        position: 'absolute',
        left: -9999,
        'z-index': '9999 !important'
      },
      viewDate: moment(this.props.dateTime, this.props.format).startOf("month"),
      selectedDate: moment(this.props.dateTime, this.props.format),
      inputValue: moment(this.props.dateTime, this.props.format).format(this.props.inputFormat)
    };
  },
  componentWillReceiveProps: function(nextProps) {
    return this.setState({
      viewDate: moment(nextProps.dateTime, nextProps.format).startOf("month"),
      selectedDate: moment(nextProps.dateTime, nextProps.format),
      inputValue: moment(nextProps.dateTime, nextProps.format).format(nextProps.inputFormat)
    });
  },
  onChange: function(event) {
    if (moment(event.target.value, "MM/DD/YY H:mm A").isValid()) {
      this.setState({
        selectedDate: moment(event.target.value, "MM/DD/YY H:mm A"),
        inputValue: moment(event.target.value, "MM/DD/YY H:mm A").format("MM/DD/YY H:mm A")
      });
    } else {
      this.setState({
        inputValue: event.target.value
      });
      console.log("This is not a valid date");
    }
    return this.props.onChange(this.state.selectedDate.format(this.props.format));
  },
  setSelectedDate: function(e) {
    return this.setState({
      selectedDate: this.state.viewDate.clone().date(parseInt(e.target.innerHTML)).hour(this.state.selectedDate.hours()).minute(this.state.selectedDate.minutes())
    }, function() {
      this.closePicker();
      this.props.onChange(this.state.selectedDate.format(this.props.format));
      return this.setState({
        inputValue: this.state.selectedDate.format("MM/DD/YY H:mm A")
      });
    });
  },
  setSelectedHour: function(e) {
    return this.setState({
      selectedDate: this.state.selectedDate.clone().hour(parseInt(e.target.innerHTML)).minute(this.state.selectedDate.minutes())
    }, function() {
      this.closePicker();
      this.props.onChange(this.state.selectedDate.format(this.props.format));
      return this.setState({
        inputValue: this.state.selectedDate.format("MM/DD/YY H:mm A")
      });
    });
  },
  setSelectedMinute: function(e) {
    return this.setState({
      selectedDate: this.state.selectedDate.clone().hour(this.state.selectedDate.hours()).minute(parseInt(e.target.innerHTML))
    }, function() {
      this.closePicker();
      this.props.onChange(this.state.selectedDate.format(this.props.format));
      return this.setState({
        inputValue: this.state.selectedDate.format("MM/DD/YY H:mm A")
      });
    });
  },
  setViewMonth: function(month) {
    return this.setState({
      viewDate: this.state.viewDate.clone().month(month)
    });
  },
  setViewYear: function(year) {
    return this.setState({
      viewDate: this.state.viewDate.clone().year(year)
    });
  },
  addMinute: function() {
    return this.setState({
      selectedDate: this.state.selectedDate.clone().add("minutes", 1)
    });
  },
  addHour: function() {
    return this.setState({
      selectedDate: this.state.selectedDate.clone().add("hours", 1)
    });
  },
  addMonth: function() {
    return this.setState({
      viewDate: this.state.viewDate.add("months", 1)
    });
  },
  addYear: function() {
    return this.setState({
      viewDate: this.state.viewDate.add("years", 1)
    });
  },
  addDecade: function() {
    return this.setState({
      viewDate: this.state.viewDate.add("years", 10)
    });
  },
  subtractMinute: function() {
    return this.setState({
      selectedDate: this.state.selectedDate.clone().subtract("minutes", 1)
    });
  },
  subtractHour: function() {
    return this.setState({
      selectedDate: this.state.selectedDate.clone().subtract("hours", 1)
    });
  },
  subtractMonth: function() {
    return this.setState({
      viewDate: this.state.viewDate.subtract("months", 1)
    });
  },
  subtractYear: function() {
    return this.setState({
      viewDate: this.state.viewDate.subtract("years", 1)
    });
  },
  subtractDecade: function() {
    return this.setState({
      viewDate: this.state.viewDate.subtract("years", 10)
    });
  },
  togglePeriod: function() {
    if (this.state.selectedDate.hour() > 12) {
      return this.setState({
        selectedDate: this.state.selectedDate.clone().subtract('hours', 12)
      });
    } else {
      return this.setState({
        selectedDate: this.state.selectedDate.clone().add('hours', 12)
      });
    }
  },
  togglePicker: function() {
    return this.setState({
      showDatePicker: !this.state.showDatePicker,
      showTimePicker: !this.state.showTimePicker
    });
  },
  onClick: function() {
    var classes, gBCR, offset, placePosition, scrollTop, styles;
    if (this.state.showPicker) {
      return this.closePicker();
    } else {
      this.setState({
        showPicker: true
      });
      gBCR = this.refs.dtpbutton.getDOMNode().getBoundingClientRect();
      classes = {
        "bootstrap-datetimepicker-widget": true,
        "dropdown-menu": true
      };
      offset = {
        top: gBCR.top + window.pageYOffset - document.documentElement.clientTop,
        left: gBCR.left + window.pageXOffset - document.documentElement.clientLeft
      };
      offset.top = offset.top + this.refs.datetimepicker.getDOMNode().offsetHeight;
      scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      placePosition = this.props.direction === 'up' ? 'top' : this.props.direction === 'bottom' ? 'bottom' : this.props.direction === 'auto' ? offset.top + this.refs.widget.getDOMNode().offsetHeight > window.offsetHeight + scrollTop && this.refs.widget.offsetHeight + this.refs.datetimepicker.getDOMNode().offsetHeight > offset.top ? 'top' : 'bottom' : void 0;
      if (placePosition === 'top') {
        offset.top = -this.refs.widget.getDOMNode().offsetHeight - this.getDOMNode().clientHeight - 2;
        classes["top"] = true;
        classes["bottom"] = false;
        classes['pull-right'] = true;
      } else {
        offset.top = 40;
        classes["top"] = false;
        classes["bottom"] = true;
        classes['pull-right'] = true;
      }
      styles = {
        display: 'block',
        position: 'absolute',
        top: offset.top,
        left: 'auto',
        right: 40
      };
      return this.setState({
        widgetStyle: styles,
        widgetClasses: classes
      });
    }
  },
  closePicker: function(e) {
    var style;
    style = this.state.widgetStyle;
    style['left'] = -9999;
    return this.setState({
      showPicker: false,
      widgetStyle: style
    });
  },
  renderOverlay: function() {
    var styles;
    styles = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      'z-index': '999'
    };
    if (this.state.showPicker) {
      return (<div style={styles} onClick={this.closePicker} />);
    } else {
      return '';
    }
  },
  render: function() {
    return (
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
              <input type="text" className="form-control" onChange={this.onChange} value={this.state.selectedDate.format("MM/DD/YY h:mm A")} />
              <span className="input-group-addon" onClick={this.onClick} onBlur={this.onBlur} ref="dtpbutton"><Glyphicon glyph="calendar" /></span>
            </div>
          </div>
    );
  }
});

export default = DateTimeField;
