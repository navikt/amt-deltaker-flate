// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ['shared-config/**'],
  extends: ['@amt-deltaker-flate/eslint-config/library.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true
  }
}
