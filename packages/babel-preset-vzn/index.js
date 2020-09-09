const jsxTransform = require("babel-plugin-jsx-dom-expressions");
const classProperties = require("@babel/plugin-proposal-class-properties");

module.exports = function (context, options = {}) {
  const plugins = [
    classProperties,
    [
      jsxTransform,
      Object.assign(
        {
          moduleName: "@vzn/dom"
        },
        options
      )
    ]
  ];

  return {
    plugins
  };
};