module.exports = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest"
  }
};