/**
 * Rich Editor Example
 * @author tangzehua
 * @since 2019-06-24 14:52
 */
import React from 'react';
import {
    Appearance,
    Button,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import KeyboardSpacer from './helper/KeyboardSpacer';
import {actions, defaultActions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {InsertLinkModal} from './insertLink';
import {EmojiView} from './emoji';

const imageList = [
    'https://img.lesmao.vip/k/h256/R/MeiTu/1293.jpg',
    'https://pbs.twimg.com/profile_images/1242293847918391296/6uUsvfJZ.png',
    'https://img.lesmao.vip/k/h256/R/MeiTu/1297.jpg',
    'https://img.lesmao.vip/k/h256/R/MeiTu/1292.jpg',
];
const initHTML = `<br/>
<center><b onclick="_.sendEvent('TitleClick')" id="title" contenteditable="false">Rich Editor</b></center>
<center>
<a href="https://github.com/wxik/react-native-rich-editor">React Native</a>
<span>And</span>
<a href="https://github.com/wxik/flutter-rich-editor">Flutter</a>
</center>
<br/>
<img src="${imageList[0]}" onclick="_.sendEvent('ImgClick')" contenteditable="false"/>
<br/>Click the picture to switch<br/><br/>
`;

const phizIcon = require('./assets/phiz.png');
const htmlIcon = require('./assets/h5.png');
const videoIcon = require('./assets/video.png');
const strikethrough = require('./assets/strikethrough.png');
const keyboardIcon = require('./assets/keyboard.png');
const bulletIcon = require('./assets/bullet.png');

class Example extends React.Component {
    richText = React.createRef();
    linkModal = React.createRef();

    constructor(props) {
        super(props);
        const that = this;
        const theme = props.theme || Appearance.getColorScheme();
        const contentStyle = that.createContentStyle(theme);
        that.state = {theme: theme, contentStyle, emojiVisible: false, disabled: false};
        that.editorFocus = false;
        that.onHome = ::that.onHome;
        that.save = ::that.save;
        that.onTheme = ::that.onTheme;
        that.onPressAddImage = ::that.onPressAddImage;
        that.onInsertLink = ::that.onInsertLink;
        that.onLinkDone = ::that.onLinkDone;
        that.themeChange = ::that.themeChange;
        that.handleChange = ::that.handleChange;
        that.handleHeightChange = ::that.handleHeightChange;
        that.insertEmoji = ::that.insertEmoji;
        that.insertHTML = ::that.insertHTML;
        that.insertVideo = ::that.insertVideo;
        that.handleEmoji = ::that.handleEmoji;
        that.onDisabled = ::that.onDisabled;
        that.editorInitializedCallback = ::that.editorInitializedCallback;
    }

    componentDidMount() {
        Appearance.addChangeListener(this.themeChange);
        Keyboard.addListener('keyboardDidShow', this.onKeyShow);
        Keyboard.addListener('keyboardDidHide', this.onKeyHide);
    }

    componentWillUnmount() {
        Appearance.removeChangeListener(this.themeChange);
        Keyboard.removeListener('keyboardDidShow', this.onKeyShow);
        Keyboard.removeListener('keyboardDidHide', this.onKeyHide);
    }

    onKeyHide = () => {};

    onKeyShow = () => {
        TextInput.State.currentlyFocusedInput() && this.setState({emojiVisible: false});
    };

    editorInitializedCallback() {
        this.richText.current?.registerToolbar(function (items) {
            console.log('Toolbar click, selected items (insert end callback):', items);
        });
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

    /**
     * editor change data
     * @param {string} html
     */
    handleChange(html) {
        // console.log('editor data:', html);
    }

    /**
     * editor height change
     * @param {number} height
     */
    handleHeightChange(height) {
        console.log('editor height change:', height);
    }

    insertEmoji(emoji) {
        this.richText.current?.insertText(emoji);
        this.richText.current?.blurContentEditor();
    }

    handleEmoji() {
        const {emojiVisible} = this.state;
        Keyboard.dismiss();
        this.richText.current?.blurContentEditor();
        this.setState({emojiVisible: !emojiVisible});
    }

    insertVideo() {
        this.richText.current?.insertVideo(
            'https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4',
            'width: 50%;',
        );
    }

    insertHTML() {
        this.richText.current?.insertHTML(
            `<span onclick="alert(2)" style="color: blue; padding:0 10px;" contenteditable="false">HTML</span>`,
        );
    }

    onPressAddImage() {
        // insert URL
        this.richText.current?.insertImage(
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png',
            'background: gray;',
        );
        // insert base64
        // this.richText.current?.insertImage(`data:${image.mime};base64,${image.data}`);
    }

    onInsertLink() {
        // this.richText.current?.insertLink('Google', 'http://google.com');
        this.linkModal.current?.setModalVisible(true);
    }

    onLinkDone({title, url}) {
        this.richText.current?.insertLink(title, url);
    }

    onHome() {
        this.props.navigation.push('index');
    }

    createContentStyle(theme) {
        // Can be selected for more situations (cssText or contentCSSText).
        const contentStyle = {
            backgroundColor: '#000033',
            color: '#fff',
            placeholderColor: 'gray',
            // cssText: '#editor {background-color: #f3f3f3}', // initial valid
            contentCSSText: 'font-size: 16px; min-height: 200px; height: 100%;', // initial valid
        };
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

    onDisabled() {
        this.setState({disabled: !this.state.disabled});
    }

    handlePaste = data => {
        console.log('Paste:', data);
    };

    handleKeyUp = data => {
        // console.log('KeyUp:', data);
    };

    handleKeyDown = data => {
        // console.log('KeyDown:', data);
    };

    handleMessage = ({type, id, data}) => {
        let index = 0;
        switch (type) {
            case 'ImgClick':
                index = this.i_tempIndex || 1;
                this.i_tempIndex = index + 1 >= imageList.length ? 0 : index + 1;
                this.richText.current?.commandDOM(`$('#${id}').src="${imageList[index]}"`);
                break;
            case 'TitleClick':
                index = this._tempIndex || 0;
                const color = ['red', 'blue', 'gray', 'yellow', 'coral'][index];
                this._tempIndex = index + 1 >= color.length ? 0 : index + 1;

                // command: $ = document.querySelector
                this.richText.current?.commandDOM(`$('#${id}').style.color='${color}'`);
                break;
            case 'SwitchImage':
                break;
        }
        console.log('onMessage', type, id, data);
    };

    handleFocus = () => {
        this.editorFocus = true;
    };

    handleBlur = () => {
        this.editorFocus = false;
    };

    handleKeyboard = () => {
        const editor = this.richText.current;
        if (editor.isKeyboardOpen) {
            editor.dismissKeyboard();
        } else {
            editor.focusContentEditor();
        }
    };

    render() {
        let that = this;
        const {contentStyle, theme, emojiVisible, disabled} = that.state;
        const {backgroundColor, color, placeholderColor} = contentStyle;
        const themeBg = {backgroundColor};
        return (
            <SafeAreaView style={[styles.container, themeBg]}>
                <StatusBar barStyle={theme !== 'dark' ? 'dark-content' : 'light-content'} />
                <InsertLinkModal
                    placeholderColor={placeholderColor}
                    color={color}
                    backgroundColor={backgroundColor}
                    onDone={that.onLinkDone}
                    ref={that.linkModal}
                />
                <View style={styles.nav}>
                    <Button title={'HOME'} onPress={that.onHome} />
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
                        <View style={styles.item}>
                            <Button title={theme} onPress={that.onTheme} />
                            <Button title={disabled ? 'enable' : 'disable'} onPress={that.onDisabled} />
                        </View>
                    </View>
                    <RichEditor
                        // initialFocus={true}
                        disabled={disabled}
                        editorStyle={contentStyle} // default light style
                        containerStyle={themeBg}
                        ref={that.richText}
                        style={[styles.rich, themeBg]}
                        placeholder={'please input content'}
                        initialContentHTML={initHTML}
                        editorInitializedCallback={that.editorInitializedCallback}
                        onChange={that.handleChange}
                        onHeightChange={that.handleHeightChange}
                        onPaste={that.handlePaste}
                        onKeyUp={that.handleKeyUp}
                        onKeyDown={that.handleKeyDown}
                        onMessage={that.handleMessage}
                        onFocus={that.handleFocus}
                        onBlur={that.handleBlur}
                        pasteAsPlainText={true}
                    />
                </ScrollView>
                <View style={styles.Keyboard}>
                    <TouchableOpacity onPress={that.handleKeyboard} style={{padding: 5}}>
                        <Image source={keyboardIcon} />
                    </TouchableOpacity>
                    <KeyboardSpacer />
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <RichToolbar
                        style={[styles.richBar, themeBg]}
                        editor={that.richText}
                        disabled={disabled}
                        iconTint={color}
                        selectedIconTint={'#2095F2'}
                        disabledIconTint={'#8b8b8b'}
                        onPressAddImage={that.onPressAddImage}
                        onInsertLink={that.onInsertLink}
                        iconSize={40} // default 50
                        actions={[
                            'insertVideo',
                            ...defaultActions,
                            actions.checkboxList,
                            actions.setStrikethrough,
                            actions.heading1,
                            actions.heading4,
                            actions.removeFormat,
                            'insertEmoji',
                            'insertHTML',
                        ]} // default defaultActions
                        iconMap={{
                            insertEmoji: phizIcon,
                            [actions.checkboxList]: bulletIcon,
                            [actions.removeFormat]: ({tintColor}) => (
                                <Text style={[styles.tib, {color: tintColor}]}>C</Text>
                            ),
                            [actions.setStrikethrough]: strikethrough,
                            [actions.heading1]: ({tintColor}) => (
                                <Text style={[styles.tib, {color: tintColor}]}>H1</Text>
                            ),
                            [actions.heading4]: ({tintColor}) => (
                                <Text style={[styles.tib, {color: tintColor}]}>H3</Text>
                            ),
                            insertHTML: htmlIcon,
                            insertVideo: videoIcon,
                        }}
                        insertEmoji={that.handleEmoji}
                        insertHTML={that.insertHTML}
                        insertVideo={that.insertVideo}
                    />
                    {emojiVisible && <EmojiView onSelect={that.insertEmoji} />}
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
        borderColor: '#e8e8e8',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    scroll: {
        backgroundColor: '#ffffff',
    },
    item: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#e8e8e8',
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        paddingHorizontal: 15,
    },

    input: {
        flex: 1,
    },

    tib: {
        textAlign: 'center',
        color: '#515156',
    },

    Keyboard: {
        position: 'absolute',
        bottom: 50 + getBottomSpace(),
        right: 8,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export {Example};
