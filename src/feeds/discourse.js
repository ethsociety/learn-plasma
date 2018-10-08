/*

discourse forum feeds
---------------------

+ get recent activity from discourse sites
+ npm run data-discourse

*/

let sites = [
  {
    id: 'ethresear.ch plasma',
    linkPrefix: 'https://ethresear.ch/c/plasma',
    url: 'https://ethresear.ch/c/plasma?format=json'
  }
]

let icon = 'fab fa-discourse'

let fs = require('fs')
let path = require('path')
let async = require('async')
let request = require('request')
let flatten = require('lodash/flatten')
let moment = require('moment')
let urlJoin = require('url-join')
let {dataPath, filterDays, itemIcon} = require('./shared')
let discourseDataPath = path.join(dataPath, 'discourse.json')
let json = true

function requestActivity(done) {
  let steps = sites.map(item => done => {
    let {url} = item
    request({url, json}, (err, _, body) => {
      if (err !== null && err !== undefined) {
        console.error('error requesting site', item, err)
        return done(err)
      }
      done(null, body)
    })
  })
  async.parallel(steps, done)
}

function format({requestActivity}, done) {
  let op = requestActivity.map((item, index) => {
    // we need to know the topic url
    let {linkPrefix} = sites[index]

    // build the url with the topic url and slug
    let topics = item.topic_list.topics.map(item => {
      let url = urlJoin(linkPrefix, item.slug)
      item.url = url
      return item
    })

    return topics
  })
  op = flatten(op)
  op = op.filter(item => item.pinned !== true)

  // limit to configured days by key
  op = op.filter(filterDays('last_posted_at'))

  // assign icon
  op = op.map(itemIcon(icon))

  done(null, op)
}

function save({format}, done) {
  let op = JSON.stringify(format, null, '  ')
  fs.writeFile(discourseDataPath, op, done)
}

let steps = {
  requestActivity,
  format: ['requestActivity', format],
  save: ['format', save]
}

async.auto(steps, (err, res) => {
  if (err !== null && err !== undefined) {
    console.error('error in discourse steps', err)
    return
  }

  console.log('data-discourse done')
})
