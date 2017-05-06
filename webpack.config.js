let webpack = require('webpack')
let path = require('path')

module.exports = {
	entry: './src/index.js',
  externals: [
      /^(uf\-target\-)/
  ],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'unfuck.js',
		library: 'unfuck',
		libraryTarget: 'umd'
	},
  plugins: [
    new webpack.ProvidePlugin({
      BrainfuckError: path.resolve(__dirname, 'src/error.js')
    })
  ],
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015'],
					cacheDirectory: true
				}
			}
		]
	}
};
