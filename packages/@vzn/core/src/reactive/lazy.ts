import { ComponentType, createComponent, FunctionComponent } from "../rendering";
import { withCurrentOwner } from "./owner";
import { createState } from "./state";

export function lazy<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  const lazyComponent: FunctionComponent<any> = (props) => {
    const state = createState({
      componentDefault: null as null | T,

      get component() {
        return this.componentDefault ? this.componentDefault : () => {};
      },

      *fetch() {
        const module = (yield factory()) as { default: T };
        this.componentDefault = module.default;
      }
    })

    state.fetch();

    return withCurrentOwner(() => createComponent(state.component, props));
  };

  return lazyComponent;
}