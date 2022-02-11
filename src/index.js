const { fork } = require('child_process')
const { join } = require('path')
const { MY_NAME } = require('./constants')
const { cleanup, createServerHandler, generateConfig, mergeConfig } = require('./util')
// risky use of Remix internals:
const { BuildMode } = require('@remix-run/dev/build')
const remixCompiler = require('@remix-run/dev/compiler')

let watcher

function setHttp ({ inventory: { inv } }) {
  const {
    _project: { arc },
  } = inv

  if (arc[MY_NAME]) {
    const { pluginConfig } = mergeConfig(arc)

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
    const config = await generateConfig(inv)

    console.log('Arc is starting Remix watch...')

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
    const config = await generateConfig(inv)
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
      cleanup(inv)
    },
  },
  sandbox: {
    start: sandboxStart,
    async end ({ inventory: { inv } }) {
      console.log('Arc is cleaning up Remix artifacts...')

      if (watcher) {
        watcher.kill()
      }

      cleanup(inv)
    },
  },
}
