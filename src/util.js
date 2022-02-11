const { copyFileSync, existsSync, mkdirSync, rmSync } = require('fs')
const { join } = require('path')
const { BUILD_DIR, MY_NAME, REMIX_OVERWRITES } = require('./constants')
const remixConfig = require('@remix-run/dev/config')

/**
 *
 * @description merge defaults and plugin options to create plugin and Remix config
 * @param {*} arc
 * @returns { { pluginConfig: object, mergedRemixConfig: object } }
 */
function mergeConfig (arc) {
  const mergedRemixConfig = { ...REMIX_OVERWRITES }
  const pluginConfig = {
    // defaults
    mount: '/*',
    appDirectory: MY_NAME,
    buildDirectory: BUILD_DIR,
    serverDirectory: `${BUILD_DIR}/server`,
    serverHandler: join(__dirname, 'server', 'index.js'),
  }

  // look at @remix plugin options:
  for (const option of arc[MY_NAME]) {
    if (Array.isArray(option)) {
      const name = option[0]
      const value = option[1]

      if (name === 'app-directory') {
        pluginConfig.appDirectory = value
        mergedRemixConfig.appDirectory = value
      }
      else if (name === 'mount') {
        pluginConfig.mount = value
      }
      else if (name === 'server-handler') {
        pluginConfig.serverHandler = value
      }
      else if (name === 'build-directory') {
        pluginConfig.buildDirectory = value
        pluginConfig.serverDirectory = `${value}/server`

        for (const key in mergedRemixConfig) {
          mergedRemixConfig[key] = mergedRemixConfig[key].replace(BUILD_DIR, value)
        }
      }
    }
  }

  return { pluginConfig, mergedRemixConfig }
}

/**
 *
 * @description create Arc handler for Remix server
 * @param {*} inv
 * @returns {void}
 */
function createServerHandler (inv) {
  const { pluginConfig } = mergeConfig(inv._project.arc)

  if (!existsSync(pluginConfig.serverDirectory))
    mkdirSync(pluginConfig.serverDirectory, { recursive: true })

  copyFileSync(pluginConfig.serverHandler, join(pluginConfig.serverDirectory, 'index.js'))
}

/**
 *
 * @description generate full Remix config
 * @param {*} inv
 * @returns {Promise<remixConfig.RemixConfig>}
 */
async function generateConfig (inv) {
  const {
    _project: { arc, cwd },
  } = inv

  const existingConfig = await remixConfig.readConfig(cwd)
  const { mergedRemixConfig } = mergeConfig(arc)

  return {
    ...existingConfig,
    ...mergedRemixConfig, // overwrite build directories
  }
}

/**
 *
 * @description removes Remix build artifacts
 * @param {*} inv
 * @returns {void}
 */
function cleanup (inv) {
  const { mergedRemixConfig, pluginConfig } = mergeConfig(inv._project.arc)

  rmSync(mergedRemixConfig.assetsBuildDirectory, { recursive: true, force: true })
  rmSync(pluginConfig.buildDirectory, { recursive: true, force: true })
}

module.exports = {
  cleanup,
  createServerHandler,
  generateConfig,
  mergeConfig,
}
