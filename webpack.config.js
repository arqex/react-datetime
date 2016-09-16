var webpack = require('webpack');

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
        'NODE_ENV': JSON.stringify('production')
    }
  })
];

module.exports = {

  entry: ['./DateTime.js'],

  output: {
    path: __dirname + '/dist/',
    library: 'Datetime',
    libraryTarget: 'umd'
  },

  resolve: {
    extensions: ['', '.js']
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'moment': 'moment'
  },

  plugins: plugins
};
