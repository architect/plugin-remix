const { fork } = require('child_process')
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
    console.log('Arc is starting Remix watch...')

    const config = await createFinalRemixConfig(inv)
    createServerHandler(inv)
    watcher = fork(join(__dirname, 'watcher.js'), [ JSON.stringify(config), BuildMode.Development ])
  }
}

async function deployStart ({ inventory: { inv } }) {
  const {
    _project: { arc },
  } = inv

  // build the thing
  if (arc[MY_NAME]) {
    const config = await createFinalRemixConfig(inv)
    createServerHandler(inv)
    await remixCompiler.build(config, { mode: BuildMode.Production })
  }
}

module.exports = {
  set: {
    http: setHttp,
  },
  deploy: {
    start: deployStart,
    async end ({ inventory: { inv } }) {
      console.log('Arc is cleaning up local Remix artifacts...')
      cleanup(inv)
    },
  },
  sandbox: {
    start: sandboxStart,
    async end ({ inventory: { inv } }) {
      console.log('Arc is cleaning up local Remix artifacts...')

      if (watcher) watcher.kill()
      cleanup(inv)
    },
  },
}
