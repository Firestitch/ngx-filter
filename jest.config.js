const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./src/tsconfig.spec');

module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/app/'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  setupFilesAfterEnv: ['<rootDir>/src/test.ts'],
  collectCoverage: true,
  coverageReporters: ['html'],
  coverageDirectory: 'coverage/app',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/'
  }),
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/src/tsconfig.spec.json',
    }
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!lodash-es)"
  ],
  transform: { "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest"}
};
