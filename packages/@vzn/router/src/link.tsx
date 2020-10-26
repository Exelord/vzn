import { action, Component, ComponentState } from "@vzn/core"
import { useRouter } from "./store";

type LinkProps = {
  to: string;
}

class State extends ComponentState<LinkProps> {
  router = useRouter();

  @action
  handleClick(event: Event) {
    event.preventDefault();

    if (this.props.to) {
      this.router.push(this.props.to)
    }
  }
}

export const Link: Component<LinkProps> = (props) => {
  const state = new State(props);

  return (
    <a href={props.to} onClick={state.handleClick}>
      {props.children}
    </a>
  )
}