import {WebViewProps} from 'react-native-webview';
import {ImageSourcePropType, StyleProp, ViewStyle} from 'react-native';
import React from 'react';

declare module 'react-native-pell-rich-editor' {
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
         * String value to set text auto capitalization.
         * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize
         */
        autoCapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';

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
         * Callback when the editor focus some content
         */
        onFocus?: () => void;

        /**
         * Callback when the editor blur some content
         */
        onBlur?: () => void;

        /**
         * Callback after height change
         */
        onHeightChange?: (height: number) => void;

        onMessage?: (message: {type: string; id: string; data?: any}) => void;

        /**
         * Styling for container or for Rich Editor more dark or light settings
         */
        editorStyle?: {
            backgroundColor?: string; // editor background color
            color?: string; // editor text color
            placeholderColor?: string; // editor placeholder text color
            contentCSSText?: string; // editor content css text
            cssText?: string; // editor global css text
        };
    }

    export type SelectionChangeListener = (items: string[]) => void;

    export const actions: {[key: string]: string};

    export type DefaultActions = ['image', 'bold', 'italic', 'unorderedList', 'orderedList', 'link'];

    export type IconRecord = {
        selected: boolean;
        disabled: boolean;
        tintColor: any;
        iconSize: number;
    };

    export class RichEditor extends React.Component<RichEditorProps> {
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

        /**
         * $ = document.querySelector
         * this.richText.current?.commandDOM(`$('#title').style.color='${color}'`);
         * @param command
         */
        commandDOM: (command: string) => void;

        /**
         * Returns whether the keyboard is on
         */
        isKeyboardOpen: boolean;

        /**
         * Dismisses the active keyboard and removes focus.
         */
        dismissKeyboard: () => void;
    }

    export interface RichToolbarProps {
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
         * Your own set if images for the toolbar
         */
        iconMap?: Record<string, (IconRecord) => React.Element | ImageSourcePropType>;

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
         * By default the toolbar permits an Action set of type DefaultActions
         */
        actions?: Partial<DefaultActions> | string[];
    }

    export class RichToolbar extends React.Component<RichToolbarProps> {}
}
