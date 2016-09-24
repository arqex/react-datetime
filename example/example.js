var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDOM = require('react-dom');

var options = {
  /*timeFormat: true,
  monthColumns: 3,
  yearColumns: 5,
  yearRows: 4,*/
  viewMode: 'years',
  defaultValue: new Date( 2000, 0, 15, 2, 2, 2, 2 )
  /*,
  renderDay: function( props, currentDate ){
    return React.DOM.td({ key: props.key }, React.DOM.button( props, currentDate.format('DD') ));
  }*/
};

ReactDOM.render(
  //React.createElement(DateTime, { timeFormat: true }),
  React.createElement(DateTime, options),
  document.getElementById('datetime')
);
