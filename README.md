# @yaoxfly/eslint-plugin-expand

Custom some useful rules。

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm install eslint --save-dev
```

Next, install `@yaoxfly/eslint-plugin-expand`:

```sh
npm install @yaoxfly/eslint-plugin-expand --save-dev
```

## Usage

Add `@yaoxfly/eslint-plugin-expand` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-`prefix:

```js
{
    plugins: [
        "@yaoxfly/expand"
    ]
}
```
You can inherit all the rules

```js
  extends: [
    'plugin:@yaoxfly/expand/recommended'
  ],
```

or configure the rules you want to use under the rules section.

```js
{
    rules: {
        "@yaoxfly/expand/rule-name": 2 //0:close  1:warn 2 error
    } 
}
```

## Rules
<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                               | Description                      | 💼 | 🔧 |
| :------------------------------------------------- | :------------------------------- | :- | :- |
| [refs-judage-null](docs/rules/refs-judage-null.md) | this.$refs.xx need to judge null | ✅  | 🔧 |

<!-- end auto-generated rules list -->


