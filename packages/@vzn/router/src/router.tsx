import { Component, ComponentState } from "@vzn/core";
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

class State extends ComponentState<RouterProps> {
  router = useRouter();

  get route() {
    return this.props.config.routes[this.router.history.location.pathname];
  }
}

export const Router: Component<RouterProps> = (props) => {
  const state = new State(props);

  return () => createComponent(state.route.component, {});
}