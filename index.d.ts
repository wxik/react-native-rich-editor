import {WebViewProps} from "react-native-webview";
import {ImageSourcePropType, StyleProp, ViewStyle} from "react-native";
import * as React from "react";

declare module "react-native-pell-rich-editor" {
    /** The RichTextEditor accepts all props from Webview */
    export interface RichEditorProps extends WebViewProps {
        /**
         * Used for placement of editor
         */
        contentInset?: { top: number; bottom: number };

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
         * Callback called after the editor has been initialized
         */
        editorInitializedCallback?: () => void;
    }

    export type SelectionChangeListener = (items: string[]) => void;

    export type DefaultActions = [
        "image",
        "bold",
        "italic",
        "unorderedList",
        "orderedList",
        "link"
    ];

    export class RichEditor extends React.Component<RichEditorProps> {
        // Public API

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

        init: () => void;
    }

    export interface RichToolbarProps {
        /**
         * Function that returns a reference to the RichEditor instance
         */
        getEditor: () => RichEditor;

        unselectedButtonStyle?: StyleProp<ViewStyle>;
        selectedButtonStyle?: StyleProp<ViewStyle>;

        /**
         * Color for selected button Icon
         */
        selectedIconTint?: string;
        /**
         * Color for unselected button Icon
         */
        iconTint?: string;
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
        iconMap?: Record<string, ImageSourcePropType>;

        /**
         * Logic for what happens when you press on the add image button
         * */
        onPressAddImage?: () => void;

        /**
         * Custom actions you want the toolbar to permit.
         * By default the toolbar permits an Action set of type DefaultActions
         */
        actions?: Partial<DefaultActions> | string[];
    }

    export class RichToolbar extends React.Component<RichToolbarProps> {
    }
}
