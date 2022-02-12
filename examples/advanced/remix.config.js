/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  // if declaring a custom "app-directory" in app.arc > @remix,
  // this option must be set to match
  appDirectory: 'remix', // defaults to "app"
  // these settings are controlled by plugin-remix and will have no effect:
  assetsBuildDirectory: 'public/.remix/',
  cacheDirectory: '.remix/.cache/',
  serverBuildDirectory: '.remix/server/build/',
  publicPath: '/_static/.remix/',
  // other Remix options are respected:
  ignoredRouteFiles: [ '.*' ],
}
