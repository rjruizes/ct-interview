const EtsyClient = require('./EtsyClient')
const FileClient = require('./FileClient')

var args = process.argv.slice(2);
let shopIDs = []
if (args.length > 0) {
  shopIDs = args // TODO: input validation
} else {
  shopIDs = ['15822947', '15822933', '15822875']
}

let ec = new EtsyClient()
ec.getShopInstanceList(shopIDs)
  .then(function(shops) {
    fc.saveShops(shops)
  })

// const shopList = require('./test/shopInstanceList.json')
// const shopList2 = require('./test/shopInstanceListUpdated.json')
// fc.saveShops(shopList)
