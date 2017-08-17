'use strict'
const mkdirp = require('mkdirp')
const fs = require('fs')
const jf = require('jsonfile')

module.exports = class FileClient {
  constructor() {
    this.dir = './shops/'
    this.logPrefix = 'FileClient'
    mkdirp.sync(this.dir)
  }

  writeJSONFile(filepath, content) {
    const logPrefix = this.logPrefix + ' writeJSONFile -'
    return new Promise(function(resolve, reject) {
      fs.writeFile(filepath, JSON.stringify(content), function(err) {
          if(err) {
            console.log(logPrefix + 'Error', err)
            reject(err)
            return
          }
          // console.log(logPrefix, 'Saved', filepath);
          console.log('\nShop ID', content['shop_id'])
          for(var i = 0; i < content.instances.length; i++) {
            console.log('+ added listing ' + content.instances[i])
          }
          resolve()
      })
    })
  }

  updateJSONFile(filepath, newContent) {
    const logPrefix = this.logPrefix + ' updateJSONFile -'
    let isUpdated = false
    return new Promise(function(resolve, reject) {
      jf.readFile(filepath, function(err, oldContent) {
        console.log('\nShop ID', newContent['shop_id'])
        const oldInstances = oldContent.instances
        const newInstances = newContent.instances
        for(let i = 0; i < oldInstances.length; i++) {
          if (!newInstances.includes(oldInstances[i])) {
            const action = '- removed listing ' + oldInstances[i]
            console.log(action)
            isUpdated = true
          }
        }
        for(let i = 0; i < newInstances.length; i++) {
          if (!oldInstances.includes(newInstances[i])) {
            const action = '+ added listing ' + newInstances[i]
            console.log(action)
            isUpdated = true
          }
        }
        if(!isUpdated) {
          const action = 'No changes since last sync'
          console.log(action)
        }
        resolve()
      }.bind(this));
    })
  }

  // Update file if it exists, write a new file if it doesn't
  updateOrCreateFile(name, content) {
    const logPrefix = this.logPrefix + ' updateOrCreateFile -'
    const filepath = this.dir + name + '.json'

    return new Promise(function(resolve, reject) {
      fs.stat(filepath, function(err, stat) {
        if(err == null) {
            // console.log('File exists');
            resolve(this.updateJSONFile(filepath, content))
        } else if(err.code == 'ENOENT') {
            resolve(this.writeJSONFile(filepath, content))
        } else {
            console.log(logPrefix, 'Error', err.code)
            reject(err)
        }
      }.bind(this))
    }.bind(this))
  }

  // input: array of shop objects {'shop_id':123, instances:[] }
  // output: saves each shop object to a file
  saveShops(shopList) {
    let files = []
    for (var i = 0; i < shopList.length; i++) {
      const shopObj = shopList[i]
      files.push(this.updateOrCreateFile(shopObj['shop_id'], shopObj))
    }
    Promise.all(files).then(function(){
      // console.log('Done.')
    })
  }
}
