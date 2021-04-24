import { batch, untrack } from "../reactivity";
import { JSX } from "../jsx";

export function component<T>(Comp: (props: T) => JSX.Element, props: T): JSX.Element {
  return untrack(() => batch(() => Comp(props as T)));
}