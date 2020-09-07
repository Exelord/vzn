import { observable, untracked, action, autorun } from 'mobx';
import { createOwner, onCleanup, Disposable, setOwner } from './owner';

export function createRoot<T>(fn: (dispose: Disposable) => T) {
  const owner = createOwner();
  setOwner(owner);

  return untracked(() => fn(() => {
    setOwner(owner.parentOwner);
    owner.destroy()
  }));
}

export function createEffect<T>(fn: (prev?: T) => T, value?: T) {
  const owner = createOwner();
  
  onCleanup(() => {
    disposeAutoRun();
    owner.destroy();
  });

  const disposeAutoRun = autorun(() => {
    owner.dispose();
    setOwner(owner);
    value = fn(value);
    setOwner(owner.parentOwner);
  });
}

export function createMemo<T>(fn: () => T, equal?: boolean) {
  const value = observable.box(untracked(fn));

  const update = action((result: T) => value.set(result));
  
  createEffect(prev => {
    const result = fn();
    
    if (!equal || prev !== result) update(result);
    
    return result;
  });

  return () => value.get();
}