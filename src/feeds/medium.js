/*

medium feed processor:
---

+ add urls to feeds array to get more
+ npm run data-medium

*/

// ⚠️ put more urls here ⬇️
let feeds = [
  {
    id: 'omisego',
    url: 'https://blog.omisego.network/feed'
  }
]

let icon = 'fab fa-medium'

let fs = require('fs')
let path = require('path')
let async = require('async')
let request = require('request')
let xml2js = require('xml2js')
let get = require('lodash/get')
let isString = require('lodash/isString')
let isArray = require('lodash/isArray')
let {dataPath, filterDays, itemIcon} = require('./shared')
let mediumDataPath = path.join(dataPath, 'medium.json')

function requestFeedXmls(done) {
  let steps = feeds.map(item => done => {
    let {id, url} = item
    request({url}, (err, res, body) => {
      if (err !== null && err !== undefined) {
        console.error('error requesting', id, url, err)
        return done(err)
      }
      done(null, body)
    })
  })
  async.parallel(steps, done)
}

function parseFeedXmls({feedXmls}, done) {
  let steps = feedXmls.map(source => done => {
    xml2js.parseString(source, (err, res) => {
      if (err !== null && err !== undefined) {
        console.error('error parsing xml', err)
        return done(err)
      }
      let posts = get(res, 'rss.channel[0].item')
      done(null, posts)
    })
  })
  async.parallel(steps, done)
}

function formatFeeds({feedObjects}, done) {
  let op = feedObjects
    // combine and parse from the goofy xml
    .reduce((arr, posts, index) => {
      let {id} = feeds[index]
      posts.forEach(item => {
        let title = get(item, 'title[0]', '')
        let link = get(item, 'link[0]', '')
        let creator = get(item, 'dc:creator[0]', '')
        let updated = get(item, 'atom:updated[0]', '')
        let categories = get(item, 'category', []).map(item =>
          item.toLowerCase().trim()
        )
        let content = get(item, 'content:encoded[0]', '')
        arr.push({id, title, link, updated, categories})
      })

      return arr
    }, [])
    // save only things saying 'plasma' in it
    .filter(post => {
      return Object.keys(post).some(key => {
        let item = post[key]

        if (isString(item) === true) {
          return item.toLowerCase().indexOf('plasma') > -1
        }

        if (isArray(item) === true) {
          return item.some(item => item.indexOf('plasma') > -1)
        }

        return false
      })
    })
    // sort by date
    .sort((a, b) => new Date(b.updated) - new Date(a.updated))
    // cut out things we don't need
    .map(({id, title, link, creator, updated, categories}) => ({
      id,
      title,
      link,
      creator,
      updated,
      categories
    }))

  // limit to configured days by key
  op = op.filter(filterDays('updated'))

  // format the url and mark external for the index page
  op = op.map(item => {
    item.url = item.link
    item.external = true
    return item
  })

  // assign icon
  op = op.map(itemIcon(icon))

  done(null, op)
}

function saveFormattedFeeds({formatted}, done) {
  let op = JSON.stringify(formatted, null, '  ')
  fs.writeFile(mediumDataPath, op, done)
}

let steps = {
  feedXmls: requestFeedXmls,
  feedObjects: ['feedXmls', parseFeedXmls],
  formatted: ['feedObjects', formatFeeds],
  save: ['formatted', saveFormattedFeeds]
}

async.auto(steps, (err, res) => {
  if (err !== null && err !== undefined) {
    return console.error('error doing steps', err)
  }

  console.log('data-medium done')
})
