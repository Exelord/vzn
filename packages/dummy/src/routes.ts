import type { RouterConfig } from "@vzn/router";
import { lazy } from "@vzn/core";

// https://github.com/pillarjs/path-to-regexp

const config: RouterConfig = {
  routes: {
    '/': { name: 'index', component: lazy(() => import('@/pages/index')) },
    '/home': { name: 'index', component: lazy(() => import('@/pages/home')) },
  }
}

export default config;