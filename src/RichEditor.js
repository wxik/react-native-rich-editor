import React, { Component } from "react";
import { WebView } from "react-native-webview";
import { actions, messages } from "./const";
import {
  Dimensions,
  PixelRatio,
  Platform,
  StyleSheet,
  View
} from "react-native";
import { HTML } from "./editor";

const PlatformIOS = Platform.OS === "ios";

export default class RichTextEditor extends Component {
  // static propTypes = {
  //     initialContentHTML: PropTypes.string,
  //     initialEditorHeight: PropTypes.number,
  //     editorInitializedCallback: PropTypes.func,
  // };

  static defaultProps = {
    contentInset: {},
    style: {}
  };

  constructor(props) {
    super(props);
    this._sendAction = this._sendAction.bind(this);
    this.registerToolbar = this.registerToolbar.bind(this);
    this._onKeyboardWillShow = this._onKeyboardWillShow.bind(this);
    this._onKeyboardWillHide = this._onKeyboardWillHide.bind(this);
    this.isInit = false;
    this.state = {
      selectionChangeListeners: [],
      keyboardHeight: 0,
      height: 0,
      taggingActive: false,
      tagText: '',
    };
    this.focusListeners = [];
  }

  componentWillMount() {
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
  }

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
    this.setState({ keyboardHeight: newKeyboardHeight });
  }

  _onKeyboardWillHide(event) {
    this.setState({ keyboardHeight: 0 });
  }

  setEditorAvailableHeightBasedOnKeyboardHeight(keyboardHeight) {
    const { top = 0, bottom = 0 } = this.props.contentInset;
    const { marginTop = 0, marginBottom = 0 } = this.props.style;
    const spacing = marginTop + marginBottom + top + bottom;

    const editorAvailableHeight =
      Dimensions.get("window").height - keyboardHeight - spacing;
    // this.setEditorHeight(editorAvailableHeight);
  }

  onMessage = event => {
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
          console.log("FROM EDIT:", ...message.data);
          break;
        case messages.SELECTION_CHANGE: {
          const items = message.data;
          this.state.selectionChangeListeners.map(listener => {
            listener(items);
          });
          break;
        }
        case messages.CONTENT_FOCUSED: {
          this.focusListeners.map(da => da());
          break;
        }
        case messages.OFFSET_HEIGHT:
          this.setWebHeight(message.data);
          break;
        case messages.CONTENT_CHANGE:
          const { onActivateTagging } = this.props;
          const { taggingActive, tagText } = this.state;

          if (!PlatformIOS) {
            const contentLastWord = message.data.content.split('\n').pop().split(/(\s+)/).pop();
            if (contentLastWord === '@') {
              onActivateTagging?.(true, '');
              this.setState({
                taggingActive: true,
                tagText: '',
              });
            } else if (taggingActive) {
              if (!contentLastWord.includes('@')) {
                onActivateTagging?.(false, '');
                this.setState({
                  taggingActive: false,
                  tagText: '',
                });
              } else {
                const text = contentLastWord.replace('@', '');
                onActivateTagging?.(true, text);
                this.setState({
                  taggingActive: true,
                  tagText: text,
                });
              }
            }
            break;
          }

          const content = message.data.content.trim();
          const offset = message.data.key.length > 1 ? 1 : 2;
          const lastChar = content.length > 1 ? content.substr(content.length - offset, 1) : '';
          //alert(JSON.stringify(message.data));
          if (lastChar !== '@' && message.data.key === '@') {
            onActivateTagging && onActivateTagging(true, '');
            this.setState({
              taggingActive: true,
              tagText: '',
            });
          } else if (taggingActive && message.data.keyCode === 13) {
            // enter key, select first connection in list
            const text =  tagText + '\n';
            onActivateTagging && onActivateTagging(false, text, true);
          } else if (taggingActive && message.data.key !== 'Shift' && message.data.keyCode !== 32) {
            // if not space, continue with tagging
            // if backspace, but not deleting @, continue with tagging
            if ( message.data.keyCode !== 8 &&  message.data.key.length > 1) return;

            const text = message.data.keyCode === 8 ? tagText.substr(0, tagText.length - 1) : tagText + message.data.key;
            const taggingActive = !(text.length === 0 && lastChar !== '@');
            onActivateTagging && onActivateTagging(taggingActive, text);
            this.setState({
              taggingActive,
              tagText: text,
            });
          }
          break;
      }
    } catch (e) {
      //alert('NON JSON MESSAGE');
    }
  };

  setWebHeight = height => {
    const { onHeightChange } = this.props;
    console.log(height);
    if (height !== this.state.height) {
      this.setState({ height });
      onHeightChange && onHeightChange(height);
    }
  };

  renderWebView = () => (
    <WebView
      useWebKit={true}
      scrollEnabled={false}
      {...this.props}
      hideKeyboardAccessoryView={true}
      keyboardDisplayRequiresUserAction={false}
      ref={r => {
        this.webviewBridge = r;
      }}
      onMessage={this.onMessage}
      originWhitelist={["*"]}
      dataDetectorTypes={"none"}
      domStorageEnabled={false}
      bounces={false}
      javaScriptEnabled={true}
      source={{ html: HTML }}
      onLoad={() => this.init()}
    />
  );

  render() {
    let { height } = this.state;

    // useContainer is an optional prop with default value of true
    // If set to true, it will use a View wrapper with styles and height.
    // If set to false, it will not use a View wrapper
    const { useContainer = true } = this.props;

    if (useContainer) {
      return (
        <View
          style={[
            this.props.style,
            { height: height || Dimensions.get("window").height * 0.7 }
          ]}
        >
          {this.renderWebView()}
        </View>
      );
    }
    return this.renderWebView();
  }

  _sendAction(type, action, data) {
    let jsonString = JSON.stringify({ type, name: action, data });
    if (this.webviewBridge) {
      this.webviewBridge.postMessage(jsonString);
      // console.log(jsonString)
    }
  }

  //-------------------------------------------------------------------------------
  //--------------- Public API

  registerToolbar(listener) {
    this.setState({
      selectionChangeListeners: [
        ...this.state.selectionChangeListeners,
        listener
      ]
    });
  }

  setContentFocusHandler(listener) {
    this.focusListeners.push(listener);
  }

  setContentHTML(html) {
    this._sendAction(actions.content, "setHtml", html);
  }

  setEditorHeight(height) {
    this._sendAction(actions.content, "setMinHeight", height);
  }

  blurContentEditor() {
    this._sendAction(actions.content, "blur");
  }

  focusContentEditor() {
    this._sendAction(actions.content, "focus");
  }

  insertImage(attributes) {
    this._sendAction(actions.insertImage, "result", attributes);
    this._sendAction(actions.updateHeight);
  }

  insertVideo(attributes) {
    this._sendAction(actions.insertVideo, "result", attributes);
    this._sendAction(actions.updateHeight);
  }

  insertTag(attributes) {
    this._sendAction(actions.insertTag, "result", attributes);
    this._sendAction(actions.updateHeight);
  }

  insertLink(attributes) {
    this._sendAction(actions.insertLink, "result", attributes);
    this._sendAction(actions.updateHeight);
  }

  init() {
    let that = this;
    that.isInit = true;
    that.setContentHTML(this.props.initialContentHTML);
    that.setEditorHeight(this.props.initialEditorHeight);
    that.props.editorInitializedCallback &&
      that.props.editorInitializedCallback();

    this.focusContentEditor();

    this.intervalHeight = setInterval(function() {
      that._sendAction(actions.updateHeight);
    }, 200);
  }

  async getContentHtml() {
    return new Promise((resolve, reject) => {
      this.contentResolve = resolve;
      this.contentReject = reject;
      this._sendAction(actions.content, "postHtml");

      this.pendingContentHtml = setTimeout(() => {
        if (this.contentReject) {
          this.contentReject("timeout");
        }
      }, 5000);
    });
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  innerModal: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingTop: 20,
    paddingBottom: PlatformIOS ? 0 : 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: "stretch",
    margin: 40,
    borderRadius: PlatformIOS ? 8 : 2
  },
  button: {
    fontSize: 16,
    color: "#4a4a4a",
    textAlign: "center"
  },
  inputWrapper: {
    marginTop: 5,
    marginBottom: 10,
    borderBottomColor: "#4a4a4a",
    borderBottomWidth: PlatformIOS ? 1 / PixelRatio.get() : 0
  },
  inputTitle: {
    color: "#4a4a4a"
  },
  input: {
    height: PlatformIOS ? 20 : 40,
    paddingTop: 0
  },
  lineSeparator: {
    height: 1 / PixelRatio.get(),
    backgroundColor: "#d5d5d5",
    marginLeft: -20,
    marginRight: -20,
    marginTop: 20
  }
});
