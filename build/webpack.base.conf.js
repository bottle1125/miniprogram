var path = require('path');
var fs = require('fs');
var utils = require('./utils');
var config = require('../config');
var webpack = require('webpack');
var merge = require('webpack-merge');
var vueLoaderConfig = require('./vue-loader.conf');
var MpvuePlugin = require('webpack-mpvue-asset-plugin');
var glob = require('glob');
var relative = require('relative');

var WebpackAssetsManifest = require('webpack-assets-manifest');
var getPaths = require('../webpack.paths');
var {MANIFEST} = getPaths({ appName: 'album' });

var MpvueEntry = require('mpvue-entry');

function resolve (dir) {
    return path.join(__dirname, '..', dir);
}

let baseWebpackConfig = {
    // 如果要自定义生成的 dist 目录里面的文件路径，
    // 可以将 entry 写成 {'toPath': 'fromPath'} 的形式，
    // toPath 为相对于 dist 的路径, 例：index/demo，则生成的文件地址为 dist/index/demo.js
    entry: MpvueEntry.getEntry(),
    target: require('mpvue-webpack-target'),
    output: {
        path: config.build.assetsRoot,
        jsonpFunction: 'webpackJsonpMpvue',
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue: 'mpvue',
            axios: resolve('src/services/axios'),
            '@': resolve('src')
        },
        symlinks: false,
        aliasFields: ['mpvue', 'weapp', 'browser'],
        mainFields: ['browser', 'module', 'main']
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                exclude: [
                    resolve('src/services/pingpp.js'),
                    resolve('src/services/sensors')
                ],
                options: {
                    formatter: require('eslint-friendly-formatter'),
                    fix: true
                }
            },
            {
                test: /\.less$/,
                include: [resolve('src/views'), resolve('src/components')],
                use: [
                    'style-loader',
                    'css-loader?sourceMap&modules&localIdentName=[local]___[hash:base64:7]',
                    'less-loader'
                ]
            },
            {
                test: /\.vue$/,
                loader: 'mpvue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                include: [resolve('src'), resolve('test')],
                use: [
                    'babel-loader',
                    {
                        loader: 'mpvue-loader',
                        options: {
                            checkMPEntry: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 100000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name]].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[ext]')
                }
            }
        ]
    },
    plugins: [
        new MpvueEntry(),
        new WebpackAssetsManifest({
            publicPath: '',
            output: MANIFEST,
            merge: false,
            customize: function (key, value, originalValue, manifest) {
                // 过滤图片
                if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(value)) {
                    return {
                        key: key,
                        value: value
                    };
                }
                return false;
            }
        }),
        // api 统一桥协议方案
        new webpack.DefinePlugin({
            'mpvue': 'global.mpvue',
            'mpvuePlatform': 'global.mpvuePlatform'
        }),
        new MpvuePlugin()
    ]
};


module.exports = baseWebpackConfig;
