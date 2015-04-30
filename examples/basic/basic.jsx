var React = require('react/addons');
var DateTimeField = require('react-bootstrap-datetimepicker');
var moment = require('moment');

var Basic = React.createClass({

	render: function() {
		return <div className="container">
						<div className="row">
							<div className="col-xs-12">
								<h1>React Bootstrap DateTimePicker</h1>
								This project is a port of <a href="https://github.com/Eonasdan/bootstrap-datetimepicker">https://github.com/Eonasdan/bootstrap-datetimepicker</a> for React.js
							</div>
						</div>
						<div className="row">
							<div className="col-xs-12">
								Default Basic Example
								<DateTimeField />
								<pre> {'<DateTimeField />'} </pre>
							</div>
						</div>
						<div className="row">
							<div className="col-xs-12">
								Example with default Text
								<DateTimeField
									defaultText="Please select a date"
								/>
								<pre> {'<DateTimeField defaultText="Please select a date" />'} </pre>
							</div>
						</div>
						<div className="row">
							<div className="col-xs-12">
                ViewMode set to years view with custom inputFormat
                <DateTimeField
                  inputFormat='DD-MM-YYYY'
                  viewMode='years'
                />
                <pre> {'<DateTimeField viewMode="years" inputFormat="DD-MM-YYYY" />'} </pre>
							</div>
						</div>
						<div className="row">
							<div className="col-xs-12">
                daysOfWeekDisabled
                <DateTimeField
                  daysOfWeekDisabled={[0,1,2]}
                />
                <pre> {'<DateTimeField daysOfWeekDisabled={[0,1,2]} />'} </pre>

              </div>
						</div>
						<div className="row">
							<div className="col-xs-12">
                minDate and maxDate
                <DateTimeField
                  minDate={moment().subtract(1, 'days')}
                  maxDate={moment().add(1, 'days')}
                />
                <pre> {'<DateTimeField daysOfWeekDisabled={[0,1,2]} />'} </pre>

              </div>
						</div>
					</div>;
	}

});



React.render(React.createFactory(Basic)(), document.getElementById('example'));
