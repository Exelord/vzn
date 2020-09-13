import { createState, FunctionComponent } from "@vzn/core"
import { useRouter } from "./store";

type LinkProps = {
  to: string;
}

export const Link: FunctionComponent<LinkProps> = (props) => {
  const state = createState({
    router: useRouter(),

    handleClick(event: Event) {
      event.preventDefault();
  
      if (props.to) {
        this.router.push(props.to)
      }
    }
  })

  return (
    <a href={props.to} onClick={state.handleClick}>
      {props.children}
    </a>
  )
}