const path = require('path');
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-function-bind'],
    [
      'module-resolver',
      {
        alias: {
          'react-native-pell-rich-editor': path.resolve('..'),
        },
      },
    ],
  ],
};
