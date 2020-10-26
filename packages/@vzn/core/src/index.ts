export * from "./reactive";
export * from "./rendering";
export { root, tracked, action, computed, getTrackingContext } from "./tracking";
export type { TrackingContext } from './tracking'

// handle multiple instance check
declare global {
  var VZN: any;
}

if (!globalThis.VZN) {
  globalThis.VZN = {}
} else {
  console.warn(
    "You appear to have multiple instances of VZN. This can lead to unexpected behavior."
  );
}