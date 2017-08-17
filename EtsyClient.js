'use strict'
const request = require('request-promise')
const appendQuery = require('append-query')

module.exports = class EtsyClient {
  constructor() {
    this.apiKey = process.env['ETSY_API_KEY']
    this.etsyBaseURL = 'https://openapi.etsy.com/v2'
    this.shopsURL = this.etsyBaseURL + '/shops/'
  }

  // Returns an array of listing IDs for a given shop ID
  getShopListingIDs(id) {
    const shopURL = appendQuery(this.shopsURL + id, 'includes=Listings')
    const endURL = appendQuery(shopURL, 'api_key='+this.apiKey)
    return request(endURL)
      .then(function(resp) {
        let jsonBody = JSON.parse(resp)
        // console.log(jsonBody)
        const listings = jsonBody.results[0].Listings
        let listingIDs = []
        for(let i = 0; i < listings.length; i++) {
          const id = listings[i]['listing_id']
          listingIDs.push(id)
        }
        // console.log('shop:', id, 'listings:', listingIDs)
        return listingIDs
      }.bind(this))
      .catch(function(err) {
        console.log('ERROR:', err)
      })
  }

  // Given some shop IDs, retrieve the listings for each and
  // return an array of those shops with their listings
  getShopInstanceList(shopIDs) {
    // console.log('shopIDs:', shopIDs)
    let requests = []
    let shopInstanceList = []
    for (var i = 0; i < shopIDs.length; i++) {
      requests.push(this.getShopListingIDs(shopIDs[i]))
    }
    return new Promise(function(resolve, reject) {
      Promise.all(requests).then(function(listingIDs){
        // console.log('listingIDs', listingIDs)
        for(var i = 0; i < listingIDs.length; i++) {
          shopInstanceList.push({
            'shop_id': shopIDs[i],
            'instances': listingIDs[i]
          })
        }
        resolve(shopInstanceList)
      })
    })
  }

  // Returns n number of shops from /shops API
  // If n is not provided, the default is however many etsy returns (25)
  getSomeShops(n) {
    const endURL = appendQuery(this.shopsURL, 'api_key='+this.apiKey)
    return request(endURL)
      .then(function (resp) {
        let jsonBody = JSON.parse(resp)
        // console.log(jsonBody)
        const shops = jsonBody.results
        let shopIDs = []
        let numShops = n || shops.length
        for(let i = 0; i < numShops; i++) {
          const id = shops[i]['shop_id']
          shopIDs.push(id)
        }
        // console.log('shops:', shopIDs)
        return shopIDs
      })
      .catch(function(err){
        console.log('ERROR:', err)
      })
  }
}


function getDummyData() {
  let ec = new EtsyClient()
  let shopIDs = []
  let shopInstanceList = []
  ec.getSomeShops(3)
    .then(function(ids) {
      shopIDs = ids
      return ids
    })
    .map(ec.getShopListingIDs.bind(ec))
    .then(function(instancesList) {
      for(var i = 0; i < instancesList.length; i++) {
        shopInstanceList.push({
          'shop_id': shopIDs[i],
          'instances': instancesList[i]
        })
      }
      console.log(shopInstanceList)
    })
}

