'use strict';

var React = require('react');

var DOM = React.DOM;
var Header = React.createClass({

	render: function() {
		var switchProps = {
			'key': 'switch',
			'className': 'rdtSwitch',
			'onClick': this.props.onSwitchClick,
			'data-value': this.props.switchValue
		};

		if (this.props.switchColspan != null)
			switchProps.colSpan = this.props.switchColspan;

		return DOM.tr({ key: 'h'}, [
			DOM.th(this.props.tabify({ key: 'prev', className: 'rdtPrev' }), DOM.span({onClick: this.props.onPrevClick})),
			DOM.th(this.props.tabify(switchProps), this.props.switchLabel ),
			DOM.th(this.props.tabify({ key: 'next',	className: 'rdtNext' }), DOM.span({onClick: this.props.onNextClick}))
		]);
	}
});

module.exports = Header;
