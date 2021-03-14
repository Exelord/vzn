let globalContainer: Container | undefined;

export type Disposer = () => void;
export type Computation<T> = () => T;

export interface Container {
  readonly isPaused: boolean;
  readonly isDisposed: boolean;

  scheduleUpdate(container: Container): void;
  scheduleEffect(effect: Computation<void>): void;
  update(): void;
  recompute(): void;
  pause(): void;
  resume(): void;
  dispose(): void;
  onCleanup(fn: Disposer): void;
}

function setContainer(container: Container | undefined) {
  globalContainer = container;
}

export function getContainer(): Container | undefined {
  return globalContainer;
}

export function runWithContainer<T>(
  container: Container | undefined,
  computation: Computation<T>
): T {
  const currentContainer = getContainer();

  setContainer(container);

  try {
    return computation();
  } finally {
    setContainer(currentContainer);
  }
}

export function untrack<T>(fn: () => T): T {
  return runWithContainer(undefined, fn);
}

export function onCleanup(fn: Disposer) {
  const container = getContainer();

  if (container) {
    container.onCleanup(fn);
  }
}

export function createContainer<T>(
  computation: Computation<T>,
  isPrivileged = false
): Container {
  let isPaused = false;
  let isDisposed = false;

  let cleanups = [] as Disposer[];
  const updates = new Set<Container>();
  const effects = new Set<Computation<void>>();

  const container = {
    get isPaused() {
      return isPaused;
    },

    get isDisposed() {
      return isDisposed;
    },

    scheduleUpdate(container: Container) {
      if (isPaused) {
        updates.add(container);
      } else {
        container.recompute();
      }
    },

    scheduleEffect(effect: Computation<void>) {
      if (isPaused) {
        effects.add(effect);
      } else {
        effect();
      }
    },

    update() {
      const container = getContainer();

      if (container && !isPrivileged) {
        container.scheduleUpdate(this);
      } else {
        this.recompute();
      }
    },

    recompute() {
      computation();
    },

    pause() {
      isPaused = true;
    },

    resume() {
      if (isPaused) {
        isPaused = false;
        updates.forEach((container) => container.recompute());
        updates.clear();
        effects.forEach((effect) => effect());
        effects.clear();
      }
    },

    dispose() {
      cleanups.forEach((disposer) => disposer());
      cleanups = [];
      isDisposed = true;
    },

    onCleanup(fn: Disposer) {
      cleanups.push(fn)
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

export function createRoot<T>(fn: (dispose: () => void) => T): T {
  const container = createContainer(() => {});

  return runWithContainer(container, () =>
    batch(() => fn(() => container.dispose()))
  );
}
