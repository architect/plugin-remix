const MY_NAME = 'remix'
const BUILD_DIR = `.${MY_NAME}`
const REMIX_OVERRIDES = {
  appDirectory: 'app',
  // TODO: put assets in BUILD_DIR and deploy to a bucket
  assetsBuildDirectory: `public/${BUILD_DIR}/`,
  cacheDirectory: `${BUILD_DIR}/.cache/`,
  serverBuildDirectory: `${BUILD_DIR}/server/build/`,
  publicPath: `/_static/${BUILD_DIR}/`,
}

module.exports = {
  MY_NAME,
  BUILD_DIR,
  REMIX_OVERRIDES,
}
