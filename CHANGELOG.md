
## 1.5.2
### Added
- Add `dismissKeyboard` Dismisses the active keyboard and removes focus.
- Add `isKeyboardOpen` Returns whether the keyboard is on

### Fix
- Keyboard listener on unmount
- placeholder does not restore [issues 121](https://github.com/wxik/react-native-rich-editor/issues/121)

## 1.5.1
#### Added
- Add `onFocus` and `onBlur`
- Add `_.sendEvent` to automatically generate ID to RN, and you can dynamically modify the dom corresponding to the event with commandDOM

#### Changed
- `insertVideo` and `insertImage` Add style params to dom


## 1.5.0
- Add `onMessage` props on editor Callback outside postMessage internal type processing
- Add `_.sendEvent(type, data)` event callback to RN, using onMessage to receive callback
- Add `commandDOM` method can manipulate DOM

## 1.4.0
#### Added
- Add `pasteAsPlainText` props on editor
- Add `removeFormat` props on editor
- Add `autoCapitalize` props on editor of autocapitalize
- Add `onPaste` props on editor callback paste value
- Add `onKeyUp` props on editor callback keyup event
- Add `onKeyDown` props on editor callback keydown event

#### Changed
- useContainer is false of used initialHeight

#### Fix
- Toolbar buttons activate/deactivate erratically after backspacing
- disabled editor height fix

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
