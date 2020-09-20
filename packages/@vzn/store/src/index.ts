import { createContext, useContext } from "@vzn/core";

export interface StoreConstructor<T = {}> { new(): T; }

export type FunctionStore<T = {}> = () => T;

export type StoreType<T> = FunctionStore<T> | StoreConstructor<T>;

function isClass(func: any) {
  return typeof func === 'function' && /^class\s/.test(Function.prototype.toString.call(func));
}

export class StoreRegistry {
  private registry = new Map();

  lookup<T>(key: StoreType<T>): T | undefined {
    return this.registry.get(key);
  }

  register<T>(key: StoreType<T>, value: T): T {
    this.registry.set(key, value);
    return value;
  }
}

export const StoreRegistryContext = createContext(new StoreRegistry());

export function useStoreRegistry() {
  return useContext(StoreRegistryContext);
}

export function useStore<T>(storeCreator: StoreType<T>): T {
  const registry = useStoreRegistry();
  const registration = registry.lookup<T>(storeCreator);
  
  if (registration) return registration;

  const store = isClass(storeCreator) ? new (storeCreator as StoreConstructor<T>)() : (storeCreator as FunctionStore<T>)();

  return registry.register(storeCreator, store);
}