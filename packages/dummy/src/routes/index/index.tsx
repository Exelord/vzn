import { value } from '@vzn/reactivity';
// @ts-ignore
import styles from './styles.module.css';

const IndexRoute = () => {
  const [getCount, setCount] = value(0)
  
  return (
    <button class={styles.button} onClick={() => setCount(getCount() + 1)}>
      Count: {getCount}
    </button>
  );
}

export default IndexRoute;