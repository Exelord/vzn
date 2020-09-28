import { createContext, getOwner, setOwner, useContext } from "@vzn/core";
import { Owner } from "@vzn/core";

export type Store<T> = () => T;

class StoreRegistry {
  private registry = new Map<Store<any>, any>();
  private owner?: Owner;

  constructor() {
    this.owner = getOwner();
  }

  has<T>(initializer: Store<T>) {
    return this.registry.has(initializer)
  }

  lookup<T>(initializer: Store<T>) {
    return this.registry.get(initializer)
  }

  register<T>(initializer: Store<T>) {
    const currentOwner = getOwner();
    
    setOwner(this.owner);
    const store = initializer();
    setOwner(currentOwner);
    
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