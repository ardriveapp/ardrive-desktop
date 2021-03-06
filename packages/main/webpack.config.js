const path = require('path');

module.exports = {
	entry: './src/index.ts',
	target: 'electron-main',
	externals: {
		sqlite3: 'commonjs sqlite3',
		fsevents: "require('fsevents')"
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'babel-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'build')
	},
	node: {
		global: false,
		__filename: false,
		__dirname: false
	}
};
