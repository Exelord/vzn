import { Component, For } from "@vzn/core";
import { Todo } from "../index";
import ListItem from './item';

type TodoListProps = {
  todoItems: Todo[];
  onRemove: (todo: Todo) => void
}

export const List: Component<TodoListProps> = (props) => {
  return (
    <ul>
      <For each={props.todoItems} do={(todo) =>
        <li>
          <ListItem todo={todo} onRemove={() => props.onRemove(todo)} />
        </li>
      } />
    </ul>
  );
}

export default List;