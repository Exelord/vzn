import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import cleanup from "rollup-plugin-cleanup";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs"
      },
      {
        file: "dist/index.js",
        format: "es"
      }
    ],
    
    plugins: [
      nodeResolve({
        extensions: [".js", ".ts"]
      }),

      babel({
        extensions: [".js", ".ts"],
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        babelrc: false,
        presets: ["@babel/preset-typescript"],
        plugins: [
          [
            "babel-plugin-transform-rename-import",
            {
              original: "rxcore",
              replacement: "../../../packages/@vzn/dom/src/core"
            }
          ]
        ]
      }),

      cleanup({
        extensions: [".js", ".ts"]
      })
    ]
  }
];