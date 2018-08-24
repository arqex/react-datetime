module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/react"
  ],
  plugins: ["react", "prettier"],
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  settings: {
    react: {
      version: "15.6.2"
    }
  },
  globals: {
    require: true,
    module: true
  },
  // Enables rules that report common problems,
  // see http://eslint.org/docs/rules/ for list
  rules: {
    // Ignore display-name errors for now
    "react/display-name": "warn",

    // Enforce the use of variables within the scope they are defined
    "block-scoped-var": "error",

    // Enforce camelcase naming convention
    camelcase: "error",

    // Require the use of === and !==
    eqeqeq: ["error", "smart"],

    // Enforce the consistent use of the radix argument when using parseInt()
    radix: "error"
  }
};
