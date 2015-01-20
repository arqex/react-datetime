var React = require('react/addons');
var DateTimeField = require('react-bootstrap-datetimepicker');

var Basic = React.createClass({

  render () {
    return <DateTimeField />;
  }

});

React.render(React.createFactory(Basic)(), document.getElementById('example'));
