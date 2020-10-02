import { createComponent, Component } from "../rendering";
import { createMemo } from "./memo";
import { makeState } from "./reactivity";

export type RouteLoader<T> = () => Promise<{ default: T }>;

class LazyState<T> {
  routeComponent?: T = undefined;

  loader: RouteLoader<T>;

  constructor(loader: RouteLoader<T>) {
    this.loader = loader;
    
    makeState(this);
    
    this.load();
  }

  get component() {
    return this.routeComponent ? this.routeComponent : () => undefined;
  }

  *load() {
    const module = (yield this.loader()) as { default: T };
    this.routeComponent = module.default;
  }
}

export function lazy<T extends Component<any>>(loader: RouteLoader<T>) {
  const lazyComponent: Component<any> = (props) => {
    const state = new LazyState(loader);

    return createMemo(() => createComponent(state.component, props));
  };

  return lazyComponent;
}