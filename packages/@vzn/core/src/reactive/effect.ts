import { createOwner, setOwner, getOwner, onCleanup } from "./owner";
import { autorun } from "mobx";

export function createEffect<T>(fn: (prev?: T) => T, value?: T) {
  const owner = createOwner();

  const disposeAutoRun = autorun(() => {
    owner.dispose();
    
    const currentOwner = getOwner()
    
    setOwner(owner);
    value = fn(value);
    setOwner(currentOwner);
  });

  onCleanup(() => {
    disposeAutoRun();
    owner.destroy();
  });
}