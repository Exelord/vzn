import { Disposable } from "../utils/disposer";
import { createOwner, setOwner } from "./owner";
import { untracked } from "mobx";

export function createRoot<T>(fn: (dispose: Disposable) => T) {
  const owner = createOwner();
  setOwner(owner);

  return untracked(() => fn(() => {
    setOwner(owner.parentOwner);
    owner.destroy()
  }));
}