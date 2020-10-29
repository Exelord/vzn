import { Provider } from "../reactive";

export type Disposable = () => void;

export type Action<T> = (...args: any[]) => T;

export type Tracked<T = any> = {
  (value?: T): T;
  _pendingValue: T | Symbol;
  _observers: Set<TrackingContext>;
  _runObservers: Set<TrackingContext>;
}

export type TrackingContext<T = any> = {
  (): T
  _fresh: boolean;
  _dependencies: TrackingContext[];
  _trackable: Tracked[];
  _cleanups: Disposable[];
  _contexts: Map<Provider<any>, any>
}

export type Observer<T = any> = {
  (value?: T): T;
  _update?: TrackingContext;
}

const EMPTY_SYMBOL = Symbol('EMPTY');
const trackedRegistry = new WeakMap();

let tracking: TrackingContext | undefined;
let queue: any;

/**
 * Returns current tracking context
 */
export function getTrackingContext(nextContext?: TrackingContext) {
  if (arguments.length > 0) tracking = nextContext;

  return tracking;
}

/**
 * Returns true if there is an active observer.
 */
export function isListening() {
  return !!tracking;
}

/**
 * Creates a root and executes the passed function that can contain computations.
 * The executed function receives an `unsubscribe` argument which can be called to
 * unsubscribe all inner computations.
 */
export function root<T>(fn: (dispose: Disposable) => T) {
  const prevTracking = tracking;
  const rootUpdate = createUpdate(() => {});

  tracking = rootUpdate;

  const result = fn(() => {
    _unsubscribe(rootUpdate);
    tracking = undefined;
  });
  
  tracking = prevTracking;
  return result;
}

/**
 * Creates a new tracked property, returns a function which can be used to get
 * the tracked's value by calling the function without any arguments
 * and set the value by passing one argument of any type.
 */
export function tracked<T = any>(value?: T): Tracked<T>;
export function tracked<T = any>(target: Object, key: string | symbol): void;
export function tracked<T = any>(target: Object, key: string, desc: PropertyDescriptor): PropertyDescriptor;
export function tracked<T = any>(...args: any[]): Tracked<T> | PropertyDescriptor | void {
  if (args.length > 1) {
    const [target, key, descriptor] = args;
  
    if (descriptor && (descriptor.value || descriptor.get || descriptor.set)) throwTrackedDecoratorError();

    function getter(context: any) {
      if (!trackedRegistry.has(context)) trackedRegistry.set(context, new Map());
      const registry = trackedRegistry.get(context);
      
      if (registry.has(key)) return registry.get(key)();

      const trackedValue = trackable<T>(descriptor?.initializer?.());
      registry.set(key, trackedValue);
      return trackedValue();
    }

    function setter(context: any, value: T) {
      if (!trackedRegistry.has(context)) trackedRegistry.set(context, new Map());
      const registry = trackedRegistry.get(context);

      if (registry.has(key)) return registry.get(key)(value);
      
      const trackedValue = trackable<T>(value);
      registry.set(key, trackedValue);
      return trackedValue();
    }
  
    const trackedDescriptor = {
      enumerable: true,
      configurable: true,
  
      get(): T {
        return getter(this);
      },
  
      set(newValue: T): void {
        setter(this, newValue);
      },
    };
  
    if (descriptor) return trackedDescriptor;
    
    // In TypeScript's implementation, decorators on simple class fields do not
    // receive a descriptor, so we define the property on the target directly.
    Object.defineProperty(target, key, trackedDescriptor);
  } else {
    const value = args[0] as T;
    return trackable(value)
  }
};

/**
 * Don't create a dependency on it.
 *
 * @example
 * computed(() => { if (foo()) bar(untracked(bar) + 1); });
 */
export function untracked<T>(fn: () => T) {
  const prevTracking = tracking;
  
  tracking = undefined;
  const value = fn();
  tracking = prevTracking;
  
  return value;
}

/**
 * Creates action wrapped in transaction
 */
export function action<T>(fn: Action<T>): Action<T>;
export function action<T>(target: Object, key: string, desc: PropertyDescriptor): PropertyDescriptor;
export function action<T>(...args: any[]): Action<T> | PropertyDescriptor | void {
  if (args.length > 1) {
    const descriptor = args[2];
  
    if (descriptor && (descriptor.get || descriptor.set || descriptor.initializer)) throwActionDecoratorError();

    return {
      get(): any {
        return (...args: any[]) => transaction(() => descriptor.value.call(this, ...args))
      }
    };
  } else {
    const fn = args[0] as (...args: any[]) => T;
    return (...args: any[]) => transaction(() => fn(...args))
  }
}

