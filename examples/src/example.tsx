/* eslint-disable react/no-unstable-nested-components,react-native/no-inline-styles*/
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
  ColorSchemeName,
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
import {actions, FONT_SIZE, getContentCSS, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {XMath} from '@wxik/core';
import {InsertLinkModal} from './insertLink';
import {EmojiView} from './emoji';
import {INavigation, RefLinkModal} from './interface';
import {IconRecord} from '../../index';

interface IProps {
  navigation: INavigation;
  theme?: ColorSchemeName;
}

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

function createContentStyle(theme: ColorSchemeName) {
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

export function Example(props: IProps) {
  const {theme: initTheme = Appearance.getColorScheme(), navigation} = props;
  const richText = useRef<RichEditor>(null);
  const linkModal = useRef<RefLinkModal>();
  const scrollRef = useRef<ScrollView>(null);
  // save on html
  const contentRef = useRef(initHTML);

  const [theme, setTheme] = useState(initTheme);
  const [emojiVisible, setEmojiVisible] = useState(false);
  const [disabled, setDisable] = useState(false);
  const contentStyle = useMemo(() => createContentStyle(theme), [theme]);

  // on save to preview
  const handleSave = useCallback(() => {
    navigation.push('preview', {html: contentRef.current, css: getContentCSS()});
  }, [navigation]);

  const handleHome = useCallback(() => {
    navigation.push('index');
  }, [navigation]);

  // editor change data
  const handleChange = useCallback((html: string) => {
    // save html to content ref;
    contentRef.current = html;
  }, []);

  // theme change to editor color
  const themeChange = useCallback(({colorScheme}: Appearance.AppearancePreferences) => {
    setTheme(colorScheme);
  }, []);

  const onTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme]);

  const onDisabled = useCallback(() => {
    setDisable(!disabled);
  }, [disabled]);

  const editorInitializedCallback = useCallback(() => {
    // richText.current.registerToolbar(function (items) {
    // console.log('Toolbar click, selected items (insert end callback):', items);
    // });
  }, []);

  const onKeyHide = useCallback(() => {}, []);

  const onKeyShow = useCallback(() => {
    TextInput.State.currentlyFocusedInput() && setEmojiVisible(false);
  }, []);

  // editor height change
  const handleHeightChange = useCallback((height: number) => {
    console.log('editor height change:', height);
  }, []);

  const handleInsertEmoji = useCallback((emoji: string) => {
    richText.current?.insertText(emoji);
    richText.current?.blurContentEditor();
  }, []);

  const handleEmoji = useCallback(() => {
    Keyboard.dismiss();
    richText.current?.blurContentEditor();
    setEmojiVisible(!emojiVisible);
  }, [emojiVisible]);

  const handleInsertVideo = useCallback(() => {
    richText.current?.insertVideo(
      'https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4',
      'width: 50%;',
    );
  }, []);

  const handleInsertHTML = useCallback(() => {
    // this.richText.current?.insertHTML(
    //     `<span onclick="alert(2)" style="color: blue; padding:0 10px;" contenteditable="false">HTML</span>`,
    // );
    richText.current?.insertHTML(
      `<div style="padding:10px 0;" contentEditable="false">
                <iframe  width="100%" height="220"  src="https://www.youtube.com/embed/6FrNXgXlCGA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>`,
    );
  }, []);

  const onPressAddImage = useCallback(() => {
    // insert URL
    richText.current?.insertImage(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png',
      'background: gray;',
    );
    // insert base64
    // this.richText.current?.insertImage(`data:${image.mime};base64,${image.data}`);
  }, []);

  const onInsertLink = useCallback(() => {
    // this.richText.current?.insertLink('Google', 'http://google.com');
    linkModal.current?.setModalVisible(true);
  }, []);

  const onLinkDone = useCallback(({title, url}: {title?: string; url?: string}) => {
    if (title && url) {
      richText.current?.insertLink(title, url);
    }
  }, []);

  const handleFontSize = useCallback(() => {
    // 1=  10px, 2 = 13px, 3 = 16px, 4 = 18px, 5 = 24px, 6 = 32px, 7 = 48px;
    let size = [1, 2, 3, 4, 5, 6, 7];
    richText.current?.setFontSize(size[XMath.random(size.length - 1)] as FONT_SIZE);
  }, []);

  const handleForeColor = useCallback(() => {
    richText.current?.setForeColor('blue');
  }, []);

  const handleHaliteColor = useCallback(() => {
    richText.current?.setHiliteColor('red');
  }, []);

  const handlePaste = useCallback((data: any) => {
    console.log('Paste:', data);
  }, []);

  // @deprecated Android keyCode 229
  const handleKeyUp = useCallback(() => {
    // console.log('KeyUp:', data);
  }, []);

  // @deprecated Android keyCode 229
  const handleKeyDown = useCallback(() => {
    // console.log('KeyDown:', data);
  }, []);

  const handleInput = useCallback(() => {
    // console.log(inputType, data)
  }, []);

  const handleMessage = useCallback(({type, id, data}: {type: string; id: string; data?: any}) => {
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
  }, []);

  const handleFocus = useCallback(() => {
    console.log('editor focus');
  }, []);

  const handleBlur = useCallback(() => {
    console.log('editor blur');
  }, []);

  const handleCursorPosition = useCallback((scrollY: number) => {
    // Positioning scroll bar
    scrollRef.current!.scrollTo({y: scrollY - 30, animated: true});
  }, []);

  useEffect(() => {
    let listener = [
      Appearance.addChangeListener(themeChange),
      Keyboard.addListener('keyboardDidShow', onKeyShow),
      Keyboard.addListener('keyboardDidHide', onKeyHide),
    ];
    return () => {
      listener.forEach(it => it.remove());
    };
  }, [onKeyHide, onKeyShow, themeChange]);

  const {backgroundColor, color, placeholderColor} = contentStyle;
  const dark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.container, dark && styles.darkBack]}>
      <StatusBar barStyle={!dark ? 'dark-content' : 'light-content'} />
      <InsertLinkModal
        placeholderColor={placeholderColor}
        color={color}
        backgroundColor={backgroundColor}
        onDone={onLinkDone}
        forwardRef={linkModal}
      />
      <View style={styles.nav}>
        <Button title={'HOME'} onPress={handleHome} />
        <Button title="Preview" onPress={handleSave} />
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
            <Button title={String(theme)} onPress={onTheme} />
            <Button title={disabled ? 'enable' : 'disable'} onPress={onDisabled} />
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
          initialFocus={false}
          firstFocusEnd={false}
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
            [actions.foreColor]: () => <Text style={[styles.tib, {color: 'blue'}]}>FC</Text>,
            [actions.hiliteColor]: ({tintColor}: IconRecord) => (
              <Text style={[styles.tib, {color: tintColor, backgroundColor: 'red'}]}>BC</Text>
            ),
            [actions.heading1]: ({tintColor}: IconRecord) => <Text style={[styles.tib, {color: tintColor}]}>H1</Text>,
            [actions.heading4]: ({tintColor}: IconRecord) => <Text style={[styles.tib, {color: tintColor}]}>H4</Text>,
            insertHTML: htmlIcon,
          }}
          insertEmoji={handleEmoji}
          insertHTML={handleInsertHTML}
          insertVideo={handleInsertVideo}
          fontSize={handleFontSize}
          foreColor={handleForeColor}
          hiliteColor={handleHaliteColor}
        />
        {emojiVisible && <EmojiView onSelect={handleInsertEmoji} />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
