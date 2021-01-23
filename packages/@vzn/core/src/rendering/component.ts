import { untracked } from "../tracking";

export type PropsWithChildren<P> = P & { children?: JSX.Element };

export interface Component<P = {}> {
  (props: PropsWithChildren<P>): JSX.Element;
  displayName?: string;
}

export type ComponentProps<T extends keyof JSX.IntrinsicElements | Component<any>> =
  T extends Component<infer P>
    ? P
    : T extends keyof JSX.IntrinsicElements
        ? JSX.IntrinsicElements[T]
        : {};

export function createComponent<P>(componentCreator: Component<P>, props: P): JSX.Element {
  const staticProps = Object.freeze(props);
  return untracked(() => componentCreator(staticProps));
}

export class ComponentState<P = {}> {
  protected props: PropsWithChildren<P>;

  constructor(props: PropsWithChildren<P>) {
    this.props = props
  }
}