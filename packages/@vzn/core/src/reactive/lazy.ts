import { createComponent, Component } from "../rendering";
import { action, tracked } from "../tracking";
import { memo } from "./memo";

export type RouteLoader<T> = () => Promise<{ default: T }>;

class LazyState<T> {
  @tracked routeComponent?: T = undefined;

  loader: RouteLoader<T>;

  constructor(loader: RouteLoader<T>) {
    this.loader = loader;

    this.load();
  }

  get component() {
    return this.routeComponent ? this.routeComponent : () => undefined;
  }

  @action
  async load() {
    const module = (await this.loader()) as { default: T };
    this.routeComponent = module.default;
  }
}

export function lazy<T extends Component<any>>(loader: RouteLoader<T>) {
  const lazyComponent: Component<any> = (props) => {
    const state = new LazyState(loader);

    return memo(() => createComponent(state.component, props));
  };

  return lazyComponent;
}