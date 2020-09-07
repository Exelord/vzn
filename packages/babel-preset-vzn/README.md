# babel-preset-vzn
Babel preset to transform JSX into vzn runtime calls.

### Install

Via NPM

```javascript
npm install babel-preset-vzn --save-dev
```

or Yarn

```javascript
yarn add babel-preset-vzn --dev
```

### Usage

Make or update your .babelrc config file with the preset:

```javascript
{
  "presets": [
    "vzn"
  ]
}
```

Via package.json

```javascript
   ...
   "babel": {
     "presets": [
       "es2015",
       "vzn"
     ],
     "plugins": [
     ]
   },
   ...
```