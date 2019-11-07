---
title: How I ditched Redux
date: 2019-11-06
topic: javascript
---

[Redux][redux] is probably the most used state management library for
[React][react]. However, even its own creator has trouble using it, probably
because it is one massive piece of bloat and boilerplate.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Reading some Redux example code I wrote four years ago and I have no effing idea what&#39;s going on there</p>&mdash; Dan Abramov (@dan_abramov) <a href="https://twitter.com/dan_abramov/status/1191487232038883332?ref_src=twsrc%5Etfw">November 4, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I used to solve that problem using [elfi][elfi], a dead simple state management
library that I wrote a few years ago. Elfi is a 50 LOC lib that does not bring
any difficult to grasp concepts like _reducers_, _thunks_ or whatever, but
instead only relies on functions.

But given the recent additions to React, even elfi is useless now. Using [React
Contexts][react:contexts], I simply implement state management in my top level
component and pass the state management functions through the context:

```javascript
const AppContext = React.createContext()

class App extends React.Component {
  dispatch = async (fn, ...args) => {
    return new Promise(resolve => {
      this.setState(
        prevState => ({ appState: fn(prevState.appState, ...args) }),
        () => resolve(this.state.appState),
      )
    })
  }

  state = {
    appState: {},
  }

  render() {
    const appContext = {
      state: this.state.appState,
      dispatch: this.dispatch,
    }

    return (
      <AppContext.Provider value={appContext}>
        {/* Your component tree */}
      </AppContext.Provider>
    )
  }
}
```

[redux]: https://redux.js.org/
[react]: https://reactjs.org/
[elfi]: https://github.com/madx/elfi
[react:contexts]: https://reactjs.org/docs/context.html
