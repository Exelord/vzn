import { action, Component, ComponentState, tracked } from "@vzn/core";
import { Todo } from "../index";

type FormObject = {
  [key: string]: any;
}

export type CreateFormProps = {
  onCreate: (todo: Todo) => void
}

class State extends ComponentState<CreateFormProps> {
  @tracked formObject: FormObject = {
    title: ''
  }

  @action
  addTodo(event: Event) {
    event.preventDefault();

    const { title } = this.formObject;
    
    const todo = new Todo({ title, done: false });
    
    this.props.onCreate(todo);

    this.formObject = { title: '' };
  }

  @action
  onChange(event: Event) {
    const { name, value } = event.target as HTMLInputElement;

    this.formObject[name] = value;
  }
}

export const CreateForm: Component<CreateFormProps> = (props) => {
  const state = new State(props);

  return (
    <form onSubmit={state.addTodo}>
      <label>
        Title
        
        <input
          required
          type="text"
          name="title"
          placeholder="Todo title"
          value={state.formObject.title} 
          onChange={state.onChange} />
      </label>
    </form>
  );
}

export default CreateForm;