'use strict';

/* eslint-env node, jasmine */

const pino = require('pino')
const memfs = require('memfs')
const Volume = memfs.Volume
const readadir = require('../lib/read-a-dir')

const logger = pino({ level: process.env['READADIR_BASICSPEC_LOG_LEVEL'] || 'info' })

const files = [
  '1.txt',
  '2/2.txt',
  '2/2.1.txt',
  '3.txt'
]

describe('readadir function', function() {

  function f (dir) {
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
        return readadir.readadir(dir, { fs: memfs.createFsFromVolume(vol) })
      })
      .then(r => {
        logger.debug({ result: r })
        expect(r.sort()).toEqual(files.sort())
      })
  }

  it('finds files in a directory', function() {
    f('/directory')
  })

  it('finds files in a subdirectory', function() {
    f('/sub/directory')
  })

  it('finds files in at root /', function() {
    f('/')
  })
})
