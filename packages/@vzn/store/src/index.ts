import { createContext, useContext, onCleanup, getContextOwner } from 'solid-js';

export type Store<T> = () => T;

class StoreRegistry {
  private readonly registry = new Map<Store<any>, any>();
  private owner = getContextOwner();

  constructor() {
    onCleanup(() => this.registry.clear());
  }

  has<T>(initializer: Store<T>) {
    return this.registry.has(initializer)
  }

  lookup<T>(initializer: Store<T>) {
    return this.registry.get(initializer)
  }

  register<T>(initializer: Store<T>) {
    const owner = getContextOwner();

    // setContextOwner(this.owner)
    const store = initializer();
    // setContextOwner(owner)
    
    this.registry.set(initializer, store);

    return store;
  }
}

export function createRegistry() {
  return new StoreRegistry();
}

export const StoreRegistryContext = createContext(createRegistry());

export function useStoreRegistry() {
  return useContext(StoreRegistryContext);
}

export function useStore<T>(initializer: Store<T>): T {
  const registry = useStoreRegistry();
  
  if (registry.has(initializer)) return registry.lookup(initializer);
  
  return registry.register(initializer);
}