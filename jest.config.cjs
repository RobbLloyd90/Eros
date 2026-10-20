module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/jest.styleMock.cjs',
    '\\.(svg|png|jpe?g|gif|webp)$': '<rootDir>/jest.styleMock.cjs',
  },
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  clearMocks: true,
};
