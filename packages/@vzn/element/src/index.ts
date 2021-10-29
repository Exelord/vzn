import {
  setAttribute,
  insert,
  addEventListener,
  effect,
  VZN,
} from "@vzn/rendering";

interface ElementFactory {
  (): HTMLElement;
  plugin: (...plugins: Array<(element: HTMLElement) => void>) => ElementFactory;
  content: (...content: Array<VZN.Element>) => ElementFactory;
  attrs: (attrs: {
    [key: string]: string | number | (() => string | number);
  }) => ElementFactory;
  on: (events: { [key: string]: () => void }) => ElementFactory;
  style: (styles: {
    [key: string]: string | number | (() => string | number);
  }) => ElementFactory;
  class: (
    ...classes: Array<
      | string
      | number
      | (() => string | number)
      | { [key: string]: boolean | (() => boolean) }
    >
  ) => ElementFactory;
}

export function Element(tag: string): ElementFactory {
  const element = document.createElement(tag);

  function ElementFactory() {
    return element;
  }

  ElementFactory.plugin = function (
    ...plugins: Array<(element: HTMLElement) => void>
  ) {
    plugins.forEach((plugin) => plugin(element));

    return this;
  };

  ElementFactory.content = function (...content: Array<VZN.Element>) {
    element.textContent = "";
    content.forEach((item) => insert(element, item, null));
    return this;
  };

  ElementFactory.attrs = function (attrs: {
    [key: string]: string | number | (() => string | number);
  }) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (typeof value === "function") {
        effect(() => setAttribute(element, key, `${value()}`));
      } else {
        setAttribute(element, key, `${value}`);
      }
    });

    return this;
  };

  ElementFactory.on = function (events: { [key: string]: () => void }) {
    Object.entries(events).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => addEventListener(element, key, v, false));
      } else {
        addEventListener(element, key, value, false);
      }
    });

    return this;
  };

  ElementFactory.style = function (styles: {
    [key: string]: string | number | (() => string | number);
  }) {
    Object.entries(styles).forEach(([key, value]) => {
      if (typeof value === "function") {
        effect(() => element.style.setProperty(key, `${value()}`));
      } else {
        element.style.setProperty(key, `${value}`);
      }
    });

    return this;
  };

  ElementFactory.class = function (
    ...classes: Array<
      | string
      | number
      | (() => string | number)
      | { [key: string]: boolean | (() => boolean) }
    >
  ) {
    classes.forEach((klass) => {
      if (typeof klass === "string" || typeof klass === "number") {
        element.classList.add(`${klass}`);
      } else if (typeof klass === "function") {
        effect((prevKlass) => {
          if (prevKlass) {
            element.classList.remove(prevKlass);
          }

          element.classList.add(`${klass()}`);

          return `${klass()}`;
        }, "");
      } else if (typeof klass === "object") {
        Object.entries(klass).forEach(([key, value]) => {
          if (typeof value === "function") {
            effect(() => element.classList.toggle(key, value()));
          } else {
            element.classList.toggle(key, value);
          }
        });
      }
    });

    return this;
  };

  return ElementFactory;
}
