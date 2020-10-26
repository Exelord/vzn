import { computed } from "../tracking";

export function memo<T>(fn: () => T, equal?: boolean) {
  return computed(() => fn());
}