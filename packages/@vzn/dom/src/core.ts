import {
  root,
  renderEffect,
  memo,
  getContainer,
} from "@vzn/reactivity";

import { component } from "./render/component";

const sharedConfig = {};

export { getContainer as getOwner, component as createComponent, root, renderEffect as effect, memo, sharedConfig }