var path = require('path');

module.exports = {
	entry: [
		'webpack/hot/dev-server',
		'webpack-dev-server/client?http://localhost:8889',
		path.resolve(__dirname, 'example.js')
	],

	output: {
		path: path.resolve(__dirname, '.'),
		filename: 'bundle.js'
	}
};
