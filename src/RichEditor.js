import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {actions, messages} from './const';
import {Dimensions, Keyboard, Platform, StyleSheet, TextInput, View} from 'react-native';
import {createHTML} from './editor';

const PlatformIOS = Platform.OS === 'ios';

export default class RichTextEditor extends Component {
    // static propTypes = {
    //     initialContentHTML: PropTypes.string,
    //     editorInitializedCallback: PropTypes.func,
    //     onChange: PropTypes.func,
    //     onHeightChange: PropTypes.func,
    //     initialFocus: PropTypes.bool,
    //     disabled: PropTypes.bool,
    // };

    static defaultProps = {
        contentInset: {},
        style: {},
        placeholder: '',
        initialContentHTML: '',
        initialFocus: false,
        disabled: false,
        useContainer: true,
        editorInitializedCallback: () => {},
    };

    constructor(props) {
        super(props);
        let that = this;
        that.renderWebView = that.renderWebView.bind(that);
        that.onMessage = that.onMessage.bind(that);
        that._sendAction = that._sendAction.bind(that);
        that.registerToolbar = that.registerToolbar.bind(that);
        that._onKeyboardWillShow = that._onKeyboardWillShow.bind(that);
        that._onKeyboardWillHide = that._onKeyboardWillHide.bind(that);
        that.init = that.init.bind(that);
        that.setRef = that.setRef.bind(that);
        that._keyOpen = false;
        that.selectionChangeListeners = [];
        const {editorStyle: {backgroundColor, color, placeholderColor, cssText, contentCSSText} = {}, html} = props;
        that.state = {
            html: {html: html || createHTML({backgroundColor, color, placeholderColor, cssText, contentCSSText})},
            keyboardHeight: 0,
            height: 0,
            isInit: false,
        };
        that.focusListeners = [];
    }

    componentDidMount() {
        if (PlatformIOS) {
            this.keyboardEventListeners = [
                Keyboard.addListener('keyboardWillShow', this._onKeyboardWillShow),
                Keyboard.addListener('keyboardWillHide', this._onKeyboardWillHide),
            ];
        } else {
            this.keyboardEventListeners = [
                Keyboard.addListener('keyboardDidShow', this._onKeyboardWillShow),
                Keyboard.addListener('keyboardDidHide', this._onKeyboardWillHide),
            ];
        }
    }

    componentWillUnmount() {
        // this.keyboardEventListeners.forEach((eventListener) => eventListener.remove());
    }

    _onKeyboardWillShow(event) {
        this._keyOpen = true;
        // console.log('!!!!', event);
        /*const newKeyboardHeight = event.endCoordinates.height;
        if (this.state.keyboardHeight === newKeyboardHeight) {
            return;
        }
        if (newKeyboardHeight) {
            this.setEditorAvailableHeightBasedOnKeyboardHeight(newKeyboardHeight);
        }
        this.setState({keyboardHeight: newKeyboardHeight});*/
    }

    _onKeyboardWillHide(event) {
        this._keyOpen = false;
        // this.setState({keyboardHeight: 0});
    }

    /*setEditorAvailableHeightBasedOnKeyboardHeight(keyboardHeight) {
        const {top = 0, bottom = 0} = this.props.contentInset;
        const {marginTop = 0, marginBottom = 0} = this.props.style;
        const spacing = marginTop + marginBottom + top + bottom;

        const editorAvailableHeight = Dimensions.get('window').height - keyboardHeight - spacing;
        // this.setEditorHeight(editorAvailableHeight);
    }*/

