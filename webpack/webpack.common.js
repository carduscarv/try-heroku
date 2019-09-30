const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) =>
	new Promise((resolve, reject) => {
		let baseConfig = require('../config/base.config.json');
		let returnConfig = (finalConfigObject) => ({
			entry: {
				app: path.resolve(__dirname, '../src/index.js')
			},
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader'
						}
					},
					{
						test: [ /\.vert$/, /\.frag$/ ],
						use: 'raw-loader'
					},
					{
						test: /\.(gif|png|jpe?g|svg|xml)$/i,
						use: 'file-loader'
					}
				]
			},
			plugins: [
				new webpack.DefinePlugin({
					CANVAS_RENDERER: JSON.stringify(true),
					WEBGL_RENDERER: JSON.stringify(true),
					CONFIG: JSON.stringify(finalConfigObject)
				}),
				new HtmlWebpackPlugin({
					template: './index.html'
				})
			]
		});

		if (env) {
			let enviroConfig = env.build;
			fs.readFile(
				path.resolve(__dirname, `../config/${enviroConfig}.config.json`),
				{ encoding: 'utf8' },
				(err, data) => {
					if (!err) {
						let newconfig = JSON.parse(data);
						let combinedConfig = {
							...baseConfig,
							...newconfig
						};
						resolve(returnConfig(combinedConfig));
					} else {
						reject(`File ${enviroConfig} config is error / not found`);
					}
				}
			);
		} else {
			resolve(returnConfig(baseConfig));
		}
	});
