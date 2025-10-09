const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
    // mode: "production", // TODO production isn't working???
    mode: "development",
    devtool: "source-map",
    plugins: [
    ],
    module: {
    },
    // optimization: {
    //     minimize: true,
    //     minimizer: [new TerserPlugin()],
    // },
});
