const path = require('path');

module.exports = {
  entry: './lib/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    library: 'slap',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this', // for usage in node-js
  },
  devtool: 'source-map',

  // TODO: minimize
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              declaration: true,
              outDir: 'dist',
            },
          },
        }],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  externals: {
    react: 'react', // Case matters here
    'react-dom': 'react-dom', // Case matters here
  },


};
