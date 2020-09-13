import { lazy } from "../../core/dist/reactive/lazy";

export type RouteDefinition = {
  name: string;
  component: string;
  routes?: {
    [key: string]: RouteDefinition
  }
}

export interface RouterConfig {
  routes: {
    'index': RouteDefinition,
    [key: string]: RouteDefinition
  }
}

type RouterProps = {
  config: RouterConfig
}

const Router = (props: RouterProps) => {
  const route = props.config.routes[window.location.pathname];
  const LazyPage = lazy(() => import(route.component));

  return <LazyPage />
}

export default Router;