const { transformAsync } = require("@babel/core");
const babelPresetVzn = require("babel-preset-vzn");
const babelPresetTypescript = require("@babel/preset-typescript");

function normalizeAliases(alias) {
  return Array.isArray(alias)
    ? alias
    : Object.entries(alias).map(([find, replacement]) => ({
        find,
        replacement,
      }));
}

module.exports = function Plugin() {
  let projectRoot = process.cwd();

  return {
    name: "vzn",
    enforce: "pre",

    config(userConfig, te) {
      projectRoot = userConfig.root;

      // TODO: remove when fully removed from vite
      const legacyAlias = normalizeAliases(userConfig.alias || []);

      if (!userConfig.resolve) userConfig.resolve = {};
      userConfig.resolve.alias = [
        ...legacyAlias,
        ...normalizeAliases(
          (userConfig.resolve && userConfig.resolve.alias) || []
        ),
      ];

      const nestedDeps = [];

      return {
        esbuild: { include: /\.[jt]s$/ },
        optimizeDeps: {
          include: nestedDeps,
        },
      };
    },

    async transform(source, id) {
      if (!/\.[jt]sx/.test(id)) return null;

      const opts = {
        babelrc: false,
        configFile: false,
        root: projectRoot,
        filename: id,
        sourceFileName: id,
        sourceMaps: true,
        inputSourceMap: false,
        presets: [babelPresetVzn],
      };

      if (id.includes("tsx")) {
        opts.presets.push(babelPresetTypescript);
      }

      const { code, map } = await transformAsync(source, opts);

      return { code, map };
    },
  };
};
