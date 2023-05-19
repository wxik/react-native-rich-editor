import {WebViewProps} from 'react-native-webview';
import {ImageSourcePropType, StyleProp, ViewStyle} from 'react-native';
import React from 'react';

/** The RichTextEditor accepts all props from Webview */
export interface RichEditorProps extends WebViewProps {
  /**
   * Used for placement of editor
   */
  contentInset?: {top: number; bottom: number};

  /**
   * Wrap the editor webview inside a container.
   * Default is true
   */
  useContainer?: boolean;

  /**
   * useContainer is false by inline view of initial height
   */
  initialHeight?: number | string;
  /**
   * Wrap the editor content placeholder
   * Default is empty string
   */
  placeholder?: string;
  /**
   * Styling for container or for Webview depending on useContainer prop
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Initial content to be rendered inside WebView
   */
  initialContentHTML?: string;

  /**
   * Boolean value to Initial content request focus. The default value is false.
   */
  initialFocus?: boolean;

  /**
   * Boolean value to disable editor. The default value is false.
   */
  disabled?: boolean;

  /**
   * Boolean value to enable auto-correct. The default value is false.
   */
  autoCorrect?: boolean;

  /**
   * String value to set text auto capitalization.
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize
   */
  autoCapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';

  /**
   * String value to set return key type
   * See: https://reactnative.dev/docs/textinput#returnkeytype
   */
  enterKeyHint?: 'done' | 'go' | 'next' | 'search' | 'send';

  /**
   * Boolean value to enable paste as plain text. The default value is false.
   */
  pasteAsPlainText?: boolean;

  /**
   * HTML element used to insert when the user presses enter. The default value is div.
   */
  defaultParagraphSeparator?: string;

  /**
   * Callback called after the editor has been initialized
   */
  editorInitializedCallback?: () => void;

  /**
   * Callback after editor data modification
   */
  onChange?: (text: string) => void;

  /**
   * Callback when the user pastes some content
   * @param {string} data pastes values
   */
  onPaste?: (data: string) => void;

  /**
   * Callback when the user keyup some content
   */
  onKeyUp?: ({keyCode: number, key: string}) => void;

  /**
   * Callback when the user keydown some content
   */
  onKeyDown?: ({keyCode: number, key: string}) => void;

  /**
   * Callback input chat
   * Android and iOS inputType are not the same
   */
  onInput?: ({data: string, inputType: string}) => void;

  /**
   * Callback when the link clicked
   */
  onLink?: (url: string) => void;

  /**
   * Callback when the editor focus some content
   */
  onFocus?: () => void;

  /**
   * Callback when the editor blur some content
   */
  onBlur?: () => void;

  /**
   * Callback Enter the position of the cursor
   */
  onCursorPosition?: (offsetY: number) => void;

  /**
   * Callback after height change
   */
  onHeightChange?: (height: number) => void;

  onMessage?: (message: {type: string; id: string; data?: any}) => void;

  /**
   * When first gaining focus, the cursor moves to the end of the text
   * Default is true
   */
  firstFocusEnd?: boolean;

  /**
   * Styling for container or for Rich Editor more dark or light settings
   */
  editorStyle?: {
    backgroundColor?: string; // editor background color
    color?: string; // editor text color
    caretColor?: string; // cursor/selection color
    placeholderColor?: string; // editor placeholder text color
    contentCSSText?: string; // editor content css text
    initialCSSText?: string; // editor global css initial text
    cssText?: string; // editor global css text
  };

  /**
   * Use style instead of dedicated tags
   */
  styleWithCSS?: boolean;
}

export type SelectionChangeListener = (items: (string | {type: string; value: string})[]) => void;

export enum actions {
  content = 'content',
  updateHeight = 'UPDATE_HEIGHT',
  setBold = 'bold',
  setItalic = 'italic',
  setUnderline = 'underline',
  heading1 = 'heading1',
  heading2 = 'heading2',
  heading3 = 'heading3',
  heading4 = 'heading4',
  heading5 = 'heading5',
  heading6 = 'heading6',
  insertLine = 'line',
  setParagraph = 'paragraph',
  removeFormat = 'removeFormat',
  alignLeft = 'justifyLeft',
  alignCenter = 'justifyCenter',
  alignRight = 'justifyRight',
  alignFull = 'justifyFull',
  insertBulletsList = 'unorderedList',
  insertOrderedList = 'orderedList',
  checkboxList = 'checkboxList',
  insertLink = 'link',
  insertText = 'text',
  insertHTML = 'html',
  insertImage = 'image',
  insertVideo = 'video',
  fontSize = 'fontSize',
  fontName = 'fontName',
  setSubscript = 'subscript',
  setSuperscript = 'superscript',
  setStrikethrough = 'strikeThrough',
  setHR = 'horizontalRule',
  indent = 'indent',
  outdent = 'outdent',
  undo = 'undo',
  redo = 'redo',
  code = 'code',
  table = 'table',
  line = 'line',
  foreColor = 'foreColor',
  hiliteColor = 'hiliteColor',
  blockquote = 'quote',
  keyboard = 'keyboard',
  setTitlePlaceholder = 'SET_TITLE_PLACEHOLDER',
  setContentPlaceholder = 'SET_CONTENT_PLACEHOLDER',
  setTitleFocusHandler = 'SET_TITLE_FOCUS_HANDLER',
  setContentFocusHandler = 'SET_CONTENT_FOCUS_HANDLER',
  prepareInsert = 'PREPARE_INSERT',
  restoreSelection = 'RESTORE_SELECTION',
  setCustomCSS = 'SET_CUSTOM_CSS',
  setTextColor = 'SET_TEXT_COLOR',
  setBackgroundColor = 'SET_BACKGROUND_COLOR',
  init = 'init',
  setEditorHeight = 'SET_EDITOR_HEIGHT',
  setFooterHeight = 'SET_FOOTER_HEIGHT',
  setPlatform = 'SET_PLATFORM',
}

