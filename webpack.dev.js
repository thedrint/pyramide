const path = require('path');
//const merge = require('webpack-merge');
//const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const wwwData = 'dev';// Site dir on server (relative to this config)

module.exports = {
	mode: "development",
	devtool:"source-map",
	entry: [
		'./src/index.js',
	],
	output:
	{
		path: path.resolve(__dirname, wwwData),
		filename: '[name].js',
		publicPath: './',
	},
	plugins: [
		new CleanWebpackPlugin([wwwData], {
			exclude: [
				`${wwwData}/assets/img/decks`,
			],
		}),
		new CopyWebpackPlugin([
			{from: './assets/img/decks', to: './assets/img/decks', context: './src'},
			{from: './assets/locales', to: './assets/locales', context: './src'},
		]),
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			title: 'Pyramide Test',
			template: './src/index.html',
		}),
		// new ExtractTextPlugin({
		// 	filename: './assets/css/index.css',
		// 	allChunks: true,
		// }),
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
						test: /\.(sass|scss)$/,
						include: path.resolve(__dirname, './src/assets/css'),
						use: [
							{
								loader: MiniCssExtractPlugin.loader,
								// options: {context: 'src', name:'[path][name].[ext]'},
							},
							{
								loader: 'css-loader',
								options:{
									// context: 'src',
									sourceMap: true,
									minimize: false,
								},
							},
							{
								loader: "sass-loader",
								options: {
									sourceMap: true
								}
							},
						],
					},
				]
		},
};