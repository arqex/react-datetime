module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "react-hooks",
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
      version: "16.8.6"
    }
  },
  rules: {
    // Enforce prettier formatting
    "prettier/prettier": "error",

    // Help enforce hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // We do not use prop types at the moment
    "react/prop-types": "off",

    // Don't enforce "noopener noreferrer" security mitigation for now
    // https://mathiasbynens.github.io/rel-noopener
    "react/jsx-no-target-blank": "off",

    // Allow hardcoded " inline
    "react/no-unescaped-entities": "off",

    // Catch usages of non-defined (forgotten imports) as errors at compile time
    "no-undef": "error",

    // Warn if any var is used (prefer let or const)
    "no-var": "warn",

    // Warn if there is an unused variable
    "no-unused-vars": ["warn", { ignoreRestSiblings: true, args: "none" }],

    // Warn if there is a console output
    "no-console": "warn",

    // Disallow arrow functions in render functions
    "react/jsx-no-bind": "warn",

    // Disallow inconsistent returns
    "consistent-return": "error"
  }
};
