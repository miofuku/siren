module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^axios$': '<rootDir>/src/__mocks__/axios.js'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};