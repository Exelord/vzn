const { transformAsync } = require("@babel/core");
const babelPresetVzn = require("babel-preset-vzn");
const babelPresetTypescript = require("@babel/preset-typescript");

module.exports = function Plugin() {
  return {
    name: "vzn",
    enforce: "pre",

    async transform(source, id) {
      if (!/\.[jt]sx/.test(id)) return null;

      const opts = {
        filename: id,
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
