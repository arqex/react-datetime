const paths = require('./paths');
const path = require('path');

const outputPath = path.join(__dirname, '../dist/');

const baseConfig = {
	entry: ['./src/DateTime.js'],
	mode: 'production',

	resolve: {
		extensions: ['.js']
	},

	externals: {
		'react': 'react',
		'react-dom': 'react-dom',
		'moment': 'moment',
		'moment-timezone': 'moment-timezone'
	},

	module: {
		rules: [
			{
				test: /\.(js|mjs|jsx|ts|tsx)$/,
				include: paths.appSrc,
				loader: require.resolve('babel-loader')
			}
		]
	},
	devtool: 'source-map'
};

const umdConfig = {
	...baseConfig,
	output: {
		path: outputPath,
		library: {
			name: 'Datetime',
			type: 'umd',
			auxiliaryComment: 'React datetime',
			export: 'default'
		},
		filename: 'react-datetime.umd.js',
	}
};

const cjsConfig = {
	...baseConfig,
	output: {
		path: outputPath,
		library: {
			type: 'commonjs2',
			auxiliaryComment: 'React datetime'
		},
		filename: 'react-datetime.cjs.js',
	}
};

module.exports = [ umdConfig, cjsConfig ];
