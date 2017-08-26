let path = require('path');
let webpack = require('webpack')
let HtmlWebpackPlugin = require('html-webpack-plugin')

let phaserModule = path.join(__dirname, '/node_modules/phaser/')
let phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
let pixi = path.join(phaserModule, 'build/custom/pixi.js')
let p2 = path.join(phaserModule, 'build/custom/p2.js')

let definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
    WEBSOCKET_URL: "\"wss://inflow-server.herokuapp.com/\"",
})

module.exports = {
    entry: {
        app: [
            'babel-polyfill',
            path.resolve(__dirname, 'src/main.js')
        ],
        vendor: ['pixi', 'p2', 'phaser', 'webfontloader']

    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[chunkhash].js'
    },
    plugins: [
        definePlugin,
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.UglifyJsPlugin({
            drop_console: true,
            minimize: true,
            output: {
                comments: false
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.bundle.[chunkhash].js'}),
        new HtmlWebpackPlugin({template: 'src/index.html', inject: true}),
    ],
    module: {
        rules: [
            {test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src')},
            {test: /pixi\.js/, use: ['expose-loader?PIXI']},
            {test: /phaser-split\.js$/, use: ['expose-loader?Phaser']},
            {test: /p2\.js/, use: ['expose-loader?p2']},
            {
                test: /\.(png|jpe?g)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }]
            },
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2
        },
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname),
        ]
    }
}
