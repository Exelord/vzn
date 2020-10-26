const jsxTransform = require("babel-plugin-jsx-dom-expressions");
const classProperties = require("@babel/plugin-proposal-class-properties");
const decorators = require("@babel/plugin-proposal-decorators");

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
    [decorators, { legacy: true }],
    [classProperties, { loose: true }]
  ];

  return {
    plugins
  };
};