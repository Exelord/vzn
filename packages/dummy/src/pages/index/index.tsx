import { FunctionComponent } from "@vzn/core";
import { Link, useRouter } from '@vzn/router';

const IndexPage: FunctionComponent = () => {
  const router = useRouter();

  return (
    <>
      <h1>Hello from Index Page "{router.pathname}"</h1>
      <Link to="/home">Go to home page</Link>
    </>
  );
}

export default IndexPage;