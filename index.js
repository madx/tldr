const Metalsmith = require("metalsmith")
const collections = require("metalsmith-collections")
const layouts = require("metalsmith-layouts")
const markdown = require("metalsmith-markdown")
const permalinks = require("metalsmith-permalinks")
const pagination = require("metalsmith-pagination")
const debug = require("metalsmith-debug")
const dayjs = require("dayjs")

const sortByDateThenBirthtime = require("./lib/sortByDateThenBirthtime")

const builder = Metalsmith(__dirname)
  .metadata({
    author: "François Vaux",
    sitename: "tl;dr",
    siteurl: "http://tldr.yapok.org/",
    description: "Development-related tips and articles by François Vaux",
    year: dayjs().year(),
    dayjs,
  })
  .source("./src")
  .destination("./build")
  .clean(true)

  .use(
    collections({
      posts: {
        pattern: "posts/**/*.md",
        sortBy: sortByDateThenBirthtime,
      },
    }),
  )

  .use(markdown())

  .use(
    permalinks({
      relative: false,
      pattern: ":date/:title",
      date: "YYYY/MM",
    }),
  )

  .use(
    pagination({
      "collections.posts": {
        perPage: 3,
        layout: "home.pug",
        first: "index.html",
        path: "page/:num/index.html",
        pageMetadata: {
          title: "Archive",
        },
      },
    }),
  )

  .use(
    layouts({
      default: "post.pug",
    }),
  )

  .use(debug())

if (process.env.NODE_ENV === "development") {
  const serve = require("metalsmith-serve")
  const watch = require("metalsmith-watch")
  builder.use(serve()).use(
    watch({
      paths: {
        "${source}/**/*": true,
        "layouts/**/*": "**/*.md",
      },
      livereload: true,
    }),
  )
}

builder.build(function(err) {
  if (err) throw err
})
