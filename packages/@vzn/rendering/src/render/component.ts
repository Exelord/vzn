import { freeze } from "@vzn/reactivity";
import { JSX } from "../jsx";

export function createComponent<T>(
  Comp: (props: T) => JSX.Element,
  props: T
): JSX.Element {
  return freeze(() => Comp(props as T));
}
