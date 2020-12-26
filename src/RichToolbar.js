import React, {Component} from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {actions} from './const';

export const defaultActions = [
    actions.insertImage,
    actions.setBold,
    actions.setItalic,
    actions.insertBulletsList,
    actions.insertOrderedList,
    actions.insertLink,
];

function getDefaultIcon({iconType}) {
    const texts = {};
    // old icons styles
    if (iconType === 'v1') {
        texts[actions.insertImage] = require('../img/icon_format_media.png');
        texts[actions.setBold] = require('../img/icon_format_bold.png');
        texts[actions.setItalic] = require('../img/icon_format_italic.png');
        texts[actions.insertBulletsList] = require('../img/icon_format_ul.png');
        texts[actions.insertOrderedList] = require('../img/icon_format_ol.png');
        texts[actions.insertLink] = require('../img/icon_format_link.png');
    } else {
        texts[actions.insertImage] = require('../img/image.png');
        texts[actions.setBold] = require('../img/bold.png');
        texts[actions.setItalic] = require('../img/italic.png');
        texts[actions.insertBulletsList] = require('../img/bullets_list.png');
        texts[actions.insertOrderedList] = require('../img/ordered_list.png');
        texts[actions.insertLink] = require('../img/link.png');
    }
    texts[actions.setStrikethrough] = require('../img/strikethrough.png');
    texts[actions.setUnderline] = require('../img/underline.png');
    texts[actions.insertVideo] = require('../img/video.png');
    texts[actions.removeFormat] = require('../img/remove_forma.png');
    texts[actions.undo] = require('../img/undo.png');
    texts[actions.redo] = require('../img/redo.png');
    return texts;
}

export default class RichToolbar extends Component {
    // static propTypes = {
    //   getEditor?: PropTypes.func.isRequired,
    //   editor?: PropTypes.object,
    //   actions: PropTypes.array,
    //   onPressAddImage: PropTypes.func,
    //   onInsertLink: PropTypes.func,
    //   selectedButtonStyle: PropTypes.object,
    //   iconTint: PropTypes.any,
    //   selectedIconTint: PropTypes.any,
    //   unselectedButtonStyle: PropTypes.object,
    //   disabledButtonStyle: PropTypes.object,
    //   disabledIconTint: PropTypes.any,
    //   renderAction: PropTypes.func,
    //   iconMap: PropTypes.object,
    //   disabled: PropTypes.bool,
    //   iconType: PropTypes.string,
    // };

    static defaultProps = {
        actions: defaultActions,
        disabled: false,
        // iconType: 'v1',
    };

    constructor(props) {
        super(props);
        this.editor = null;
        this.state = {
            selectedItems: [],
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        let that = this;
        return (
            nextProps.actions !== that.props.actions ||
            nextState.selectedItems !== that.state.selectedItems ||
            nextState.actions !== that.state.actions ||
            nextState.style !== that.props.style
        );
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const {actions} = nextProps;
        if (actions !== prevState.actions) {
            let {selectedItems = []} = prevState;
            return {
                actions,
                data: actions.map((action) => ({action, selected: selectedItems.includes(action)})),
            };
        }
        return null;
    }

    componentDidMount() {
        setTimeout(this._mount);
    }

    _mount = () => {
        const {editor: {current: editor} = {current: this.props?.getEditor()}} = this.props;
        if (!editor) {
            throw new Error('Toolbar has no editor!');
        } else {
            editor.registerToolbar((selectedItems) => this.setSelectedItems(selectedItems));
            this.editor = editor;
        }
    };

    setSelectedItems(items) {
        const {selectedItems} = this.state;
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
        const {iconMap, iconType} = this.props;
        if (iconMap && iconMap[action]) {
            return iconMap[action];
        } else {
            return getDefaultIcon({iconType})[action];
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
            case actions.setIndent:
            case actions.setOutdent:
                editor.showAndroidKeyboard();
                editor.sendAction(action, 'result');
                break;
            case actions.insertImage:
                onPressAddImage && onPressAddImage();
                break;
            case actions.insertVideo:
                insertVideo && insertVideo();
                break;
            default:
                this.props[action] && this.props[action]();
                break;
        }
    }

    _defaultRenderAction(action, selected) {
        let that = this;
        const icon = that._getButtonIcon(action);
        const {iconSize = 50, disabled} = that.props;
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
                style={[{width: iconSize, justifyContent: 'center'}, style]}
                onPress={() => that._onPress(action)}>
                {icon ? (
                    typeof icon === 'function' ? (
                        icon({selected, disabled, tintColor, iconSize})
                    ) : (
                        <Image
                            source={icon}
                            style={{
                                tintColor: tintColor,
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
        height: 50,
        backgroundColor: '#D3D3D3',
        alignItems: 'center',
    },
});
