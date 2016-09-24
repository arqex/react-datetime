'use strict';

var React = require('react')
;

var DOM = React.DOM;
var Header = React.createClass({

	render: function() {
		return DOM.tr({ key: 'h'}, [
			DOM.th({ key: 'prev', className: 'rdtPrev' }, DOM.span({onClick: this.props.onPrevClick}, '‹')),
			DOM.th({ key: 'switch', className: 'rdtSwitch', onClick: this.props.onSwitchClick, colSpan: this.props.switchColspan, 'data-value': this.props.switchValue }, this.props.switchLabel ),
			DOM.th({ key: 'next', className: 'rdtNext' }, DOM.span({onClick: this.props.onNextClick}, '›'))
		]);
	}
});

module.exports = Header;
