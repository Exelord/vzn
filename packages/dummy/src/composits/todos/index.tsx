import { Component, makeState } from "@vzn/core";
import CreateForm from './create-form'
import List from './list';

export type TodoItem = {
  title: string;
  done: boolean;
}

class State {
  todoItems: TodoItem[] = [];

  constructor() {
    makeState(this);
  }

  addTodo(todoItem: TodoItem) {
    this.todoItems.push(todoItem);
  }

  removeTodo(todoItem: TodoItem) {
    this.todoItems = this.todoItems.filter(todo => todo !== todoItem);
  }

  addMany() {
    const todos = [ ...Array(500)].map((v,i) => ({ title: `${i}`, done: false } as TodoItem));
    this.todoItems.push(...todos)
  }

  clear() {
    this.todoItems = []
  }
}

export const Todos: Component = () => {
  const state = new State();

  return (
    <div>
      <button onClick={state.addMany}>Add 500</button>
      <button onClick={state.clear}>Clear</button>
      <h4>Count: {state.todoItems.length}</h4>
      <CreateForm onCreate={state.addTodo} />
      <List todoItems={state.todoItems} onRemove={state.removeTodo} />
    </div>
  );
}

export default Todos;