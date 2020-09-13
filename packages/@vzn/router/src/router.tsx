import { createState, FunctionComponent, withCurrentOwner } from "@vzn/core";
import { createComponent } from "@vzn/dom";
import { useRouter } from "./store";

export type RouteDefinition = {
  name: string;
  component: FunctionComponent;
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

export const Router: FunctionComponent<RouterProps> = (props) => {
  const state = createState({
    router: useRouter(),
    
    get route() {
      return props.config.routes[this.router.pathname];
    }
  })

  return withCurrentOwner(() => createComponent(state.route.component, {}));
}