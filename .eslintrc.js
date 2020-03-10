module.exports = {
  "extends": "airbnb-base",
  "rules": {
    "no-console": 0,
    "no-param-reassign": [2, {"props": false}],
    "prefer-destructuring": 0,
    "treatUndefinedAsUnspecified": true,
    "comma-dangle": 0,
    'arrow-body-style': ['error', 'as-needed', {
      requireReturnForObjectLiteral: false,
    }],
    'arrow-spacing': ['error', { before: true, after: true }],
    'no-class-assign': 'error',
    'no-const-assign': 'error',
     'no-var': 'error',
  },
  "env": {
    "commonjs": true,
    "node": true,
    "mocha": true,
    "es6": true,
  },
};