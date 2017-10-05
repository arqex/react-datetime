var webpack = require('webpack');

module.exports = {
  entry: [
    './src/DateTime.js'
  ],

  output: {
    path: __dirname + '/dist/',
    filename: 'react-datetime.min.js',
    library: 'Datetime',
    libraryTarget: 'umd'
  },

  devtool: '#cheap-module-source-map',

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'moment': 'moment'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  }
};
