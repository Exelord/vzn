import { onCleanup, getContextOwner, createContext, createComponent, Component, useContext } from 'solid-js';

// REGISTRY

export type Registration<T> = () => T;

export class Registry {
  private readonly registry = new Map<Registration<any>, any>();
  private owner = getContextOwner();

  constructor() {
    onCleanup(() => this.registry.clear());
  }

  has<T>(initializer: Registration<T>) {
    return this.registry.has(initializer)
  }

  get<T>(initializer: Registration<T>) {
    return this.registry.get(initializer)
  }

  register<T>(initializer: Registration<T>) {
    // const registration = runWithOwner(this.owner, () => initializer())
    const registration = initializer();
    
    this.registry.set(initializer, registration);

    return registration;
  }
}

// CONTEXT

export type RegistryProviderProps = {
  registry?: Registry
}

const RegistryContext = createContext(new Registry());

export const RegistryProvider: Component<RegistryProviderProps> = (props) => {
  const registry = props.registry || new Registry();
  return createComponent(RegistryContext.Provider, { value: registry, children: props.children })
}

export function useRegistry() {
  return useContext(RegistryContext);
}
