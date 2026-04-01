module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/jest.css.mock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-native-linear-gradient$':
      '<rootDir>/jest.linear-gradient.mock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-redux|@reduxjs|immer|redux|redux-persist|react-native-reanimated|react-native-worklets|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|@react-navigation|@react-native-community/slider|@react-native-async-storage|react-native-css-interop|nativewind)/)',
  ],
};
