import { createContext, getTrackingContext, TrackingContext, getContext } from "@vzn/core";

export type Store<T> = () => T;

class StoreRegistry {
  private registry = new Map<Store<any>, any>();
  private tracking?: TrackingContext;

  constructor() {
    this.tracking = getTrackingContext();
  }

  has<T>(initializer: Store<T>) {
    return this.registry.has(initializer)
  }

  lookup<T>(initializer: Store<T>) {
    return this.registry.get(initializer)
  }

  register<T>(initializer: Store<T>) {
    const currentTracking = getTrackingContext();

    getTrackingContext(this.tracking);
    const store = initializer();
    getTrackingContext(currentTracking);
    
    this.registry.set(initializer, store);

    return store;
  }
}

export function createRegistry() {
  return new StoreRegistry();
}

export const StoreRegistryContext = createContext(createRegistry());

export function getStoreRegistry() {
  return getContext(StoreRegistryContext);
}

export function getStore<T>(initializer: Store<T>): T {
  const registry = getStoreRegistry();
  
  if (registry.has(initializer)) return registry.lookup(initializer);
  
  return registry.register(initializer);
}