import App from './app';

import { configure, render } from '@vzn/rendering';

import {
  untrack,
  onCleanup,
  createRoot,
  createMemo,
  createValue,
  createReaction,
} from "@vzn/reactivity";

configure({
  untrack,
  onCleanup,
  createRoot,
  createMemo,
  createValue,
  createReaction,
});

render(App, document.querySelector('#app')!);