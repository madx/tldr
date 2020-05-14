---
title: Recursively invalidating require cache in Node.js
date: 2020-05-14
topic: javascript
---

While working on [Fluor.js](https://fluorjs.github.io)'s website, I found
myself needing to reload node modules when in watch mode in order to update
components used by the generated pages (I'm using Server Side Rendering with
React to build the website).

Here's the snippet I used to recursively invalidate a module's cache entry and all its dependencies:

```js
function removeFromCache(moduleId) {
  const cached = require.cache[moduleId]

  if (!cached) {
    return
  }

  // LIB_ROOT and SITE_ROOT are where my source files reside. I avoid reloading
  // node_modules as it causes some issues with the rendering process
  const ownModule = (mod) =>
    mod.path.startsWith(LIB_ROOT) || mod.path.startsWith(SITE_ROOT)

  cached.children.filter(ownModule).forEach((mod) => removeFromCache(mod.id))
  delete require.cache[moduleId]
}
```