/**
 * Creates a transaction in which a tracked property can be set multiple times
 * but only trigger a computation once.
 */
export function transaction<T>(fn: () => T) {
  const prevQueue = queue;

  queue = [];

  const result = fn();
  const currentQueue = queue;

  queue = prevQueue;
  
  currentQueue.forEach((operation: Tracked<any>) => {
    if (operation._pendingValue === EMPTY_SYMBOL) return;
    
    const pending = operation._pendingValue;
    operation._pendingValue = EMPTY_SYMBOL;

    operation(pending);
  });

  return result;
}

/**
 * Creates a new computation which runs when defined and automatically re-runs
 * when any of the used tracked's values are set.
 */
export function computed<T>(observer: Observer<T>, value?: T): () => T {
  return computable(observer)
};

/**
 * Run the given function just before the enclosing computation updates
 * or is disposed.
 */
export function cleanup(fn: Disposable) {
  if (tracking) tracking._cleanups.push(fn);

  return fn;
}

/**
 * Subscribe to updates of a tracked property.
 */
export function subscribe<T>(observer: Observer<T>) {
  computable(observer);

  return () => _unsubscribe(observer._update!);
}

/**
 * Statically declare a computation's dependencies.
 */
// export function on(obs, fn, seed, onchanges) {
//   obs = [].concat(obs);
//   return computed((value) => {
//     obs.forEach((o) => o());

//     let result = value;
//     if (!onchanges) {
//       result = untracked(() => fn(value));
//     }

//     onchanges = false;
//     return result;
//   }, seed);
// }

/**
 * Unsubscribe from an observer.
 */
export function unsubscribe<T>(observer: Observer<T>) {
  if (observer._update) _unsubscribe(observer._update);
}

function _unsubscribe<T>(update: TrackingContext<T>) {
  update._dependencies.forEach(_unsubscribe);
  
  update._trackable.forEach(o => {
    o._observers.delete(update);

    if (o._runObservers) o._runObservers.delete(update);
  });
  
  update._cleanups.forEach(c => c());
  
  resetUpdate(update);
}

function trackable<T = any>(value?: T): Tracked<T> {  
  const data: Tracked<T> = function (...args: [T | undefined]): T {
    if (args.length as number === 0) {
      if (tracking && !data._observers.has(tracking)) {
        data._observers.add(tracking);
        tracking._trackable.push(data);
      }
      
      return value as T;
    }

    const nextValue = args[0] as T;
    
    value = nextValue;

    if (queue) {
      if (data._pendingValue === EMPTY_SYMBOL) queue.push(data);
      
      data._pendingValue = nextValue;
      
      return nextValue;
    }

    // Clear `tracking` otherwise a computed triggered by a set
    // in another computed is seen as a child of that other computed.
    const clearedUpdate = tracking;

    tracking = undefined;

    // Update can alter data._observers, make a copy before running.
    data._runObservers = new Set(data._observers);
    
    data._runObservers.forEach(observer => (observer._fresh = false));
    
    data._runObservers.forEach(observer => {
      if (!observer._fresh) observer();
    });

    tracking = clearedUpdate;

    return value as T;
  }

  data._observers = new Set();
  data._runObservers = new Set();
  data._pendingValue = EMPTY_SYMBOL;

  return data;
}

function computable<T>(observer: Observer<T>, value?: T): () => T {
  const update = createUpdate(() => {
    const prevTracking = tracking;
    
    if (tracking) {
      tracking._dependencies.push(update);
    }

    _unsubscribe(update);

    update._fresh = true;
    
    tracking = update;
    value = observer(value);
    tracking = prevTracking;

    return value;
  });

  observer._update = update;

  resetUpdate(update);
  update();

  function data() {
    if (update._fresh) {
      if (tracking) {
        // If being read from inside another computed, pass trackable to it
        update._trackable.forEach(o => o());
      }
    } else {
      value = update();
    }

    return value as T;
  }

  return data;
}

function throwTrackedDecoratorError(): never {
  throw new Error(
    `The @tracked decorator does not need to be applied to getters. Properties implemented using a getter will recompute automatically when any tracked properties they access change.`
  );
}

function throwActionDecoratorError(): never {
  throw new Error(
    `The @action decorator can be only applied on class methods.`
  );
}

function createUpdate<T>(update: () => T) {
  const trackingUpdate = update as TrackingContext<T>
  
  resetUpdate(trackingUpdate);
  
  return trackingUpdate;
}

function resetUpdate<T>(update: TrackingContext<T>) {
  update._fresh = true;
  update._trackable = [];
  update._dependencies = [];
  update._cleanups = [];
  update._contexts = new Map();
}