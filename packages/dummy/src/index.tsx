import App from './app';

import { configure, render } from '@vzn/dom';

import {
  root,
  untrack,
  getOwner,
  onCleanup,
  createMemo,
  createValue,
  runWithOwner,
  createReaction
} from "@vzn/reactivity";

export function createEffect<T>(fn: (v: T) => T, value: T): void;
export function createEffect<T>(fn: (v?: T) => T | undefined): void;
export function createEffect<T>(fn: (v?: T) => T, value?: T): void {
  const { disposer } = getOwner();
  queueMicrotask(() => runWithOwner({ disposer }, () => createReaction(fn, value)))
}

configure({
  untrack,
  cleanup: onCleanup,
  createRoot: root,
  createMemo,
  createValue,
  createEffect,
  createRenderEffect: createReaction
})

render(App, document.querySelector('#app')!);