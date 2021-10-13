const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "none",
  entry: {
    script: { import: "./src/script.js", dependOn: "shared" },
    page2: { import: "./src/page2.js", dependOn: "shared" },
    shared: "lodash/join",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      chunks: ["script", "shared"],
    }),
    new HtmlWebpackPlugin({
      filename: "page2/index.html",
      template: "./src/index.html",
      chunks: ["page2", "shared"],
    }),
    new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  optimization: {
    usedExports: true,
    minimize: true,
  },
};
