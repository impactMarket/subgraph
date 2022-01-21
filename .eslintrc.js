// .eslintrc.js
module.exports = {
    env: {
        es2020: true,
        mocha: true,
        node: true
    },
    extends: ['impact-market/node', 'prettier'],
    rules: {
        'max-params': ['error', 9],
        'no-underscore-dangle': 'off',
        'prefer-destructuring': 'off'
    }
};
