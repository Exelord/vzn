import App from './app';

import { configure, render } from '@vzn/dom';

import {
  batch,
  untrack,
  onCleanup,
  createRoot,
  createMemo,
  createValue,
  createEffect,
  createInstantEffect
} from "@vzn/reactivity";

configure({
  batch,
  untrack,
  cleanup: onCleanup,
  createRoot,
  createMemo,
  createValue,
  createEffect,
  createRenderEffect: createInstantEffect
})

render(App, document.querySelector('#app')!);