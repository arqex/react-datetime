var DateTimePickerYears, React;

React = require('react');

DateTimePickerYears = React.createClass({
  propTypes: {
    subtractDecade: React.PropTypes.func.isRequired,
    addDecade: React.PropTypes.func.isRequired,
    viewDate: React.PropTypes.object.isRequired,
    selectedDate: React.PropTypes.object.isRequired,
    setViewYear: React.PropTypes.func.isRequired
  },
  renderYears: function() {
    var classes, i, year, years, rows;
    years = [];
    year = parseInt(this.props.viewDate.year() / 10, 10) * 10;
    year--;
    i = -1;
    rows = [];
    while (i < 11) {
    	if( (i+1) && (i+1) % 4 == 0 ){
    		rows.push( <tr>{ years }</tr> );
    		years = [];
    	}
    	classes = 'year';
    	if( i === -1 | i === 10 )
    		classes += ' old';
    	if( this.props.selectedDate.year() === year )
    		classes += ' active';

      years.push(<td key={year} className={ classes } onClick={this.props.setDate('year')}>{year}</td>);
      year++;
      i++;
    }
    rows.push( <tr>{ years }</tr> );
    return rows;
  },
  render: function() {
    var year;
    year = parseInt(this.props.viewDate.year() / 10, 10) * 10;
    return (
      <div className="datepicker-years" style={{display: "block"}}>
        <table className="table-condensed">
          <thead>
            <tr>
              <th className="prev" onClick={this.props.subtractTime(10, 'years')}>‹</th>
              <th className="switch" colSpan="5">{year} - {year+9}</th>
              <th className="next" onClick={this.props.addTime(10, 'years')}>›</th>
            </tr>
          </thead>
        </table>
        <table>
          <tbody>
            {this.renderYears()}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = DateTimePickerYears;
