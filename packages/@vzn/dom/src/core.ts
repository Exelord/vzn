import {
  root,
  createInstantEffect,
  memo,
  getContainer,
} from "@vzn/reactivity";

import { component } from "./render/component";

const sharedConfig = {};

export { getContainer as getOwner, component as createComponent, root, createInstantEffect as effect, memo, sharedConfig }