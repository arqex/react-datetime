module.exports = {
  env: {
    browser: true
  },
  globals: {
    require: true,
    module: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true
    }
  },
  plugins: ['prettier']
}
