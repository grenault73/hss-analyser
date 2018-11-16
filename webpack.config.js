const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  target: "node",
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./"),
    filename: "index.js",
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: [
                [ "@babel/env", { loose: true, modules: false } ],
              ],
            },
          },
        ],
      },
    ],
  },
  stats: { colors: true },
};
