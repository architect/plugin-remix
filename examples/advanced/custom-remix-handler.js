/* eslint-disable */
// @ts-nocheck

console.log('Hello from Architect!')
// before Remix is loaded

const { createRequestHandler } = require('@remix-run/architect')
exports.handler = createRequestHandler({
  // Remix server build is always a sibling of this file
  build: require('./build'),
})
