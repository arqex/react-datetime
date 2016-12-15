var React = require('react');
var DateTime = require('../DateTime');
var DOM = React.DOM;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      isOpen: this.props.open || false
    };
  },

  render: function() {
    var isOpen = this.state.isOpen;
    function handleClick() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
    function handleBlur() {
      this.setState({
        isOpen: false
      });
    }

    return DOM.div({
      className: 'datepicker-container',
    },
      React.createElement(DateTime, Object.assign({}, this.props, {
        open: isOpen,
        onBlur: handleBlur.bind(this)
      })),
      DOM.button({
        onClick: handleClick.bind(this),
        className: 'open-datepicker',
        children: 'Toggle open Datepicker'
      })
    );
  }
});
