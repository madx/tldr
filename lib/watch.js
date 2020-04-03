const http = require("http")
const serve = require("serve-handler")
const sane = require("sane")
const color = require("chalk")
const tinylr = require("tiny-lr")
const createBuilder = require("./builder")

const DEFAULT_PORT = 8080
const DEFAULT_PATTERN = "**/*"

const options = {
  port: DEFAULT_PORT,
  pattern: DEFAULT_PATTERN,
}

let builder = createBuilder()

function onBuild() {
  const start = new Date()

  return (err, files) => {
    if (err) {
      return console.error(color.red(err))
    }
    const filenames = Object.keys(files)
    const delta = new Date() - start
    console.log(
      `${color.green("✓")} build ${color.gray(
        `${filenames.length} files, ${delta}ms`,
      )}`,
    )
    livereload.changed({ body: { files: filenames } })
  }
}

function rebuild() {
  builder = createBuilder()
  builder.build(onBuild())
}

const livereload = tinylr()

livereload.listen(35729, (err) => {
  if (err) {
    return console.log(color.red(err))
  }
  console.log(`${color.green("✓")} live reload server started`)
})

const watcher = sane(process.cwd(), {
  glob: options.pattern,
  ignored: builder.destination(),
})

watcher.on("ready", () => {
  console.log(
    `${color.green("✓")} started watching files ${color.yellow(
      options.pattern,
    )}`,
  )
})

watcher.on("change", rebuild)
watcher.on("add", rebuild)
watcher.on("delete", rebuild)

server = http.createServer((req, res) =>
  serve(req, res, { public: builder.destination() }),
)

server.listen(options.port, () =>
  console.log(
    `${color.green("✓")} preview server started on port ${color.yellow(
      options.port,
    )}`,
  ),
)

builder.build(onBuild())
