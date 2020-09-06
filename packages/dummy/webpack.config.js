const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',

  mode: 'production',

  output: {
    filename: '[name]-[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },

  optimization: {
    runtimeChunk: 'single',

    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      maxSize: 100000
    },
  },

  module: {
    rules: [
      {
        test: /\.(js|mjs|ts|tsx)$/,
        use: 'babel-loader',
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  devServer: {
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: './src/index.html',
      excludeChunks: ['tests'],
    }),
  ],
};
