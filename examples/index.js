/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './src/App';

LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent('examples', () => App);
