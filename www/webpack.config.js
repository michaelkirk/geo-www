const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    },
    mode: 'development',
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ]
    },
    experiments: {
        // deprecated: TODO switch to `asyncWebAssembly: true,`
        asyncWebAssembly: true,
    }
};
