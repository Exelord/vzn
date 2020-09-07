export * from "./reactive";
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