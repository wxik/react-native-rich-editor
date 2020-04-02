/**
 * Rich Editor Example
 * @author tangzehua
 * @since 2019-06-24 14:52
 */
import React from 'react';
import {Button, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {RichEditor, RichToolbar} from 'react-native-pell-rich-editor';

const initHTML = `<br/>
<center><b>Pell.js Rich Editor</b></center>
<center>React Native</center>
<br/>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png" ></br></br>
</br></br>
`;

class Example extends React.Component {
    save = async () => {
        // Get the data here and call the interface to save the data
        let html = await this.richText.getContentHtml();
        // console.log(html);
        alert(html);
    };

    onPressAddImage = () => {
        // insert URL
        this.richText.insertImage(
                'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png',
        );
        // insert base64
        // this.richText.insertImage(`data:${image.mime};base64,${image.data}`);
        this.richText.blurContentEditor();
    };

    onHome = () => {
        this.props.navigation.push('index');
    };

    render() {
        let that = this;
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.nav}>
                    <Button title={'HOME'} onPress={that.onHome}/>
                    <Button title="Save" onPress={that.save}/>
                </View>
                <ScrollView style={styles.scroll}>
                    <RichEditor ref={(rf) => (that.richText = rf)} initialContentHTML={initHTML} style={styles.rich}/>
                </ScrollView>
                <KeyboardAvoidingView behavior={'padding'}>
                    <RichToolbar
                            style={styles.richBar}
                            getEditor={() => that.richText}
                            iconTint={'#000033'}
                            selectedIconTint={'#2095F2'}
                            selectedButtonStyle={{backgroundColor: 'transparent'}}
                            onPressAddImage={that.onPressAddImage}
                    />
                </KeyboardAvoidingView>
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
    rich: {
        minHeight: 300,
        flex: 1,
    },
    richBar: {
        height: 50,
        backgroundColor: '#F5FCFF',
    },
    scroll: {
        backgroundColor: '#ffffff',
    },
});

export {Example};
