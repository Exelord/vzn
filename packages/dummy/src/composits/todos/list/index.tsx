import { action, Component, For } from "@vzn/core";
import { TodoItem } from "../index";
import ListItem from './item';

type TodoListProps = {
  todoItems: TodoItem[];
  onRemove: (todoItem: TodoItem) => void
}

export const List: Component<TodoListProps> = (props) => {
  return (
    <ul>
      <For each={props.todoItems} do={(todoItem) =>
        <li>
          <ListItem todoItem={todoItem} onRemove={action(() => props.onRemove(todoItem))} />
        </li>
      } />
    </ul>
  );
}

export default List;