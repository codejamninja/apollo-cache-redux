`apollo-cache-redux` is a cache implementation backed by Redux for Apollo Client 2.0.
It heavily reuses cache normalization code from `apollo-cache-inmemory`.
Works with Redux 3.x and 4.x .

**WARNING: there are bugs**

Please file any issues you are expiriencing [HERE](https://github.com/codejamninja/apollo-cache-redux/issues)

# Installation
```javascript
npm install @codejamninja/apollo-cache-redux --save
```

After installing the package:
```js
import { ReduxCache, apolloReducer } from 'apollo-cache-redux';
import { createStore, combineReducers } from 'redux';
import { HttpLink } from 'apollo-link-http';
import ApolloClient from 'apollo-client';

const store = createStore(
    combineReducers({
        apollo: apolloReducer
        ...otherReducers
    })
);

const cache = new ReduxCache({ store });

const client = new ApolloClient({
  link: new HttpLink(),
  cache
});
```

The following options are accepted for `ReduxCache`:
* `store`. An existing Redux store. If you don't have one, please create it as per the example above.
* `reduxRootSelector` (optional). Customises the reducer name for the cache (default: `apollo`).
* Other options accepted by `InMemoryCache`, to customise the underlying `InMemoryCache` (e.g. `fragmentMatcher`).


# Tests
Apart from the unit tests in this repo, this cache implementation was tested with the `apollo-client` and `react-apollo` end-to-end tests.
Until there's a better way to bring them to this repo, they will reside in their own branches of these projects:
* https://github.com/rportugal/apollo-client/tree/cache_tester
* https://github.com/rportugal/react-apollo/tree/redux_cache_tests
