import { createValue, batch } from "@vzn/reactivity";
import { buildData } from "./data";
import { For } from '@vzn/dom';

function benchmark<T>(name: string, fn: (...args: any[]) => T) {
  const startTime = performance.now();
  fn();
  const stop = performance.now();

  window.setTimeout(() => console.log(name+" took "+(stop-startTime)), 0);
}

const Button = ({ id, text, fn }) =>
  <div class="col-sm-6 smallpad">
    <button id={id} class="btn btn-primary btn-block" type="button" onClick={fn}>{text}</button>
  </div>

const IndexRoute = () => {
  const [data, setData] = createValue([], false);
  const [selected, setSelected] = createValue(null);

  function remove(id) {
    const d = data();
    d.splice(d.findIndex(d => d.id === id), 1);
    setData(d);
  }

  function run() {
    benchmark('run', () => {
      batch(() => {
        setData(buildData(1000));
        setSelected(null);
      });
    })
  }

  function runLots() {
    benchmark('runLots', () => {
      batch(() => {
        setData(buildData(10000));
        setSelected(null);
      });
    });
  }

  function add() { setData(data().concat(buildData(1000))); }

  function update() {
    batch(() => {
      const d = data();
      for (let i = 0; i < d.length; i += 10) {
        d[i].label += ' !!!';
      }
    });
  }

  function swapRows() {
    const d = data();
    if (d.length > 998) {
      let tmp = d[1];
      d[1] = d[998];
      d[998] = tmp;
      setData(d);
    }
  }

  function clear() {
    batch(() => {
      setData([]);
      setSelected(null);
    });
  }

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6"><h1>VZN</h1></div>
          <div class="col-md-6">
            <div class="row">
              <Button id="run" text="Create 1,000 rows" fn={run} />
              <Button id="runlots" text="Create 10,000 rows" fn={runLots} />
              <Button id="add" text="Append 1,000 rows" fn={add} />
              <Button id="update" text="Update every 10th row" fn={update} />
              <Button id="clear" text="Clear" fn={clear} />
              <Button id="swaprows" text="Swap Rows" fn={swapRows} />
            </div>
          </div>
        </div>
      </div>

      <table class="table table-hover table-striped test-data">
        <tbody>
          <For each={data()}>{(row) => {
            let rowId = row.id;
            return <tr class={rowId === selected() ? "danger": ""}>
              <td class="col-md-1" textContent={ rowId } />
              <td class="col-md-4"><a onClick={[setSelected, rowId]} textContent={row.label} /></td>
              <td class="col-md-1"><a onClick={[remove, rowId]}><span class="glyphicon glyphicon-remove" aria-hidden="true" /></a></td>
              <td class="col-md-6"/>
            </tr>
          }}</For>
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
}

export default IndexRoute;