'use strict';

const pino = require('pino')
const path = require('path')

// SSTRUCT_LOG_LEVEL environment variable allows setting the desired log level
// see https://getpino.io/#/docs/api?id=level-string details for valid values
// For "production" NODE_ENV value
const logger = pino({ level: process.env['READADIR_LOG_LEVEL'] || (process.env.NODE_ENV == 'production' ? 'info' : 'info') })

// Parses the input stream; options object can be provided to tune parsing
// procedure, e.g. obtain meta info in another object.
//
// The function returns a Promise that is resolved to the parsed object.
module.exports.readadir = function (root, options) {
  options = options || {}
  var fs = options.fs || require('fs')
  var acc = []

  // Normalize root and use is as parent dir, and . as current (start) dir
  logger.debug({ root: root })
  root = path.normalize(root)
  if (root.endsWith('/')) {
    root = root.substring(0, root.length - 1)
  }
  logger.debug({ normalizedRoot: root })
  var parentDir = root
  var basename = '.'

  // Check for hidden 
  function isHidden (file) {
    if (options.includeHidden) {
      return false
    } else {
      return file.name.startsWith('.')
    }
  }

  // This is the recursive call
  function d (dirname, parentDir, acc) {
    logger.debug({ dirname: dirname, parentDir: parentDir, acc: acc })
    var full = parentDir + '/' + dirname
    return new Promise(function (resolve2, reject2) {
      fs.readdir(full, { withFileTypes: true }, function (err, r) {
        if (err) {
          logger.debug({ errorInReaddir: err })
          reject2(err)
        } else {
          logger.debug({ dirname: dirname, parentDir: parentDir, acc: acc, filesHere: r })
          resolve2(r)
        }
      })
    })
      .then(contents => Promise.all(contents.map(file => {
          if (isHidden(file)) {
            logger.debug({ ignored: file.name })
            return Promise.resolve()
          } else if (file.isDirectory()) {
            return d(file.name, full, acc)
          } else {
            acc.push(full + '/' + file.name)
            return Promise.resolve()
          }
      })))
  }

  return d(basename, parentDir, acc)
    .then(() => {
      logger.debug({ beforeCleanRoot: acc })
      return acc.map(x => x.substring((root + '/./').length))
    })
    .then(r => {
      logger.debug({ result: r })
      return r
    })
}

