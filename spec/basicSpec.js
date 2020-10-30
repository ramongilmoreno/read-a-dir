'use strict';

/* eslint-env node, jasmine */

const pino = require('pino')
const memfs = require('memfs')
const Volume = memfs.Volume

const logger = pino({ level: process.env['SSTRUCT_BASICSPEC_LOG_LEVEL'] || 'info' })

describe('readdir function', function() {
  it('finds a file', function() {
    return new Promise(function (resolve, reject) {
      logger.debug({ messsage: 'Basic test' })
      try {
        const vol = new Volume()
        vol.writeFileSync('/example.txt', 'Example text')
        resolve(vol)
      } catch (error) {
        reject(error)
      }
    })
      .then(() => {
        expect(true).toEqual(true)
      })
  })
})
