import { untrack } from "@vzn/reactivity";
import { JSX } from "../jsx";

export function component<T>(Comp: (props: T) => JSX.Element, props: T): JSX.Element {
  return untrack(() => Comp(props as T));
}