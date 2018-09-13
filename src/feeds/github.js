/*

get github activity

+ orgs
+ users
+ npm run data-github

*/

// ⚠️ organizations here ⬇️
let orgs = [
  'ethsociety',
  'fourthstate',
  'omisego',
  'loomnetwork',
  'bankex',
  'wolkdb',
  'luciditytech'
]

// ⚠️ users here ⬇️
let users = ['kfichter', 'parthgargava', 'barrasso']

let icon = 'fab fa-github'

/*

Event types enumerated here:
https://developer.github.com/v3/activity/events/types/

*/
let desiredEventTypes = ['ReleaseEvent']

let badges = {
  ReleaseEvent: '<span class="badge">release</span>'
}

let fs = require('fs')
let path = require('path')
let async = require('async')
let request = require('request')
let flatten = require('lodash/flatten')
// let githubGraph = require('github-graphql-api')
let urlJoin = require('url-join')
let {dataPath, filterDays, itemIcon} = require('./shared')
let githubDataPath = path.join(dataPath, 'github.json')
let githubApiUrl = 'https://api.github.com'
let json = true
let qs = {limit: 5}
let headers = {'User-Agent': 'node request'}

let githubRequest = (url, done) =>
  request({url, json, qs, headers}, (err, _, body) => done(err, body))

// let githubGraphRequest =

function requestActivity(done) {
  let orgUrls = orgs.map(item => urlJoin(githubApiUrl, 'orgs', item, 'events'))
  let userUrls = users.map(item =>
    urlJoin(githubApiUrl, 'users', item, 'events')
  )
  let urls = [].concat(orgUrls).concat(userUrls)
  async.map(urls, githubRequest, done)
}

function format({requestActivity}, done) {
  let op = requestActivity.map(item => {
    if (typeof item === 'string') {
      return JSON.parse(item)
    }

    return item
  })
  op = flatten(op)

  // filter by event type
  op = op.filter(item => desiredEventTypes.indexOf(item.type) > -1)

  // limit to configured days by key
  op = op.filter(filterDays('created_at'))

  // format the url and mark external for the index page
  op = op.map(item => {
    let {type} = item
    let url =
      get(item, 'release.url') ||
      get(item, 'repo.url') ||
      get(item, 'repository.url')
    let title = ''

    if (type === 'ReleaseEvent') {
      let tag = get(item, 'release.tag', '')
      let fullName = get(item, 'repository.full_name', '')
      title = `${tag} ${fullName}`
    }

    item.url = url
    item.title = title
    item.external = true
    return item
  })

  // assign icon
  op = op.map(itemIcon(icon))

  // assign badge
  op = op.map(item => {
    let {type} = item
    let {title} = item
    let badge = badges[type]

    if (badge !== undefined) {
      item.title = `${badge} ${title}`
    }

    return item
  })

  done(null, op)
}

function save({format}, done) {
  let op = JSON.stringify(format, null, '  ')
  fs.writeFile(githubDataPath, op, done)
}

let steps = {
  requestActivity,
  format: ['requestActivity', format],
  save: ['format', save]
}

async.auto(steps, (err, res) => {
  if (err !== null && err !== undefined) {
    return console.error('error doing steps', err)
  }

  console.log('data-github done')
})
