
##

## 1.0.8
- Add `onInsertLink` event to toolbar, replace built-in processing
- Add `insertLink` props to the editor to support customization
- Add `onChange` props to the editor to get data

### Fix Bug
- Fix `focusContentEditor` Unable to get focus（android requires `react-native-webview>=7.5.2`）
- Fix `insertImage` Cannot be executed without focus


## 1.0.7

### Added
- Add `editor` props substitute `getEditor` function props
- Add `editorStyle` props styling for container or for Rich Editor more dark or light settings


## 1.0.6

### Fix Bug
- Fix `selected toolbar` error


## 1.0.5

### Added
- Add `useContainer` props Wrap the editor webview inside a container
- Add `placeholder` props Wrap the editor content placeholder


### Changed
- Upgrade `componentWillReceiveProps` to `getDerivedStateFromProps`
- Upgrade `props` site on hideKeyboardAccessoryView and keyboardDisplayRequiresUserAction end
- Upgrade `Examples` to RN 0.62.0 Webview 9.0.1

### Removed
- Removing experimental `componentWillMount`
