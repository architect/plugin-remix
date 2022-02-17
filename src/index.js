const { fork, execSync } = require('child_process')
const { copyFileSync } = require('fs')
const { join } = require('path')
const { MY_NAME } = require('./constants')
const {
  cleanup,
  createServerHandler,
  createFinalRemixConfig,
  createPluginConfigs
} = require('./util')

// ! Use of Remix internals. API not guaranteed:
const { BuildMode } = require('@remix-run/dev/build')
const remixCompiler = require('@remix-run/dev/compiler')

let watcher

function setHttp ({ inventory: { inv } }) {
  const { _project } = inv

  if (_project.arc[MY_NAME]) {
    // ! keep this function fast
    // make sure handler directory exists
    createServerHandler(inv, { skipHandler: true })

    const { pluginConfig } = createPluginConfigs(_project)

    return {
      method: 'any',
      path: pluginConfig.mount,
      src: pluginConfig.serverDirectory,
    }
  }
}

async function sandboxStart ({ inventory: { inv } }) {
  const {
    _project: { arc },
  } = inv

  if (arc[MY_NAME]) {
    console.log('Sandbox is starting Remix watch...')

    const config = await createFinalRemixConfig(inv)

    createServerHandler(inv)
    watcher = fork(join(__dirname, 'watcher.js'), [ JSON.stringify(config), BuildMode.Development ])
  }
}

async function deployStart ({ inventory: { inv } }) {
  const {
    _project
  } = inv

  // Build Remix client and server
  if (_project.arc[MY_NAME]) {
    console.log('Building Remix app for deployment...')

    const { pluginConfig } = createPluginConfigs(_project)
    const config = await createFinalRemixConfig(inv)

    createServerHandler(inv)
    await remixCompiler.build(config, { mode: BuildMode.Production })
    // TODO: hydrate the Remix server function
    copyFileSync(pluginConfig.serverPackage, join(pluginConfig.serverDirectory, 'package.json'))
    await execSync(`cd ${pluginConfig.serverDirectory} && npm i`, { stdio: 'inherit' })
  }
}

module.exports = {
  set: {
    http: setHttp,
  },
  deploy: {
    start: deployStart,
    async end ({ inventory: { inv } }) {
      cleanup(inv)
    },
  },
  sandbox: {
    start: sandboxStart,
    async end ({ inventory: { inv } }) {
      if (watcher) watcher.kill()
      cleanup(inv)
    },
  },
}
