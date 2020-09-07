import { createOwner, setOwner, onCleanup } from "./owner";
import { autorun } from "mobx";

export function createEffect<T>(fn: (prev?: T) => T, value?: T) {
  const owner = createOwner();
  
  onCleanup(() => {
    disposeAutoRun();
    owner.destroy();
  });

  const disposeAutoRun = autorun(() => {
    owner.dispose();
    setOwner(owner);
    value = fn(value);
    setOwner(owner.parentOwner);
  });
}