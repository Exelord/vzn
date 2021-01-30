import { createContext, useContext, onCleanup } from 'solid-js';

export type Store<T> = () => T;

class StoreRegistry {
  private readonly registry = new Map<Store<any>, any>();

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
    const store = initializer();
    
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