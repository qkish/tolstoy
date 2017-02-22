import path from 'path'
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import writeStats from './utils/write-stats'
import HappyPack from 'happypack'
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin'
import os from 'os'

const Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin');
const webpack_isomorphic_tools_plugin =
	new Webpack_isomorphic_tools_plugin(require('./webpack-isotools-config'))
//		.development(); // depricated

const outputPath = path.resolve(__dirname, '../dist')
const plugincfgHappyPack = {
  loaders: [
    {
      path: 'babel',
      query: {
        plugins: [
          'transform-runtime'
        ],
        cacheDirectory: false,
      },
    }
  ],
  threads: os.cpus().length || 2
}
const plugincfgHardSource = { // https://goo.gl/XLfMMz
    cacheDirectory: path.resolve(outputPath,'[confighash]'),
    recordsPath: path.resolve(outputPath,'[confighash]', 'records.json'),
    configHash: function(webpackConfig) {
    return require('node-object-hash')().hash(webpackConfig);
  },
  environmentHash: {
    root: process.cwd(),
      directories: ['node_modules'],
      files: ['package.json'],
  },
}
const plugincfgCommonChunk = { // https://goo.gl/GjpAg5
  names: ['vendor', 'manifest'],
  filename: '[name].js',
  minChunks: function (module) {
    return module.context && module.context.indexOf('node_modules') !== -1;
  }
}

const plugincfgDll = {
  path: path.resolve(outputPath, '[name]-manifest.json'),
  name: '[name]_dll'
}

export default {
	entry: {
		app: ['babel-polyfill', './app/Main.js'],
		vendor: [
		  'react',
      'react-dom',
      'react-router',
      'react-redux',
      'redux-saga',
    ]
	},
	output: {
		path: outputPath,
		filename: '[name].[hash].bundle.js',
		chunkFilename: '[id].[hash].bundle.js',
		publicPath: '/assets/',
    //library: '[name]_dll',
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
				test: /\.jsx?$/,
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
  cache: true,
	plugins: [
    new HappyPack(plugincfgHappyPack),
    new HardSourceWebpackPlugin(plugincfgHardSource),
    //new webpack.optimize.CommonsChunkPlugin(plugincfgCommonChunk),
    //new webpack.DllPlugin(plugincfgDll),
    function(){this.plugin('done', writeStats)},
		webpack_isomorphic_tools_plugin,
		new ExtractTextPlugin('[name].css'),
    
  
  ],
	resolve: {
		root: [
			path.resolve(__dirname, '..')
		],
		extensions: ['', '.js', '.json', '.jsx'],
		modulesDirectories: ['node_modules'],
		unsafeCache: /node_modules/
	},
	performance: {
		hints: 'warning'
	}
};
