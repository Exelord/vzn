export type Disposer = () => void;
export type Computation<T> = () => T;

export interface Container {
  readonly isPaused: boolean;

  schedule(computation: Computation<void>): void;
  scheduleDelayed(computation: Computation<void>): void;
  recompute(): void;
  pause(): void;
  resume(): void;
  dispose(): void;
  addDisposer(fn: Disposer): void;
}

let globalContainer: Container | undefined;

export function getContainer(): Container | undefined {
  return globalContainer;
}

export function runWithContainer<T>(
  container: Container | undefined,
  computation: Computation<T>
): T {
  const currentContainer = getContainer();

  globalContainer = container;

  try {
    return computation();
  } finally {
    globalContainer = currentContainer;
  }
}

export function untrack<T>(fn: () => T): T {
  const container = createContainer();

  try {
    return runWithContainer(container, fn);
  } finally {
    cleanup(container.dispose);
  }
}

export function cleanup(fn: Disposer) {
  const container = getContainer();

  if (container) {
    container.addDisposer(fn);
  } else {
    queueMicrotask(fn);
  }
}

export function createContainer(
  computation?: Computation<void>,
  isPrioritized = false
): Container {
  let isPaused = false;

  const disposers = new Set<Disposer>();
  const computationsQueue = new Set<Computation<void>>();
  const delayedQueue = new Set<Computation<void>>();

  function recompute() {
    if (!computation) return;
    
    const parentContainer = getContainer();
  
    if (parentContainer && !isPrioritized) {
      parentContainer.schedule(computation);
    } else {
      untrack(computation);
    }
  }

  function schedule(fn: Computation<void>) {
    if (isPaused) {
      computationsQueue.add(fn);
    } else {
      untrack(fn);
    }
  }

  function scheduleDelayed(fn: Computation<void>) {
    if (isPaused) {
      delayedQueue.add(fn);
    } else {
      untrack(fn);
    }
  }

  function pause() {
    isPaused = true;
  }

  function resume() {
    if (!isPaused) return;

    isPaused = false;
    
    const computations = [...computationsQueue];
    const delayed = [...delayedQueue];
    
    computationsQueue.clear();
    delayedQueue.clear();
    
    computations.forEach(async (fn) => untrack(fn));
    delayed.forEach(async (fn) => untrack(fn));
  }

  function dispose() {
    const tmpDisposers = [...disposers]
    
    disposers.clear();
    
    tmpDisposers.forEach(async (disposer) => untrack(disposer));
  }

  function addDisposer(fn: Disposer) {
    disposers.add(fn)
  }

  return Object.freeze({
    recompute,
    schedule,
    scheduleDelayed,
    pause,
    resume,
    dispose,
    addDisposer,

    get isPaused() {
      return isPaused;
    }
  });
}

export function batch<T>(computation: Computation<T>): T {
  const container = getContainer();

  if (!container) {
    const tmpContainer = createContainer();

    try {
      return runWithContainer(tmpContainer, () => batch(computation));
    } finally {
      tmpContainer.dispose();
    }
  }

  if (container.isPaused) {
    return computation();
  }

  container.pause();

  try {
    return computation();
  } finally {
    container.resume();
  }
}
