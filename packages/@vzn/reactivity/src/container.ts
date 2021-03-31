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
  return runWithContainer(undefined, fn);
}

export function onCleanup(fn: Disposer) {
  const container = getContainer();

  if (container) {
    container.addDisposer(fn);
  }
}

export function createContainer<T>(
  computation: Computation<T>,
  isPrioritized = false
): Container {
  let isPaused = false;

  const disposers = new Set<Disposer>();
  const computationsQueue = new Set<Computation<void>>();
  const delayedQueue = new Set<Computation<void>>();

  const container = {
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
  
    schedule(computation: Computation<void>) {
      if (isPaused) {
        computationsQueue.add(computation);
      } else {
        untrack(computation);
      }
    },
  
    scheduleDelayed(computation: Computation<void>) {
      if (isPaused) {
        delayedQueue.add(computation);
      } else {
        untrack(computation);
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
        
        computations.forEach(async (computation) => untrack(computation));
        effects.forEach(async (computation) => untrack(computation));
      }
    },
  
    dispose() {
      const tmpDisposers = [...disposers]
      
      disposers.clear();
      
      tmpDisposers.forEach(async (disposer) => untrack(disposer));
    },
  
    addDisposer(fn: Disposer) {
      disposers.add(fn)
    }
  };

  onCleanup(() => container.dispose());

  return container;
}

export function batch<T>(computation: Computation<T>): T {
  const container = getContainer();

  if (!container) {
    return runWithContainer(createContainer(() => {}), () => batch(computation));
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
