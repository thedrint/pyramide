const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = merge(common, {
	mode: "production",
	plugins: [
		new CopyWebpackPlugin([
			{from:'./src/index.css', to: './index.css'}
		]),
		new CleanWebpackPlugin(['prod']),
		new HtmlWebpackPlugin({
			title: 'Pyramide Solitaire',
			template: './src/index.html'
		})
	],
	output: {
		path: path.resolve(__dirname, 'prod')
	}
});