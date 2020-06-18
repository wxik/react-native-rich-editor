import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {actions, messages} from './const';
import {Dimensions, PixelRatio, Platform, StyleSheet, View} from 'react-native';
import {createHTML} from './editor';

const PlatformIOS = Platform.OS === 'ios';

export default class RichTextEditor extends Component {
    // static propTypes = {
    //     initialContentHTML: PropTypes.string,
    //     editorInitializedCallback: PropTypes.func,
    // };

    static defaultProps = {
        contentInset: {},
        style: {},
        placeholder: '',
        initialContentHTML: '',
    };

    constructor(props) {
        super(props);
        let that = this;
        that.onMessage = that.onMessage.bind(that);
        that._sendAction = that._sendAction.bind(that);
        that.registerToolbar = that.registerToolbar.bind(that);
        that._onKeyboardWillShow = that._onKeyboardWillShow.bind(that);
        that._onKeyboardWillHide = that._onKeyboardWillHide.bind(that);
        that.init = that.init.bind(that);
        that.setRef = that.setRef.bind(that);
        that.isInit = false;
        that.selectionChangeListeners = [];
        const {editorStyle: {backgroundColor, color, placeholderColor} = {}, html} = props;
        that.state = {
            html: {html: html || createHTML({backgroundColor, color, placeholderColor})},
            keyboardHeight: 0,
            height: 0,
        };
        that.focusListeners = [];
    }

    // componentWillMount() {
    // if (PlatformIOS) {
    //     this.keyboardEventListeners = [
    //         Keyboard.addListener('keyboardWillShow', this._onKeyboardWillShow),
    //         Keyboard.addListener('keyboardWillHide', this._onKeyboardWillHide)
    //     ];
    // } else {
    //     this.keyboardEventListeners = [
    //         Keyboard.addListener('keyboardDidShow', this._onKeyboardWillShow),
    //         Keyboard.addListener('keyboardDidHide', this._onKeyboardWillHide)
    //     ];
    // }
    // }

    componentWillUnmount() {
        this.intervalHeight && clearInterval(this.intervalHeight);
        // this.keyboardEventListeners.forEach((eventListener) => eventListener.remove());
    }

    _onKeyboardWillShow(event) {
        // console.log('!!!!', event);
        const newKeyboardHeight = event.endCoordinates.height;
        if (this.state.keyboardHeight === newKeyboardHeight) {
            return;
        }
        if (newKeyboardHeight) {
            this.setEditorAvailableHeightBasedOnKeyboardHeight(newKeyboardHeight);
        }
        this.setState({keyboardHeight: newKeyboardHeight});
    }

    _onKeyboardWillHide(event) {
        this.setState({keyboardHeight: 0});
    }

    setEditorAvailableHeightBasedOnKeyboardHeight(keyboardHeight) {
        const {top = 0, bottom = 0} = this.props.contentInset;
        const {marginTop = 0, marginBottom = 0} = this.props.style;
        const spacing = marginTop + marginBottom + top + bottom;

        const editorAvailableHeight = Dimensions.get('window').height - keyboardHeight - spacing;
        // this.setEditorHeight(editorAvailableHeight);
    }

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
        if (height !== this.state.height) {
            this.setState({height});
        }
    };

    _sendAction(type, action, data) {
        let jsonString = JSON.stringify({type, name: action, data});
        if (this.webviewBridge) {
            this.webviewBridge.postMessage(jsonString);
            // console.log(jsonString)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {editorStyle} = this.props;
        if (prevProps.editorStyle !== editorStyle) {
            editorStyle && this.setContentStyle(editorStyle);
        }
    }

    setRef(ref) {
        this.webviewBridge = ref;
    }

    renderWebView = () => {
        const {html, editorStyle, useContainer, ...rest} = this.props;
        const {html: viewHTML} = this.state;
        return (
            <WebView
                useWebKit={true}
                scrollEnabled={false}
                hideKeyboardAccessoryView={true}
                keyboardDisplayRequiresUserAction={false}
                {...rest}
                ref={this.setRef}
                onMessage={this.onMessage}
                originWhitelist={['*']}
                dataDetectorTypes={'none'}
                domStorageEnabled={false}
                bounces={false}
                javaScriptEnabled={true}
                source={viewHTML}
                opacity={this.isInit ? 1 : 0}
                onLoad={this.init}
            />
        );
    };

    render() {
        let {height} = this.state;

        // useContainer is an optional prop with default value of true
        // If set to true, it will use a View wrapper with styles and height.
        // If set to false, it will not use a View wrapper
        const {useContainer = true, style} = this.props;

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

    blurContentEditor() {
        this._sendAction(actions.content, 'blur');
    }

    focusContentEditor() {
        this._sendAction(actions.content, 'focus');
    }

    insertImage(attributes) {
        this._sendAction(actions.insertImage, 'result', attributes);
    }

    init() {
        let that = this;
        that.isInit = true;
        that.setContentHTML(this.props.initialContentHTML);
        that.setPlaceholder(this.props.placeholder);
        that.props.editorInitializedCallback && that.props.editorInitializedCallback();

        this.intervalHeight = setInterval(function () {
            that._sendAction(actions.updateHeight);
        }, 200);
    }

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
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    innerModal: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingTop: 20,
        paddingBottom: PlatformIOS ? 0 : 20,
        paddingLeft: 20,
        paddingRight: 20,
        alignSelf: 'stretch',
        margin: 40,
        borderRadius: PlatformIOS ? 8 : 2,
    },
    button: {
        fontSize: 16,
        color: '#4a4a4a',
        textAlign: 'center',
    },
    inputWrapper: {
        marginTop: 5,
        marginBottom: 10,
        borderBottomColor: '#4a4a4a',
        borderBottomWidth: PlatformIOS ? 1 / PixelRatio.get() : 0,
    },
    inputTitle: {
        color: '#4a4a4a',
    },
    input: {
        height: PlatformIOS ? 20 : 40,
        paddingTop: 0,
    },
    lineSeparator: {
        height: 1 / PixelRatio.get(),
        backgroundColor: '#d5d5d5',
        marginLeft: -20,
        marginRight: -20,
        marginTop: 20,
    },
});
