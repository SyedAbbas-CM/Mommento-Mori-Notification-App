module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // Disable the most common errors you're seeing
    'no-trailing-spaces': 'off',
    'comma-dangle': 'off',
    'curly': 'off',
    'no-alert': 'off',
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'eol-last': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'prettier/prettier': 'off',
    'react/no-unstable-nested-components': 'off'
  },
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['module:metro-react-native-babel-preset'],
    },
  },
};