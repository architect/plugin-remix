const { copyFileSync, existsSync, mkdirSync, rmSync } = require('fs')
const { join } = require('path')
const { BUILD_DIR, MY_NAME, PLUGIN_DEFAULTS, REMIX_OVERRIDES } = require('./constants')

// ! Use of Remix internals. API not guaranteed:
const remixConfig = require('@remix-run/dev/config')

/**
 * Merge defaults and plugin options to create plugin and "initial" Remix config
 * @param {*} project
 * @returns { { pluginConfig: object, initialRemixConfig: object } }
 */
function createPluginConfigs (project) {
  const { arc, cwd } = project
  const initialRemixConfig = { ...REMIX_OVERRIDES }
  const pluginConfig = { ...PLUGIN_DEFAULTS }

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
          initialRemixConfig[key] = initialRemixConfig[key].replace(
            BUILD_DIR,
            value
          )
        }
      }
    }
  }

  // patch to be a full file path
  initialRemixConfig.serverBuildPath = join(cwd, initialRemixConfig.serverBuildPath)

  return { pluginConfig, initialRemixConfig }
}

/**
 * Create Arc handler for Remix server
 * @param {*} inv
 * @param {object} options
 * @returns {void}
 */
function createServerHandler (inv, options = {}) {
  const { skipHandler = false } = options
  const { pluginConfig } = createPluginConfigs(inv._project)

  if (!existsSync(pluginConfig.serverDirectory))
    mkdirSync(pluginConfig.serverDirectory, { recursive: true })

  if (skipHandler) return

  copyFileSync(pluginConfig.serverHandler, join(pluginConfig.serverDirectory, 'index.js'))
  copyFileSync(pluginConfig.serverPackage, join(pluginConfig.serverDirectory, 'package.json'))
}

/**
 * Generate full Remix config
 * @param {*} inv
 * @returns {Promise<remixConfig.RemixConfig>}
 */
async function createFinalRemixConfig (inv) {
  const { _project } = inv

  const existingConfig = await remixConfig.readConfig(_project.cwd)
  const { initialRemixConfig } = createPluginConfigs(_project)

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
  const { initialRemixConfig, pluginConfig } = createPluginConfigs(inv._project)

  console.log('Sandbox is cleaning up local Remix artifacts...')

  rmSync(initialRemixConfig.assetsBuildDirectory, { recursive: true, force: true })
  rmSync(pluginConfig.buildDirectory, { recursive: true, force: true })
}

module.exports = {
  cleanup,
  createServerHandler,
  createFinalRemixConfig,
  createPluginConfigs,
}
