import { createState, Component } from "@vzn/core";
import { createComponent } from "@vzn/dom";
import { useRouter } from "./store";

export type RouteDefinition = {
  name: string;
  component: Component;
  routes?: {
    [key: string]: RouteDefinition
  }
}

export interface RouterConfig {
  routes: {
    '/': RouteDefinition,
    [key: string]: RouteDefinition
  }
}

type RouterProps = {
  config: RouterConfig
}

export const Router: Component<RouterProps> = (props) => {
  const state = createState(() => ({
    router: useRouter(),
    
    get route() {
      return props.config.routes[this.router.history.location.pathname];
    }
  }))

  return () => createComponent(state.route.component, {});
}