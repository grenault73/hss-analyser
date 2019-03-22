/* eslint-env node */

const coverageIsWanted = !!process.env.HSS_COVERAGE;

module.exports = {
  roots: ["<rootDir>/src"],
  testEnvironment: "jsdom",
  collectCoverage: coverageIsWanted,
  collectCoverageFrom: [
    "src/**/*.js",
    "!**/__tests__/**",
  ],
};
