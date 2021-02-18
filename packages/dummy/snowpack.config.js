/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: {url: '/', static: true},
    src: {url: '/dist'},
  },
  routes: [
    /* Enable an SPA Fallback in development: */
    // { match: "routes", src: ".*", dest: "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    source: 'remote',
    types: true
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  plugins: [
    '@snowpack/plugin-babel'
  ]
};
