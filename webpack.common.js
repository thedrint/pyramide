const path = require('path');

module.exports =
{
	entry:
	{
		app: './src/index.js',
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
				use: [
					'style-loader',
					{loader:'css-loader', options:{}},
				],
			},
			{
				test: /\.(png|jpeg|jpg|gif)$/,
				use: [{loader: 'url-loader',
					options: {useRelativePath:false, name:'assets/img/[folder]/[name].[ext]', limit: 128}}],
			},
		]
	},
};