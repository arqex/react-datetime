var path = require('path');

module.exports = {
  entry: [
    path.resolve(__dirname, 'example.js')
  ],

  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'bundle.js'
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
