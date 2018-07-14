# Learn Plasma

This website aims to educate visitors about the fundamentals of Plasma and its design principles. We plan to add interactive tutorials and showcase other use cases for layer 2 dapps.

Learn Plasma was conceived at the 2018 IC3 Bootcamp at Cornell.

# Getting Started

First, [Download and install Node.js](https://nodejs.org/en/download/) if it's not installed on your machine

Clone the repo:

```
$ git clone https://github.com/ethsociety/plasma-website.git
```

Install the Gulp command line tools, *gulp-cli*:

```
npm install gulp-cli -g
```

Navigate to the root of the repo and install the dependencies:

```
$ npm install
```

Run the app:

```
$ npm start
```

Other tasks:

- `gulp serve` - Runs a server and starts watching for changes to html, scss and js files; compiles and reloads the browser

- `gulp dist` - Creates a /dist folder, compiles scss and js files, and copies all the project's files inside the /dist directory except the unnecessary ones

- `gulp img` - Uses the imagemin plugin to minify the images inside /assets/img directory
