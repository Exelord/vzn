import { observable, untracked, action, autorun } from 'mobx';
import { createOwner, setOwner, onCleanup, Disposable } from './owner';

export function createRoot<T>(fn: (dispose: Disposable) => T) {
  let d: any[], ret: T;

  const owner = createOwner();
  setOwner(owner);

  ret = untracked(() =>
    fn(() => {
      let k, len: number;
      for (k = 0, len = d.length; k < len; k++) d[k]();
      d = [];
    })
  );
  
  setOwner(owner.owner);

  return ret;
}

export function createEffect<T>(fn: (prev?: T) => T, value?: T) {
  const owner = createOwner();

  const cleanupFn = (final: boolean) => {
    owner.dispose();
    final && dispose();
  }

  const dispose = autorun(() => {
    cleanupFn(false);
    setOwner(owner);
    value = fn(value);
    setOwner(owner.owner);
  });

  onCleanup(() => cleanupFn(true));
}

export function createMemo<T>(fn: () => T, equal?: boolean) {
  const o = observable.box(untracked(fn));

  const update = action((r: T) => o.set(r));
  
  createEffect(prev => {
    const res = fn();
    (!equal || prev !== res) && update(res);
    return res;
  });

  return () => o.get();
}