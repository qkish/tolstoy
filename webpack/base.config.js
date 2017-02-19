import path from 'path'
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import writeStats from './utils/write-stats'
import HappyPack from 'happypack'
import os from 'os'

const Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin');
const webpack_isomorphic_tools_plugin =
	new Webpack_isomorphic_tools_plugin(require('./webpack-isotools-config'))
//		.development(); // depricated

export default {
	entry: {
		app: ['babel-polyfill', './app/Main.js'],
		vendor: ['react', 'react-dom', 'react-router']
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: '[name].js',
		chunkFilename: '[id].js',
		publicPath: '/assets/'
	},
	module: {
		loaders: [
			{test: /\.(jpe?g|png)/, loader: 'url-loader?limit=4096'},
			{
				test: /fonts.*\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9-]+)?$/,
				
				loader: 'file-loader'
			},
			{test: /\.json$/, loader: 'json'},
			{
				test: /\.js$|\.jsx$/,
				exclude: /node_modules/,
				loader: 'happypack/loader',
			},
			{test: /\.svg$/, loader: 'svg-inline-loader'},
			{
				test: require.resolve("blueimp-file-upload"),
				loader: "imports?define=>false"
			},
			{
				test: require.resolve("medium-editor-insert-plugin"),
				loader: "imports?define=>false"
			},
			{
				test: /\.css$/,
				loader: 'style!css!autoprefixer'
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!sass?outputStyle=expanded')
			},
			{
				test: require.resolve('wowjs/dist/wow.js'),
				loader: 'exports?this.WOW'
			}
		]
	},
	plugins: [
		new HappyPack({
			// loaders is the only required parameter:
			loaders: [
				{
					path: 'babel',
					query: {
						plugins: [
							'transform-runtime'
						],
						cacheDirectory: true,
					},
				}
			],
			threads: os.cpus().length || 2
			// customize as needed, see Configuration below
		}),
//		new webpack.DllPlugin({
//			path: path.join(__dirname, "js", "[name]-manifest.json"),
//			name: "[name]_[hash]"
//		}),
		function () {
			this.plugin('done', writeStats);
		},
		webpack_isomorphic_tools_plugin,
		new ExtractTextPlugin('[name].css')
	],
	resolve: {
		root: [
			path.resolve(__dirname, '..')
		],
		extensions: ['', '.js', '.json', '.jsx'],
		modulesDirectories: ['node_modules']
	}
};
/* medium-editor, add to plugins[]
 
 new webpack.ProvidePlugin({
 $: 'jquery'
 })
 */
