import React, {FC} from 'react';
import {Button, SafeAreaView, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {INavigation} from './interface';

interface IProps {
  navigation: INavigation;
  html?: string;
  css?: string;
}

export const Preview: FC<IProps> = ({html, css, navigation}) => {
  html = `<html><head><meta name="viewport" content="user-scalable=1.0,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">${css}</head><body>${html}</body></html>`;
  const handleHome = () => {
    navigation.push('rich');
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.nav}>
        <Button title={'EDITOR'} onPress={handleHome} />
      </View>
      <WebView
        useWebKit={true}
        scrollEnabled={false}
        hideKeyboardAccessoryView={true}
        keyboardDisplayRequiresUserAction={false}
        originWhitelist={['*']}
        dataDetectorTypes={'none'}
        domStorageEnabled={false}
        bounces={false}
        javaScriptEnabled={true}
        source={{html}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
});
