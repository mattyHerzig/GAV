const path = require('path');

module.exports = {
  entry: './pyodide2.js', // your main JS file
  output: {
    filename: 'main.js', // the output bundle file
    path: path.resolve(__dirname, 'dist'), // directory where the bundle should be saved
  },
  target: 'web', // target environment is web
  mode: 'development', // set mode to development
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader', // use Babel to transpile your JS
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};