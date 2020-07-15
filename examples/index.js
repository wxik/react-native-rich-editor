/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './src/App';

require('react-native').unstable_enableLogBox();
LogBox.ignoreLogs(['currentlyFocusedField']);

AppRegistry.registerComponent('examples', () => App);
