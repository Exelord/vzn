import WelcomeComponent from "@/components/welcome";
import Todos from "@/composits/todos";
import { tracked, If, action, Component } from "@vzn/core";

export const IndexPage: Component = () => {
  return <Todos />
}

export default IndexPage;