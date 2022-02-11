const remixCommands = require('@remix-run/dev/cli/commands')

const config = JSON.parse(process.argv[2])
const mode = process.argv[3]

remixCommands.watch(config, mode)
