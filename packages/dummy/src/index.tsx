import App from './app';

import { configure, render } from '@vzn/dom';

import {
  root,
  batch,
  untrack,
  onCleanup,
  createMemo,
  createValue,
  createEffect,
  createInstantEffect
} from "@vzn/reactivity";

configure({
  batch,
  untrack,
  cleanup: onCleanup,
  createRoot: root,
  createMemo,
  createValue,
  createEffect,
  createRenderEffect: createInstantEffect
})

render(App, document.querySelector('#app')!);