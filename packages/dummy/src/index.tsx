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
  createRenderEffect
} from "@vzn/reactivity";

configure({
  batch,
  untrack,
  onCleanup,
  createRoot,
  createMemo,
  createValue,
  createEffect,
  createRenderEffect
})

render(App, document.querySelector('#app')!);