const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = (env) =>
	new Promise((resolve, reject) => {
		common(env)
			.then((config) => {
				resolve(
					merge(config, {
						mode: 'production',
						output: {
							filename: '[name].bundle.js',
							path: path.resolve(__dirname, '../dist')
						},
						performance: {
							maxEntrypointSize: 900000,
							maxAssetSize: 900000
						},
						optimization: {
							minimizer: [
								new TerserPlugin({
									terserOptions: {
										output: {
											comments: false
										}
									}
								}),
								new OptimizeCSSAssetsPlugin({})
							],
							splitChunks: {
								chunks: 'initial'
							}
						},
						plugins: [
							new JavaScriptObfuscator({
								rotateUnicodeArray: true
							},[]),
							new CleanWebpackPlugin([ 'dist' ], {
								root: path.resolve(__dirname, '../')
							}),
							new webpack.DefinePlugin({
								DEVELOPMENT: JSON.stringify(false),
								PRODUCTION: JSON.stringify(true)
							}),
							new MiniCssExtractPlugin({
								filename: '[name].css',
								chunkFilename: '[id].css'
							})
						],
						module: {
							rules: [
								{
									test: /\.css$/,
									use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
								}
							]
						}
					})
				);
			})
			.catch((err) => reject(err));
	});
