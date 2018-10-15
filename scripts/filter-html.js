/*

minify html in production

*/

let {minify} = require('html-minifier')
let dev = process.env.NODE_ENV === 'development'

let opts = {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  removeComments: true,
  useShortDoctype: true
}

function filterHtml(str, data) {
  if (dev === true) {
    // don't modify in development
    return str
  }

  return minify(str, opts)
}

hexo.extend.filter.register('after_render:html', filterHtml)
