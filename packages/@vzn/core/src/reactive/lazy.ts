import { untracked } from "mobx";
import { ComponentType, FunctionComponent } from "../rendering";
import { createState } from "./state";

export function lazy<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  const lazyComponent: FunctionComponent<any> = (props) => {
    const state = createState({
      componentDefault: null as null | T,

      get component() {
        if (this.componentDefault) {
          return untracked(() => this.componentDefault(props));
        }
      },

      *fetch() {
        const module = (yield factory()) as { default: T };
        this.componentDefault = module.default;
      }
    })

    state.fetch();

    return () => state.component;
  };

  return lazyComponent;
}