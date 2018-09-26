const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const CopyWebpackPlugin = require('copy-webpack-plugin')



module.exports = merge(common, {
	mode: "development",
	output: {
		path: path.resolve(__dirname, 'dev'),
	},
	plugins: [
		// new CopyWebpackPlugin([
		// 	{from:'./src/index.css', to: './index.css'},
		// 	{from:'./src/decks', to: './decks'},
		// 	{from:'./src/tables', to: './tables'},
		// ]),
		new CleanWebpackPlugin(['dev']),
		new HtmlWebpackPlugin({
			title: 'Pyramide Test',
			template: './src/index.html',
			links: [
				'./index.css'
			]
		})
	],
	devtool:"source-map",
	devServer: {
		contentBase: './dev'
	}
});