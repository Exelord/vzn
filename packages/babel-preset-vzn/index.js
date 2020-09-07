const jsxTransform = require("babel-plugin-jsx-dom-expressions");

module.exports = function (context, options = {}) {
  const plugins = [
    [
      jsxTransform,
      Object.assign(
        {
          moduleName: "vzn"
        },
        options
      )
    ]
  ];

  return {
    plugins
  };
};