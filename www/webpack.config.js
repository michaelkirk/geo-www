const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
    entry: './src/bootstrap.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.png$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'index.html' }
            ]
        })
    ],
    mode: 'development',
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ]
    },
    experiments: {
        // deprecated: TODO switch to `asyncWebAssembly: true,`
        asyncWebAssembly: true,
    }
};
