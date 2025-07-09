---
title: 代码风格校验配置
author: EricYangXD
date: '2025-07-09'
meta:
  - name: keywords
    content: 代码风格校验,eslint,prettier,husky
---

## 简介

本文档用于记录代码风格校验的配置，包括编辑器配置、代码风格校验配置、代码风格格式化配置等。一般需要结合 babel、eslint、prettier 等工具（包括 npm 依赖和 vscode 插件等）一起使用。参考[代码风格检查&license 声明添加](../DevelopmentSkills/前端常用开发技巧.md#代码风格检查license-声明添加)。

## .editorconfig

基础的编辑器配置，可以参考 [EditorConfig 官方文档](https://editorconfig.org/)。

## .eslintrc

在 .eslintrc 文件中使用自定义 rules 以及现有的规则集，比如 airbnb 的`npm install --save-dev babel-preset-airbnb`。比如对于 vue3：`npm add --dev @vue/eslint-config-typescript`，结合`vue-tsc`使用 lint：`"lint:fix": "vue-tsc --noEmit --noEmitOnError --pretty && eslint --ext .ts,.vue src --fix"`，如果有强制校验则需结合`husky`+`lint-staged`+`commitlint`等。

```js
module.exports = {
  globals: {
    Nullable: true,
  },
  extends: ['airbnb', 'eslint:recommended', '@mine/rules/vue3'], // 单个扩展时可以省略中括号
  rules: {
    // Note: you must disable the base rule as it can report incorrect errors
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
};
```

## .prettierrc

大多数时候只需要配置几行即可，具体的配置可以参考 [Prettier 官方文档](https://prettier.io/docs/en/options.html)。在[这里](https://prettier.io/playground/)可以在线上配置，然后复制到 .prettierrc 文件中。

```js
{
  "endOfLine": "lf",
  "bracketSpacing": false,
  "arrowParens": "always",
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "overrides": [
    {
      "files": ["*.ats", "*.cts", "*.mts", "*.ts"],
      "options": {
        "tabWidth": 2,
        "semi": true,
        "singleQuote": false,
        "bracketSpacing": false,
        "printWidth": 120,
        "proseWrap": "always",
        "quoteProps": "as-needed",
        "useTabs": false,
        "trailingComma": "all",
        "arrowParens": "avoid",
        "endOfLine": "lf"
      }
    },
    {
      "files": ["*.bash", "*.sh", "*.zsh"],
      "options": {
        "shellDefaultIndents": false
      }
    },
    {
      "files": ["*.cjs", "*.js"],
      "options": {
        "semi": true,
        "singleQuote": false,
        "jsxSingleQuote": false,
        "trailingComma": "none",
        "bracketSpacing": true,
        "arrowParens": "avoid",
        "printWidth": 80,
        "tabWidth": 4,
        "useTabs": false,
        "endOfLine": "auto"
      }
    },
    {
      "files": [
        "*.har",
        "*.jsb2",
        "*.jsb3",
        "*.json",
        ".babelrc",
        ".eslintrc",
        ".prettierrc",
        ".stylelintrc",
        "apple-app-site-association",
        "bowerrc",
        "jest.config"
      ],
      "options": {
        "printWidth": 80,
        "tabWidth": 2,
        "useTabs": false,
        "semi": false,
        "singleQuote": false,
        "bracketSpacing": true,
        "arrowParens": "avoid",
        "trailingComma": "none",
        "endOfLine": "lf"
      }
    },
    {
      "files": ["*.htm", "*.html", "*.ng", "*.sht", "*.shtm", "*.shtml"],
      "options": {
        "printWidth": 80,
        "tabWidth": 2,
        "useTabs": false,
        "semi": false,
        "singleQuote": false,
        "bracketSpacing": true,
        "arrowParens": "avoid",
        "trailingComma": "none",
        "endOfLine": "lf",
        "overrides": [
          {
            "files": ["*.html"],
            "options": {
              "proseWrap": "always",
              "quoteProps": "as-needed",
              "htmlWhitespaceSensitivity": "ignore",
              "overrides": [
                {
                  "files": ["*.html"],
                  "options": {
                    "printWidth": 80,
                    "tabWidth": 2,
                    "useTabs": false,
                    "semi": false,
                    "singleQuote": false,
                    "bracketSpacing": true,
                    "arrowParens": "avoid",
                    "trailingComma": "none",
                    "endOfLine": "lf"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      "files": ["*.markdown", "*.md"],
      "options": {
        "proseWrap": "always",
        "singleQuote": false,
        "semi": false,
        "quoteProps": "as-needed",
        "tabWidth": 2,
        "arrowParens": "avoid",
        "htmlWhitespaceSensitivity": "ignore",
        "endOfLine": "auto",
        "bracketSpacing": true,
        "useTabs": false,
        "printWidth": 120
      }
    }
  ]
}
```

basic demo：

```json
{
  "arrowParens": "always",
  "bracketSameLine": false,
  "objectWrap": "preserve",
  "bracketSpacing": false,
  "semi": true,
  "experimentalOperatorPosition": "end",
  "experimentalTernaries": false,
  "singleQuote": true,
  "jsxSingleQuote": false,
  "quoteProps": "as-needed",
  "trailingComma": "all",
  "singleAttributePerLine": true,
  "htmlWhitespaceSensitivity": "css",
  "vueIndentScriptAndStyle": false,
  "proseWrap": "preserve",
  "insertPragma": false,
  "printWidth": 120,
  "requirePragma": false,
  "tabWidth": 2,
  "useTabs": false,
  "embeddedLanguageFormatting": "auto"
}
```

## .eslintignore

忽略部分文件格式校验

```bash
*.sh
node_modules
*.md
*.woff
*.ttf
.vscode
.idea
dist
/public
/docs
.husky
.local
/bin
Dockerfile
/src/api/diy/
/src/views/diy/
node_modules/.pnpm
```

## .browserslistrc

设置浏览器兼容性

```bash
> 1%
last 2 versions
not dead
```

## vue.config.js

```js
const { getConfig } = require('vue');
const { merge } = require('webpack-merge');

const defaultConfig = getConfig({
  title: '权限管理',
  useEsbuild: true,
});

module.exports = merge(defaultConfig, {
  outputDir: 'dist',
  devServer: {
    host: 'localhost',
  },
  configureWebpack: {
    output: {
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].js',
    },
  },
});
```

## tailwind.config.js

```js
const lineClampPlugin = require('@tailwindcss/line-clamp');

module.exports = {
  plugins: [lineClampPlugin],
  theme: {
    extend: {
      height: {
        header: '44px',
        breadcrumb: '20px',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
```

## tsconfig.json

```js
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "jsx": "preserve",
    "importHelpers": true,
    "moduleResolution": "node",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "sourceMap": true,
    "pretty": true,
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": true,
    // "suppressImplicitAnyIndexErrors": true,
    "strictPropertyInitialization": false,
    "downlevelIteration": true,
    "noUnusedLocals": false,
    "noImplicitAny": false,
    "noImplicitThis": true,
    "removeComments": false,
    "strictFunctionTypes": false,
    "baseUrl": ".",
    "types": [
      "webpack-env"
    ],
    "typeRoots": ["./node_modules/@types/", "./types"],
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "lib": [
      "esnext",
      "dom",
      "dom.iterable",
      "scripthost"
    ]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "types/**/*.d.ts",
    "types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```
