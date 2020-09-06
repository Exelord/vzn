import { observable, untracked, action, autorun } from 'mobx';
import { createOwner, onCleanup, Disposable, getOwner } from './owner';
import { Disposer } from '../utils/disposer';

export function createRoot<T>(fn: (dispose: Disposable) => T) {
  const owner = createOwner();
  return untracked(() => fn(() => owner.destroy()));
}

export function createEffect<T>(fn: (prev?: T) => T, value?: T) {
  const disposer = new Disposer();

  const dispose = autorun(() => {
    disposer.dispose();
    value = fn(value);
  });

  onCleanup(() => {
    dispose();
    disposer.dispose();
  });
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