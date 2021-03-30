export type Disposer = () => void;
export type Computation<T> = () => T;

export interface Container {
  readonly isPaused: boolean;

  scheduleUpdate(computation: Computation<void>): void;
  scheduleEffect(computation: Computation<void>): void;
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
  const updatesQueue = new Set<Computation<void>>();
  const effectsQueue = new Set<Computation<void>>();

  const container = {
    get isPaused() {
      return isPaused;
    },

    recompute() {
      const parentContainer = getContainer();
  
      if (parentContainer && !isPrioritized) {
        parentContainer.scheduleUpdate(computation);
      } else {
        untrack(computation);
      }
    },
  
    scheduleUpdate(computation: Computation<void>) {
      if (isPaused) {
        updatesQueue.add(computation);
      } else {
        untrack(computation);
      }
    },
  
    scheduleEffect(computation: Computation<void>) {
      if (isPaused) {
        effectsQueue.add(computation);
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
        
        const updates = [...updatesQueue];
        const effects = [...effectsQueue];
        
        updatesQueue.clear();
        effectsQueue.clear();
        
        updates.forEach(async (computation) => untrack(computation));
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
