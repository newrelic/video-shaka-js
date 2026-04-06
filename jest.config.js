module.exports = {
    testEnvironment: "node",
    moduleFileExtensions: ["js", "jsx"],
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    transformIgnorePatterns: ["node_modules/(?!@shotgunjed)/"],
    moduleNameMapper: {
      "^@newrelic/video-core$": "@newrelic/video-core/__mock__.js"
    },
    testMatch: ["**/__test__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
  };