const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: {
		main: './src/main.ts',
		app: './src/controllers/AppEntry.tsx',
	},
	// eval-cheap-module-source-map
	// inline-source-map
	// eval-source-map
	devtool: 'source-map',
	context: path.resolve(__dirname, '../'),
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../out/build'),
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(png|jpe?g|gif|ico|svg)$/i,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: './assets/img/',
					publicPath: './assets/img/',
				},
			},
			{
				test: /\.(eot|ttf|woff|woff2)$/i,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: './assets/font/',
					publicPath: './assets/font/',
				},
			},
		],
	},
	target: 'electron-main',
	node: { __dirname: false },
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			src: path.resolve(__dirname, '../src'),
			assets: path.resolve(__dirname, '../assets'),
		},
	},
	optimization: {
		minimize: false,
	},
	// externals: {
	// 	react: 'React',
	// 	'react-dom': 'ReactDOM',
	// },
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			meta: {
				viewport: 'width=device-width, initial-scale=1',
				'theme-color': '#000000',
				description: 'Web site created using create-react-app',
			},
			showErrors: true,
			chunks: ['app'],
			inject: 'body',
			templateContent: `
				<!DOCTYPE html>
				<html lang="en">
					<head>
					<meta charset="utf-8" />
					<title>Firewall</title>
					<script
						crossorigin
						src="https://unpkg.com/react@16/umd/react.development.js"
					></script>
					<script
						crossorigin
						src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
					></script>
					<link rel="icon" href="./assets/favicon.ico" />
					<link rel="apple-touch-icon" href="./assets/logo192.png" />
					<link rel="manifest" href="./manifest.json" />
					</head>
					<body>
						<noscript>You need to enable JavaScript to run this app.</noscript>
						<div id="root"></div>
					</body>
				</html>
				`,
			// scriptLoading: 'defer',
			// minify: true,
		}),
	],
	watchOptions: {
		aggregateTimeout: 600,
		ignored: [
			/node_modules/,
			/.vscode/,
			/out/,
			/old/,
			/metadata/,
			'README*.md',
			'.gitignore',
			'package*.json',
			'tsconfig.json',
		],
	},
	performance: {
		hints: 'warning',
	},
};
