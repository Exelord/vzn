import { createValue } from "@vzn/reactivity";

function _random (max: number) { return Math.round(Math.random() * 1000) % max; };

let ID = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

export type Todo = {
  id: number;
  label: string;
}

export function buildData(count: number): Todo[] {
  const data = [];

  for (let i = 0; i < count; i++) {
    const [getLabel, setLabel] = createValue(adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]);
    
    data.push({
      id: ID++,
      get label() { return getLabel() },
      set label(value) { setLabel(value) }
    });
  }

  return data;
}