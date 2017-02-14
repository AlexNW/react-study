'use strict';
let path = require('path');
let glob = require('glob');
let defaultSettings = require('./defaults');

// Additional npm or bower modules to include in builds
// Add all foreign plugins you may need into this array
// @example:
// let npmBase = path.join(__dirname, '../node_modules');
// let additionalPaths = [ path.join(npmBase, 'react-bootstrap') ];
let additionalPaths = [];
let appPath = path.join(__dirname, '/../src/apps');
let files = glob.sync(path.join(appPath, '/*.js'));
let entries = {};
let regula = new RegExp('.*\/apps\/(.*)\.js');
files.forEach(function(fPathName){
    var names = regula.exec(fPathName);
    console.dir(names);
    entries[names[1]] = fPathName;
});

module.exports = {
    additionalPaths: additionalPaths,
    port: defaultSettings.port,
    debug: true,
    devtool: 'eval',
    entry: entries,
    output: {
        path: path.join(__dirname, '/../dist' + defaultSettings.publicPath),
        filename: '[name].bundle.js',
        publicPath: defaultSettings.publicPath
    },
    devServer: {
        contentBase: './src/',
        historyApiFallback: true,
        hot: true,
        port: defaultSettings.port,
        publicPath: defaultSettings.publicPath,
        noInfo: false
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
            actions: `${defaultSettings.srcPath}/actions/`,
            components: `${defaultSettings.srcPath}/components/`,
            sources: `${defaultSettings.srcPath}/sources/`,
            stores: `${defaultSettings.srcPath}/stores/`,
            styles: `${defaultSettings.srcPath}/styles/`,
            config: `${defaultSettings.srcPath}/config/` + process.env.REACT_WEBPACK_ENV,
            'react/lib/ReactMount': 'react-dom/lib/ReactMount'
        }
    },
    module: {}
};
