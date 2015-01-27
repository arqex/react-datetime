var webpack = require('webpack');

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
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

  entry: ['./src/DateTimeField.jsx'],

  output: {
    path: __dirname + "/dist/",
    library: 'ReactBootstrapDatetimepicker',
    libraryTarget: 'umd',
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  externals: {
    'react': 'React',
    'react/addons': 'React',
    'react-bootstrap': 'ReactBootstrap',
    'moment': 'moment'
  },

  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx-loader' }
    ]
  },

  plugins: plugins

};
