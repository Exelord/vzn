const jsxTransform = require("babel-plugin-jsx-dom-expressions");
const classProperties = require("@babel/plugin-proposal-class-properties");

module.exports = function (context, options = {}) {
  const plugins = [
    [
      jsxTransform,
      Object.assign(
        {
          moduleName: "@vzn/dom",
          builtIns: [
            'If',
            'For'
          ]
        },
        options
      )
    ],
    [classProperties]
  ];

  return {
    plugins
  };
};