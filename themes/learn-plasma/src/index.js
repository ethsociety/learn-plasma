let $ = require('jquery')
let hashPattern = /\#.+/
let trailingSlashPattern = /\/$/

require('bootstrap')

$(() => {
  let pathname = window.location.pathname.replace(trailingSlashPattern, '')

  $('a.nav-link').each((_, item) => {
    let link = $(item)

    let linkHref = link
      .attr('href')
      .replace(hashPattern, '')
      .replace(trailingSlashPattern, '')

    if (linkHref === pathname) {
      // match
      // the user is viewing this url
      link.addClass('active')
      return
    }

    // no match
    link.removeClass('active')
  })

  let counter = 100
  $('.index-post').each((_, item) => {
    setTimeout(() => $(item).addClass('loaded'), (counter += 100))
  })
})
