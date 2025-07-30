import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  testPathIgnorePatterns: [
    '.*\\.e2e\\.spec\\.ts$',
    '.*\\.functional\\.spec\\.ts$'
  ],
  verbose: true,
};

export default config;
