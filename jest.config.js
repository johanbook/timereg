/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: ["./src/**"],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 90,
      statements: 10,
    },
  },
};
