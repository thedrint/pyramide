const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const srcDir = './src';// Source dir (relative to this config)
const dstDir = './dev';// Site dir on server (relative to this config)

module.exports = {
	mode: "development",
	devtool:"source-map",
	devServer: {
		contentBase: path.join(__dirname, dstDir),
		publicPath: '/',
	},
	entry: {
		index: `${srcDir}/index.js`
	},
	output:
	{
		path: path.resolve(__dirname, dstDir),
		filename: '[name].js',
		publicPath: '/',
	},
	plugins: [
		new CleanWebpackPlugin({
			// dry:true,
			cleanOnceBeforeBuildPatterns: [
				'index.html', 
				'index.js*', 
				'index.css*', 
				'favicon.png', 
				'assets/*', 
				// '!assets/img/**', // exclude decks
				'locales/*', 
			],
		}),
		new CopyWebpackPlugin([
			// {from: './assets/img', to: './assets/img', context: srcDir},
			{from: './locales', to: './locales', context: srcDir},
		]),
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			title: 'Pyramide Test',
			favicon: `${srcDir}/assets/img/favicon.png`,
		}),
	],
	module:
		{
			rules:
				[
					{
						test: /\.(png|jpe?g|gif|svg)$/,
						include: path.resolve(__dirname, `${srcDir}/assets/img`),
						use: [
							{
								loader: 'url-loader',
								options: {
									context: srcDir, name:'[path][name].[ext]',
									limit: 128,
								}
							},
						],
					},
					{
						test: /\.(css)$/,
						// include: path.resolve(__dirname, srcDir),
						use: [
							'style-loader',
							'css-loader',
						],
					},
					{
						test: /\.(sass|scss)$/,
						include: path.resolve(__dirname, `${srcDir}/assets/css`),
						use: [
							{
								loader: MiniCssExtractPlugin.loader,
								// options: {context: srcDir, name:'[path][name].[ext]'},
							},
							{
								loader: 'css-loader',
								options:{
									// context: srcDir,
									sourceMap: true,
									// importLoaders: 1,
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
