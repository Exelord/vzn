module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    ["jsx-dom-expressions", { moduleName: 'vzn/dom' }]
  ],
  presets: ['@babel/preset-modules', '@babel/preset-typescript'],
};
