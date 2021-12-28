/**
 * Rich Editor Example
 * @deprecated Please refer to example.hooks.js
 * @author wxik
 * @since 2019-06-24 14:52
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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


function createContentStyle(theme) {
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

export function Example(props) {
    let {theme: initTheme = Appearance.getColorScheme(), navigation} = props;
    let richText = useRef();
    let linkModal = useRef();
    let scrollRef = useRef();
    // save on html
    let contentRef = useRef(initHTML);

    let [theme, setTheme] = useState(initTheme);
    let [emojiVisible, setEmojiVisible] = useState(false);
    let [disabled, setDisable] = useState(false);
    let contentStyle = useMemo(()=> createContentStyle(theme), [theme]);

    // on save to preview
    let handleSave = useCallback(() => {
        navigation.push('preview', {html: contentRef.current, css: getContentCSS()});
    }, []);

    let handleHome = useCallback(() => {
        navigation.push('index');
    }, []);

    // editor change data
    let handleChange = useCallback((html) => {
        // save html to content ref;
        contentRef.current = html;
    }, [])

    // theme change to editor color
    let themeChange = useCallback(({colorScheme}) => {
        setTheme(colorScheme);
    }, []);

    let onTheme = useCallback(() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }, [theme]);

    let onDisabled = useCallback(() => {
        setDisable(!disabled);
    }, [disabled]);

    let editorInitializedCallback = useCallback(() => {
        richText.current.registerToolbar(function (items) {
            // console.log('Toolbar click, selected items (insert end callback):', items);
        });
    }, []);

    let onKeyHide = useCallback(() => {

    }, []);

    let onKeyShow = useCallback(() => {
        TextInput.State.currentlyFocusedInput() && setEmojiVisible(false)
    }, []);

    // editor height change
    let handleHeightChange = useCallback((height) => {
        console.log('editor height change:', height);
    }, []);

    let handleInsertEmoji = useCallback((emoji) => {
        richText.current?.insertText(emoji);
        richText.current?.blurContentEditor();
    }, [])

    let handleEmoji = useCallback(() => {
        Keyboard.dismiss();
        richText.current?.blurContentEditor();
        setEmojiVisible(!emojiVisible)
    }, [emojiVisible]);

    let handleInsertVideo = useCallback(() => {
        richText.current?.insertVideo(
            'https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4',
            'width: 50%;',
        );
    }, []);

    let handleInsertHTML = useCallback(() => {
        // this.richText.current?.insertHTML(
        //     `<span onclick="alert(2)" style="color: blue; padding:0 10px;" contenteditable="false">HTML</span>`,
        // );
        richText.current?.insertHTML(
            `<div style="padding:10px 0;" contentEditable="false">
                <iframe  width="100%" height="220"  src="https://www.youtube.com/embed/6FrNXgXlCGA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>`,
        );
    }, []);

    let onPressAddImage = useCallback(() => {
        // insert URL
        richText.current?.insertImage(
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png',
            'background: gray;',
        );
        // insert base64
        // this.richText.current?.insertImage(`data:${image.mime};base64,${image.data}`);
    }, []);

    let onInsertLink = useCallback(() => {
        // this.richText.current?.insertLink('Google', 'http://google.com');
        linkModal.current?.setModalVisible(true);
    }, []);

    let onLinkDone = useCallback(({title, url}) => {
        richText.current?.insertLink(title, url);
    }, []);

    let handleFontSize = useCallback(() => {
        // 1=  10px, 2 = 13px, 3 = 16px, 4 = 18px, 5 = 24px, 6 = 32px, 7 = 48px;
        let size = [1, 2, 3, 4, 5, 6, 7];
        richText.current?.setFontSize(size[XMath.random(size.length - 1)]);
    }, []);

    let handleForeColor = useCallback(() => {
        richText.current?.setForeColor('blue');
    }, []);

    let handleHiliteColor = useCallback(() => {
        richText.current?.setHiliteColor('red');
    }, []);

    let handlePaste = useCallback((data) => {
        console.log('Paste:', data);
    }, []);

    // @deprecated Android keyCode 229
    let handleKeyUp = useCallback((data) => {
        // console.log('KeyUp:', data);
    }, [])

    // @deprecated Android keyCode 229
    let handleKeyDown = useCallback((data) => {
        // console.log('KeyDown:', data);
    }, [])

    let handleInput = useCallback(({data, inputType}) => {
        // console.log(inputType, data)
    }, []);

    let handleMessage = useCallback(({type, id, data}) => {
        let index = 0;
        switch (type) {
            case 'ImgClick':
                richText.current?.commandDOM(`$('#${id}').src="${imageList[XMath.random(imageList.length - 1)]}"`);
                break;
            case 'TitleClick':
                const color = ['red', 'blue', 'gray', 'yellow', 'coral'];

                // command: $ = document.querySelector
                richText.current?.commandDOM(`$('#${id}').style.color='${color[XMath.random(color.length - 1)]}'`);
                break;
            case 'SwitchImage':
                break;
        }
        console.log('onMessage', type, id, data);
    }, [])

    let handleFocus = useCallback(() => {
        console.log('editor focus')
    }, [])

    let handleBlur = useCallback(() => {
        console.log('editor blur');
    }, []);

    let handleCursorPosition = useCallback((scrollY) => {
        // Positioning scroll bar
        scrollRef.current.scrollTo({y: scrollY - 30, animated: true});
    }, [])


    useEffect(() => {
        let listener = [
            Appearance.addChangeListener(themeChange),
            Keyboard.addListener('keyboardDidShow', this.onKeyShow),
            Keyboard.addListener('keyboardDidHide', this.onKeyHide)
        ]
        return () => {
            listener.forEach(it => it.remove());
        }
    }, []);

    let {backgroundColor, color, placeholderColor} = contentStyle;
    let dark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, dark && styles.darkBack]}>
            <StatusBar barStyle={!dark ? 'dark-content' : 'light-content'}/>
            <InsertLinkModal
                placeholderColor={placeholderColor}
                color={color}
                backgroundColor={backgroundColor}
                onDone={onLinkDone}
                ref={linkModal}
            />
            <View style={styles.nav}>
                <Button title={'HOME'} onPress={handleHome}/>
                <Button title="Preview" onPress={handleSave}/>
            </View>
            <ScrollView
                style={[styles.scroll, dark && styles.scrollDark]}
                keyboardDismissMode={'none'}
                ref={scrollRef}
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
                        <Button title={theme} onPress={onTheme}/>
                        <Button title={disabled ? 'enable' : 'disable'} onPress={onDisabled}/>
                    </View>
                </View>
                <RichToolbar
                    style={[styles.richBar, dark && styles.richBarDark]}
                    flatContainerStyle={styles.flatStyle}
                    editor={richText}
                    disabled={disabled}
                    selectedIconTint={'#2095F2'}
                    disabledIconTint={'#bfbfbf'}
                    onPressAddImage={onPressAddImage}
                    onInsertLink={onInsertLink}
                />
                <RichEditor
                    // initialFocus={true}
                    disabled={disabled}
                    editorStyle={contentStyle} // default light style
                    ref={richText}
                    style={styles.rich}
                    useContainer={true}
                    initialHeight={400}
                    enterKeyHint={'done'}
                    // containerStyle={{borderRadius: 24}}
                    placeholder={'please input content'}
                    initialContentHTML={initHTML}
                    editorInitializedCallback={editorInitializedCallback}
                    onChange={handleChange}
                    onHeightChange={handleHeightChange}
                    onPaste={handlePaste}
                    onKeyUp={handleKeyUp}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    onMessage={handleMessage}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onCursorPosition={handleCursorPosition}
                    pasteAsPlainText={true}
                />
            </ScrollView>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <RichToolbar
                    style={[styles.richBar, dark && styles.richBarDark]}
                    flatContainerStyle={styles.flatStyle}
                    editor={richText}
                    disabled={disabled}
                    // iconTint={color}
                    selectedIconTint={'#2095F2'}
                    disabledIconTint={'#bfbfbf'}
                    onPressAddImage={onPressAddImage}
                    onInsertLink={onInsertLink}
                    // iconSize={24}
                    // iconGap={10}
                    actions={[
                        actions.undo,
                        actions.redo,
                        actions.insertVideo,
                        actions.insertImage,
                        actions.setStrikethrough,
                        // actions.checkboxList,
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
                            <Text style={[styles.tib, {color: tintColor}]}>H4</Text>
                        ),
                        insertHTML: htmlIcon,
                    }}
                    insertEmoji={handleEmoji}
                    insertHTML={handleInsertHTML}
                    insertVideo={handleInsertVideo}
                    fontSize={handleFontSize}
                    foreColor={handleForeColor}
                    hiliteColor={handleHiliteColor}
                />
                {emojiVisible && <EmojiView onSelect={handleInsertEmoji}/>}
            </KeyboardAvoidingView>
        </SafeAreaView>
    )


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

