module.exports = {
    entry: './src/app.js',
    output: {
      //path: './build',
      filename: './build/bundle.js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: "babel-loader",
          query: {
            presets: ["es2015", "react"]
          }
        }
      ]
    }
  };