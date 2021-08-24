import React, {Component} from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {actions} from './const';

export const defaultActions = [
    actions.keyboard,
    actions.setBold,
    actions.setItalic,
    actions.setUnderline,
    actions.removeFormat,
    actions.insertBulletsList,
    actions.indent,
    actions.outdent,
    actions.insertLink,
];

function getDefaultIcon() {
    const texts = {};
    // new icon styles of experiment
    texts[actions.insertImage] = require('../img/image.png');
    texts[actions.keyboard] = require('../img/keyboard.png');
    texts[actions.setBold] = require('../img/bold.png');
    texts[actions.setItalic] = require('../img/italic.png');
    texts[actions.setSubscript] = require('../img/subscript.png');
    texts[actions.setSuperscript] = require('../img/superscript.png');
    texts[actions.insertBulletsList] = require('../img/ul.png');
    texts[actions.insertOrderedList] = require('../img/ol.png');
    texts[actions.insertLink] = require('../img/link.png');
    texts[actions.setStrikethrough] = require('../img/strikethrough.png');
    texts[actions.setUnderline] = require('../img/underline.png');
    texts[actions.insertVideo] = require('../img/video.png');
    texts[actions.removeFormat] = require('../img/remove_format.png');
    texts[actions.undo] = require('../img/undo.png');
    texts[actions.redo] = require('../img/redo.png');
    texts[actions.checkboxList] = require('../img/checkbox.png');
    texts[actions.table] = require('../img/table.png');
    texts[actions.code] = require('../img/code.png');
    texts[actions.outdent] = require('../img/outdent.png');
    texts[actions.indent] = require('../img/indent.png');
    texts[actions.alignLeft] = require('../img/justify_left.png');
    texts[actions.alignCenter] = require('../img/justify_center.png');
    texts[actions.alignRight] = require('../img/justify_right.png');
    texts[actions.alignFull] = require('../img/justify_full.png');
    texts[actions.blockquote] = require('../img/blockquote.png');
    texts[actions.line] = require('../img/line.png');
    texts[actions.fontSize] = require('../img/fontSize.png');
    return texts;
}

// noinspection FallThroughInSwitchStatementJS
export default class RichToolbar extends Component {
    // static propTypes = {
    //   getEditor?: PropTypes.func.isRequired,
    //   editor?: PropTypes.object,
    //   actions: PropTypes.array,
    //   onPressAddImage: PropTypes.func,
    //   onInsertLink: PropTypes.func,
    //   selectedButtonStyle: PropTypes.object,
    //   itemStyle: PropTypes.object,
    //   iconTint: PropTypes.any,
    //   selectedIconTint: PropTypes.any,
    //   unselectedButtonStyle: PropTypes.object,
    //   disabledButtonStyle: PropTypes.object,
    //   disabledIconTint: PropTypes.any,
    //   renderAction: PropTypes.func,
    //   iconMap: PropTypes.object,
    //   disabled: PropTypes.bool,
    // };

    static defaultProps = {
        actions: defaultActions,
        disabled: false,
        iconTint: '#71787F',
        iconSize: 20,
        iconGap: 16,
    };

