var React = require('react'),
  DaysView = require('./DaysView'),
  MonthsView = require('./MonthsView'),
  YearsView = require('./YearsView'),
  TimeView = require('./TimeView'),
  onClickOutside = require('react-onclickoutside')
;

var CalendarContainer = onClickOutside( React.createClass({
	viewComponents: {
		days: DaysView,
		months: MonthsView,
		years: YearsView,
		time: TimeView
	},

  render: function() {
    return React.createElement( this.viewComponents[ this.props.view ], this.props.viewProps );
  },

  handleClickOutside: function() {
    this.props.onClickOutside();
  }
}));

module.exports = CalendarContainer;
