import { untracked } from "mobx";

type PropsWithChildren<P = {}> = P & { children?: JSX.Element };

type ComponentConstructor<P> =
  | FunctionComponent<P>
  | (new (props: PropsWithChildren<P>) => JSX.Element);

export type FunctionComponent<P = {}> = (props: PropsWithChildren<P>) => JSX.Element;

export type ComponentProps<
  T extends keyof JSX.IntrinsicElements | ComponentConstructor<any>
> = T extends ComponentConstructor<infer P>
  ? P
  : T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : {};

export class Component<P extends PropsWithChildren = {}> {
  props: P;

  constructor(props: P) {
    this.props = props;
  }

  template(props: P) {
    return props.children;
  }
}

export function createComponent<T>(Comp: Component<T> | FunctionComponent<T>, props: T): JSX.Element {
  const staticProps = Object.freeze(props);

  if ((Comp as any).prototype instanceof Component) {
    return untracked(() => {
      const comp: Component<T> = new (Comp as any)(staticProps);
      return comp.template(staticProps);
    });
  }
  
  return untracked(() => (Comp as FunctionComponent<T>)(staticProps));
}