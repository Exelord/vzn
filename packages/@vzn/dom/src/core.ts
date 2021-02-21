import {
  root,
  instantEffect,
  memo,
  getContainer,
} from "@vzn/reactivity";

import { component } from "./render/component";

const sharedConfig = {};

export { getContainer as getOwner, component as createComponent, root, instantEffect as effect, memo, sharedConfig }