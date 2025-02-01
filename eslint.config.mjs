import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // 'no-console': 'warn',
      'no-debugger': 'error',
      curly: ['error', 'all'],
      'no-alert': 'error', // disallow alert(), confirm(), and prompt()
      'no-implicit-coercion': 'error', // disallow short-hand type conversions (e.g., !!value)
      'consistent-return': 'error', // ensure functions always return a consistent value
      'no-param-reassign': 'error', // prevent modifying function parameters
      'prefer-const': 'error', // enforce `const` over `let` when possible
      'no-var': 'error', // disallow `var` in favor of `let` and `const`

      // TypeScript Rules (if applicable)
      '@typescript-eslint/no-unused-vars': [
        'next',
        { argsIgnorePattern: '^_' },
      ], // Allow unused function args if prefixed with _
      // '@typescript-eslint/explicit-function-return-type': 'warn', // Warn when return types are missing
      '@typescript-eslint/no-explicit-any': 'warn', // Warn when `any` is used
      '@typescript-eslint/no-non-null-assertion': 'error', // Disallow non-null assertions (! operator)

      // Security
      'no-eval': 'error', // Disallow `eval()`
      'no-new-func': 'error', // Disallow `new Function()` (potential security risk)
      'no-shadow': 'error', // Prevent variable shadowing
      'no-use-before-define': ['error', { functions: false, classes: true }], // Prevent use before declaration
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]
