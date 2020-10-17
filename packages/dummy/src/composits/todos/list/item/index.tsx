import { Component, makeState } from "@vzn/core";
import { TodoItem } from "../../index";

type TodoListItemProps = {
  todoItem: TodoItem
  onRemove: (todoItem: TodoItem) => void;
}

class State {
  props: TodoListItemProps;

  constructor(props: TodoListItemProps) {
    this.props = props;
    makeState(this);
  }

  toggle() {
    this.props.todoItem.done = !this.props.todoItem.done;
  }

  removeTodo() {
    const confirmed = confirm(`Do you want to remove: ${this.props.todoItem.title}`);
    if (!confirmed) return;

    this.props.onRemove(this.props.todoItem);
  }
}

export const ListItem: Component<TodoListItemProps> = (props) => {
  const state = new State(props);

  return (
    <div>
      <input type="checkbox" checked={props.todoItem.done} onChange={state.toggle} />

      <span style={{ 'text-decoration': props.todoItem.done ? 'line-through' : '' }}>
        {props.todoItem.title}
      </span>

      <button type="button" onClick={state.removeTodo}>🗑</button>
    </div>
  );
}

export default ListItem;