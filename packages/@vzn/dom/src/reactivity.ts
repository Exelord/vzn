export type Config = {
  batch<T>(fn: () => T): T;
  untrack<T>(fn: () => T): T;
  cleanup(fn: () => void): void;
  createRoot<T>(fn: (dispose: () => void) => T): T;
  createMemo<T>(fn: () => T, equal?: boolean): () => T;
  
  createValue<T>(): [() => T | undefined, <U extends T | undefined>(value?: U) => void];
  createValue<T>(
    value: T,
    compare?: boolean | ((prev: T, next: T) => boolean),
  ): [() => T, (value: T) => void];
  createValue<T>(
    value?: T,
    compare?: boolean | ((prev: T | undefined, next: T) => boolean),
  ): [() => T | undefined, (value: T) => void]

  createEffect<T>(fn: (v: T) => T, value: T): void;
  createEffect<T>(fn: (v?: T) => T | undefined): void;
  createEffect<T>(fn: (v?: T) => T, value?: T): void

  createRenderEffect<T>(fn: (v: T) => T, value: T): void;
  createRenderEffect<T>(fn: (v?: T) => T | undefined): void;
  createRenderEffect<T>(fn: (v?: T) => T, value?: T): void
}

let configuration: Config | null = null;

export function isConfigured() {
  return !!configuration;
}

export function configure(config: Config) {
  configuration = config;
}

export function batch<T>(fn: () => T): T {
  return configuration.batch(fn);
}

export function untrack<T>(fn: () => T): T {
  return configuration.untrack(fn);
}

export function cleanup(fn: () => void): void {
  return configuration.cleanup(fn);
}

export function createRoot<T>(fn: (dispose: () => void) => T): T {
  return configuration.createRoot(fn);
}

export function createMemo<T>(fn: () => T, equal?: boolean): () => T {
  return configuration.createMemo(fn, equal);
}

export function createValue<T>(): [() => T | undefined, <U extends T | undefined>(value?: U) => void];
export function createValue<T>(
  value: T,
  compare?: boolean | ((prev: T, next: T) => boolean),
): [() => T, (value: T) => void];
export function createValue<T>(
  value?: T,
  compare?: boolean | ((prev: T | undefined, next: T) => boolean),
): [() => T | undefined, (value: T) => void] {
  return configuration.createValue(value, compare);
}

export function createEffect<T>(fn: (v: T) => T, value: T): void;
export function createEffect<T>(fn: (v?: T) => T | undefined): void;
export function createEffect<T>(fn: (v?: T) => T, value?: T): void {
  configuration.createEffect(fn, value);
}

export function createRenderEffect<T>(fn: (v: T) => T, value: T): void;
export function createRenderEffect<T>(fn: (v?: T) => T | undefined): void;
export function createRenderEffect<T>(fn: (v?: T) => T, value?: T): void {
  configuration.createRenderEffect(fn, value);
}
