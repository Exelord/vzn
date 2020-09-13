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
    external: ["@vzn/core", "@vzn/dom", "@vzn/store", "path-to-regexp"],
    plugins: [
      nodeResolve({
        extensions: [".js", ".ts", ".tsx"]
      }),

      babel({
        extensions: [".js", ".ts", ".tsx"],
        exclude: "node_modules/**",
        babelrc: false,
        presets: ["@babel/preset-typescript", "vzn", [
          "@babel/preset-env",
          {
            bugfixes: true,
            targets: {
              esmodules: true
            }
          }
        ]],
      }),
      
      cleanup({
        extensions: [".js", ".ts", ".tsx"]
      })
    ]
  }
];