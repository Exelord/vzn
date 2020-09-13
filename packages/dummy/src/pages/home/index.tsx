import { FunctionComponent } from "@vzn/core";
import { Link, useRouter } from '@vzn/router';

const HomePage: FunctionComponent = () => {
  const router = useRouter();

  return (
    <>
      <h1>Hello from Home Page "{router.pathname}"</h1>
      <Link to="/">Go to index page</Link>
    </>
  );
}

export default HomePage;