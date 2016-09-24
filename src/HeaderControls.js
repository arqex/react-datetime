'use strict';

var React = require('react');

var DOM = React.DOM;
var Header = React.createClass({

	render: function() {
		return DOM.tr({ key: 'h'}, [
			DOM.th({ key: 'prev' }, DOM.button({ className: 'rdtPrev' }, DOM.span({onClick: this.props.onPrevClick}))),
			DOM.th({ key: 'switch', colSpan: this.props.switchColspan }, DOM.button({ className: 'rdtSwitch', onClick: this.props.onSwitchClick, 'data-value': this.props.switchValue }, this.props.switchLabel )),
			DOM.th({ key: 'next' }, DOM.button({ className: 'rdtNext' }, DOM.span({onClick: this.props.onNextClick})))
		]);
	}
});

module.exports = Header;
