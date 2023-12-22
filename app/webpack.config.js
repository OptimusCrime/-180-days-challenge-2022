const path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  TerserWebpackPlugin = require('terser-webpack-plugin'),
  OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin"),
  webpack = require('webpack'),
  FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const buildPath = path.join(__dirname, 'docs');
const sourcePath = path.join(__dirname, 'src');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: "./index.tsx",
    context: sourcePath,
    output: {
      clean: true,
      filename: '[name].[contenthash].js',
      path: buildPath,
      publicPath: isProduction ? '' : '/'
    },
    devtool: isProduction ? false : 'eval-source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.json', '.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          test: /\.s?css$/i,
          use: [
            // Mini CSS extract plugin does not play nicely with hot reload
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'clean-css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|site\.webmanifest|svg|icon|xml)$/i,
          loader: "file-loader",
          options: {
            name: '[path][name].[ext]',
          }
        },
      ]
    },
    devServer: {
      static: {
        directory: isProduction ? buildPath : sourcePath,
      },
      historyApiFallback: true,
      port: 8080,
      compress: isProduction,
      hot: !isProduction,
      host: '0.0.0.0',
      https: false,
      allowedHosts: 'all',
    },
    optimization: {
      minimize: isProduction,
      minimizer: isProduction? [] : [new TerserWebpackPlugin(), new OptimizeCssAssetsWebpackPlugin()],
    },
    plugins: [
      new FaviconsWebpackPlugin({
        logo: path.join(__dirname, 'src', 'icon', 'app-icon.png'),
        favicons: {
          appName: "180-days-challenge",
          start_url: "/180-days-challenge",
          appDescription: "180 Days Challenge",
        }
      }),
      new webpack.DefinePlugin({
        'process.env': {
          TOKEN_HEADER_NAME: JSON.stringify(process.env.TOKEN_HEADER_NAME || '')
        }
      }),
      new HtmlWebpackPlugin({
        template: path.join(sourcePath, 'index.html'),
        path: buildPath,
        filename: 'index.html',
        inject: "head"
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
    ]}
}
