import { configure } from "mobx"
import { getOwner } from "./reactive";

configure({
  enforceActions: "observed",
  computedRequiresReaction: true,
  observableRequiresReaction: true
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