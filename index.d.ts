import {WebViewProps} from 'react-native-webview';
import {ImageSourcePropType, StyleProp, ViewStyle} from 'react-native';
import * as React from 'react';

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
         * Callback called after the editor has been initialized
         */
        editorInitializedCallback?: () => void;

        /**
         * Callback after editor data modification
         */
        onChange?: () => void;

        /**
         * Callback after height change
         */
        onHeightChange: () => void;

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

    export type DefaultActions = ['image', 'bold', 'italic', 'unorderedList', 'orderedList', 'link'];

    export class RichEditor extends React.Component<RichEditorProps> {
        // Public API

        /**
         * @deprecated please use onChange
         */
        getContentHtml: () => Promise<string>;

        registerToolbar: (listener: SelectionChangeListener) => void;

        /** Add a listener for the content focused event in WebView */
        setContentFocusHandler: (listener: () => void) => void;

        /**
         * Set current HTML to be rendered
         */
        setContentHTML: (html: string) => void;

        blurContentEditor: () => void;

        focusContentEditor: () => void;

        insertImage: (attributes: any) => void;

        insertVideo: (attributes: any) => void;

        insertLink: (title: string, url: string) => void;

        insertText: (text: string) => void;

        insertHTML: (html: string) => void;

        init: () => void;
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
        disabled?: boolean,
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
        iconMap?: Record<string, ({selected: boolean, disabled: boolean, tintColor: any, iconSize: number}) => React.Element | ImageSourcePropType>;

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
