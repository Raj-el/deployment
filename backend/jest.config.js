export default {
  testEnvironment: 'node',
  transform: {},
  roots: ['<rootDir>/test', '<rootDir>/test'],
  setupFiles: ['<rootDir>/test/setupEnv.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
