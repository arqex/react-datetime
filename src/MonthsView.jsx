var DateTimePickerMonths, React, moment;

React = require('react');

moment = require('moment');

DateTimePickerMonths = React.createClass({
  renderMonths: function() {
    var classes, i, month, months, monthsShort, rows;
    month = this.props.selectedDate.month();
    monthsShort = moment.monthsShort();
    rows = [],
    i = 0;
    months = [];
    while (i < 12) {
    	if( i && i % 4 == 0 ){
    		rows.push( <tr>{ months }</tr> );
    		months = [];
    	}

      classes = "month";
      if( i === month && this.props.viewDate.year() === this.props.selectedDate.year() )
        classes += " active";

      months.push(<td key={i} className={ classes } onClick={this.props.setDate('month')}>{monthsShort[i]}</td>);
      i++;
    }
    rows.push( <tr>{ months }</tr> );
    return rows;
  },
  render: function() {
    return (
    	<div className="datepicker-months" style={{display: 'block'}}>
			<table className="table-condensed">
				<thead>
					<tr>
						<th className="prev" onClick={this.props.subtractTime(1, 'years')}>‹</th>

						<th className="switch" colSpan="5" onClick={this.props.showView('years')}>{this.props.viewDate.year()}</th>

						<th className="next" onClick={this.props.addTime(1, 'years')}>›</th>
					</tr>
				</thead>
			</table>
			<table>
				<tbody>
					{this.renderMonths()}
				</tbody>
			</table>
		</div>
    );
  }
});

module.exports = DateTimePickerMonths;
