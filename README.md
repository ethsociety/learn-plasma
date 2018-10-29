# Learn Plasma

This website aims to educate visitors about the fundamentals and design principles of [plasma](https://plasma.io/), a framework for building scalable blockchain applications.

Learn Plasma was conceived at the [2018 IC3 Boot Camp at Cornell](https://www.initc3.org/events/2018-07-12-IC3-Ethereum-Crypto-Boot-Camp.html) and is maintained by [community contributors](https://github.com/ethsociety/learn-plasma/issues)!

## Development

+ [Contributing](.github/CONTRIBUTING.md)
+ [Code of Conduct](.github/CODE_OF_CONDUCT.md)
+ [Pages](#pages)
+ [Posts](#posts)
+ [Language files](#language-files) (i18n)
+ [Edit CSS & JS](#edit-css--js)
+ [Edit the theme templates](#edit-the-theme-templates)

```sh
git clone https://github.com/ethsociety/learn-plasma.git
cd learn-plasma
npm install

# watch during development, auto-refresh courtesy of browser-sync
npm run dev
open http://127.0.0.1:7781

# build for production
npm run prd

# experimental static site test
npm test
```

Check out `./package.json` for each of the individual scripts if you get interested in what is available.

### Pages

The easiest way to make a page is to make a directory then put a markdown file in it.

```sh
mkdir source/en/plasma-scientific-thoughts
touch source/en/plasma-scientific-thoughts/index.md
```

Pages and Posts use something called "Front Matter" to give the page some context like `title`, `date`, and `categories`. You don't have to use them all. Bare minimum it should have a `title` and `date` in it though.

A bare minimum page:

```md
---
title: Plasma Scientific Thoughts
date: 2018-08-21 16:26:02
---

Plasma blinded me with science! 🙈
```

Or with categories and tags:

```md
---
title: Plasma Scientific Thoughts
date: 2018-08-21 16:26:02
categories:
- Plasma
- Science
tags:
- plasma
- monkies
- cash
---

Plasma blinded me with science! 🙈
```

How do we get that date?

+ Shell `date -u +"%Y-%m-%dT%H:%M:%SZ"`
+ JavaScript `(new Date()).toGMTString()`
+ Python `import datetime; datetime.datetime.now().isoformat()`

## Posts

It's pretty much the same thing as Pages.

+ English `touch source/en/_posts/the-man.md`
+ German `touch source/de/_posts/the-man.md`

```md
---
title: The Man Who Collected All the Plasma Cash in One Wallet
date: 2018-09-18T01:07:27.467Z
---

It's all mine! 🤑💸
```

The recent posts can get aggregated on the front page or we can make a blog page if we need it.

### Language files

For example English:

+ `./source/_data/en.yml`
+ `./source/en`

Or German:

+ `./source/_data/de.yml`
+ `./source/de`

If you want to translate some pages to your language you can copy an existing one you know then submit for PR.

### Edit CSS & JS

Stylus gets transpiled to CSS, JavaScript is bundled with Webpack. In production it will get optimized and minified.

+ `./themes/learn-plasma/src/index.styl`
+ `./themes/learn-plasma/src/index.js`

### Edit the theme templates

`./theme/learn-plasma/layout/*.ejs`

## References

### Plasma

+ https://plasma.io/
+ https://ethresear.ch/c/plasma
+ https://www.reddit.com/r/learnplasma
+ https://twitter.com/learnplasma

### Developing this site

+ Hexo https://hexo.io/docs
+ Gulp https://github.com/gulpjs/gulp/blob/v3.9.1/docs/API.md
+ Webpack https://webpack.js.org/concepts/configuration/
