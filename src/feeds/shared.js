let path = require('path')
let filter = require('lodash/filter')
let get = require('lodash/get')
let moment = require('moment')
let projectPath = path.join(__dirname, '..', '..')
let dataPath = path.join(projectPath, 'source', '_data')
let maxDays = 30
let now = moment()

/**
 * Used in an array filter to limit posts by days old
 * @method filterDays
 * @param {string} datePath lodash object get path
 * @returns {function} filterer
 */
let filterDays = datePath => item => {
  let itemDate = get(item, datePath)
  let days = now.diff(moment(itemDate), 'days')

  if (days < maxDays) {
    return true
  }

  return false
}

let itemIcon = icon => item => {
  item.icon = icon
  return item
}

module.exports = {
  projectPath,
  dataPath,
  filterDays,
  itemIcon
}
