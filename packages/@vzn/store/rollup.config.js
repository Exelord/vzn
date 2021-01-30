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
    external: ["solid-js"],
    plugins: [
      nodeResolve({
        extensions: [".js", ".ts"]
      }),

      babel({
        extensions: [".js", ".ts"],
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        babelrc: false,
        presets: ["@babel/preset-typescript", [
          "@babel/preset-env",
          {
            bugfixes: true,
            targets: {
              esmodules: true
            }
          }
        ]],
        plugins: ['@babel/plugin-proposal-class-properties'],
      }),
      
      cleanup({
        extensions: [".js", ".ts"]
      })
    ]
  }
];