define(function (require, exports, module) {var React = require('react');
var classSet = require('./utils/classSet');
var cloneWithProps = require('./utils/cloneWithProps');

var ValidComponentChildren = require('./utils/ValidComponentChildren');
var createChainedFunction = require('./utils/createChainedFunction');

var ListGroup = React.createClass({displayName: "ListGroup",
  propTypes: {
    onClick: React.PropTypes.func
  },

  render: function () {
    return (
      React.createElement("div", {className: "list-group"}, 
        ValidComponentChildren.map(this.props.children, this.renderListItem)
      )
    );
  },

  renderListItem: function (child, index) {
    return cloneWithProps(child, {
      ref: child.ref,
      key: child.key ? child.key : index
    });
  }
});

module.exports = ListGroup;

});
