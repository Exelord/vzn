import {
  createRoot,
  createInstantEffect,
  createMemo,
  getContainer,
} from "@vzn/reactivity";

import { component } from "./render/component";

const sharedConfig = {};

export {
  getContainer as getOwner,
  component as createComponent,
  createRoot as root,
  createInstantEffect as effect,
  createMemo as memo,
  sharedConfig
}
