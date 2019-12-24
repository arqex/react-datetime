const baseConfig = {
	entry: ['./src/datetime/DateTime.js'],
	mode: 'development',

	resolve: {
		extensions: ['.js']
	},

	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'moment': 'moment',
		'moment-timezone': 'moment-timezone'
	}
};

const umdConfig = {
	...baseConfig,
	output: {
		path: __dirname + '/dist/',
		library: 'Datetime',
		libraryTarget: 'umd',
		filename: 'react-datetime.umd.js',
		auxiliaryComment: 'React datetime'
	}
};

const cjsConfig = {
	...baseConfig,
	output: {
		path: __dirname + '/dist/',
		library: 'Datetime',
		libraryTarget: 'commonjs2',
		filename: 'react-datetime.cjs.js',
		auxiliaryComment: 'React datetime'
	}
};

module.exports = [ umdConfig, cjsConfig ];
