var React = require('react/addons');
var DateTimePicker = require('react-bootstrap-datetimepicker');

var Basic = React.createClass({

  render () {
    return <DateTimePicker />;
  }

});

React.render(React.createFactory(Basic)(), document.getElementById('example'));
