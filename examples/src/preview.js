// @flow
import React from 'react';
import {Button, StyleSheet, View, SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';

type Props = {};
type State = {};

export class Preview extends React.Component<Props, State> {
    onHome = () => {
        this.props.navigation.push('rich');
    };

    render() {
        const that = this;
        let {html, css} = that.props;
        html = `<html><head><meta name="viewport" content="user-scalable=1.0,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">${css}</head><body>${html}</body></html>`;
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.nav}>
                    <Button title={'EDITOR'} onPress={that.onHome} />
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
    }
}

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
