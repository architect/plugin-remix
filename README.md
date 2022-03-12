<div style="width:500px">

[![Architect](https://assets.arc.codes/architect-logo-light-500b@2x.png#gh-dark-mode-only)](https://arc.codes)

[![Architect](https://assets.arc.codes/architect-logo-500b@2x.png#gh-light-mode-only)](https://arc.codes)

</div>

## [`@architect/plugin-remix`](https://www.npmjs.com/package/@architect/plugin-remix)

> Mix [Remix](https://remix.run) into an [Architect](https://arc.codes) project.

[![GitHub CI status](https://github.com/architect/plugin-remix/workflows/Node%20CI/badge.svg)](https://github.com/architect/plugin-remix/actions?query=workflow%3A%22Node+CI%22)

> ⚠️  This plugin is still pre-v1. Give it a go and provide any feedback by filing an issue.

## Install

Into your existing Architect project:

```sh
npm i @architect/plugin-remix --save-dev
```

Add the following to your Architect project manifest (usually `app.arc`):

```arc
@plugins
architect/plugin-remix

@remix
```

Create a `remix.config.js` in your Architect project root:

```js
// ./remix.config.js

module.exports = {}
```

## Requirements

Architect 10+

## Examples

See examples/ for sample apps.

- [Simple app](https://github.com/architect/plugin-remix/tree/main/examples/simple): A baseline app without custom configuration.
- [Advanced app](https://github.com/architect/plugin-remix/tree/main/examples/advanced): An example that uses all plugin options with a slightly more complex Remix app.

## How it works

`@architect/plugin-remix` is an [Architect](https://arc.codes) (v10+) plugin that automatically integrates the [Remix framework](https://remix.run) into an Arc project.

To achieve this, the plugin hooks into Architect's local development Sandbox and deployment commands in order to build and serve a Remix project (from ./app by default).

This plugin automatically configures and uses Remix's built-in watcher as a sub-process of Architect's Sandbox.

The following directories are automatically managed (see [configuration](#configuration) for options):

- `./.build/` directory will be created at the project root for the Remix server (deployed as a Lambda) and cache.
- `./public/.build/` dir will be created for Remix assets (deployed to an S3 bucket).

## Configuration

Available plugin options and their defaults:

```sh
@remix
app-directory app
build-directory .remix
```

- `app-directory` - folder path. Specify where your Remix app lives.
- `build-directory` - folder name. Name of folder for both server and client builds.
- `server-handler` - (advanced usage!) Javascript file path. Use a custom Lambda handler to load the Remix server. A recommended handler is provided by default when this option is not set.
- `mount` - Broken! - Specify a route to mount the Remix server. WIP.

### Interaction with remix.config.js

`@architect/plugin-remix` makes its best effort to respect a project's existing remix.config.js, but does control Remix build directories to better integrate with Architect.

Based on plugin defaults and plugin configuration (via `@remix` in `app.arc`), the following options are mutated before being passed to Remix:

```
appDirectory
assetsBuildDirectory
cacheDirectory
publicPath
serverBuildPath
```

## Known Issues

- `createArcTableSessionStorage` from `@remix-run/architect` hasn't been validated in this plugin yet.
- "`ExperimentalWarning: stream/web is an experimental feature.`" messages pollute the console.
  - This is an issue upstream of Architect and Remix: https://github.com/remix-run/remix/issues/1141
- Architect Sandbox will warn "`Warning: You may have dependencies that could be inaccessible in production`" when the Remix server isn't hydrated.
  - Either ignore or run `npx arc hydrate` after an initial Remix build has been run (via running Sandbox or an `arc deploy`)
