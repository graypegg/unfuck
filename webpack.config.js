var path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'unfuck.js',
		library: 'unfuck',
		libraryTarget: 'umd'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: [['es2015', { modules: false }]],
					cacheDirectory: true
				}
			}
		]
	}
};
