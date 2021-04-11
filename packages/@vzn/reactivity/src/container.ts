export type Disposer = () => void;
export type Computation<T> = () => T;

export interface Container {
  readonly isPaused: boolean;

  scheduleTask(computation: Computation<void>): void;
  scheduleMicroTask(computation: Computation<void>): void;
  recompute(): void;
  pause(): void;
  resume(): void;
  dispose(): void;
  addDisposer(fn: Disposer): void;
}

let globalContainer: Container | undefined;

function asyncRethrow<T>(fn: Computation<T>): void {
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
  const currentContainer = getContainer();

  if (currentContainer) {
    currentContainer.addDisposer(fn);
  } else {
    queueMicrotask(() => {
      const container = createContainer();

      try {
        return runWithContainer(container, fn);
      } finally {
        container.dispose();
      }
    });
  }
}

export function createContainer(
  computation?: Computation<void>,
  isPrioritized = false
): Container {
  let isPaused = false;

  const disposers = new Set<Disposer>();
  const tasksQueue = new Set<Computation<void>>();
  const microTasksQueue = new Set<Computation<void>>();

  function recompute() {
    if (!computation) return;
    
    const currentContainer = getContainer();
  
    if (currentContainer && !isPrioritized) {
      currentContainer.scheduleTask(computation);
    } else {
      asyncRethrow(() => untrack(computation));
    }
  }

  function scheduleTask(fn: Computation<void>) {
    if (isPaused) {
      tasksQueue.add(fn);
    } else {
      asyncRethrow(() => untrack(fn));
    }
  }

  function scheduleMicroTask(fn: Computation<void>) {
    if (isPaused) {
      microTasksQueue.add(fn);
    } else {
      const currentContainer = getContainer();
      queueMicrotask(() => runWithContainer(currentContainer, () => untrack(fn)));
    }
  }

  function pause() {
    isPaused = true;
  }

  function resume() {
    if (!isPaused) return;

    isPaused = false;
    
    const tasks = [...tasksQueue];
    const microTasks = [...microTasksQueue];
    
    tasksQueue.clear();
    microTasksQueue.clear();
    
    tasks.forEach(scheduleTask);
    microTasks.forEach(scheduleMicroTask);
  }

  function dispose() {
    const tmpDisposers = [...disposers]
    
    disposers.clear();
    
    tmpDisposers.forEach((disposer) => asyncRethrow(() => runWithContainer(undefined, () => untrack(disposer))));
  }

  function addDisposer(fn: Disposer) {
    disposers.add(fn)
  }

  return Object.freeze({
    recompute,
    scheduleTask,
    scheduleMicroTask,
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
  const currentContainer = getContainer();

  if (!currentContainer) {
    const tmpContainer = createContainer();

    try {
      return runWithContainer(tmpContainer, () => batch(computation));
    } finally {
      tmpContainer.dispose();
    }
  }

  if (currentContainer.isPaused) {
    return computation();
  }

  currentContainer.pause();

  try {
    return computation();
  } finally {
    currentContainer.resume();
  }
}
