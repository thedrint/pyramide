const path = require('path');

module.exports = {
  mode: "development",
  entry: './src/index.js',
  devtool:"source-map",
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname)
  },
	module: {
		rules: [
			{
				test: /\.png$/,
				use: [
					{
						loader: 'url-loader?mimetype=image/png',
						options: {
							limit: 8192000
						}
					}
				]
			}
		]
	}
};