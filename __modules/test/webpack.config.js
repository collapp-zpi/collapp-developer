const path = require('path')

const SRC_DIR = path.resolve(__dirname, 'src')
const DIST_DIR = path.resolve(__dirname, 'dist')

module.exports = [
  {
    entry: path.resolve(SRC_DIR, 'client.js'),
    output: {
      path: path.resolve(DIST_DIR, 'client'),
      filename: 'index.js',
      libraryTarget: 'commonjs2',
      libraryExport: 'default',
    },
    externals: ['react'],
    module: {
      rules: [
        {
          test: /\.(js|jsx)?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      ],
    },
  },
  {
    entry: path.resolve(SRC_DIR, 'server.js'),
    output: {
      path: path.resolve(DIST_DIR, 'server'),
      filename: 'index.js',
      libraryTarget: 'commonjs2',
      libraryExport: 'default',
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
  },
]
