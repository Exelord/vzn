import { action, Component, ComponentState } from "@vzn/core";
import { Todo } from "../../index";

type TodoListItemProps = {
  todo: Todo
  onRemove: (todo: Todo) => void;
}

class State extends ComponentState<TodoListItemProps> {
  @action
  toggle() {
    this.props.todo.done = !this.props.todo.done;
  }

  @action
  removeTodo() {
    const confirmed = confirm(`Do you want to remove: ${this.props.todo.title}`);
    if (!confirmed) return;

    this.props.onRemove(this.props.todo);
  }
}

export const ListItem: Component<TodoListItemProps> = (props) => {
  const state = new State(props);

  return (
    <div>
      <input type="checkbox" checked={props.todo.done} onChange={state.toggle} />

      <span style={{ 'text-decoration': props.todo.done ? 'line-through' : '' }}>
        {props.todo.title}
      </span>

      <button type="button" onClick={state.removeTodo}>🗑</button>
    </div>
  );
}

export default ListItem;