import App from './app';

import { configure, render } from '@vzn/dom';

import {
  root,
  untrack,
  onCleanup,
  createMemo,
  createValue,
  createReaction
} from "@vzn/reactivity";

configure({
  root,
  untrack,
  onCleanup,
  createMemo,
  createValue,
  createReaction
})

render(App, document.querySelector('#app')!);