    onMessage(event) {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            switch (message.type) {
                case messages.CONTENT_HTML_RESPONSE:
                    if (this.contentResolve) {
                        this.contentResolve(message.data);
                        this.contentResolve = undefined;
                        this.contentReject = undefined;
                        if (this.pendingContentHtml) {
                            clearTimeout(this.pendingContentHtml);
                            this.pendingContentHtml = undefined;
                        }
                    }
                    break;
                case messages.LOG:
                    console.log('FROM EDIT:', ...message.data);
                    break;
                case messages.SELECTION_CHANGE: {
                    const items = message.data;
                    this.selectionChangeListeners.map((listener) => {
                        listener(items);
                    });
                    break;
                }
                case messages.CONTENT_FOCUSED: {
                    this.focusListeners.map((da) => da());
                    break;
                }
                case messages.CONTENT_CHANGE: {
                    this.props.onChange && this.props.onChange(message.data);
                    break;
                }
                case messages.OFFSET_HEIGHT:
                    this.setWebHeight(message.data);
                    break;
            }
        } catch (e) {
            //alert('NON JSON MESSAGE');
        }
    }

    setWebHeight = (height) => {
        // console.log(height);
        const {onHeightChange, useContainer} = this.props;
        if (height !== this.state.height) {
            useContainer && this.setState({height});
            onHeightChange && onHeightChange(height);
        }
    };

    _sendAction(type, action, data) {
        let jsonString = JSON.stringify({type, name: action, data});
        if (this.webviewBridge) {
            this.webviewBridge.postMessage(jsonString);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {editorStyle, disabled} = this.props;
        if (prevProps.editorStyle !== editorStyle) {
            editorStyle && this.setContentStyle(editorStyle);
        }
        if (disabled !== prevProps.disabled) {
            this.setDisable(disabled);
        }
    }

    setRef(ref) {
        this.webviewBridge = ref;
    }

    renderWebView() {
        let that = this;
        const {html, editorStyle, useContainer, ...rest} = that.props;
        const {html: viewHTML} = that.state;
        // webview dark theme bug
        const opacity = that.state.isInit ? 1 : 0;
        return (
            <>
                <WebView
                    useWebKit={true}
                    scrollEnabled={false}
                    hideKeyboardAccessoryView={true}
                    keyboardDisplayRequiresUserAction={false}
                    {...rest}
                    ref={that.setRef}
                    onMessage={that.onMessage}
                    originWhitelist={['*']}
                    dataDetectorTypes={'none'}
                    domStorageEnabled={false}
                    bounces={false}
                    javaScriptEnabled={true}
                    source={viewHTML}
                    opacity={opacity}
                    onLoad={that.init}
                />
                {Platform.OS === 'android' && <TextInput ref={(ref) => (that._input = ref)} style={styles._input} />}
            </>
        );
    }

    render() {
        let {height} = this.state;

        // useContainer is an optional prop with default value of true
        // If set to true, it will use a View wrapper with styles and height.
        // If set to false, it will not use a View wrapper
        const {useContainer, style} = this.props;

        if (useContainer) {
            return (
                <View style={[style, {height: height || Dimensions.get('window').height * 0.7}]}>
                    {this.renderWebView()}
                </View>
            );
        }
        return this.renderWebView();
    }

    //-------------------------------------------------------------------------------
    //--------------- Public API

    registerToolbar(listener) {
        this.selectionChangeListeners = [...this.selectionChangeListeners, listener];
    }

    setContentFocusHandler(listener) {
        this.focusListeners.push(listener);
    }

    setContentHTML(html) {
        this._sendAction(actions.content, 'setHtml', html);
    }

    setPlaceholder(placeholder) {
        this._sendAction(actions.content, 'setPlaceholder', placeholder);
    }

    setContentStyle(styles) {
        this._sendAction(actions.content, 'setContentStyle', styles);
    }

    setDisable(dis) {
        this._sendAction(actions.content, 'setDisable', !!dis);
    }

    blurContentEditor() {
        this._sendAction(actions.content, 'blur');
    }

    focusContentEditor() {
        this.showAndroidKeyboard();
        this._sendAction(actions.content, 'focus');
    }

    /**
     * open android keyboard
     * @platform android
     */
    showAndroidKeyboard() {
        let that = this;
        if (Platform.OS === 'android') {
            !that._keyOpen && that._input.focus();
            that.webviewBridge.requestFocus && that.webviewBridge.requestFocus();
        }
    }

    insertImage(attributes) {
        this._sendAction(actions.insertImage, 'result', attributes);
    }

    insertVideo(attributes) {
        this._sendAction(actions.insertVideo, 'result', attributes);
    }

    insertText(text) {
        this._sendAction(actions.insertText, 'result', text);
    }

    insertHTML(html) {
        this._sendAction(actions.insertHTML, 'result', html);
    }

    insertLink(title, url) {
        if (url) {
            this.showAndroidKeyboard();
            this._sendAction(actions.insertLink, 'result', {title, url});
        }
    }

    init() {
        let that = this;
        const {initialFocus, initialContentHTML, placeholder, editorInitializedCallback, disabled} = that.props;
        that.setContentHTML(initialContentHTML);
        that.setPlaceholder(placeholder);
        that.setDisable(disabled);
        editorInitializedCallback();

        // initial request focus
        initialFocus && !disabled && that.focusContentEditor();
        // no visible ?
        that._sendAction(actions.init);
        that.setState({isInit: true});
    }

    /**
     * @deprecated please use onChange
     * @returns {Promise}
     */
    async getContentHtml() {
        return new Promise((resolve, reject) => {
            this.contentResolve = resolve;
            this.contentReject = reject;
            this._sendAction(actions.content, 'postHtml');

            this.pendingContentHtml = setTimeout(() => {
                if (this.contentReject) {
                    this.contentReject('timeout');
                }
            }, 5000);
        });
    }
}

const styles = StyleSheet.create({
    _input: {
        position: 'absolute',
        width: 1,
        height: 1,
        zIndex: -999,
        bottom: -999,
        left: -999,
    },
});
