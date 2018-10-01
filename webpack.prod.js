const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
// const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

const wwwData = 'public';// Site dir on server (relative to this config)

module.exports = {
	mode: "production",
	output:
	{
		path: path.resolve(__dirname, wwwData),
		filename: '[name].js',
		publicPath: './',
	},
	optimization: {
		minimizer: [
			new OptimizeCSSAssetsPlugin({}),
			new TerserPlugin({
				extractComments: /^foo$/,
			}),
		],
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
		// new SpriteLoaderPlugin(),
		// new SVGSpritemapPlugin({
		// 	src: 'src/**/*.svg',
		// 	svgo: {
		// 		removeMetadata: true,
		// 	},
		// }),
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			title: 'Pyramide Solitaire',
			template: './src/index.html',
		}),
	],
	module:
	{
		rules:
		[
			// {
			// 	test: /\.svg$/,
			// 	loader: 'svg-sprite-loader',
			// 	options: {
			// 		extract: true,
			// 	}
			// },
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
							sourceMap: false,
							minimize: true,
						},
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: false,
						}
					},
				],
			},
		]
	},
};