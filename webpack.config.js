module.exports = {
    entry: './src/app.js',
    output: {
        filename: './build/bundle.js'
    },

    devServer: {
        inline: true,
        contentBase: "./build",
        port: 3000
    },

    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: "babel-loader",
            query: {
                presets: ["es2015", "react"]
            }
        }]
    }
};
