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

function dummyFn() {}

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
  const result = runWithContainer(container, fn);

  cleanup(container.dispose);

  return result;
}

export function cleanup(fn: Disposer) {
  const container = getContainer();

  if (container) {
    container.addDisposer(fn);
  } else {
    fn();
  }
}

export function createContainer(
  computation: Computation<void> = dummyFn,
  isPrioritized = false
): Container {
  let isPaused = false;

  const disposers = new Set<Disposer>();
  const computationsQueue = new Set<Computation<void>>();
  const delayedQueue = new Set<Computation<void>>();

  const container = Object.freeze({
    get isPaused() {
      return isPaused;
    },

    recompute() {
      const parentContainer = getContainer();
  
      if (parentContainer && !isPrioritized) {
        parentContainer.schedule(computation);
      } else {
        untrack(computation);
      }
    },
  
    schedule(fn: Computation<void>) {
      if (isPaused) {
        computationsQueue.add(fn);
      } else {
        untrack(fn);
      }
    },
  
    scheduleDelayed(fn: Computation<void>) {
      if (isPaused) {
        delayedQueue.add(fn);
      } else {
        untrack(fn);
      }
    },
  
    pause() {
      isPaused = true;
    },
  
    resume() {
      if (isPaused) {
        isPaused = false;
        
        const computations = [...computationsQueue];
        const effects = [...delayedQueue];
        
        computationsQueue.clear();
        delayedQueue.clear();
        
        computations.forEach((computation) => untrack(computation));
        effects.forEach((computation) => untrack(computation));
      }
    },
  
    dispose() {
      const tmpDisposers = [...disposers]
      
      disposers.clear();
      
      tmpDisposers.forEach((disposer) => untrack(disposer));
    },
  
    addDisposer(fn: Disposer) {
      disposers.add(fn)
    }
  });

  return container;
}

export function batch<T>(computation: Computation<T>): T {
  const container = getContainer();

  if (!container) {
    const tmpContainer = createContainer();
    const result = runWithContainer(tmpContainer, () => batch(computation));

    tmpContainer.dispose();

    return result;
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
