/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: {url: '/', static: true},
    src: {url: '/dist'},
  },
  routes: [
    /* Enable an SPA Fallback in development: */
    { match: "routes", src: ".*", dest: "/index.html"},
  ],
  optimize: {
    // preload: true,
    bundle: true,
    manifest: true,
    minify: true,
    splitting: true,
    treeshake: true,
    target: "es2020"
  },
  packageOptions: {
    types: true
  },
  devOptions: {
    open: 'none',
  },
  buildOptions: {
    clean: true
  },
  plugins: [
    '@snowpack/plugin-typescript',
    [
      '@snowpack/plugin-babel',
      {
        transformOptions: {
          presets: ["vzn", "@babel/preset-typescript"],
        }
      }
    ]
  ]
};
