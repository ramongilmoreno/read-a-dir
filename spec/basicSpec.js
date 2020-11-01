'use strict';

/* eslint-env node, jasmine */

const pino = require('pino')
const memfs = require('memfs')
const Volume = memfs.Volume
const readadir = require('../lib/read-a-dir')
const mktemp = require('mktemp')
const fs = require('fs/promises')

const logger = pino({ level: process.env['READADIR_BASICSPEC_LOG_LEVEL'] || 'info' })

const files = [
  '1.txt',
  '2/2.txt',
  '2/2.1.txt',
  '3.txt'
]

const hidden = files.concat([
  '.hidden/onlyIfHiddenAllowed.txt',
  '.hidden.txt'
])

describe('readadir function', function() {

  function fComplex (files, dir, result, includeHidden) {
    return new Promise(function (resolve, reject) {
      logger.debug({ message: 'Basic test' })
      try {
        const vol = new Volume()
        const json = {}
        files.forEach(x => json[x] = 'Contenst of ' + x)
        vol.fromJSON(json, dir)
        resolve(vol)
      } catch (error) {
        reject(error)
      }
    })
      .then(vol => {
        var options = { fs: memfs.createFsFromVolume(vol) }
        if (includeHidden) {
          options.includeHidden = true
        }
        return readadir.readadir(dir, options )
      })
      .then(r => {
        logger.debug({ result: r })
        expect(r.sort()).toEqual(result.sort())
      })
  }

  function f(dir) { return fComplex(files, dir, files) }

  it('finds files in a directory', function() {
    f('/directory')
  })

  it('finds files in a subdirectory', function() {
    f('/sub/directory')
  })

  it('finds files in at root /', function() {
    f('/')
  })

  it('skips hidden files', function() {
    fComplex(hidden, '/', files)
  })

  it('finds hidden files', function() {
    fComplex(hidden, '/', hidden, true)
  })

  it('works in an actual filesystem', function() {
    return mktemp
      .createDir('read-a-dir-XXXXXXX')
      .then(path => {
        logger.debug({ tmpdir: path })
        return fs.writeFile(path + '/1.txt', 'Contents of 1')
          .then(() => fs.mkdir(path + '/2'))
          .then(() => fs.writeFile(path + '/2/2.txt', 'Contents of 2'))
          .then(() => fs.mkdir(path + '/2/3'))
          .then(() => fs.writeFile(path + '/2/3/3.txt', 'Contents of 3'))
          .then(() => {
            var r = readadir.readadir(path)
            // Clean before continue
            return fs.rmdir(path, { recursive: true })
              .then(() => r)
          })
      })
      .then(r => {
        logger.debug({ resultInFilesystem: r })
        expect(r.sort()).toEqual([
            '1.txt',
            '2/2.txt',
            '2/3/3.txt'
          ].sort())
      })
  })
})
