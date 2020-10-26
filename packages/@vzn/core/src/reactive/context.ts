import { tracked, action, getTrackingContext, TrackingContext } from '../tracking';
import { effect } from "./effect";
import { Component } from "../rendering";

interface ProviderProps<T> {
  value: T;
}

export type Provider<T> = Component<ProviderProps<T>>

export interface Context<T> {
  Provider: Provider<T>;
  displayName?: string;
  defaultValue: T
}

export function createContext<T>(defaultValue: T): Context<T> {
  const provider: Provider<T> = (props) => {
    const rendered = tracked()
    
    const update = action(() => rendered(resolveChildren(props.children)));

    effect(() => {
      const tracking = getTrackingContext()!;

      tracking._contexts.set(provider, props.value || defaultValue);

      update();
    });

    return () => rendered();
  }

  return { Provider: provider, defaultValue };
}

export function getContext<T>(context: Context<T>): T {
  const tracking = getTrackingContext();
  return (tracking && lookup(context.Provider, tracking)) || context.defaultValue;
}

function lookup<T>(key: Provider<T>, tracking: TrackingContext): T | undefined {
  return tracking._contexts.get(key);
}

function resolveChildren(children: any): any {
  if (typeof children === "function") {
    const c = tracked();
    const update = action((child: any) => c(child));

    effect(() => update(children()));
    
    return () => c();
  }

  if (Array.isArray(children)) {
    const results: any[] = [];

    for (let i = 0; i < children.length; i++) {
      const result = resolveChildren(children[i]);

      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    
    return results;
  }

  return children;
}
