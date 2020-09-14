const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: './src/index.tsx',

  mode: 'production',

  output: {
    filename: '_vzn/static/chunks/[name]-[contenthash].js',
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
    alias: {
      '@': path.resolve('./src'),
      '@/': path.resolve('./src/')
    }
  },

  devServer: {
    historyApiFallback: true,
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
  ],
};

if (process.env.ANALYZE) {
  config.plugins.push(
    new BundleAnalyzerPlugin()
  )
}

module.exports = config;