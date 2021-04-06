export type Disposer = () => void;
export type Computation<T> = () => T;

export interface Container {
  readonly isPaused: boolean;

  scheduleMicroTask(computation: Computation<void>): void;
  scheduleMacroTask(computation: Computation<void>): void;
  recompute(): void;
  pause(): void;
  resume(): void;
  dispose(): void;
  addDisposer(fn: Disposer): void;
}

let globalContainer: Container | undefined;

function rethrowError<T>(fn: Computation<T>): void {
  try {
    fn();
  } catch (error) {
    setTimeout(() => { throw error; })
  }
}

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
  const microQueue = new Set<Computation<void>>();
  const macroQueue = new Set<Computation<void>>();

  function recompute() {
    if (!computation) return;
    
    const currentContainer = getContainer();
  
    if (currentContainer && !isPrioritized) {
      currentContainer.scheduleMicroTask(computation);
    } else {
      rethrowError(() => untrack(computation));
    }
  }

  function scheduleMicroTask(fn: Computation<void>) {
    if (isPaused) {
      microQueue.add(fn);
    } else {
      rethrowError(() => untrack(fn));
    }
  }

  function scheduleMacroTask(fn: Computation<void>) {
    if (isPaused) {
      macroQueue.add(fn);
    } else {
      rethrowError(() => untrack(fn));
    }
  }

  function pause() {
    isPaused = true;
  }

  function resume() {
    if (!isPaused) return;

    isPaused = false;
    
    const micro = [...microQueue];
    const macro = [...macroQueue];
    
    microQueue.clear();
    macroQueue.clear();
    
    micro.forEach((fn) => rethrowError(() => untrack(fn)));
    macro.forEach((fn) => rethrowError(() => untrack(fn)));
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
    scheduleMicroTask,
    scheduleMacroTask,
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
