import { createComponent, Component } from "../rendering";
import { createMemo } from "./memo";
import { createState } from "./state";

export function lazy<T extends Component<any>>(factory: () => Promise<{ default: T }>) {
  const lazyComponent: Component<any> = (props) => {
    const state = createState(() => ({
      componentDefault: null as null | T,

      get component() {
        return this.componentDefault ? this.componentDefault : () => undefined;
      },

      *fetch() {
        const module = (yield factory()) as { default: T };
        this.componentDefault = module.default;
      }
    }))

    state.fetch();

    return createMemo(() => createComponent(state.component, props));
  };

  return lazyComponent;
}