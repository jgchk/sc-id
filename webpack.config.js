const path = require('path')
const WebpackUserscript = require('webpack-userscript')

const dev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scid.user.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  },
  plugins: [
    new WebpackUserscript({
      headers: {
        version: dev ? `[version]-build.[buildNo]` : `[version]`,
        license: 'GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt',
        match: ['*://soundcloud.com/*'],
        grant: ['GM_xmlhttpRequest'],
      },
    }),
  ],
}