    constructor(props) {
        super(props);
        this.editor = null;
        this.state = {
            items: [],
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        let that = this;
        return (
            nextState.items !== that.state.items ||
            nextState.actions !== that.state.actions ||
            nextState.data !== that.state.data ||
            nextProps.style !== that.props.style
        );
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const {actions} = nextProps;
        if (actions !== prevState.actions) {
            let {items = []} = prevState;
            return {
                actions,
                data: actions.map((action) => ({action, selected: items.includes(action)})),
            };
        }
        return null;
    }

    componentDidMount() {
        setTimeout(this._mount);
    }

    _mount = () => {
        const {editor: {current: editor} = {current: this.props.getEditor?.()}} = this.props;
        if (!editor) {
            throw new Error('Toolbar has no editor!');
        } else {
            editor.registerToolbar((selectedItems) => this.setSelectedItems(selectedItems));
            this.editor = editor;
        }
    };

    setSelectedItems(items) {
        const {items: selectedItems} = this.state;
        if (this.editor && items !== selectedItems) {
            this.setState({
                items,
                data: this.state.actions.map((action) => ({action, selected: items.includes(action)})),
            });
        }
    }

    _getButtonSelectedStyle() {
        return this.props.selectedButtonStyle && this.props.selectedButtonStyle;
    }

    _getButtonUnselectedStyle() {
        return this.props.unselectedButtonStyle && this.props.unselectedButtonStyle;
    }

    _getButtonDisabledStyle() {
        return this.props.disabledButtonStyle && this.props.disabledButtonStyle;
    }

    _getButtonIcon(action) {
        const {iconMap} = this.props;
        if (iconMap && iconMap[action]) {
            return iconMap[action];
        } else {
            return getDefaultIcon()[action];
        }
    }

    handleKeyboard() {
        const editor = this.editor;
        if (!editor) return;
        if (editor.isKeyboardOpen) {
            editor.dismissKeyboard();
        } else {
            editor.focusContentEditor();
        }
    }

    _onPress(action) {
        const {onPressAddImage, onInsertLink, insertVideo} = this.props;
        const editor = this.editor;
        if (!editor) return;

        switch (action) {
            case actions.insertLink:
                if (onInsertLink) return onInsertLink();
            case actions.setBold:
            case actions.setItalic:
            case actions.undo:
            case actions.redo:
            case actions.insertBulletsList:
            case actions.insertOrderedList:
            case actions.checkboxList:
            case actions.setUnderline:
            case actions.heading1:
            case actions.heading2:
            case actions.heading3:
            case actions.heading4:
            case actions.heading5:
            case actions.heading6:
            case actions.code:
            case actions.blockquote:
            case actions.line:
            case actions.setParagraph:
            case actions.removeFormat:
            case actions.alignLeft:
            case actions.alignCenter:
            case actions.alignRight:
            case actions.alignFull:
            case actions.setSubscript:
            case actions.setSuperscript:
            case actions.setStrikethrough:
            case actions.setHR:
            case actions.indent:
            case actions.outdent:
                editor.showAndroidKeyboard();
                editor.sendAction(action, 'result');
                break;
            case actions.insertImage:
                onPressAddImage && onPressAddImage();
                break;
            case actions.insertVideo:
                insertVideo && insertVideo();
                break;
            case actions.keyboard:
                this.handleKeyboard();
                break;
            default:
                this.props[action] && this.props[action]();
                break;
        }
    }

    _defaultRenderAction(action, selected) {
        let that = this;
        const icon = that._getButtonIcon(action);
        const {iconSize, iconGap, disabled, itemStyle} = that.props;
        const style = selected ? that._getButtonSelectedStyle() : that._getButtonUnselectedStyle();
        const tintColor = disabled
            ? that.props.disabledIconTint
            : selected
            ? that.props.selectedIconTint
            : that.props.iconTint;
        return (
            <TouchableOpacity
                key={action}
                disabled={disabled}
                style={[{width: iconGap + iconSize}, styles.item, itemStyle, style]}
                onPress={() => that._onPress(action)}>
                {icon ? (
                    typeof icon === 'function' ? (
                        icon({selected, disabled, tintColor, iconSize, iconGap})
                    ) : (
                        <Image
                            source={icon}
                            style={{
                                tintColor,
                                height: iconSize,
                                width: iconSize,
                            }}
                        />
                    )
                ) : null}
            </TouchableOpacity>
        );
    }

    _renderAction(action, selected) {
        return this.props.renderAction
            ? this.props.renderAction(action, selected)
            : this._defaultRenderAction(action, selected);
    }

    render() {
        const {style, disabled, children, flatContainerStyle} = this.props;
        const vStyle = [styles.barContainer, style, disabled && this._getButtonDisabledStyle()];
        return (
            <View style={vStyle}>
                <FlatList
                    horizontal
                    keyboardShouldPersistTaps={'always'}
                    keyExtractor={(item, index) => item.action + '-' + index}
                    data={this.state.data}
                    alwaysBounceHorizontal={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => this._renderAction(item.action, item.selected)}
                    contentContainerStyle={flatContainerStyle}
                />
                {children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    barContainer: {
        height: 44,
        backgroundColor: '#efefef',
        alignItems: 'center',
    },

    item: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
