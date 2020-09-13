import { untracked } from "mobx";

export type PropsWithChildren<P> = P & { children?: JSX.Element };

export type ComponentProps<T extends keyof JSX.IntrinsicElements | ComponentType<any>> =
  T extends ComponentType<infer P>
    ? P
    : T extends keyof JSX.IntrinsicElements
        ? JSX.IntrinsicElements[T]
        : {};


export interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>): JSX.Element;
  displayName?: string;
}

export type ComponentType<P = {}> = FunctionComponent<P>;

export function createComponent<T>(Comp: FunctionComponent<T>, props: T): JSX.Element {
  const staticProps = Object.freeze(props);
  return untracked(() => Comp(staticProps));
}