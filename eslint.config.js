// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      complexity: ["warn", 16],
      quotes: ["warn", "single", { allowTemplateLiterals: true }],
      semi: ["warn", "always"],
      "max-statements-per-line": ["warn", { max: 1 }],
      "max-params": ["warn", 4],
      "max-depth": ["warn", 4],
      "max-lines": ["warn", 500],
      "max-len": [
        "warn",
        {
          code: 125,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      "object-shorthand": ["warn", "always", { avoidQuotes: true }],
      "quote-props": ["warn", "consistent-as-needed"],
      "@angular-eslint/prefer-on-push-component-change-detection": ["error"],
      "@angular-eslint/use-injectable-provided-in": ["error"],
      "@angular-eslint/no-lifecycle-call": ["error"],
      "@angular-eslint/prefer-signals": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      "@typescript-eslint/no-empty-function": [
        "error",
        {
          allow: [
            "constructors",
            "methods",
            "arrowFunctions",
            "private-constructors",
            "protected-constructors",
            "overrideMethods",
            "decoratedFunctions",
          ],
        },
      ],
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["rxjs/operators"],
              message: "Don't use 'rxjs/operators' instead of 'rxjs'",
            },
          ],
        },
      ],
      // Needed to be off because spartan uses input renaming frequently
      "@angular-eslint/no-input-rename": ["off"],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/prefer-self-closing-tags": ["warn"],
      "@angular-eslint/template/prefer-ngsrc": ["warn"],
      "@angular-eslint/template/attributes-order": ["error"],
      "@angular-eslint/template/button-has-type": ["error"],
      "@angular-eslint/template/no-duplicate-attributes": ["error"],
      "@angular-eslint/template/no-inline-styles": ["warn"],
      "@angular-eslint/template/no-interpolation-in-attributes": ["error"],
      "@angular-eslint/template/no-positive-tabindex": ["error"],
    },
  },
]);
