import { Registration, useRegistry } from './registry';

export type Store<T> = Registration<T>;

export function useStore<T>(initializer: Store<T>): T {
  const registry = useRegistry();
  
  if (registry.has(initializer)) return registry.get(initializer);
  
  return registry.register(initializer);
}