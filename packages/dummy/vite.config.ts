import { defineConfig } from 'vite'
import { transformAsync, TransformOptions } from '@babel/core';
import babelPresetVzn from 'babel-preset-vzn';
import babelPresetTypescript from '@babel/preset-typescript';

export default defineConfig({
  build: {
    target: 'esnext'
  },
  plugins: [
    {
      name: 'vzn',
      enforce: 'pre',

      async transform(source, id) {
        if (!/\.[jt]sx/.test(id)) return null;
  
        const opts: TransformOptions = {
          filename: id,
          presets: [babelPresetVzn],
        };
  
        if (id.includes('tsx')) {
          opts.presets.push(babelPresetTypescript);
        }
  
        const { code, map } = await transformAsync(source, opts);
  
        return { code, map };
      },
    }
  ]
});