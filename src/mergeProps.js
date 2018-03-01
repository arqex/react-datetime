'use strict';

var assign = require('object-assign');

function mergeProps (defaultProps, customProps, customPropsParams) {
	return assign(defaultProps, typeof customProps == 'function' ? customProps.apply(null, customPropsParams) : customProps);
}

module.exports = mergeProps;
