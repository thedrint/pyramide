const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports =
{
	entry:
	{
		app: './src/assets/js/index.js',
	},
	output:
	{
		filename: '[name].bundle.js',
	},
	module:
	{
		rules:
		[
			{
				test: /\.css$/,
				include: path.resolve(__dirname, 'src/assets/css'),
				use: ExtractTextPlugin.extract({
					use: 'css-loader',
					fallback: 'style-loader',
					// options:{sourceMap: true, minimize: true}
				}),
			},
			{
				test: /\.(png|jpeg|jpg|gif)$/,
				include: path.resolve(__dirname, 'src/assets/img'),
				use: [
					{
						loader: 'url-loader',
						options: {useRelativePath:false, name:'assets/img/[folder]/[name].[ext]', limit: 128}
					},
				],
			},
		]
	},
	plugins: [
		new ExtractTextPlugin('assets/css/[name].[ext]'),
	]
};