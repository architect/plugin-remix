const { copyFileSync, existsSync, mkdirSync, rmSync } = require('fs')
const { join } = require('path')
const { BUILD_DIR, MY_NAME, REMIX_OVERRIDES } = require('./constants')

// ! Use of Remix internals. API not guaranteed:
const remixConfig = require('@remix-run/dev/config')

/**
 * Merge defaults and plugin options to create plugin and "initial" Remix config
 * @param {*} arc
 * @returns { { pluginConfig: object, initialRemixConfig: object } }
 */
function createPluginConfigs (arc) {
  const initialRemixConfig = { ...REMIX_OVERRIDES }
  const pluginConfig = {
    // Arc plugin-remix defaults
    mount: '/*',
    appDirectory: 'app', // best to support Remix defaults
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
        initialRemixConfig.appDirectory = value
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

        for (const key in initialRemixConfig) {
          initialRemixConfig[key] = initialRemixConfig[key].replace(BUILD_DIR, value)
        }
      }
    }
  }

  return { pluginConfig, initialRemixConfig }
}

/**
 * Create Arc handler for Remix server
 * @param {*} inv
 * @returns {void}
 */
function createServerHandler (inv) {
  const { pluginConfig } = createPluginConfigs(inv._project.arc)

  if (!existsSync(pluginConfig.serverDirectory))
    mkdirSync(pluginConfig.serverDirectory, { recursive: true })

  copyFileSync(pluginConfig.serverHandler, join(pluginConfig.serverDirectory, 'index.js'))
}

/**
 * Generate full Remix config
 * @param {*} inv
 * @returns {Promise<remixConfig.RemixConfig>}
 */
async function createFinalRemixConfig (inv) {
  const {
    _project: { arc, cwd },
  } = inv

  const existingConfig = await remixConfig.readConfig(cwd)
  const { initialRemixConfig } = createPluginConfigs(arc)

  return {
    ...existingConfig,
    ...initialRemixConfig, // overwrite build directories
  }
}

/**
 * Removes Remix build artifacts
 * @param {*} inv
 * @returns {void}
 */
function cleanup (inv) {
  const { initialRemixConfig, pluginConfig } = createPluginConfigs(inv._project.arc)

  rmSync(initialRemixConfig.assetsBuildDirectory, { recursive: true, force: true })
  rmSync(pluginConfig.buildDirectory, { recursive: true, force: true })
}

module.exports = {
  cleanup,
  createServerHandler,
  createFinalRemixConfig,
  createPluginConfigs,
}
