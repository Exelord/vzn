import { computed } from "mobx";
import { createOwner, setOwner, getOwner, onCleanup } from "./owner";

export function createMemo<T>(fn: () => T, equal?: boolean) {
  const owner = createOwner();
  onCleanup(() => owner.destroy());

  const computedFn = computed(() => {
    owner.dispose();

    const currentOwner = getOwner()
    
    setOwner(owner);
    const result = fn();
    setOwner(currentOwner);

    return result;
  });

  return () => computedFn.get();
}