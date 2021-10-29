import { freeze } from "@vzn/reactivity";
import { VZN } from "../vzn";

export function createComponent<T>(
  Comp: (props: T) => VZN.Element,
  props: T
): VZN.Element {
  return freeze(() => Comp(props as T));
}
