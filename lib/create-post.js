const fs = require("fs")
const path = require("path")
const util = require("util")
const { spawn } = require("child_process")

const prompts = require("prompts")
const _slugify = require("slugify")
const dayjs = require("dayjs")

const topics = {
  js: "javascript",
}

function slugify(title) {
  return _slugify(title, {
    remove: /[*+~.()'"!:@]/g,
    lower: true,
  })
}

const now = dayjs()
const postPrefix = now.format("YYYY-MM-DD")

prompts([
  { type: "text", name: "topic", message: "Post topic" },
  { type: "text", name: "title", message: "Post title" },
  {
    type: "text",
    name: "slug",
    message: `http://tldr.yapok.org/${postPrefix}-`,
    initial: prev => slugify(prev),
  },
])
  .then(({ slug, title, topic }) => {
    const filename = path.join("src", "posts", `${postPrefix}-${slug}.md`)
    const content = `
---
title: ${title}
date: ${now.format("YYYY-MM-DD")}
topic: ${topics[topic] || topic}
---

`.trimStart()

    fs.writeFileSync(filename, content)

    return filename
  })
  .then(filename => {
    const editor = spawn("vim", [filename, "+", "+startinsert"], {
      stdio: "inherit",
      detached: true,
    })

    editor.on("data", data => process.stdout.pipe(data))
  })
