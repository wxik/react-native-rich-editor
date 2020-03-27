import React, {Component} from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {actions} from './const';

const defaultActions = [
  actions.insertImage,
  actions.setBold,
  actions.setItalic,
  actions.insertBulletsList,
  actions.insertOrderedList,
  actions.insertLink
];

function getDefaultIcon() {
  const texts = {};
  texts[actions.insertImage] = require('../img/icon_format_media.png');
  texts[actions.setBold] = require('../img/icon_format_bold.png');
  texts[actions.setItalic] = require('../img/icon_format_italic.png');
  texts[actions.insertBulletsList] = require('../img/icon_format_ul.png');
  texts[actions.insertOrderedList] = require('../img/icon_format_ol.png');
  texts[actions.insertLink] = require('../img/icon_format_link.png');
  return texts;
}


export default class RichToolbar extends Component {

  // static propTypes = {
  //   getEditor: PropTypes.func.isRequired,
  //   actions: PropTypes.array,
  //   onPressAddImage: PropTypes.func,
  //   selectedButtonStyle: PropTypes.object,
  //   iconTint: PropTypes.any,
  //   selectedIconTint: PropTypes.any,
  //   unselectedButtonStyle: PropTypes.object,
  //   renderAction: PropTypes.func,
  //   iconMap: PropTypes.object,
  // };

  constructor(props) {
    super(props);
    const actions = this.props.actions ? this.props.actions : defaultActions;
    this.state = {
      editor: undefined,
      selectedItems: [],
      actions,
        data: this.getRows(actions, [])
    };
  }

  //---- new-s -----
  shouldComponentUpdate(nextProps, nextState) {
    let that = this;
    return nextProps.actions !== that.props.actions
          || nextState.editor !== that.state.editor
          || nextState.selectedItems !== that.state.selectedItems
          || nextState.actions !== that.state.actions
  }
  //---- new-e-----

  // componentDidReceiveProps(newProps) {
  componentWillReceiveProps(newProps) {
    const actions = newProps.actions ? newProps.actions : defaultActions;
    this.setState({
      actions,
      data: this.getRows(actions, this.state.selectedItems)
    });
  }

  getRows(actions, selectedItems) {
    return actions.map((action) => {return {action, selected: selectedItems.includes(action)};});
  }

  componentDidMount() {
    const editor = this.props.getEditor();
    if (!editor) {
      throw new Error('Toolbar has no editor!');
    } else {
      editor.registerToolbar((selectedItems) => this.setSelectedItems(selectedItems));
      this.setState({editor});
    }
  }

  setSelectedItems(selectedItems) {
    if (selectedItems !== this.state.selectedItems) {
      this.setState({
        selectedItems,
        data: this.getRows(this.state.actions, selectedItems)
      });
    }
  }

  _getButtonSelectedStyle() {
    return this.props.selectedButtonStyle ? this.props.selectedButtonStyle : styles.defaultSelectedButton;
  }

  _getButtonUnselectedStyle() {
    return this.props.unselectedButtonStyle ? this.props.unselectedButtonStyle : styles.defaultUnselectedButton;
  }

  _getButtonIcon(action) {
    if (this.props.iconMap && this.props.iconMap[action]) {
      return this.props.iconMap[action];
    } else if (getDefaultIcon()[action]){
      return getDefaultIcon()[action];
    } else {
      return undefined;
    }
  }

  _defaultRenderAction(action, selected) {
    const icon = this._getButtonIcon(action);
    const { iconSize = 50 } = this.props
    return (
      <TouchableOpacity
          key={action}
          style={[
            {height: iconSize, width: iconSize, justifyContent: 'center'},
            selected ? this._getButtonSelectedStyle() : this._getButtonUnselectedStyle()
          ]}
          onPress={() => this._onPress(action)}
      >
        {icon ? <Image source={icon} style={{tintColor: selected ? this.props.selectedIconTint : this.props.iconTint, height: iconSize, width: iconSize}}/> : null}
      </TouchableOpacity>
    );
  }

  _renderAction(action, selected) {
    return this.props.renderAction ?
        this.props.renderAction(action, selected) :
        this._defaultRenderAction(action, selected);
  }

  render() {
    return (
      <View
          style={[{height: 50, backgroundColor: '#D3D3D3', alignItems: 'center'}, this.props.style]}
      >
        <FlatList
            horizontal
            keyExtractor={(item, index) => item.action + '-' + index}
            data={this.state.data}
            alwaysBounceHorizontal={false}
            showsHorizontalScrollIndicator={false}
            renderItem= {({item}) => this._renderAction(item.action, item.selected)}
        />
      </View>
    );
  }

  _onPress(action) {
    switch(action) {
      case actions.setBold:
      case actions.setItalic:
      case actions.insertBulletsList:
      case actions.insertOrderedList:
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
      case actions.insertLink:
        this.state.editor._sendAction(action, "result");
        break;
      case actions.insertImage:
        if(this.props.onPressAddImage) {
          this.props.onPressAddImage();
        }
        break;
    }
  }
}

const styles = StyleSheet.create({
  defaultSelectedButton: {
    backgroundColor: 'red'
  },
  defaultUnselectedButton: {}
});
