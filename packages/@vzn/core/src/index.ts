import { configure } from "mobx"
import { getOwner } from "./reactive";

configure({
  computedRequiresReaction: true,
  observableRequiresReaction: true,
  enforceActions: "observed"
})

export * from "./reactive";
export * from "./rendering";

// handle multiple instance check
declare global {
  var VZN: any;
}

if (!globalThis.VZN) {
  globalThis.VZN = {
    getOwner
  }
} else {
  console.warn(
    "You appear to have multiple instances of VZN. This can lead to unexpected behavior."
  );
}