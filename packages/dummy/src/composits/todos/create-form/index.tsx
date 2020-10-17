import { Component, makeState } from "@vzn/core";
import { TodoItem } from "../index";

type FormObject = {
  [key: string]: any;
}

export type CreateFormProps = {
  onCreate: (todo: TodoItem) => void
}

class State {
  props: CreateFormProps;

  formObject: FormObject = {
    title: ''
  }

  constructor(props: CreateFormProps) {
    makeState(this);
    this.props = props;
  }

  addTodo(event: Event) {
    event.preventDefault();

    const { title } = this.formObject;

    const todo = {
      title,
      done: false
    } as TodoItem

    this.props.onCreate(todo);

    this.formObject = { title: '' };
  }

  onChange(event: Event) {
    const { name, value } = event.target as HTMLInputElement;

    this.formObject[name] = value;
  }
}

export const CreateForm: Component<CreateFormProps> = (props) => {
  const state = new State(props);

  return (
    <form onSubmit={state.addTodo}>
      <label>Title</label>
      <input
        required
        type="text"
        name="title"
        placeholder="Todo title"
        value={state.formObject.title} 
        onChange={state.onChange} />
    </form>
  );
}

export default CreateForm;