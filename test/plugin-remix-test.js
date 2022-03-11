const test = require('tape')
const pluginRemix = require('../src')
const { PLUGIN_DEFAULTS } = require('../src/constants')
const {
  createFinalRemixConfig,
  createPluginConfigs,
} = require('../src/util')

test('existential', (t) => {
  t.ok(pluginRemix, 'lib exists')
  t.ok(createFinalRemixConfig, 'util.createFinalRemixConfig exists')
  t.ok(createPluginConfigs, 'util.createPluginConfigs exists')
  t.end()
})

test('plugin config generator', (t) => {
  const arcProject = {
    arc: {
      remix: [],
    },
    cwd: './testProject'
  }
  const defaultExpectedOutput = {
    pluginConfig: {
      'mount': '/*',
      'appDirectory': './app',
      'buildDirectory': '.remix',
      'serverDirectory': '.remix/server',
      'serverHandler': PLUGIN_DEFAULTS.serverHandler,
    },
    initialRemixConfig: {
      'appDirectory': './app',
      'assetsBuildDirectory': './public/.remix/',
      'cacheDirectory': '.remix/.cache/',
      'publicPath': '/_static/.remix/',
      'serverBuildPath': 'testProject/.remix/server/build.js',
      'serverBuildTarget': 'arc'
    }
  }

  t.deepEquals(createPluginConfigs(arcProject), defaultExpectedOutput, 'default config')

  const verboseArcProject = {
    arc: {
      remix: [
        [ 'app-directory', 'testing' ],
        [ 'build-directory', '.testing' ],
        [ 'mount', '/testing' ],
        [ 'server-handler', './custom/testing.js' ],
      ],
    },
    cwd: './testProject'
  }
  const verboseExpectedOutput = {
    pluginConfig: {
      'mount': '/testing',
      'appDirectory': 'testing',
      'buildDirectory': '.testing',
      'serverDirectory': '.testing/server',
      'serverHandler': './custom/testing.js',
    },
    initialRemixConfig: {
      'appDirectory': 'testing',
      'assetsBuildDirectory': './public/.testing/',
      'cacheDirectory': '.testing/.cache/',
      'publicPath': '/_static/.testing/',
      'serverBuildPath': 'testProject/.testing/server/build.js',
      'serverBuildTarget': 'arc'
    }
  }

  t.deepEquals(createPluginConfigs(verboseArcProject), verboseExpectedOutput, 'verbose config')

  t.end()
})

test('remix config generator', async (t) => {
  const arcInv = {
    _project: {
      arc: {
        remix: [],
      },
      cwd: './test/testProject'
    }
  }
  const expectedOutput = {
    appDirectory: './app',
    cacheDirectory: '.remix/.cache/',
    assetsBuildDirectory: './public/.remix/',
    publicPath: '/_static/.remix/',
    serverBuildPath: 'test/testProject/.remix/server/build.js',
    // serverMode: 'production',
    serverBuildTarget: 'arc',
  }
  const actualOutput = await createFinalRemixConfig(arcInv)

  for (const key in expectedOutput) {
    t.equals(actualOutput[key], expectedOutput[key], key)
  }

  t.end()
})
