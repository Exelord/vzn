import App from './app';

import { configure, render } from '@vzn/rendering';

import {
  root,
  untrack,
  onCleanup,
  createMemo,
  createValue,
  createReaction
} from "@vzn/reactivity";

configure({
  untrack,
  onCleanup,
  createRoot: root,
  createMemo,
  createValue,
  createReaction
})

render(App, document.querySelector('#app')!);