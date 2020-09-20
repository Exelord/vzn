import { createComponent, Component } from "../rendering";
import { createMemo } from "./memo";
import { createState } from "./state";

export type RouteLoader<T> = () => Promise<{ default: T }>;

class LazyState<T> {
  routeComponent?: T = undefined;

  loader: RouteLoader<T>;

  constructor(loader: RouteLoader<T>) {
    this.loader = loader;
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
    const state = createState(() => new LazyState(loader))
    state.load();
    return createMemo(() => createComponent(state.component, props));
  };

  return lazyComponent;
}