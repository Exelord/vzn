import copy from "rollup-plugin-copy";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import cleanup from "rollup-plugin-cleanup";

const plugins = [
  nodeResolve({
    extensions: [".js", ".ts"]
  }),
  babel({
    extensions: [".js", ".ts"],
    exclude: "node_modules/**",
    babelrc: false,
    presets: ["@babel/preset-typescript"],
    plugins: [
      [
        "babel-plugin-transform-rename-import",
        {
          original: "rxcore",
          replacement: "../../../packages/vzn/src/dom/core"
        }
      ]
    ]
  }),
  cleanup({
    extensions: [".js", ".ts"]
  })
];

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "lib/index.js",
        format: "cjs"
      },
      {
        file: "dist/index.js",
        format: "es"
      }
    ],
    plugins: [
      copy({
        targets: [{ src: "../../node_modules/dom-expressions/src/jsx.ts", dest: "./src/rendering" }]
      })
    ].concat(plugins)
  },
  {
    input: "src/dom/index.ts",
    output: [
      {
        file: "lib/dom/index.js",
        format: "cjs"
      },
      {
        file: "dist/dom/index.js",
        format: "es"
      }
    ],
    external: ["../index"],
    plugins: [
      copy({
        targets: [
          {
            src: ["../../node_modules/dom-expressions/src/runtime.d.ts"],
            dest: "./src/dom"
          },
          { src: "../../node_modules/dom-expressions/src/runtime.d.ts", dest: "./types/dom/" }
        ]
      })
    ].concat(plugins)
  }
];