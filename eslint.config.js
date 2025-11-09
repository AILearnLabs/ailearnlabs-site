// eslint.config.js (ESM, ESLint v9)
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import astro from 'eslint-plugin-astro'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended, // <-- ESM: this is an array
]