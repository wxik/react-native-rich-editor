/**
 * Rich Editor Example
 * @author tangzehua
 * @since 2019-06-24 14:52
 */
import React from 'react';
import {
    Appearance,
    Button,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import {actions, getContentCSS, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {XMath} from '@wxik/core';
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
<div><center><img src="${imageList[0]}" onclick="_.sendEvent('ImgClick')" contenteditable="false" height="170px"/></center></div>
<pre type="javascript"><code>const editor = ReactNative;</code><code>console.log(editor);</code></pre>
<br/>Click the picture to switch<br/><br/>
`;

const phizIcon = require('./assets/phiz.png');
const htmlIcon = require('./assets/html.png');

class Example extends React.Component {
    richText = React.createRef();
    linkModal = React.createRef();
    scrollRef = React.createRef();

    constructor(props) {
        super(props);
        const that = this;
        const theme = props.theme || Appearance.getColorScheme();
        const contentStyle = that.createContentStyle(theme);
        that.richHTML = '';
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
            // console.log('Toolbar click, selected items (insert end callback):', items);
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
        this.props.navigation.push('preview', {html, css: getContentCSS()});
    }

    /**
     * editor change data
     * @param {string} html
     */
    handleChange(html) {
        this.richHTML = html;
        this.setState({a: Math.random});
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

    fontSize = () => {
        // 1=  10px, 2 = 13px, 3 = 16px, 4 = 18px, 5 = 24px, 6 = 32px, 7 = 48px;
        const size = [1, 2, 3, 4, 5, 6, 7];
        this.richText.current?.setFontSize(size[XMath.random(size.length - 1)]);
    };

    foreColor = () => {
        this.richText.current?.setForeColor('blue');
    };

    hiliteColor = () => {
        this.richText.current?.setHiliteColor('red');
    };

    insertHTML() {
        // this.richText.current?.insertHTML(
        //     `<span onclick="alert(2)" style="color: blue; padding:0 10px;" contenteditable="false">HTML</span>`,
        // );
        this.richText.current?.insertHTML(
            `<div style="padding:10px 0;" contentEditable="false">
                <iframe  width="100%" height="220"  src="https://www.youtube.com/embed/6FrNXgXlCGA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>`,
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
            backgroundColor: '#2e3847',
            color: '#fff',
            caretColor: 'red', // initial valid// initial valid
            placeholderColor: 'gray',
            // cssText: '#editor {background-color: #f3f3f3}', // initial valid
            contentCSSText: 'font-size: 16px; min-height: 200px;', // initial valid
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

    /**
     * @deprecated Android keyCode 229
     * @param data
     */
    handleKeyUp = data => {
        // console.log('KeyUp:', data);
    };

    /**
     * @deprecated Android keyCode 229
     * @param data
     */
    handleKeyDown = data => {
        // console.log('KeyDown:', data);
    };

    /**
     *
     * @param data
     * @param {string} inputType
     */
    onInput = ({data, inputType}) => {
        // console.log(inputType, data)
    }

    handleMessage = ({type, id, data}) => {
        let index = 0;
        switch (type) {
            case 'ImgClick':
                this.richText.current?.commandDOM(`$('#${id}').src="${imageList[XMath.random(imageList.length - 1)]}"`);
                break;
            case 'TitleClick':
                const color = ['red', 'blue', 'gray', 'yellow', 'coral'];

                // command: $ = document.querySelector
                this.richText.current?.commandDOM(`$('#${id}').style.color='${color[XMath.random(color.length - 1)]}'`);
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

    handleCursorPosition = scrollY => {
        // Positioning scroll bar
        this.scrollRef.current.scrollTo({y: scrollY - 30, animated: true});
    };

    render() {
        let that = this;
        const {contentStyle, theme, emojiVisible, disabled} = that.state;
        const {backgroundColor, color, placeholderColor} = contentStyle;
        const dark = theme === 'dark';
        return (
            <SafeAreaView style={[styles.container, dark && styles.darkBack]}>
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
                    <Button title="Preview" onPress={that.save} />
                </View>
                <ScrollView
                    style={[styles.scroll, dark && styles.scrollDark]}
                    keyboardDismissMode={'none'}
                    ref={that.scrollRef}
                    nestedScrollEnabled={true}
                    scrollEventThrottle={20}>
                    <View style={[styles.topVi, dark && styles.darkBack]}>
                        <View style={styles.item}>
                            <Text style={{color}}>To: </Text>
                            <TextInput
                                autoCorrect={false}
                                style={[styles.input, {color}]}
                                placeholderTextColor={placeholderColor}
                                placeholder={'stulip@126.com'}
                            />
                        </View>
                        <View style={styles.item}>
                            <Text style={{color}}>Subject: </Text>
                            <TextInput
                                autoCorrect={false}
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
                    <RichToolbar
                        style={[styles.richBar, dark && styles.richBarDark]}
                        flatContainerStyle={styles.flatStyle}
                        editor={that.richText}
                        disabled={disabled}
                        selectedIconTint={'#2095F2'}
                        disabledIconTint={'#bfbfbf'}
                        onPressAddImage={that.onPressAddImage}
                        onInsertLink={that.onInsertLink}
                    />
                    <RichEditor
                        // initialFocus={true}
                        disabled={disabled}
                        editorStyle={contentStyle} // default light style
                        ref={that.richText}
                        style={styles.rich}
                        useContainer={true}
                        initialHeight={400}
                        // containerStyle={{borderRadius: 24}}
                        placeholder={'please input content'}
                        initialContentHTML={initHTML}
                        editorInitializedCallback={that.editorInitializedCallback}
                        onChange={that.handleChange}
                        onHeightChange={that.handleHeightChange}
                        onPaste={that.handlePaste}
                        onKeyUp={that.handleKeyUp}
                        onKeyDown={that.handleKeyDown}
                        onInput={that.onInput}
                        onMessage={that.handleMessage}
                        onFocus={that.handleFocus}
                        onBlur={that.handleBlur}
                        onCursorPosition={that.handleCursorPosition}
                        pasteAsPlainText={true}
                    />
                </ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <RichToolbar
                        style={[styles.richBar, dark && styles.richBarDark]}
                        flatContainerStyle={styles.flatStyle}
                        editor={that.richText}
                        disabled={disabled}
                        // iconTint={color}
                        selectedIconTint={'#2095F2'}
                        disabledIconTint={'#bfbfbf'}
                        onPressAddImage={that.onPressAddImage}
                        onInsertLink={that.onInsertLink}
                        // iconSize={24}
                        // iconGap={10}
                        actions={[
                            actions.undo,
                            actions.redo,
                            actions.insertVideo,
                            actions.insertImage,
                            actions.setStrikethrough,
                            actions.checkboxList,
                            actions.insertOrderedList,
                            actions.blockquote,
                            actions.alignLeft,
                            actions.alignCenter,
                            actions.alignRight,
                            actions.code,
                            actions.line,

                            actions.foreColor,
                            actions.hiliteColor,
                            actions.heading1,
                            actions.heading4,
                            'insertEmoji',
                            'insertHTML',
                            'fontSize',
                        ]} // default defaultActions
                        iconMap={{
                            insertEmoji: phizIcon,
                            [actions.foreColor]: ({tintColor}) => <Text style={[styles.tib, {color: 'blue'}]}>FC</Text>,
                            [actions.hiliteColor]: ({tintColor}) => (
                                <Text style={[styles.tib, {color: tintColor, backgroundColor: 'red'}]}>BC</Text>
                            ),
                            [actions.heading1]: ({tintColor}) => (
                                <Text style={[styles.tib, {color: tintColor}]}>H1</Text>
                            ),
                            [actions.heading4]: ({tintColor}) => (
                                <Text style={[styles.tib, {color: tintColor}]}>H3</Text>
                            ),
                            insertHTML: htmlIcon,
                        }}
                        insertEmoji={that.handleEmoji}
                        insertHTML={that.insertHTML}
                        insertVideo={that.insertVideo}
                        fontSize={that.fontSize}
                        foreColor={that.foreColor}
                        hiliteColor={that.hiliteColor}
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
        backgroundColor: '#efefef',
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5,
    },
    rich: {
        minHeight: 300,
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#e3e3e3',
    },
    topVi: {
        backgroundColor: '#fafafa',
    },
    richBar: {
        borderColor: '#efefef',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    richBarDark: {
        backgroundColor: '#191d20',
        borderColor: '#696969',
    },
    scroll: {
        backgroundColor: '#ffffff',
    },
    scrollDark: {
        backgroundColor: '#2e3847',
    },
    darkBack: {
        backgroundColor: '#191d20',
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

    flatStyle: {
        paddingHorizontal: 12,
    },
});

export {Example};
