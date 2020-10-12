const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: __dirname + '/public',
    filename: 'build/app.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: { src: path.resolve(__dirname, 'src') },
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
};
