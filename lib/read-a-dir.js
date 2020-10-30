'use strict';

const pino = require('pino')

// SSTRUCT_LOG_LEVEL environment variable allows setting the desired log level
// see https://getpino.io/#/docs/api?id=level-string details for valid values
// For "production" NODE_ENV value
const logger = pino({ level: process.env['SSTRUCT_LOG_LEVEL'] || (process.env.NODE_ENV == 'production' ? 'info' : 'info') })

// Parses the input stream; options object can be provided to tune parsing
// procedure, e.g. obtain meta info in another object.
//
// The function returns a Promise that is resolved to the parsed object.
module.exports.readdir = function (root, options) {
  return new Promise(function (resolve, reject) {
    logger.debug({ root: root })
    options = options || {}
    var fs = options.fs || require('fs')
    if (!root) {
      reject('Needs root parameter')
    }
    fs.readdir(root)
    resolve('OK')
  })
}

