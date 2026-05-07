import eslintJs from '@eslint/js';
import { configs as angularConfigs, processInlineTemplates } from 'angular-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig } from 'eslint/config';
import { configs as tsConfigs } from 'typescript-eslint';
const { configs: jsConfigs } = eslintJs;

export default defineConfig([
  {
    files: ['**/*.ts'],
    ignores: ['**/src/app/spartan/**'],
    plugins: {
      'unused-imports': unusedImports,
    },
    extends: [jsConfigs.recommended, tsConfigs.recommended, tsConfigs.stylistic, angularConfigs.tsRecommended],
    processor: processInlineTemplates,
    rules: {
      complexity: ['warn', 16],
      quotes: ['warn', 'single', { allowTemplateLiterals: true }],
      semi: ['warn', 'always'],
      'max-statements-per-line': ['warn', { max: 1 }],
      'max-params': ['warn', 4],
      'max-depth': ['warn', 4],
      'max-lines': ['warn', 500],
      'max-len': [
        'warn',
        {
          code: 125,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'object-shorthand': ['warn', 'always', { avoidQuotes: true }],
      'quote-props': ['warn', 'consistent-as-needed'],
      '@angular-eslint/use-injectable-provided-in': ['error'],
      '@angular-eslint/no-lifecycle-call': ['error'],
      '@angular-eslint/prefer-signals': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          allow: [
            'constructors',
            'methods',
            'arrowFunctions',
            'private-constructors',
            'protected-constructors',
            'overrideMethods',
            'decoratedFunctions',
          ],
        },
      ],
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['rxjs/operators'],
              message: "Don't use 'rxjs/operators' instead of 'rxjs'",
            },
          ],
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          overrides: {
            accessors: 'explicit',
            constructors: 'no-public',
            methods: 'off',
            properties: 'explicit',
            parameterProperties: 'off',
          },
        },
      ],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'adm', style: 'kebab-case' }],
      '@angular-eslint/no-implicit-take-until-destroyed': 'error',
      '@angular-eslint/prefer-signal-model': 'error',
      '@angular-eslint/prefer-host-metadata-property': ['error'],
      '@angular-eslint/prefer-output-readonly': ['error'],
      '@angular-eslint/prefer-output-emitter-ref': ['error'],
      // Needed to be off because spartan uses input renaming frequently
      '@angular-eslint/no-input-rename': ['off'],
    },
  },
  {
    files: ['**/*.html'],
    ignores: ['**/src/app/spartan/**'],
    extends: [angularConfigs.templateRecommended, angularConfigs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-self-closing-tags': ['warn'],
      '@angular-eslint/template/prefer-class-binding': 'error',
      '@angular-eslint/template/prefer-ngsrc': ['warn'],
      '@angular-eslint/template/attributes-order': ['error'],
      '@angular-eslint/template/button-has-type': ['error'],
      '@angular-eslint/template/no-duplicate-attributes': ['error'],
      '@angular-eslint/template/no-inline-styles': ['warn', { allowBindToStyle: true }],
      '@angular-eslint/template/no-interpolation-in-attributes': ['error'],
      '@angular-eslint/template/no-positive-tabindex': ['error'],
    },
  },
]);
