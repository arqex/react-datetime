module.exports = {
    env: {
      browser: true
    },
    parser: 'babel-eslint',
    extends: [
      'eslint:recommended',
      'plugin:react/recommended'
    ],
    rules: {
        // Enforce the use of variables within the scope they are defined
        'block-scoped-var': 2,
        // Enforce camelcase naming convention
        'camelcase': 2,
        // Enforce consistent spacing before and after commas
        'comma-spacing': 2,
        // Enforce at least one newline at the end of files
        'eol-last': 2,
        // Require the use of === and !==
        'eqeqeq': [2, 'smart'],
        // Enforce consistent spacing before and after keywords
        'keyword-spacing': [2, { before: true, after: true }],
        // Disallow multiple empty lines
        'no-multiple-empty-lines': [2, { max: 1, maxEOF: 1, maxBOF: 0 }],
        // Enforce the consistent use of the radix argument when using parseInt()
        'radix': 2,
        // Require or disallow semicolons instead of AS
        'semi': ['error', 'never'],
        // Enforce consistent spacing before and after semicolons
        'semi-spacing': 2,
        // Enforce consistent spacing before blocks
        'space-before-blocks': 2,
        // Enforce consistent spacing inside parentheses
        // 'space-in-parens: [2, 'always'],
        // Enforce the consistent use of either backticks, double, or single quotes
        'quotes': [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        // Enforce using tabs for indentation
        'indent': [2, 2, { SwitchCase: 1 }],
        'react/prop-types': [2, { skipUndeclared: true }]
    }
};
