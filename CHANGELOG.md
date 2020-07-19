
## 1.3.0
#### Added
- Add `disabled` props to RichEditor and Toolbar
- Add `disabledIconTint` props to Toolbar
- Add `disabledButtonStyle` props to Toolbar

#### Changed
- `iconMap` Support incoming methods to return React elements

## 1.2.1
#### Added
- editor console.log in RN of __DEV__ mode
- Add strikethrough and insertLine on editor

#### Changed
- Detail optimization
- Set default Android keyboard open

#### Fix Bug
- Fix Initialization speed by default 200ms
- Fix heading1、heading2 key error
- Fix Android keyboard of v1.1.1

## 1.1.1

#### Changed
- The modified part has been subsequently supported on the web platform


#### Fix Bug
- Fix selected Text styles

## 1.1.0

**Now you can add custom functions (insertHTML or insertText) and styles (cssText or contentCSSText) to the editor, of course, Toolbar has also been customized extension**

#### Added
- Add `contentCSSText` by editorStyle options of Custom content style （css text）
- Add `cssText` by editorStyle options of Custom editor global css text
- Add `initialFocus` props to the editor initial request focus
- Add `onHeightChange` props to the editor Callback after height change
- Add `insertVideo` props to the editor insert video
- Add `insertText` props to the editor insert text 
- Add `insertHTML` props to the editor insert html

#### Fix Bug
- Fix Click outside the editor to get focus

## 1.0.9-beta.1
#### Fix Bug
- Fix `showAndroidKeyboard` of Expo

## 1.0.9-beta.0
- experiment `showAndroidKeyboard` props on keyboard of android focus

## 1.0.8
- Add `onInsertLink` event to toolbar, replace built-in processing
- Add `insertLink` props to the editor to support customization
- Add `onChange` props to the editor to get data

#### Fix Bug
- Fix `focusContentEditor` Unable to get focus（android requires `react-native-webview>=7.5.2`）
- Fix `insertImage` Cannot be executed without focus


## 1.0.7

#### Added
- Add `editor` props substitute `getEditor` function props
- Add `editorStyle` props styling for container or for Rich Editor more dark or light settings


## 1.0.6

#### Fix Bug
- Fix `selected toolbar` error


## 1.0.5

#### Added
- Add `useContainer` props Wrap the editor webview inside a container
- Add `placeholder` props Wrap the editor content placeholder


#### Changed
- Upgrade `componentWillReceiveProps` to `getDerivedStateFromProps`
- Upgrade `props` site on hideKeyboardAccessoryView and keyboardDisplayRequiresUserAction end
- Upgrade `Examples` to RN 0.62.0 Webview 9.0.1

#### Removed
- Removing experimental `componentWillMount`
