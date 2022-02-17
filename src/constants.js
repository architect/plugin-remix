const { join } = require('path')
const MY_NAME = 'remix'
const BUILD_DIR = `.${MY_NAME}`

/** @type {import('@remix-run/dev/config').AppConfig} */
const REMIX_OVERRIDES = {
  appDirectory: './app',
  assetsBuildDirectory: `./public/${BUILD_DIR}/`,
  cacheDirectory: `${BUILD_DIR}/.cache/`,
  publicPath: `/_static/${BUILD_DIR}/`,
  serverBuildPath: `./${BUILD_DIR}/server/build.js`,
  serverBuildTarget: 'arc',
}

const PLUGIN_DEFAULTS = {
  // Arc plugin-remix defaults
  mount: '/*',
  appDirectory: REMIX_OVERRIDES.appDirectory,
  buildDirectory: BUILD_DIR,
  serverDirectory: `${BUILD_DIR}/server`,
  serverHandler: join(__dirname, 'server', 'handler'),
  serverPackage: join(__dirname, 'server', 'package'),
}

module.exports = {
  MY_NAME,
  BUILD_DIR,
  PLUGIN_DEFAULTS,
  REMIX_OVERRIDES,
}
