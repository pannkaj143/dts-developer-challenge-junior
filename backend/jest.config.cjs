/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts'],
  coverageDirectory: 'coverage',
  clearMocks: true,
  extensionsToTreatAsEsm: ['.ts'],
  maxWorkers: 1,
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {useESM: true}]
  },
  moduleNameMapper: {
    '^(\\./routes/.*)\\.js$': '$1.ts',
    '^(\\./middleware/.*)\\.js$': '$1.ts',
    '^(\\./docs/.*)\\.js$': '$1.ts',
    '^(\\./schemas/.*)\\.js$': '$1.ts',
    '^(\\./controllers/.*)\\.js$': '$1.ts',
    '^(\\.\\./lib/.*)\\.js$': '$1.ts',
    '^(\\.\\./schemas/.*)\\.js$': '$1.ts',
    '^(\\.\\./controllers/.*)\\.js$': '$1.ts'
  },
  setupFiles: ['<rootDir>/tests/setup-env.ts']
};

module.exports = config;
