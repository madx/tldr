---
title: Five-line TailwindCSS-based styled components
date: 2020-05-14
topic: javascript
---

I recently discovered [TailwindCSS](https://tailwindcss.com/) and I think it's
a great tool to be able to quickly build fancy websites without spending too
much time fiddling with the CSS.

I came up with a five-line React component that let's you write
`styled-components`-like components using Tailwind class names:

```js
import React from "react"
import clsx from "clsx"

export default (Component, tailwindStyles) => ({ className, ...props }) => (
  <Component className={clsx(tailwindStyles, className)} {...props} />
)
```

(I know, that's actually 6 lines with the blank one 😏)

Usage is very simple as well:

```js
const Warning = styled("div", [
  "my-4",
  "p-4",
  "bg-orange-100",
  "border",
  "border-orange-300",
  "text-orange-800",
  "text-sm",
  "rounded-lg",
  "flex",
])
```

Bonus points for the regular syntax instead of the funky (read: ugly) mix of
template strings and CSS that you're used to with `styled-components`.
