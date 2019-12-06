import { Cache } from 'apollo-cache';
import { DepTrackingCache } from 'apollo-cache-inmemory/lib/depTrackingCache';
import { ObjectCache } from 'apollo-cache-inmemory/lib/objectCache';
import { cloneDeep } from 'lodash';
import {
  ApolloReducerConfig,
  InMemoryCache,
  NormalizedCache,
  StoreWriter
} from 'apollo-cache-inmemory';
import {
  ReduxNormalizedCacheConfig,
  reduxNormalizedCacheFactory
} from './reduxNormalizedCache';

export type ReduxCacheConfig = ApolloReducerConfig & ReduxNormalizedCacheConfig;

export class ReduxCache extends InMemoryCache {
  constructor(config: ReduxCacheConfig) {
    super(config);
    // Overwrite the in-memory data object
    // @ts-ignore
    this.data = reduxNormalizedCacheFactory(config);
  }

  public write(write: Cache.WriteOptions): void {
    // @ts-ignore
    const this_data: NormalizedCache = this.data;
    // @ts-ignore
    const this_storeWriter: StoreWriter = this.storeWriter;
    // const data = this.config.storeFactory(cloneDeep(this_data.toObject()));
    const data = this.config.resultCaching
      ? new DepTrackingCache(cloneDeep(this_data.toObject()))
      : new ObjectCache(cloneDeep(this_data.toObject()));
    this_storeWriter.writeResultToStore({
      dataId: write.dataId,
      result: write.result,
      variables: write.variables,
      document: this.transformDocument(write.query),
      store: data,
      dataIdFromObject: this.config.dataIdFromObject,
      fragmentMatcherFunction: this.config.fragmentMatcher.match
    });
    this_data.replace(data.toObject());
    this.broadcastWatches();
  }
}
