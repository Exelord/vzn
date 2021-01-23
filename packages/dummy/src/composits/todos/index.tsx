import { action, Component, tracked } from "@vzn/core";
import CreateForm from './create-form'
import List from './list';

export class Todo {
  @tracked title: string;
  @tracked done: boolean;

  constructor({ title, done }: { title: string, done: boolean }) {
    this.title = title;
    this.done = done;
  }
}

class State {
  @tracked todoItems: Todo[] = [];

  @action
  addTodo(todo: Todo) {
    this.todoItems.push(todo);
    this.todoItems = this.todoItems;
  }

  @action
  removeTodo(todo: Todo) {
    this.todoItems = this.todoItems.filter(item => item !== todo);
  }

  @action
  addMany() {
    const todos = [ ...Array(500)].map((v,i) => new Todo({ title: `${i}`, done: false }));
    
    this.todoItems.push(...todos);
    this.todoItems = this.todoItems;
  }

  @action
  clear() {
    this.todoItems = []
  }
}

export const Todos: Component = () => {
  const state = new State();

  return (
    <>
      <button onClick={state.addMany}>Add 500</button>
      <button onClick={state.clear}>Clear</button>
      <h4>Count: {state.todoItems.length}</h4>
      <CreateForm onCreate={state.addTodo} />
      <List todoItems={state.todoItems} onRemove={state.removeTodo} />
    </>
  );
}

export default Todos;