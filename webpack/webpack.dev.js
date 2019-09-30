const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env) =>
	new Promise((resolve, reject) => {
		common(env)
			.then((config) => {
				resolve(
					merge(config, {
						mode: 'development',
						devtool: 'eval-source-map',
						devServer: {
							contentBase: 'src/assets'
						},
						module: {
							rules: [
								{
									test: /\.css$/i,
									use: [ 'style-loader', 'css-loader' ]
								}
							]
						},
						plugins: [
							new webpack.DefinePlugin({
								DEVELOPMENT: JSON.stringify(true),
								PRODUCTION: JSON.stringify(false)
							})
						]
					})
				);
			})
			.catch((err) => reject(err));
	});
