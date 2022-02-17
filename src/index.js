const { fork, execSync } = require('child_process')
const { join } = require('path')
const { MY_NAME } = require('./constants')
const {
  createServerHandler,
  createFinalRemixConfig,
  createPluginConfigs
} = require('./util')

// ! Use of Remix internals. API not guaranteed:
const { BuildMode } = require('@remix-run/dev/build')
const remixCompiler = require('@remix-run/dev/compiler')

let watcher

function setHttp ({ inventory: { inv } }) {
  // ! keep this function fast
  const { _project } = inv

  if (_project.arc[MY_NAME]) {
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

    const config = await createFinalRemixConfig(inv)

    createServerHandler(inv)
    await remixCompiler.build(config, { mode: BuildMode.Production })

    // hydrate the Remix server function
    // TODO: use Arc's hydrate?
    const { pluginConfig } = createPluginConfigs(_project)
    await execSync(`cd ${pluginConfig.serverDirectory} && npm i`, { stdio: 'inherit' })
  }
}

module.exports = {
  set: {
    http: setHttp,
  },
  deploy: {
    start: deployStart,
  },
  sandbox: {
    start: sandboxStart,
    async end () {
      if (watcher) watcher.kill()
    },
  },
}
