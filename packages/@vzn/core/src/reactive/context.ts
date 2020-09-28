import { Owner, getOwner } from "./owner";
import { observable, action } from 'mobx';
import { createEffect } from "./effect";
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
    const rendered = observable.box();
    
    const update = action(() => rendered.set(resolveChildren(props.children)));
    
    createEffect(() => {
      const owner = getOwner()!;
      owner.contexts.set(provider, props.value || defaultValue);
      update();
    });

    return () => rendered.get();
  }

  return { Provider: provider, defaultValue };
}

export function useContext<T>(context: Context<T>): T {
  const owner = getOwner();
  return (owner && lookup(context.Provider, owner)) || context.defaultValue;
}

function lookup<T>(key: Provider<T>, owner: Owner,): T | undefined {
  if (owner.contexts.has(key)) return owner.contexts.get(key);
  
  return owner.parent && lookup(key, owner.parent);
}

function resolveChildren(children: any): any {
  if (typeof children === "function") {
    const c = observable.box(),
      update = action((child: any) => c.set(child));
    createEffect(() => update(children()));
    return () => c.get();
  }
  if (Array.isArray(children)) {
    const results: any[] = [];
    for (let i = 0; i < children.length; i++) {
      let result = resolveChildren(children[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children;
}
