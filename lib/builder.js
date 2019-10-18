const path = require("path")

const Metalsmith = require("metalsmith")
const collections = require("metalsmith-collections")
const layouts = require("metalsmith-layouts")
const markdown = require("metalsmith-markdown")
const permalinks = require("metalsmith-permalinks")
const pagination = require("metalsmith-pagination")
const tags = require("metalsmith-tags")
const sass = require("metalsmith-sass")
const debug = require("metalsmith-debug")
const dayjs = require("dayjs")

const sortByDateThenBirthtime = require("./sortByDateThenBirthtime")

const CWD = process.cwd()

module.exports = exports = () =>
  Metalsmith(__dirname)
    .metadata({
      author: "François Vaux",
      sitename: "TL;DR",
      siteurl: "http://tldr.yapok.org/",
      description: "Development-related tips and articles by François Vaux",
      year: dayjs().year(),
      dayjs,
    })
    .source(path.join(CWD, "src"))
    .destination(path.join(CWD, "build"))
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

    .use(sass())

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
          perPage: 20,
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
      tags({
        handle: "topic",
        path: "topic/:tag/index.html",
        layout: "topic.pug",
        sortBy: sortByDateThenBirthtime,
        reverse: true,
      }),
    )

    .use((files, metalsmith, done) => {
      setImmediate(done)
      Object.entries(files).forEach(([filename, value]) => {
        if (value.topic) {
          value.topic = value.topic[0].name
        }
      })
    })

    .use(
      layouts({
        directory: path.join(CWD, "layouts"),
        pattern: "**/*.html",
        default: "post.pug",
      }),
    )

    .use(debug())
