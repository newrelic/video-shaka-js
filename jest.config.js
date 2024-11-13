module.exports = {
    testEnvironment: "node",
    moduleFileExtensions: ["js", "jsx"],
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    transformIgnorePatterns: ["node_modules/(?!@shotgunjed)/"],
  
    testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
  };