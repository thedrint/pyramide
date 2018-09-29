const path = require('path');
//const merge = require('webpack-merge');
//const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
	mode: "development",
	devtool:"source-map",
	output:
	{
		path: path.resolve(__dirname, 'dev'),
		filename: '[name].js',
		publicPath: './',
	},
	plugins: [
		new CleanWebpackPlugin(['dev']),
		CopyWebpackPlugin([
			{from: './assets/img/decks', to: './assets/img/decks', context: './src'},
		]),
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			title: 'Pyramide Test',
			template: './src/index.html',
		}),
	],
	module:
		{
			rules:
				[
					{
						test: /\.(png|jpe?g|gif|svg)$/,
						include: path.resolve(__dirname, './src/assets/img'),
						use: [
							{
								loader: 'url-loader',
								options: {
									context: 'src', name:'[path][name].[ext]',
									limit: 128,
								}
							},
						],
					},
					{
						test: /\.css$/,
						include: path.resolve(__dirname, './src/assets/css'),
						use: [
							{
								loader: MiniCssExtractPlugin.loader,
								// options: {context: 'src', name:'[path][name].[ext]'},
							},
							{
								loader: 'css-loader',
								// options:{context: 'src', name:'[path][name].[ext]', sourceMap: false, minimize: true},
							},
							// {
							// 	loader: 'style-loader',
							// },
						],
					},
				]
		},
};