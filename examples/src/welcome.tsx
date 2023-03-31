/**
 *
 * @author wxik
 * @since 2019-06-24 15:07
 */

import React from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import {INavigation} from './interface';

interface IProps {
  navigation: INavigation;
}

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});

const Welcome = ({navigation}: IProps) => (
  <View style={styles.container}>
    <Text style={styles.welcome}>Welcome to React Native!</Text>
    <Text style={styles.instructions}>To get started, edit App.js</Text>
    <Text style={styles.instructions}>{instructions}</Text>
    <Button title={'LIGHT THEME'} onPress={() => navigation.push('rich', {theme: 'light'})} />
    <Button title={'DARK THEME'} onPress={() => navigation.push('rich', {theme: 'dark'})} />
    <Button title={'THEME BY SYSTEM'} onPress={() => navigation.push('rich')} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export {Welcome};
