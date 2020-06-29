module.exports = {
  preset: 'ts-jest',
  verbose: true,
  roots: ['./src'],
  testPathIgnorePatterns: ['./src/types/', './dist'],
  // "coverageThreshold": {
  //   "./src/**/*": {
  //     "branches": 50,
  //     "functions": 40
  //     // "statements": 1,
  //     // "lines": 1
  //   }
  // },
  // "collectCoverageFrom": [
  //   "./src/**/*.ts",
  //   "!**/types/**/*",
  //   "!**/config/**/*"
  // ],
  coverageDirectory: './coverage',
  // "collectCoverage": true,
  testURL: 'http://localhost:8055',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
