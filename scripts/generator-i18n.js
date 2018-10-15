/*

language-specific pages

*/

let {slugize} = require('hexo-util')
let isArray = require('lodash/isArray')
let get = require('lodash/get')
let find = require('lodash/find')
let blank = 'blank'

hexo.extend.generator.register('i18n', locals => {
  let Page = hexo.model('Page')
  let Post = hexo.model('Post')
  let Category = hexo.model('Category')
  let Tag = hexo.model('Tag')
  let gens = []

  // turn page.categories into model collection
  function warehouseize(page) {
    let categories
    let tags

    //
    // support array of strings
    //

    if (isArray(page.categories) === true) {
      categories = Category.filter(
        item => page.categories.indexOf(item.name) > -1
      )
    }

    if (isArray(page.tags) === true) {
      tags = Tag.filter(item => page.tags.indexOf(item.name) > -1)
    }

    //
    // support blank
    //
    if (page.categories === null || page.categories.length === 0) {
      categories = Category.find({blank})
    }

    if (page.tags === null || page.tags.length === 0) {
      tags = Tag.find({blank})
    }

    page.categories = categories
    page.tags = tags

    return page
  }

  let languages = Object.keys(locals.data)
    // we know its a language data file because it has i18n true
    .filter(key => locals.data[key].i18n === true)

  let defaultLang = locals.data.en

  languages.forEach(lang => {
    let pages = Page.find({lang})
    let posts = Post.find({lang})
    let categoryIds = []
    let tagIds = []

    function i18n(path) {
      return (
        get(locals.data[lang], path) ||
        get(defaultLang, path) ||
        `**translate: ${path}**`
      )
    }

    let categoryLangUrl = name =>
      `${lang}/${lang.categoryUri}/${slugize(name)}/index.html`

    let tagLangUrl = name =>
      `${lang}/${lang.tagUri}/${slugize(name)}/index.html`

    // get unique category and tag ids
    pages.each(({_id}) => {
      if (categoryIds.indexOf(_id) === -1) {
        categoryIds.push(_id)
      }
    })

    posts.each(({_id}) => {
      if (tagIds.indexOf(_id) === -1) {
        tagIds.push(_id)
      }
    })

    //
    // generate index page
    //
    gens.push({
      path: `${lang}/index.html`,
      layout: 'index',
      data: Object.assign({}, locals, {lang, i18n, pages, posts})
    })

    //
    // pages
    //
    pages.each(page => {
      page = warehouseize(page)

      gens.push({
        path: `${page.path}`,
        layout: 'page',
        data: Object.assign({}, locals, page, {lang, i18n})
      })
    })

    //
    // posts
    //
    posts.each(post => {
      post = warehouseize(post)

      gens.push({
        path: `${post.path}/index.html`,
        layout: 'post',
        data: Object.assign({}, locals, post, {lang, i18n})
      })
    })

    //
    // categories
    //
    Category.filter(({_id}) => categoryIds.indexOf(_id) > -1).each(category => {
      let pages = category.pages
      let posts = category.posts
      gens.push({
        path: categoryLangUrl(category.name),
        layout: 'category',
        data: Object.assign({}, locals, category, {lang, i18n, pages, posts})
      })
    })

    //
    // tags
    //
    Tag.filter(({_id}) => tagIds.indexOf(_id) > -1).each(tag => {
      let pages = tag.pages
      let posts = tag.posts
      gens.push({
        path: tagLangUrl(tag.name),
        layout: 'tag',
        data: Object.assign({}, locals, tag, {lang, i18n, pages, posts})
      })
    })
  })

  return gens
})
