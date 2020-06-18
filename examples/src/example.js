/**
 * Rich Editor Example
 * @author tangzehua
 * @since 2019-06-24 14:52
 */
import React from 'react';
import {
    Appearance,
    Button,
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import {RichEditor, RichToolbar} from 'react-native-pell-rich-editor';

const initHTML = `<br/>
<center><b>Pell.js Rich Editor</b></center>
<center>React Native</center>
<br/>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png" ></br></br>
</br></br>
`;

class Example extends React.Component {
    richText = React.createRef();

    constructor(props) {
        super(props);
        const that = this;
        const theme = props.theme || Appearance.getColorScheme();
        const contentStyle = that.createContentStyle(theme);
        that.state = {theme: theme, contentStyle};
        that.onHome = ::that.onHome;
        that.save = ::that.save;
        that.onTheme = ::that.onTheme;
        that.onPressAddImage = ::that.onPressAddImage;
        that.themeChange = ::that.themeChange;
    }

    componentDidMount() {
        Appearance.addChangeListener(this.themeChange);
    }

    componentWillUnmount() {
        Appearance.removeChangeListener(this.themeChange);
    }

    /**
     * theme change to editor color
     * @param colorScheme
     */
    themeChange({colorScheme}) {
        const theme = colorScheme;
        const contentStyle = this.createContentStyle(theme);
        this.setState({theme, contentStyle});
    }

    async save() {
        // Get the data here and call the interface to save the data
        let html = await this.richText.current?.getContentHtml();
        // console.log(html);
        alert(html);
    }

    onPressAddImage() {
        // insert URL
        this.richText.current?.insertImage(
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png',
        );
        // insert base64
        // this.richText.current?.insertImage(`data:${image.mime};base64,${image.data}`);
        this.richText.current?.blurContentEditor();
    }

    onHome() {
        this.props.navigation.push('index');
    }

    createContentStyle(theme) {
        const contentStyle = {backgroundColor: '#000033', color: '#fff', placeholderColor: 'gray'};
        if (theme === 'light') {
            contentStyle.backgroundColor = '#fff';
            contentStyle.color = '#000033';
            contentStyle.placeholderColor = '#a9a9a9';
        }
        return contentStyle;
    }

    onTheme() {
        let {theme} = this.state;
        theme = theme === 'light' ? 'dark' : 'light';
        let contentStyle = this.createContentStyle(theme);
        this.setState({theme, contentStyle});
    }

    render() {
        let that = this;
        const {contentStyle, theme} = that.state;
        const {backgroundColor, color, placeholderColor} = contentStyle;
        const themeBg = {backgroundColor};
        return (
            <SafeAreaView style={[styles.container, themeBg]}>
                <View style={styles.nav}>
                    <Button title={'HOME'} onPress={that.onHome} />
                    <Button title={theme} onPress={that.onTheme} />
                    <Button title="Save" onPress={that.save} />
                </View>
                <ScrollView style={[styles.scroll, themeBg]} keyboardDismissMode={'none'}>
                    <View>
                        <View style={styles.item}>
                            <Text style={{color}}>To: </Text>
                            <TextInput
                                style={[styles.input, {color}]}
                                placeholderTextColor={placeholderColor}
                                placeholder={'stulip@126.com'}
                            />
                        </View>
                        <View style={styles.item}>
                            <Text style={{color}}>Subject: </Text>
                            <TextInput
                                style={[styles.input, {color}]}
                                placeholderTextColor={placeholderColor}
                                placeholder="Rich Editor Bug 😀"
                            />
                        </View>
                    </View>
                    <RichEditor
                        editorStyle={contentStyle}
                        containerStyle={themeBg}
                        ref={that.richText}
                        style={[styles.rich, themeBg]}
                        placeholder={'please input content'}
                        initialContentHTML={initHTML}
                    />
                </ScrollView>
                <KeyboardAvoidingView behavior={'padding'}>
                    <RichToolbar
                        style={[styles.richBar, themeBg]}
                        editor={that.richText}
                        iconTint={color}
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
    item: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#eee',
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        paddingHorizontal: 15,
    },

    input: {
        flex: 1,
    },
});

export {Example};
