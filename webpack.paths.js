/**
 * webpack.paths
 */

// env
// require('./env')

const path = require('path')
const pkgs = require('./package.json')

const PROJECT_NAME = process.env.PROJECT_NAME || pkgs.projectName || pkgs.name
const CDN_URL = process.env.CDN_URL || '/'

module.exports = function ({
  appName = 'album'
}) {
  const distPath = path.join(__dirname, 'dist/wx')
  const srcPath = path.join(__dirname, 'src')
  const assetsPath = `${PROJECT_NAME}-${appName}`

  const appCdnUrl = (() => {
    if (process.env.NODE_ENV !== 'production') return '/'
    let url = CDN_URL

    // let url = process.env.NODE_ENV !== 'production'
    //     ? '/' + path.basename(CDN_URL)
    //     : CDN_URL;

    url += url.slice(-1) === '/' ? '' : '/'
    url += assetsPath + '/'

    return url
  })()

  return {
    APP_NAME: appName,
    PROJECT_NAME: PROJECT_NAME,
    MANIFEST: path.join(distPath, '../manifest.json'),
    ASSETS_PATH: assetsPath,
    PUBLIC: appCdnUrl,
    DIST: distPath,
    SRC: srcPath
  }
}
