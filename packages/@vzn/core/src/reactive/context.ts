import { Owner, getOwner } from "./owner";
import { observable, action } from 'mobx';
import { createEffect } from "./effect";

export interface Context {
  id: symbol;
  Provider: (props: any) => any;
  defaultValue: unknown;
}

export function createContext(defaultValue?: unknown): Context {
  const id = Symbol("context");
  return { id, Provider: createProvider(id), defaultValue };
}

export function useContext(context: Context) {
  return lookup(context.id, getOwner()) || context.defaultValue;
}

function createProvider(id: symbol) {
  return function provider(props: { value: unknown; children: any }) {
    const rendered = observable.box();

    const update = action(() => rendered.set(resolveChildren(props.children)));
    
    createEffect(() => {
      const owner = getOwner();
      if (owner) owner.context = { [id]: props.value };
      update();
    });

    return () => rendered.get();
  };
}

function lookup(key: symbol | string, owner?: Owner,): any {
  return owner && ((owner.context && owner.context[key]) || (owner.parentOwner && lookup(key, owner.parentOwner)))
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