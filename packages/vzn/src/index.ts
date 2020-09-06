export { createContext, useContext } from "./reactive/context";
export { onCleanup, getOwner } from "./reactive/owner";

export {
  createRoot,
  createEffect,
  createMemo
} from "./reactive/core";

export * from "./rendering";

// handle multiple instance check
declare global {
  var VZN$$: boolean;
}

if (!globalThis.VZN$$) {
  globalThis.VZN$$ = true;
} else {
  console.warn(
    "You appear to have multiple instances of Solid. This can lead to unexpected behavior."
  );
}