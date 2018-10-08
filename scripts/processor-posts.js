/*

prcoess language specific posts

*/

let postProcessor = require(`hexo/lib/plugins/processor/post`)
let Post = hexo.model('Post')

hexo.extend.processor.register(':lang/_posts/*.md', (data, done) => {
  let {params, path, type} = data
  let {lang} = params

  // used below to strip out wrong path info
  function fixPath(post, val) {
    let {date} = post
    let year = date.format('YYYY')
    let month = date.format('MM')
    let day = date.format('DD')
    return val.replace(`${lang}-posts-${year}${month}${day}-`, '')
  }

  // don't skip it in `postProcessor`
  if (type === 'skip') {
    delete data.type
  }

  let pp = postProcessor(hexo)

  // give `process` the needed context
  data.params.renderable = true
  data.params.path = path

  let op = pp
    .process(data)
    .then(res => {
      let post = Post.findOne({source: path})

      post.lang = lang

      // the paths get messed up due to the custom directory structure
      // this removes some junk from the paths
      post.slug = fixPath(post, post.slug)
      post.path = fixPath(post, post.path)
      post.permalink = fixPath(post, post.permalink)

      post.save(done)
    })
    .catch(err => {
      done(err)
    })
})
