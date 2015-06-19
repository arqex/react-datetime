var webpack = require('webpack');

var plugins = [
  new webpack.DefinePlugin({
    	'process.env': { NODE_ENV: '"production"'}
  })
];

if (process.env.COMPRESS) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  );
}

module.exports = {

  entry: ['./src/DateTime.jsx'],

  output: {
    path: __dirname + "/dist/",
    library: 'Datetime',
    libraryTarget: 'umd',
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  externals: {
    'react': 'React',
    'moment': 'moment'
  },

  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx-loader' }
    ]
  },

  plugins: plugins

};
