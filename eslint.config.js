// ESLint flat config file for ESLint v9.x
import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-unused-vars': ['warn', { 'argsIgnorePattern': 'next' }],
      'no-console': ['warn', { allow: ['error', 'info', 'warn'] }]
    }
  }
];
