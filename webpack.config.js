var path = require("path");
var HtmlWebpackPlugin = require("webpack-html-plugin");

module.exports = {
    context: path.resolve(__dirname, "src"),
    entry: "./index.js",
    output: {filename: "bundle.js", path: path.resolve(__dirname, "dist")},
    module: {loaders: [
        {test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel', query: {presets: ["es2015"]}}
    ]},
    resolve: {alias: {"datasets": path.resolve(__dirname, "datasets")}},
    plugins: [new HtmlWebpackPlugin({title: "Xerador", inject: true})]
};
