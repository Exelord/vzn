import copy from "rollup-plugin-copy";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import cleanup from "rollup-plugin-cleanup";

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
        targets: [{ src: "../../../node_modules/dom-expressions/src/jsx.ts", dest: "./src/rendering" }]
      }),

      nodeResolve({
        extensions: [".js", ".ts"]
      }),

      babel({
        extensions: [".js", ".ts"],
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        babelrc: false,
        presets: ["@babel/preset-typescript", 'vzn'],
      }),
      
      cleanup({
        extensions: [".js", ".ts"]
      })
    ]
  }
];