export type FONT_SIZE = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type defaultActions = ['image', 'bold', 'italic', 'unorderedList', 'orderedList', 'link'];

export const createHTML = (options?: Object) => string;

export const getContentCSS = () => string;

export type IconRecord = {
  selected: boolean;
  disabled: boolean;
  tintColor: any;
  iconSize: number;
};

export declare class RichEditor extends React.Component<RichEditorProps> {
  // Public API

  /**
   * @deprecated please use onChange
   */
  getContentHtml: () => Promise<string>;

  registerToolbar: (listener: SelectionChangeListener) => void;

  /**
   * @deprecated please use onFocus
   */
  setContentFocusHandler: (listener: () => void) => void;

  /**
   * Set current HTML to be rendered
   */
  setContentHTML: (html: string) => void;

  blurContentEditor: () => void;

  focusContentEditor: () => void;

  insertImage: (attributes: any, style?: string) => void;

  insertVideo: (attributes: any, style?: string) => void;

  insertLink: (title: string, url: string) => void;

  insertText: (text: string) => void;

  insertHTML: (html: string) => void;

  injectJavascript: (type: string) => void;

  preCode: (type: string) => void;

  /**
   * 1 = 10px, 2 = 13px, 3 = 16px, 4 = 18px, 5 = 24px, 6 = 32px, 7 = 48px;
   */
  setFontSize: (size: FONT_SIZE) => void;

  /**
   * The background color of the selected text
   * @param color
   */
  setHiliteColor: (color: string) => void;

  /**
   * The color of the selected text
   * @param color
   */
  setForeColor: (color: string) => void;

  /** Custom action sent to editor */
  sendAction(type: string, action: string, data?: any, options?: any): void;

  /**
   * $ = document.querySelector
   * this.richText.current?.commandDOM(`$('#title').style.color='${color}'`);
   */
  commandDOM: (command: string) => void;

  /**
   * Execute JS in the editor
   * $ = document
   * this.richText.current?.commandDOM('$.execCommand('insertHTML', false, "<br/>")');
   */
  command: (command: string) => void;

  /**
   * Returns whether the keyboard is on
   */
  isKeyboardOpen: boolean;

  /**
   * Dismisses the active keyboard and removes focus.
   */
  dismissKeyboard: () => void;

  render(): JSX.Element;
}

export interface RichToolbarProps<A extends actions> {
  /**
   * Function that returns a reference to the RichEditor instance
   * Optional editor props
   */
  getEditor?: () => RichEditor;

  /**
   * React.createRef reference to the RichEditor instance
   * Optional getEditor props
   */
  editor?: React.createRef;

  unselectedButtonStyle?: StyleProp<ViewStyle>;
  selectedButtonStyle?: StyleProp<ViewStyle>;
  disabledButtonStyle?: StyleProp<ViewStyle>;

  /**
   * Color for selected button Icon
   */
  selectedIconTint?: string;
  /**
   * Color for unselected button Icon
   */
  iconTint?: string;
  /**
   * Color for disabled button Icon
   */
  disabledIconTint?: string;

  /**
   * Boolean value to disable editor. The default value is false.
   */
  disabled?: boolean;
  /**
   * Custom renderer for toolbar actions
   */
  renderAction?: (action: string, selected: boolean) => React.Element;

  /**
   * Custom style prop for the toolbar
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Flat container style prop for the toolbar
   */
  flatContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Your own set if images for the toolbar
   */
  iconMap?: Record<string, (icon: IconRecord) => React.Element | ImageSourcePropType>;

  /**
   * Logic for what happens when you press on the add image button
   */
  onPressAddImage?: () => void;

  /**
   *  Logic for what happens when you press on the add insert link button
   */
  onInsertLink?: () => void;

  /**
   * Custom actions you want the toolbar to permit.
   * By default, the toolbar permits an Action set of type DefaultActions
   */
  actions?: A[];
}

export declare class RichToolbar extends React.Component<RichToolbarProps> {
  render(): JSX.Element;
}
