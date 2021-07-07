import { createValue } from "@vzn/reactivity";
import { buildData, Todo } from "./data";
import { For } from '@vzn/rendering';

const Button = ({ id, text, fn }: { id: string, text: string, fn: () => void}) =>
  <div class="col-sm-6 smallpad">
    <button id={id} class="btn btn-primary btn-block" type="button" onClick={fn}>{text}</button>
  </div>

export default function IndexRoute() {
  let selectedItem: any;
  const [data, setData] = createValue<Todo[]>([], false);

  function remove(id: number) {
    const d = data();
    d.splice(
      d.findIndex((d) => d.id === id),
      1
    );
    setData(d);
  }

  function run() {
    setData(buildData(1000));
    unselect();
  }

  function runLots() {
    setData(buildData(10000));
    unselect();
  }

  function add() {
    setData(data().concat(buildData(1000)));
  }

  function update() {
    const d = data();
    for (let i = 0; i < d.length; i += 10) {
      d[i].setLabel((d[i].getLabel() + " !!!"));
    }
  }

  function swapRows() {
    const d = data();
    let tmp = d[1];
    d[1] = d[d.length - 1];
    d[d.length - 1] = tmp;
    setData(d);
  }

  function clear() {
    setData([]);
    unselect();
  }

  function select(selectItem: any) {
    unselect();
    selectItem(true);
    selectedItem = selectItem;
  }

  function unselect() {
    if (selectedItem) selectedItem(false);
  }

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>VZN</h1>
          </div>
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
          <For each={data()}>
            {(todo) => {
              const [getSelected, setSelected] = createValue(false);

              return (
                <tr class={getSelected() ? "danger" : ""}>
                  <td class="col-md-1" textContent={`${todo.id}`} />
                  <td class="col-md-4">
                    <a
                      onClick={[select, setSelected]}
                      textContent={todo.getLabel()}
                    />
                  </td>
                  <td class="col-md-1">
                    <a onClick={[remove, todo.id]}>X</a>
                  </td>
                  <td class="col-md-6" />
                </tr>
              );
            }}
          </For>
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
};