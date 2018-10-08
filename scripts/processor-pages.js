let Page = hexo.model('Page')

hexo.extend.processor.register(':lang/**/*.md', (data, done) => {
  let {params, path} = data
  let {lang} = params

  if (path.indexOf('_posts') > -1) {
    return done()
  }

  let page = Page.findOne({source: path})

  if (page === undefined) {
    return done()
  }

  page.lang = lang
  page.save(done)
})
